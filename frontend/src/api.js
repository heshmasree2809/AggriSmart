import axios from 'axios';
import {
  authService,
  productsService,
  ordersService,
  soilService,
  irrigationService,
  schemesService,
  pestService,
  trendsService,
  paymentService
} from './services/localStorage';

// Environment variables
export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
export const PLANT_NET_API_KEY = import.meta.env.VITE_PLANT_NET_API_KEY;

// Weather API endpoints (still using external API)
export const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
export const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Auth API - now uses local storage service
export const authAPI = {
  login: async (credentials) => {
    try {
      const result = await authService.login(credentials);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  signup: async (userData) => {
    try {
      const result = await authService.signup(userData);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  logout: async () => {
    try {
      await authService.logout();
      return { data: { success: true } };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getProfile: async () => {
    try {
      const result = await authService.getProfile();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  updateProfile: async (data) => {
    try {
      const result = await authService.updateProfile(data);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Weather API
export const weatherAPI = {
  getCurrentWeather: async (city) => {
    const response = await axios.get(WEATHER_URL, {
      params: {
        q: city,
        units: 'metric',
        appid: WEATHER_API_KEY,
      },
    });
    return response.data;
  },
  getForecast: async (city) => {
    const response = await axios.get(FORECAST_URL, {
      params: {
        q: city,
        units: 'metric',
        appid: WEATHER_API_KEY,
      },
    });
    return response.data;
  },
};

// Plant Detection API
export const plantAPI = {
  detectDisease: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Mock implementation - replace with actual API when available
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          disease: 'Leaf Blight',
          confidence: 87,
          severity: 'Moderate',
          treatment: 'Apply copper-based fungicide every 7-10 days',
          prevention: 'Ensure proper air circulation and avoid overhead watering',
        });
      }, 2000);
    });
  },
};

// Orders API - now uses local storage service
export const ordersAPI = {
  createOrder: async (orderData) => {
    try {
      const result = await ordersService.createOrder(orderData);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getOrders: async () => {
    try {
      const result = await ordersService.getOrders();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getOrderById: async (id) => {
    try {
      const result = await ordersService.getOrderById(id);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  updateOrder: async (id, data) => {
    try {
      const result = await ordersService.updateOrder(id, data);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  cancelOrder: async (id) => {
    try {
      const result = await ordersService.cancelOrder(id);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Products API - now uses local storage service
export const productsAPI = {
  getProducts: async (params) => {
    try {
      const result = await productsService.getProducts(params);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getProductById: async (id) => {
    try {
      const result = await productsService.getProductById(id);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  searchProducts: async (query) => {
    try {
      const result = await productsService.searchProducts(query);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Soil Health API - now uses local storage service
export const soilAPI = {
  analyzeSoil: async (data) => {
    try {
      const result = await soilService.analyzeSoil(data);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getSoilHistory: async () => {
    try {
      const result = await soilService.getSoilHistory();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getRecommendations: async (soilType) => {
    try {
      const result = await soilService.getRecommendations(soilType);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Irrigation API - now uses local storage service
export const irrigationAPI = {
  getSchedule: async () => {
    try {
      const result = await irrigationService.getSchedule();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  updateSchedule: async (data) => {
    try {
      const result = await irrigationService.updateSchedule(data);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getWaterUsage: async () => {
    try {
      const result = await irrigationService.getWaterUsage();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getRecommendations: async (cropType) => {
    try {
      const result = await irrigationService.getRecommendations(cropType);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Government Schemes API - now uses local storage service
export const schemesAPI = {
  getSchemes: async (filters) => {
    try {
      const result = await schemesService.getSchemes(filters);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getSchemeById: async (id) => {
    try {
      const result = await schemesService.getSchemeById(id);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  applyForScheme: async (id, data) => {
    try {
      const result = await schemesService.applyForScheme(id, data);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Pest Management API - now uses local storage service
export const pestAPI = {
  getPestAlerts: async (location) => {
    try {
      const result = await pestService.getPestAlerts(location);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  reportPest: async (data) => {
    try {
      const result = await pestService.reportPest(data);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getTreatments: async (pestId) => {
    try {
      const result = await pestService.getTreatments(pestId);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Crop Trends API - now uses local storage service
export const trendsAPI = {
  getMarketTrends: async () => {
    try {
      const result = await trendsService.getMarketTrends();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getPriceTrends: async (cropId) => {
    try {
      const result = await trendsService.getPriceTrends(cropId);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getDemandForecast: async () => {
    try {
      const result = await trendsService.getDemandForecast();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Payment API - now uses local storage service
export const paymentAPI = {
  createPaymentIntent: async (amount) => {
    try {
      const result = await paymentService.createPaymentIntent(amount);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  confirmPayment: async (paymentId) => {
    try {
      const result = await paymentService.confirmPayment(paymentId);
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
  getPaymentHistory: async () => {
    try {
      const result = await paymentService.getPaymentHistory();
      return { data: result };
    } catch (error) {
      return Promise.reject({ response: { data: { message: error.message } } });
    }
  },
};

// Default export for backward compatibility
const api = {
  get: () => Promise.reject(new Error('Use specific API methods instead')),
  post: () => Promise.reject(new Error('Use specific API methods instead')),
  put: () => Promise.reject(new Error('Use specific API methods instead')),
  delete: () => Promise.reject(new Error('Use specific API methods instead')),
};

export default api;
