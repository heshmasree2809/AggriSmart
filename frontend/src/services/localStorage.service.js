// Local Storage Service for Demo/Offline functionality
class LocalStorageService {
  constructor() {
    this.prefix = 'agrismart_';
    this.initializeDefaultData();
  }

  // Initialize with default data if empty
  initializeDefaultData() {
    if (!this.get('initialized')) {
      this.set('initialized', true);
      this.initializeUsers();
      this.initializeProducts();
      this.initializeOrders();
      this.initializeSchemes();
      this.initializeCropData();
      this.initializeWeatherData();
      this.initializePestAlerts();
    }
  }

  // Generic methods
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('LocalStorage set error:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return defaultValue;
    }
  }

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }

  clear() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // User Management
  initializeUsers() {
    const users = [
      {
        id: '1',
        name: 'Demo User',
        email: 'demo@agrismart.com',
        password: 'Demo@123', // In real app, this would be hashed
        phone: '9876543210',
        role: 'farmer',
        address: {
          street: '123 Green Valley',
          city: 'Farmville',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        },
        createdAt: new Date('2024-01-01').toISOString()
      }
    ];
    this.set('users', users);
  }

  getUsers() {
    return this.get('users', []);
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.set('users', users);
    return newUser;
  }

  updateUser(userId, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.set('users', users);
      return users[index];
    }
    return null;
  }

  // Product Management
  initializeProducts() {
    const products = [
      {
        id: '1',
        name: 'Fresh Tomatoes',
        description: 'Organic farm-fresh tomatoes, rich in vitamins',
        price: 40,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1546470427-227d2c7c5c41?w=400',
        stock: 100,
        inStock: true,
        featured: true,
        discount: 10,
        rating: 4.5,
        reviews: 23,
        organic: true,
        farmer: { id: '1', name: 'Raj Kumar', location: 'Bangalore' }
      },
      {
        id: '2',
        name: 'Green Chillies',
        description: 'Spicy green chillies, perfect for Indian cuisine',
        price: 60,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400',
        stock: 50,
        inStock: true,
        featured: false,
        discount: 0,
        rating: 4.3,
        reviews: 15,
        organic: false,
        farmer: { id: '2', name: 'Priya Sharma', location: 'Mysore' }
      },
      {
        id: '3',
        name: 'Fresh Onions',
        description: 'Premium quality onions, essential for every kitchen',
        price: 30,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
        stock: 200,
        inStock: true,
        featured: true,
        discount: 15,
        rating: 4.7,
        reviews: 45,
        organic: false,
        farmer: { id: '3', name: 'Amit Patel', location: 'Hubli' }
      },
      {
        id: '4',
        name: 'Potatoes',
        description: 'Fresh potatoes, versatile and nutritious',
        price: 25,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
        stock: 150,
        inStock: true,
        featured: false,
        discount: 5,
        rating: 4.6,
        reviews: 38,
        organic: true,
        farmer: { id: '1', name: 'Raj Kumar', location: 'Bangalore' }
      },
      {
        id: '5',
        name: 'Carrots',
        description: 'Sweet and crunchy carrots, rich in beta-carotene',
        price: 45,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
        stock: 80,
        inStock: true,
        featured: true,
        discount: 20,
        rating: 4.4,
        reviews: 19,
        organic: true,
        farmer: { id: '4', name: 'Sunita Devi', location: 'Mandya' }
      },
      {
        id: '6',
        name: 'Spinach',
        description: 'Fresh green spinach, packed with iron and nutrients',
        price: 35,
        unit: 'bunch',
        category: 'Leafy Greens',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
        stock: 60,
        inStock: true,
        featured: false,
        discount: 0,
        rating: 4.8,
        reviews: 27,
        organic: true,
        farmer: { id: '2', name: 'Priya Sharma', location: 'Mysore' }
      },
      {
        id: '7',
        name: 'Cauliflower',
        description: 'Fresh white cauliflower, perfect for curries and salads',
        price: 50,
        unit: 'piece',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400',
        stock: 40,
        inStock: true,
        featured: true,
        discount: 10,
        rating: 4.5,
        reviews: 32,
        organic: true,
        farmer: { id: '5', name: 'Karthik Reddy', location: 'Tumkur' }
      },
      {
        id: '8',
        name: 'Brinjal (Eggplant)',
        description: 'Purple brinjals, ideal for bhartha and curry',
        price: 35,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400',
        stock: 70,
        inStock: true,
        featured: false,
        discount: 0,
        rating: 4.2,
        reviews: 18,
        organic: false,
        farmer: { id: '3', name: 'Amit Patel', location: 'Hubli' }
      },
      {
        id: '9',
        name: 'Capsicum',
        description: 'Fresh green capsicum, crunchy and flavorful',
        price: 70,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
        stock: 45,
        inStock: true,
        featured: false,
        discount: 15,
        rating: 4.6,
        reviews: 25,
        organic: true,
        farmer: { id: '6', name: 'Lakshmi Nair', location: 'Hassan' }
      },
      {
        id: '10',
        name: 'Coriander Leaves',
        description: 'Fresh coriander leaves for garnishing',
        price: 20,
        unit: 'bunch',
        category: 'Herbs',
        image: 'https://images.unsplash.com/photo-1608600712992-03e5325d94c8?w=400',
        stock: 100,
        inStock: true,
        featured: false,
        discount: 0,
        rating: 4.7,
        reviews: 42,
        organic: true,
        farmer: { id: '2', name: 'Priya Sharma', location: 'Mysore' }
      },
      {
        id: '11',
        name: 'Mint Leaves',
        description: 'Fresh mint leaves, aromatic and cooling',
        price: 25,
        unit: 'bunch',
        category: 'Herbs',
        image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400',
        stock: 80,
        inStock: true,
        featured: false,
        discount: 0,
        rating: 4.8,
        reviews: 30,
        organic: true,
        farmer: { id: '4', name: 'Sunita Devi', location: 'Mandya' }
      },
      {
        id: '12',
        name: 'Drumsticks',
        description: 'Fresh drumsticks, perfect for sambar',
        price: 40,
        unit: 'kg',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        stock: 30,
        inStock: true,
        featured: false,
        discount: 5,
        rating: 4.4,
        reviews: 22,
        organic: false,
        farmer: { id: '1', name: 'Raj Kumar', location: 'Bangalore' }
      }
    ];
    this.set('products', products);
  }

  getProducts() {
    return this.get('products', []);
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  }

  updateProductStock(productId, quantity) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index].stock -= quantity;
      this.set('products', products);
      return products[index];
    }
    return null;
  }

  // Cart Management
  getCart(userId) {
    return this.get(`cart_${userId}`, { items: [], total: 0 });
  }

  addToCart(userId, productId, quantity = 1) {
    const cart = this.getCart(userId);
    const product = this.getProductById(productId);
    
    if (!product) return null;
    
    const existingIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingIndex !== -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].total = cart.items[existingIndex].quantity * cart.items[existingIndex].price;
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity,
        total: product.price * quantity
      });
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + item.total, 0);
    this.set(`cart_${userId}`, cart);
    return cart;
  }

  updateCartItem(userId, productId, quantity) {
    const cart = this.getCart(userId);
    const index = cart.items.findIndex(item => item.productId === productId);
    
    if (index !== -1) {
      if (quantity === 0) {
        cart.items.splice(index, 1);
      } else {
        cart.items[index].quantity = quantity;
        cart.items[index].total = cart.items[index].quantity * cart.items[index].price;
      }
      
      cart.total = cart.items.reduce((sum, item) => sum + item.total, 0);
      this.set(`cart_${userId}`, cart);
    }
    
    return cart;
  }

  clearCart(userId) {
    this.set(`cart_${userId}`, { items: [], total: 0 });
    return { items: [], total: 0 };
  }

  // Order Management
  initializeOrders() {
    this.set('orders', []);
  }

  getOrders(userId = null) {
    const orders = this.get('orders', []);
    return userId ? orders.filter(o => o.userId === userId) : orders;
  }

  createOrder(userId, orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: `ORD${Date.now()}`,
      userId,
      ...orderData,
      status: 'confirmed',
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
    };
    
    orders.push(newOrder);
    this.set('orders', orders);
    
    // Clear cart after order
    this.clearCart(userId);
    
    return newOrder;
  }

  // Government Schemes
  initializeSchemes() {
    const schemes = [
      {
        id: '1',
        name: 'PM-KISAN',
        description: 'Direct income support of ₹6000 per year to farmer families',
        eligibility: 'Small and marginal farmers with land up to 2 hectares',
        benefits: '₹6000 per year in 3 installments',
        howToApply: 'Visit pmkisan.gov.in or nearest CSC center',
        deadline: '2024-03-31',
        status: 'active'
      },
      {
        id: '2',
        name: 'Crop Insurance Scheme',
        description: 'Insurance coverage for crop loss due to natural calamities',
        eligibility: 'All farmers growing notified crops',
        benefits: 'Up to 90% premium subsidy',
        howToApply: 'Contact nearest bank or agriculture office',
        deadline: '2024-06-30',
        status: 'active'
      },
      {
        id: '3',
        name: 'Soil Health Card Scheme',
        description: 'Free soil testing and health card for farmers',
        eligibility: 'All farmers',
        benefits: 'Free soil testing and recommendations',
        howToApply: 'Contact local agriculture department',
        deadline: 'Ongoing',
        status: 'active'
      }
    ];
    this.set('schemes', schemes);
  }

  getSchemes() {
    return this.get('schemes', []);
  }

  // Crop Data
  initializeCropData() {
    const cropData = {
      seasonal: [
        { season: 'Kharif', crops: ['Rice', 'Cotton', 'Sugarcane', 'Pulses'], months: 'June-October' },
        { season: 'Rabi', crops: ['Wheat', 'Mustard', 'Gram', 'Barley'], months: 'October-March' },
        { season: 'Zaid', crops: ['Watermelon', 'Cucumber', 'Muskmelon'], months: 'April-June' }
      ],
      trends: [
        { crop: 'Wheat', price: 2200, change: 5.2, demand: 'High' },
        { crop: 'Rice', price: 2800, change: -2.1, demand: 'Medium' },
        { crop: 'Cotton', price: 6500, change: 8.5, demand: 'High' },
        { crop: 'Sugarcane', price: 3100, change: 3.2, demand: 'Medium' }
      ]
    };
    this.set('cropData', cropData);
  }

  getCropData() {
    return this.get('cropData', {});
  }

  // Weather Data
  initializeWeatherData() {
    const weather = {
      current: {
        temp: 28,
        humidity: 65,
        wind: 12,
        condition: 'Partly Cloudy',
        icon: '⛅',
        location: 'Bangalore',
        feelsLike: 30
      },
      forecast: [
        { day: 'Mon', high: 32, low: 22, condition: 'Sunny', icon: '☀️', rain: 0 },
        { day: 'Tue', high: 30, low: 21, condition: 'Partly Cloudy', icon: '⛅', rain: 10 },
        { day: 'Wed', high: 28, low: 20, condition: 'Rainy', icon: '🌧️', rain: 80 },
        { day: 'Thu', high: 29, low: 21, condition: 'Cloudy', icon: '☁️', rain: 30 },
        { day: 'Fri', high: 31, low: 22, condition: 'Sunny', icon: '☀️', rain: 5 }
      ]
    };
    this.set('weather', weather);
  }

  getWeather() {
    return this.get('weather', {});
  }

  // Pest Alerts
  initializePestAlerts() {
    const alerts = [
      {
        id: '1',
        pest: 'Aphids',
        severity: 'High',
        crop: 'Tomatoes',
        description: 'Small green insects on leaves',
        prevention: 'Use neem oil spray, introduce ladybugs',
        image: '🐛'
      },
      {
        id: '2',
        pest: 'Whitefly',
        severity: 'Medium',
        crop: 'Cotton',
        description: 'White flying insects under leaves',
        prevention: 'Yellow sticky traps, insecticidal soap',
        image: '🦟'
      }
    ];
    this.set('pestAlerts', alerts);
  }

  getPestAlerts() {
    return this.get('pestAlerts', []);
  }

  // Plant Disease Detection History
  saveDetection(detection) {
    const detections = this.get('detections', []);
    const newDetection = {
      id: Date.now().toString(),
      ...detection,
      date: new Date().toISOString()
    };
    detections.unshift(newDetection); // Add to beginning
    if (detections.length > 10) detections.pop(); // Keep only last 10
    this.set('detections', detections);
    return newDetection;
  }

  getDetections() {
    return this.get('detections', []);
  }

  // Notifications
  addNotification(userId, notification) {
    const notifications = this.get(`notifications_${userId}`, []);
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newNotification);
    this.set(`notifications_${userId}`, notifications);
    return newNotification;
  }

  getNotifications(userId) {
    return this.get(`notifications_${userId}`, []);
  }

  markNotificationRead(userId, notificationId) {
    const notifications = this.getNotifications(userId);
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications[index].read = true;
      this.set(`notifications_${userId}`, notifications);
    }
  }
}

// Export singleton instance
export default new LocalStorageService();
