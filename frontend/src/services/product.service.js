import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class ProductService {
  // Get all products
  async getProducts(params = {}) {
    return await apiService.get(API_ENDPOINTS.PRODUCTS.LIST, params);
  }

  // Get product by ID
  async getProductById(id) {
    return await apiService.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  }

  // Get categories
  async getCategories() {
    return await apiService.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  }

  // Search products
  async searchProducts(query, filters = {}) {
    return await apiService.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      q: query,
      ...filters
    });
  }

  // Get featured products
  async getFeaturedProducts() {
    return await apiService.get(API_ENDPOINTS.PRODUCTS.FEATURED);
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    return await apiService.get(API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category), params);
  }
}

export default new ProductService();
