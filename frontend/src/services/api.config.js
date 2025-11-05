// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9653/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY: '/auth/verify',
    PROFILE: '/auth/profile'
  },
  
  // Products/Marketplace
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    MY_PRODUCTS: '/products/my/products',
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    BY_CATEGORY: (category) => `/products/category/${category}`
  },
  
  // Orders
  ORDERS: {
    CHECKOUT: '/orders/checkout',
    MY_ORDERS: '/orders/my-orders',
    DETAILS: (id) => `/orders/${id}`,
    UPDATE: (id) => `/orders/${id}`
  },
  
  // Soil Health
  SOIL: {
    GET: '/soil',
    UPDATE: '/soil',
    ANALYSIS: '/soil/analysis',
    HISTORY: '/soil/history',
    COMPARE: '/soil/compare'
  },
  
  // Weather
  WEATHER: {
    FORECAST: '/weather/forecast',
    HISTORICAL: '/weather/historical',
    ALERTS: '/weather/alerts',
    INSIGHTS: '/weather/insights'
  },
  
  // Disease Detection
  DISEASE: {
    SCAN: '/disease/scan',
    MY_SCANS: '/disease/my-scans',
    SCAN_DETAILS: (id) => `/disease/scan/${id}`,
    DELETE_SCAN: (id) => `/disease/scan/${id}`,
    STATS: '/disease/stats',
    REVIEW: (id) => `/disease/scan/${id}/review`
  },
  
  // Crop Recommendations
  CROP: {
    RECOMMENDATIONS: '/crop/recommendations',
    DETAILS: (crop) => `/crop/details/${crop}`,
    CALENDAR: '/crop/calendar',
    SAVE: '/crop/recommendation'
  },
  
  // Info
  INFO: {
    FERTILIZERS: '/info/fertilizers',
    PESTS: '/info/pests',
    SCHEMES: '/info/schemes'
  }
};

export default API_BASE_URL;
