import apiService from './api.service';
import { API_ENDPOINTS } from './api.config';

class OrderService {
  // Create order/checkout
  async checkout(orderData) {
    return await apiService.post(API_ENDPOINTS.ORDERS.CHECKOUT, orderData);
  }

  // Get user's orders
  async getMyOrders(params = {}) {
    return await apiService.get(API_ENDPOINTS.ORDERS.MY_ORDERS, params);
  }

  // Get order details
  async getOrderDetails(orderId) {
    return await apiService.get(API_ENDPOINTS.ORDERS.DETAILS(orderId));
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    return await apiService.put(API_ENDPOINTS.ORDERS.UPDATE(orderId), { status });
  }
}

export default new OrderService();
