// Application Constants

export const APP_NAME = 'AgriSmart';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Smart Farming Solutions for Modern Agriculture';

// API Endpoints (for future use)
// NOTE: Actual API calls should use api.service.js which has the correct URL
export const API_BASE_URL = 'http://localhost:9653/api'; // Updated to match backend

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update',
  
  // Vegetables
  GET_VEGETABLES: '/vegetables',
  GET_VEGETABLE: '/vegetables/:id',
  
  // Orders
  CREATE_ORDER: '/orders/create',
  GET_ORDERS: '/orders',
  GET_ORDER: '/orders/:id',
  
  // Weather
  GET_WEATHER: '/weather/current',
  GET_FORECAST: '/weather/forecast',
  
  // Soil
  ANALYZE_SOIL: '/soil/analyze',
  GET_SOIL_HISTORY: '/soil/history',
  
  // Crops
  GET_CROPS: '/crops',
  GET_CROP_DETAILS: '/crops/:id',
  
  // Government Schemes
  GET_SCHEMES: '/schemes',
  APPLY_SCHEME: '/schemes/apply'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BUY_VEGETABLES: '/buy',
  PLANT_DETECTION: '/plant-detection',
  FERTILIZER_INFO: '/fertilizer-info',
  WEATHER_FORECAST: '/weather-forecast',
  SEASONAL_CROP: '/seasonal-crop',
  SOIL_HEALTH: '/soil-health',
  PEST_ALERTS: '/pest-alerts',
  IRRIGATION: '/irrigation',
  GOVERNMENT_SCHEMES: '/government-schemes',
  CROP_TRENDS: '/crop-trends',
  PAYMENT: '/payment',
  TERMS: '/terms',
  PRIVACY: '/privacy'
};

// Theme Colors
export const THEME_COLORS = {
  primary: '#10b981', // Green
  secondary: '#3b82f6', // Blue
  accent: '#f59e0b', // Orange
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#06b6d4',
  dark: '#1f2937',
  light: '#f9fafb'
};

// Breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    SIGNUP: 'Registration successful!',
    ORDER_PLACED: 'Order placed successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    ITEM_ADDED: 'Item added to cart!',
    ITEM_REMOVED: 'Item removed from cart!'
  },
  ERROR: {
    LOGIN: 'Invalid credentials!',
    SIGNUP: 'Registration failed!',
    NETWORK: 'Network error. Please try again!',
    VALIDATION: 'Please fill all required fields!',
    UNAUTHORIZED: 'Unauthorized access!',
    NOT_FOUND: 'Resource not found!'
  },
  INFO: {
    LOADING: 'Loading...',
    PROCESSING: 'Processing...',
    NO_DATA: 'No data available',
    CART_EMPTY: 'Your cart is empty'
  }
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_LENGTH: 10,
  AADHAAR_LENGTH: 12,
  PIN_CODE_LENGTH: 6,
  MIN_ORDER_AMOUNT: 100,
  MAX_CART_ITEMS: 50
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  CART_ITEMS: 'cartItems',
  PREFERENCES: 'preferences',
  LOCATION: 'location',
  LANGUAGE: 'language'
};

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'தமிழ்' }
];

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

// Units
export const UNITS = {
  WEIGHT: ['kg', 'quintal', 'ton'],
  AREA: ['hectare', 'acre', 'bigha'],
  CURRENCY: '₹',
  TEMPERATURE: '°C',
  RAINFALL: 'mm',
  PERCENTAGE: '%'
};

// Default Values
export const DEFAULTS = {
  PAGINATION_LIMIT: 12,
  MAP_ZOOM: 12,
  IMAGE_QUALITY: 0.8,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};
