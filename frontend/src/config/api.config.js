// API Configuration
// IMPORTANT: This MUST point to your backend server URL
export const API_CONFIG = {
  BASE_URL: 'http://localhost:9653/api', // Absolute URL to backend - DO NOT CHANGE
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/update-profile'
  },

  // Products (Vegetables)
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    BY_CATEGORY: (category) => `/products/category/${category}`
  },

  // Cart & Orders
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear'
  },

  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders/create',
    DETAIL: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    TRACK: (id) => `/orders/${id}/track`
  },

  // Payment
  PAYMENT: {
    CREATE_SESSION: '/payment/create-session',
    VERIFY: '/payment/verify',
    HISTORY: '/payment/history'
  },

  // Plant Detection & AI Features
  PLANT: {
    DETECT_DISEASE: '/plant/detect-disease',
    GET_TREATMENT: '/plant/treatment',
    HISTORY: '/plant/history'
  },

  // Fertilizer
  FERTILIZER: {
    RECOMMEND: '/fertilizer/recommend',
    LIST: '/fertilizer/list',
    DETAIL: (id) => `/fertilizer/${id}`,
    CALCULATE: '/fertilizer/calculate'
  },

  // Weather
  WEATHER: {
    CURRENT: '/weather/current',
    FORECAST: '/weather/forecast',
    ALERTS: '/weather/alerts',
    BY_LOCATION: '/weather/location'
  },

  // Crops
  CROPS: {
    SEASONAL: '/crops/seasonal',
    RECOMMENDATIONS: '/crops/recommendations',
    TRENDS: '/crops/trends',
    PRICES: '/crops/prices',
    MARKET_ANALYSIS: '/crops/market-analysis'
  },

  // Soil
  SOIL: {
    ANALYZE: '/soil/analyze',
    REPORT: '/soil/report',
    HISTORY: '/soil/history',
    TIPS: '/soil/tips'
  },

  // Pest Management
  PEST: {
    ALERTS: '/pest/alerts',
    IDENTIFY: '/pest/identify',
    PREVENTION: '/pest/prevention',
    TREATMENTS: '/pest/treatments'
  },

  // Irrigation
  IRRIGATION: {
    SCHEDULE: '/irrigation/schedule',
    RECOMMENDATIONS: '/irrigation/recommendations',
    WATER_USAGE: '/irrigation/water-usage',
    TIPS: '/irrigation/tips'
  },

  // Government Schemes
  SCHEMES: {
    LIST: '/schemes',
    DETAIL: (id) => `/schemes/${id}`,
    ELIGIBLE: '/schemes/eligible',
    APPLY: '/schemes/apply',
    STATUS: '/schemes/status'
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    PREFERENCES: '/notifications/preferences'
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    INSIGHTS: '/analytics/insights'
  }
};

// Error Messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Cannot connect to server. Please make sure the backend is running on http://localhost:9653',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.'
};
