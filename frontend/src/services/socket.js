import io from 'socket.io-client';
import { store } from '../store/store';
import { addNotification } from '../store/slices/notificationSlice';
import { updateOrder } from '../store/slices/orderSlice';
import { updateProductInList } from '../store/slices/productSlice';
import toast from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.connected) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:9653';
    
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
    this.connected = true;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  setupListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      const user = store.getState().auth.user;
      if (user) {
        this.socket.emit('join', user._id);
        this.socket.emit('join-role', user.role);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Order events
    this.socket.on('order-created', (data) => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'Order Placed',
        message: data.message,
        data: { orderId: data.orderId, orderNumber: data.orderNumber },
      }));
      toast.success(data.message);
    });

    this.socket.on('order-updated', (data) => {
      store.dispatch(updateOrder(data.order));
      store.dispatch(addNotification({
        type: 'info',
        title: 'Order Updated',
        message: data.message,
        data: { orderId: data.orderId, status: data.status },
      }));
      toast.info(data.message);
    });

    this.socket.on('order-cancelled', (data) => {
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Order Cancelled',
        message: data.message,
        data: { orderId: data.orderId },
      }));
      toast.warning(data.message);
    });

    this.socket.on('new-order', (data) => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'New Order Received',
        message: data.message,
        data: { orderId: data.orderId, quantity: data.quantity },
      }));
      toast.success(data.message);
    });

    this.socket.on('payment-received', (data) => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'Payment Received',
        message: data.message,
        data: { orderId: data.orderId },
      }));
      toast.success(data.message);
    });

    // Product events
    this.socket.on('new-product', (data) => {
      store.dispatch(addNotification({
        type: 'info',
        title: 'New Product Available',
        message: data.message,
        data: { product: data.product },
      }));
    });

    this.socket.on('product-updated', (data) => {
      store.dispatch(updateProductInList(data.product));
    });

    this.socket.on('stock-low', (data) => {
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${data.productName} is running low on stock`,
        data: { productId: data.productId, stock: data.stock },
      }));
      toast.warning(`Low stock alert: ${data.productName}`);
    });

    // Price alerts
    this.socket.on('price-drop', (data) => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'Price Drop Alert',
        message: `${data.productName} price dropped to ₹${data.newPrice}`,
        data: { productId: data.productId, oldPrice: data.oldPrice, newPrice: data.newPrice },
      }));
      toast.success(`Price drop: ${data.productName}`);
    });

    // Weather alerts
    this.socket.on('weather-alert', (data) => {
      store.dispatch(addNotification({
        type: data.severity === 'high' ? 'error' : 'warning',
        title: 'Weather Alert',
        message: data.message,
        data: { location: data.location, conditions: data.conditions },
      }));
      toast[data.severity === 'high' ? 'error' : 'warning'](data.message);
    });

    // Disease detection alerts
    this.socket.on('disease-detected', (data) => {
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Disease Detected',
        message: `${data.disease} detected in your ${data.crop}`,
        data: { scanId: data.scanId, disease: data.disease, severity: data.severity },
      }));
      toast.warning(`Disease alert: ${data.disease} detected`);
    });

    // Expert review notifications
    this.socket.on('expert-review-ready', (data) => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'Expert Review Ready',
        message: 'An expert has reviewed your disease scan',
        data: { scanId: data.scanId },
      }));
      toast.success('Expert review ready for your scan');
    });

    // System notifications
    this.socket.on('notification', (data) => {
      store.dispatch(addNotification(data));
      
      // Show toast based on type
      const toastType = data.type === 'error' ? 'error' : 
                       data.type === 'success' ? 'success' :
                       data.type === 'warning' ? 'warning' : 'info';
      toast[toastType](data.message);
    });

    // Broadcast messages
    this.socket.on('broadcast', (data) => {
      store.dispatch(addNotification({
        type: 'info',
        title: 'System Announcement',
        message: data.message,
      }));
      toast.info(data.message);
    });
  }

  // Emit events
  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  // Join a room
  joinRoom(room) {
    this.emit('join', room);
  }

  // Leave a room
  leaveRoom(room) {
    this.emit('leave', room);
  }

  // Check connection status
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
