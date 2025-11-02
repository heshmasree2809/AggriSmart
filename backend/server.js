// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all routes
const authRoutes = require('./routes/auth');
const infoRoutes = require('./routes/info');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const soilRoutes = require('./routes/soil');
const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 9653;

// Middlewares
// Configure CORS to explicitly allow requests from frontend
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'], // Allow frontend origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));
app.use(express.json());

// API Routes
// Use the base paths for all routes
app.use('/api', authRoutes); // for /api/login, /api/signup
app.use('/api/info', infoRoutes); // for /api/info/fertilizers, etc.
app.use('/api/products', productRoutes); // for /api/products
app.use('/api/orders', orderRoutes); // for /api/orders/checkout, etc.
app.use('/api/soil', soilRoutes); // for /api/soil
app.use('/api/weather', weatherRoutes); // for /api/weather/forecast

// Global error handler middleware (MUST be after routes)
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 for undefined routes (MUST be last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AgriSmart API is running',
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      auth: '/api/signup, /api/login, /api/verifyToken',
      products: '/api/products (GET)',
      orders: '/api/orders/checkout (POST), /api/orders/my-orders (GET)',
      soil: '/api/soil (GET, POST)',
      info: '/api/info/fertilizers, /api/info/pests, /api/info/schemes',
      weather: '/api/weather/forecast (GET)'
    }
  });
});

// Test connectivity endpoint (for debugging)
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test successful - backend is reachable',
    timestamp: new Date().toISOString(),
    mongooseStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'AgriSmart API Documentation',
    baseURL: `http://localhost:${PORT}`,
    endpoints: {
      'Auth (Public)': {
        'POST /api/signup': {
          description: 'Register a new user',
          body: { name: 'string', email: 'string', password: 'string (min 6 chars)' }
        },
        'POST /api/login': {
          description: 'Login and get JWT token',
          body: { email: 'string', password: 'string' },
          returns: 'token and user object'
        },
        'POST /api/verifyToken': {
          description: 'Verify if JWT token is valid',
          headers: { Authorization: 'Bearer <token>' }
        }
      },
      'Products (Public)': {
        'GET /api/products': {
          description: 'Get all products',
          returns: 'Array of products'
        }
      },
      'Orders (Protected - Requires JWT)': {
        'POST /api/orders/checkout': {
          description: 'Create a new order',
          headers: { Authorization: 'Bearer <token>' },
          body: { products: '[{product: ObjectId, quantity: number}]', totalAmount: 'number' }
        },
        'GET /api/orders/my-orders': {
          description: 'Get all orders for logged-in user',
          headers: { Authorization: 'Bearer <token>' }
        }
      },
      'Soil Data (Protected - Requires JWT)': {
        'GET /api/soil': {
          description: 'Get user soil data',
          headers: { Authorization: 'Bearer <token>' }
        },
        'POST /api/soil': {
          description: 'Update or create soil data',
          headers: { Authorization: 'Bearer <token>' },
          body: { ph: 'number', nitrogen: 'number', potassium: 'number', phosphorus: 'number' }
        }
      },
      'Info (Public)': {
        'GET /api/info/fertilizers': 'Get all fertilizers',
        'GET /api/info/pests': 'Get all pests',
        'GET /api/info/schemes': 'Get all government schemes'
      },
      'Weather (Protected - Requires JWT)': {
        'GET /api/weather/forecast': {
          description: 'Get weather forecast',
          headers: { Authorization: 'Bearer <token>' },
          query: '?location=cityname (optional)'
        }
      }
    }
  });
});

// Connect to MongoDB
let mongoUri = process.env.MONGODB_URI;
const isDev = process.env.NODE_ENV !== 'production';

// Debug: Check if URI exists
if (!mongoUri) {
  console.error('❌ Error: MONGODB_URI is not defined in .env file');
  console.error('💡 Please create backend/.env file with your MongoDB connection string');
  if (!isDev) process.exit(1);
}

// Clean up the URI (remove quotes and whitespace)
if (mongoUri) {
  mongoUri = mongoUri.trim().replace(/^["']|["']$/g, '');
  
  // Debug: Show masked URI (hide password)
  const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
  console.log('🔗 Attempting to connect to MongoDB...');
  console.log('📍 Connection string:', maskedUri);
  
  mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 5, // Maintain at least 5 socket connections
    retryWrites: true,
    w: 'majority'
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    startServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed!');
    console.error('📋 Error Type:', err.name);
    console.error('📋 Error Message:', err.message);
    console.error('');
    
    // Provide specific troubleshooting based on error type
    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('🔐 Authentication Error:');
      console.error('   - Username or password is incorrect');
      console.error('   - Verify database user exists in MongoDB Atlas');
      console.error('   - Check user permissions in MongoDB Atlas');
    } else if (err.message.includes('querySrv') || err.message.includes('ENOTFOUND') || err.message.includes('EBADNAME')) {
      console.error('🌐 DNS/Network Error:');
      console.error('   - Cluster URL might be incorrect');
      console.error('   - Check internet connection');
      console.error('   - Verify cluster is running in MongoDB Atlas');
      console.error('   - The cluster URL should match exactly from Atlas');
    } else if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.error('🚫 IP Whitelist Error:');
      console.error('   - Your IP address is not whitelisted');
      console.error('   - Go to: MongoDB Atlas → Network Access → Add IP Address');
      console.error('   - Add 0.0.0.0/0 for all IPs (development only)');
    } else if (err.message.includes('timeout')) {
      console.error('⏱️  Timeout Error:');
      console.error('   - Connection timed out');
      console.error('   - Check firewall/antivirus settings');
      console.error('   - Verify network connectivity');
    }
    
    console.error('');
    console.error('💡 Quick Fix Steps:');
    console.error('   1. Run: node test-connection.js (in backend folder)');
    console.error('   2. Verify connection string in MongoDB Atlas dashboard');
    console.error('   3. Check Network Access → IP Whitelist in MongoDB Atlas');
    console.error('   4. Ensure cluster is running (not paused)');
    console.error('');
    
    if (isDev) {
      console.log('⚠️  Running in DEV mode - Server will start anyway');
      console.log('⚠️  Database operations will fail until MongoDB is connected');
      console.log('⚠️  Run "node test-connection.js" to debug connection');
      console.log('');
      startServer();
    } else {
      process.exit(1);
    }
  });
} else {
  console.log('⚠️  MONGODB_URI not set - Server will start in limited mode');
  startServer();
}

// Start server function
function startServer() {
  // Verify JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET is not set in .env file');
    console.warn('⚠️  Authentication will fail. Please set JWT_SECRET in backend/.env');
  } else {
    console.log('🔐 JWT_SECRET is configured');
  }

  app.listen(PORT, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err);
      return;
    }
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log('');
  });

  // Handle uncaught errors
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
  });
}
