// Local Storage Service - replaces MongoDB API calls
// Reads from JSON files in src/data/ and uses localStorage for user data

import usersData from '../data/users.json';
import cropsData from '../data/crops.json';
import fertilizersData from '../data/fertilizers.json';
import schemesData from '../data/schemes.json';
import vegetablesData from '../data/vegetables.json';
import pestsData from '../data/pests.json';
import irrigationData from '../data/irrigation.json';
import weatherData from '../data/weather.json';
import plantDiseasesData from '../data/plantDiseases.json';
import soilData from '../data/soil.json';

// Helper to get/update data in localStorage
const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
};

// Initialize orders in localStorage if not exists
if (!localStorage.getItem('agrismart_orders')) {
  setStorageItem('agrismart_orders', []);
}

// Auth Service
export const authService = {
  login: async (credentials) => {
    // Check against users.json
    const user = usersData.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const token = `mock-jwt-token-${Date.now()}-${user.id}`;
    const userData = { ...user };
    delete userData.password; // Don't store password

    setStorageItem('agrismart_token', token);
    setStorageItem('agrismart_user', userData);

    return { success: true, token, user: userData };
  },

  signup: async (userData) => {
    // Check if email exists
    const existingUser = usersData.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, hash this
      phone: userData.phone || '',
      location: userData.location || 'India',
      farmSize: userData.farmSize || '',
      crops: userData.crops || [],
      joinedDate: new Date().toISOString().split('T')[0],
      verified: false,
      profileImage: '/images/user.png'
    };

    // Save to localStorage users
    const storedUsers = getStorageItem('agrismart_users', []);
    storedUsers.push(newUser);
    setStorageItem('agrismart_users', storedUsers);

    // Auto login
    const token = `mock-jwt-token-${Date.now()}-${newUser.id}`;
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    setStorageItem('agrismart_token', token);
    setStorageItem('agrismart_user', userWithoutPassword);

    return { success: true, token, user: userWithoutPassword };
  },

  getProfile: async () => {
    const user = getStorageItem('agrismart_user');
    if (!user) {
      throw new Error('User not authenticated');
    }
    return { success: true, user };
  },

  updateProfile: async (profileData) => {
    const user = getStorageItem('agrismart_user');
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updatedUser = { ...user, ...profileData };
    setStorageItem('agrismart_user', updatedUser);
    
    // Also update in users array if exists
    const storedUsers = getStorageItem('agrismart_users', []);
    const userIndex = storedUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      storedUsers[userIndex] = { ...storedUsers[userIndex], ...profileData };
      setStorageItem('agrismart_users', storedUsers);
    }

    return { success: true, user: updatedUser };
  },

  logout: async () => {
    localStorage.removeItem('agrismart_token');
    localStorage.removeItem('agrismart_user');
    return { success: true };
  }
};

// Products/Vegetables Service
export const productsService = {
  getProducts: async (params = {}) => {
    // Use vegetables data from JSON - structure is { vegetables: [...] }
    let products = vegetablesData?.vegetables || [];
    
    // Apply filters
    if (params.category) {
      products = products.filter(p => p.category === params.category);
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return { success: true, data: products };
  },

  getProductById: async (id) => {
    const products = vegetablesData?.vegetables || [];
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return { success: true, data: product };
  },

  searchProducts: async (query) => {
    const products = vegetablesData?.vegetables || [];
    const searchLower = query.toLowerCase();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    );
    return { success: true, data: results };
  }
};

// Orders Service
export const ordersService = {
  createOrder: async (orderData) => {
    const orders = getStorageItem('agrismart_orders', []);
    const user = getStorageItem('agrismart_user');
    
    const newOrder = {
      id: Date.now().toString(),
      userId: user?.id || null,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus || 'pending',
      orderStatus: 'pending',
      total: orderData.total,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge,
      gst: orderData.gst,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    setStorageItem('agrismart_orders', orders);

    return { success: true, data: newOrder };
  },

  getOrders: async () => {
    const user = getStorageItem('agrismart_user');
    const orders = getStorageItem('agrismart_orders', []);
    
    if (user) {
      const userOrders = orders.filter(o => o.userId === user.id);
      return { success: true, data: userOrders };
    }
    
    return { success: true, data: [] };
  },

  getOrderById: async (id) => {
    const orders = getStorageItem('agrismart_orders', []);
    const order = orders.find(o => o.id === id.toString());
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return { success: true, data: order };
  },

  updateOrder: async (id, data) => {
    const orders = getStorageItem('agrismart_orders', []);
    const orderIndex = orders.findIndex(o => o.id === id.toString());
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    setStorageItem('agrismart_orders', orders);
    return { success: true, data: orders[orderIndex] };
  },

  cancelOrder: async (id) => {
    const orders = getStorageItem('agrismart_orders', []);
    const orderIndex = orders.findIndex(o => o.id === id.toString());
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    orders[orderIndex].orderStatus = 'cancelled';
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    setStorageItem('agrismart_orders', orders);
    return { success: true, data: orders[orderIndex] };
  }
};

// Soil Health Service
export const soilService = {
  analyzeSoil: async (data) => {
    // Return mock analysis based on soil type
    const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Silt'];
    const soilType = data.soilType || 'Loamy';
    
    return {
      success: true,
      data: {
        soilType,
        pH: data.pH || 6.5,
        nitrogen: data.nitrogen || 'Medium',
        phosphorus: data.phosphorus || 'Medium',
        potassium: data.potassium || 'Medium',
        organicMatter: data.organicMatter || '2.5%',
        recommendations: soilData.recommendations || [],
        analyzedAt: new Date().toISOString()
      }
    };
  },

  getSoilHistory: async () => {
    const history = getStorageItem('agrismart_soil_history', []);
    return { success: true, data: history };
  },

  getRecommendations: async (soilType) => {
    // Return soil types or conservation practices based on soilType
    let recommendations = [];
    
    if (soilType) {
      const soilTypeData = soilData.soilTypes?.find(s => s.type === soilType);
      if (soilTypeData) {
        recommendations = [{
          soilType: soilTypeData.type,
          suitableCrops: soilTypeData.suitableCrops,
          improvements: soilTypeData.improvements,
          characteristics: soilTypeData.characteristics
        }];
      }
    } else {
      recommendations = soilData.soilTypes || [];
    }
    
    return { success: true, data: recommendations };
  }
};

// Irrigation Service
export const irrigationService = {
  getSchedule: async () => {
    const schedule = getStorageItem('agrismart_irrigation_schedule', irrigationData.irrigationSchedule || []);
    return { success: true, data: schedule };
  },

  updateSchedule: async (data) => {
    setStorageItem('agrismart_irrigation_schedule', data);
    return { success: true, data };
  },

  getWaterUsage: async () => {
    const usage = getStorageItem('agrismart_water_usage', []);
    return { success: true, data: usage };
  },

  getRecommendations: async (cropType) => {
    // irrigationData structure: { irrigationSchedule: [...] }
    let recommendations = [];
    
    if (cropType) {
      const schedule = irrigationData.irrigationSchedule?.find(s => 
        s.crop === cropType
      );
      if (schedule) {
        recommendations = [schedule];
      }
    } else {
      recommendations = irrigationData.irrigationSchedule || [];
    }
    
    return { success: true, data: recommendations };
  }
};

// Government Schemes Service
export const schemesService = {
  getSchemes: async (filters = {}) => {
    let schemes = schemesData.governmentSchemes || [];
    
    if (filters.status) {
      schemes = schemes.filter(s => s.status === filters.status);
    }
    if (filters.state) {
      schemes = [...schemes, ...(schemesData.stateSchemes || []).filter(s => s.state === filters.state)];
    }
    
    return { success: true, data: schemes };
  },

  getSchemeById: async (id) => {
    const allSchemes = [...(schemesData.governmentSchemes || []), ...(schemesData.stateSchemes || [])];
    const scheme = allSchemes.find(s => s.id === parseInt(id));
    
    if (!scheme) {
      throw new Error('Scheme not found');
    }
    
    return { success: true, data: scheme };
  },

  applyForScheme: async (id, applicationData) => {
    const applications = getStorageItem('agrismart_scheme_applications', []);
    const user = getStorageItem('agrismart_user');
    
    const application = {
      id: Date.now().toString(),
      schemeId: id,
      userId: user?.id || null,
      ...applicationData,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };

    applications.push(application);
    setStorageItem('agrismart_scheme_applications', applications);

    return { success: true, data: application };
  }
};

// Pest Management Service
export const pestService = {
  getPestAlerts: async (location) => {
    // pestsData structure: { pestAlerts: [...] }
    let alerts = pestsData.pestAlerts || [];
    
    if (location) {
      alerts = alerts.filter(a => 
        a.regions?.includes(location) || !location
      );
    }
    
    return { success: true, data: alerts };
  },

  reportPest: async (data) => {
    const reports = getStorageItem('agrismart_pest_reports', []);
    const user = getStorageItem('agrismart_user');
    
    const report = {
      id: Date.now().toString(),
      userId: user?.id || null,
      ...data,
      status: 'pending',
      reportedAt: new Date().toISOString()
    };

    reports.push(report);
    setStorageItem('agrismart_pest_reports', reports);

    return { success: true, data: report };
  },

  getTreatments: async (pestId) => {
    // pestsData structure: { pestAlerts: [...] }
    const alerts = pestsData.pestAlerts || [];
    const pest = alerts.find(p => p.id === parseInt(pestId));
    if (!pest) {
      throw new Error('Pest not found');
    }
    
    return { success: true, data: pest.treatment || [] };
  }
};

// Crop Trends Service
export const trendsService = {
  getMarketTrends: async () => {
    const trends = cropsData.cropTrends || [];
    return { success: true, data: trends };
  },

  getPriceTrends: async (cropId) => {
    const crop = cropsData.cropDetails?.find(c => c.id === parseInt(cropId));
    if (!crop) {
      throw new Error('Crop not found');
    }
    
    const trends = cropsData.cropTrends?.find(t => t.crop === crop.name);
    return { success: true, data: trends || { crop: crop.name, data: [] } };
  },

  getDemandForecast: async () => {
    const forecast = getStorageItem('agrismart_demand_forecast', []);
    return { success: true, data: forecast };
  }
};

// Payment Service
export const paymentService = {
  createPaymentIntent: async (amount) => {
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount,
      currency: 'INR',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const intents = getStorageItem('agrismart_payment_intents', []);
    intents.push(paymentIntent);
    setStorageItem('agrismart_payment_intents', intents);

    return { success: true, data: paymentIntent };
  },

  confirmPayment: async (paymentId) => {
    const intents = getStorageItem('agrismart_payment_intents', []);
    const intent = intents.find(i => i.id === paymentId);
    
    if (!intent) {
      throw new Error('Payment intent not found');
    }

    intent.status = 'succeeded';
    setStorageItem('agrismart_payment_intents', intents);

    return { success: true, data: intent };
  },

  getPaymentHistory: async () => {
    const intents = getStorageItem('agrismart_payment_intents', []);
    return { success: true, data: intents };
  }
};

// Export all services
export default {
  authService,
  productsService,
  ordersService,
  soilService,
  irrigationService,
  schemesService,
  pestService,
  trendsService,
  paymentService
};

