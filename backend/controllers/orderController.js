const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { cache } = require('../config/redis');

// Create a new order with validation and stock management
exports.createOrder = asyncHandler(async (req, res) => {
  const { 
    items, 
    shippingAddress, 
    billingAddress,
    paymentMethod = 'cod', 
    notes 
  } = req.body;
  
  if (!items || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }
  
  // Calculate totals and validate stock
  let totalAmount = 0;
  let orderType = 'B2C';
  const orderItems = [];
  const stockUpdates = [];
  
  for (const item of items) {
    const product = await Product.findById(item.product)
      .populate('seller', 'name contact');
    
    if (!product) {
      throw new ApiError(404, `Product ${item.product} not found`);
    }
    
    if (!product.isActive) {
      throw new ApiError(400, `Product ${product.name} is not available`);
    }
    
    if (product.quantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}. Available: ${product.quantity}`);
    }
    
    // Check minimum and maximum order limits
    if (item.quantity < product.minimumOrder) {
      throw new ApiError(400, `Minimum order for ${product.name} is ${product.minimumOrder} ${product.unit}`);
    }
    
    if (product.maximumOrder && item.quantity > product.maximumOrder) {
      throw new ApiError(400, `Maximum order for ${product.name} is ${product.maximumOrder} ${product.unit}`);
    }
    
    // Calculate price (check for bulk pricing)
    let pricePerUnit = product.price;
    if (product.bulkPricing?.enabled && 
        item.quantity >= product.bulkPricing.minimumQuantity) {
      pricePerUnit = product.bulkPricing.price;
      orderType = 'B2B';
    }
    
    const subtotal = pricePerUnit * item.quantity;
    totalAmount += subtotal;
    
    orderItems.push({
      product: product._id,
      seller: product.seller._id,
      quantity: item.quantity,
      unit: product.unit,
      priceAtOrder: pricePerUnit,
      subtotal,
      status: 'pending'
    });
    
    // Prepare stock updates (will be executed after order creation)
    stockUpdates.push({
      productId: product._id,
      quantity: item.quantity
    });
  }
  
  // Calculate additional charges
  const shippingCost = calculateShipping(totalAmount, shippingAddress);
  const taxAmount = totalAmount * 0.18; // 18% GST
  const discountAmount = 0; // TODO: Apply coupon/discount logic
  const finalAmount = totalAmount + shippingCost + taxAmount - discountAmount;
  
  // Create order
  const order = await Order.create({
    buyer: req.user._id,
    items: orderItems,
    totalAmount,
    shippingCost,
    taxAmount,
    discountAmount,
    finalAmount,
    orderType,
    shippingAddress: shippingAddress || req.user.address,
    billingAddress: billingAddress || shippingAddress || req.user.address,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    notes,
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  
  // Update product stocks
  for (const update of stockUpdates) {
    await Product.findByIdAndUpdate(
      update.productId,
      { $inc: { quantity: -update.quantity } }
    );
  }
  
  // Populate order details
  const populatedOrder = await Order.findById(order._id)
    .populate('buyer', 'name email contact')
    .populate('items.product', 'name images price')
    .populate('items.seller', 'name contact');
  
  // Send notifications
  await sendOrderNotifications(populatedOrder);
  
  // Emit real-time event
  const io = req.app.get('io');
  io.to(`user:${order.buyer}`).emit('order-created', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    message: 'Your order has been placed successfully'
  });
  
  // Notify sellers
  for (const item of orderItems) {
    io.to(`user:${item.seller}`).emit('new-order', {
      orderId: order._id,
      product: item.product,
      quantity: item.quantity,
      message: 'You have received a new order'
    });
  }
  
  res.status(201).json(
    new ApiResponse(201, populatedOrder, 'Order placed successfully')
  );
});

// Get user's orders with filtering
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { 
    status, 
    orderType, 
    paymentStatus,
    dateFrom,
    dateTo,
    page = 1, 
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;
  
  const query = { buyer: req.user._id };
  
  // Apply filters
  if (status) query.orderStatus = status;
  if (orderType) query.orderType = orderType;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  
  // Date range filter
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }
  
  const totalOrders = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('items.product', 'name price images')
    .populate('items.seller', 'name')
    .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  // Calculate statistics
  const stats = await Order.aggregate([
    { $match: { buyer: req.user._id } },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: '$finalAmount' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$finalAmount' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);
  
  res.json(
    new ApiResponse(200, {
      orders,
      stats: stats[0] || {},
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit: parseInt(limit),
        hasNext: page * limit < totalOrders,
        hasPrev: page > 1
      }
    }, 'Orders fetched successfully')
  );
});

// Get single order with tracking info
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email contact')
    .populate('items.product', 'name price images description')
    .populate('items.seller', 'name contact location');
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  // Check authorization
  const isBuyer = order.buyer._id.toString() === req.user._id.toString();
  const isSeller = order.items.some(item => 
    item.seller._id.toString() === req.user._id.toString()
  );
  const isAdmin = req.user.role === 'Admin';
  
  if (!isBuyer && !isSeller && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to view this order');
  }
  
  // Get tracking information if available
  let trackingInfo = null;
  if (order.trackingNumber && order.courierPartner) {
    // TODO: Integrate with courier API
    trackingInfo = {
      status: order.orderStatus,
      lastUpdate: order.updatedAt,
      estimatedDelivery: order.expectedDeliveryDate
    };
  }
  
  res.json(
    new ApiResponse(200, {
      order,
      trackingInfo,
      canCancel: order.orderStatus === 'pending' && isBuyer,
      canUpdate: isSeller || isAdmin
    }, 'Order details fetched successfully')
  );
});

// Update order status (Sellers and Admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { 
    orderStatus, 
    itemId,
    trackingNumber, 
    courierPartner,
    expectedDeliveryDate,
    notes 
  } = req.body;
  
  const order = await Order.findById(req.params.id)
    .populate('items.seller');
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  // Check authorization
  const isSeller = order.items.some(item => 
    item.seller._id.toString() === req.user._id.toString()
  );
  const isAdmin = req.user.role === 'Admin';
  
  if (!isSeller && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to update this order');
  }
  
  // Update specific item status if itemId provided
  if (itemId) {
    const item = order.items.id(itemId);
    if (!item) {
      throw new ApiError(404, 'Order item not found');
    }
    
    // Verify seller owns this item
    if (!isAdmin && item.seller._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only update your own items');
    }
    
    item.status = orderStatus;
    
    // Update overall order status based on item statuses
    const allStatuses = order.items.map(i => i.status);
    if (allStatuses.every(s => s === 'delivered')) {
      order.orderStatus = 'delivered';
      order.deliveryDate = new Date();
    } else if (allStatuses.some(s => s === 'shipped')) {
      order.orderStatus = 'shipped';
    } else if (allStatuses.every(s => s === 'confirmed')) {
      order.orderStatus = 'confirmed';
    }
  } else {
    // Update overall order status
    order.orderStatus = orderStatus;
    
    if (orderStatus === 'delivered') {
      order.deliveryDate = new Date();
      order.paymentStatus = 'paid';
      order.paymentDetails.paidAt = new Date();
    }
    
    if (orderStatus === 'shipped') {
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (courierPartner) order.courierPartner = courierPartner;
      if (expectedDeliveryDate) order.expectedDeliveryDate = expectedDeliveryDate;
    }
  }
  
  if (notes) order.notes = notes;
  
  await order.save();
  
  // Send notification to buyer
  await Notification.create({
    user: order.buyer,
    type: 'Update',
    category: 'Order',
    title: 'Order Status Updated',
    message: `Your order #${order.orderNumber} status has been updated to ${orderStatus}`,
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: orderStatus
    }
  });
  
  // Emit real-time update
  const io = req.app.get('io');
  io.to(`user:${order.buyer}`).emit('order-updated', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: orderStatus,
    message: `Order ${orderStatus}`
  });
  
  res.json(
    new ApiResponse(200, order, 'Order status updated successfully')
  );
});

// Cancel order
exports.cancelOrder = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  // Check if user is the buyer
  if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    throw new ApiError(403, 'You are not authorized to cancel this order');
  }
  
  // Check if order can be cancelled
  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    throw new ApiError(400, 'Order cannot be cancelled at this stage');
  }
  
  // Update order status
  order.orderStatus = 'cancelled';
  order.cancellationReason = cancellationReason;
  order.cancelledAt = new Date();
  
  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { quantity: item.quantity } }
    );
  }
  
  await order.save();
  
  // Process refund if payment was made
  if (order.paymentStatus === 'paid') {
    // TODO: Process refund through payment gateway
    order.paymentStatus = 'refunded';
    order.paymentDetails.refundedAt = new Date();
    await order.save();
  }
  
  // Notify sellers
  const io = req.app.get('io');
  for (const item of order.items) {
    io.to(`user:${item.seller}`).emit('order-cancelled', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      message: 'An order has been cancelled'
    });
  }
  
  res.json(
    new ApiResponse(200, order, 'Order cancelled successfully')
  );
});

// Get seller's orders
exports.getSellerOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  // Find orders containing seller's products
  const query = {
    'items.seller': req.user._id
  };
  
  if (status) {
    query['items.status'] = status;
  }
  
  const orders = await Order.find(query)
    .populate('buyer', 'name contact address')
    .populate('items.product', 'name price')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  // Filter to show only seller's items
  const sellerOrders = orders.map(order => {
    const sellerItems = order.items.filter(item => 
      item.seller.toString() === req.user._id.toString()
    );
    return {
      ...order.toObject(),
      items: sellerItems,
      totalAmount: sellerItems.reduce((sum, item) => sum + item.subtotal, 0)
    };
  });
  
  const totalOrders = await Order.countDocuments(query);
  
  res.json(
    new ApiResponse(200, {
      orders: sellerOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit: parseInt(limit)
      }
    }, 'Seller orders fetched successfully')
  );
});

// Process payment
exports.processPayment = asyncHandler(async (req, res) => {
  const { paymentMethod, transactionId } = req.body;
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Unauthorized to process payment for this order');
  }
  
  if (order.paymentStatus === 'paid') {
    throw new ApiError(400, 'Order is already paid');
  }
  
  // TODO: Integrate with payment gateway
  // For now, mark as paid
  order.paymentStatus = 'paid';
  order.paymentMethod = paymentMethod;
  order.paymentDetails = {
    transactionId,
    paidAt: new Date()
  };
  
  await order.save();
  
  // Notify seller
  const io = req.app.get('io');
  for (const item of order.items) {
    io.to(`user:${item.seller}`).emit('payment-received', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      message: 'Payment received for order'
    });
  }
  
  res.json(
    new ApiResponse(200, order, 'Payment processed successfully')
  );
});

// Helper functions
function calculateShipping(totalAmount, address) {
  // Basic shipping calculation
  if (totalAmount > 1000) return 0; // Free shipping above 1000
  if (address?.state === 'Local') return 50;
  return 100;
}

async function sendOrderNotifications(order) {
  // Create notification for buyer
  await Notification.create({
    user: order.buyer,
    type: 'Success',
    category: 'Order',
    title: 'Order Placed Successfully',
    message: `Your order #${order.orderNumber} has been placed successfully`,
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber
    },
    deliveryChannels: ['InApp', 'Email']
  });
  
  // Create notifications for sellers
  for (const item of order.items) {
    await Notification.create({
      user: item.seller,
      type: 'Info',
      category: 'Order',
      title: 'New Order Received',
      message: `You have received a new order for ${item.quantity} units`,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        productId: item.product,
        quantity: item.quantity
      },
      deliveryChannels: ['InApp', 'Email', 'SMS']
    });
  }
}

