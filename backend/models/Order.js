const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  quantity: { type: Number, required: true, min: 1 },
  unit: String,
  priceAtOrder: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  }
}, { _id: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true, 
    required: true,
    index: true
  },
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  discountAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  orderType: { 
    type: String, 
    enum: ['B2C', 'B2B'], 
    default: 'B2C' 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], 
    default: 'pending' 
  },
  shippingAddress: {
    street: String,
    village: String,
    district: String,
    state: String,
    zipcode: String,
    phone: String
  },
  billingAddress: {
    street: String,
    village: String,
    district: String,
    state: String,
    zipcode: String
  },
  paymentMethod: { 
    type: String,
    enum: ['cod', 'upi', 'card', 'netbanking', 'wallet'],
    default: 'cod' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentDetails: {
    transactionId: String,
    paidAt: Date,
    refundedAt: Date
  },
  deliveryDate: Date,
  expectedDeliveryDate: Date,
  trackingNumber: String,
  courierPartner: String,
  notes: String,
  cancellationReason: String,
  cancelledAt: Date,
  invoice: String,
  isReviewed: { type: Boolean, default: false }
}, { timestamps: true });

// Generate unique order number
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  
  // Calculate final amount
  if (this.isNew) {
    this.finalAmount = this.totalAmount + this.shippingCost + this.taxAmount - this.discountAmount;
  }
  
  next();
});

// Indexes for performance
OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ 'items.seller': 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);

