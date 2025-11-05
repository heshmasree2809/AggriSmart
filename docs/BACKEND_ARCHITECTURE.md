# AgriSmart Backend Architecture

## Technology Stack

- **Node.js v18+** - Runtime environment
- **Express.js v4.18** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose v7** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Redis** - Caching and sessions
- **Socket.io** - Real-time communication
- **Bull** - Job queue for background tasks
- **Winston** - Logging
- **Joi** - Validation
- **Nodemailer** - Email service
- **Sharp** - Image processing

## Project Structure

```
backend/
├── config/
│   ├── database.js
│   ├── redis.js
│   ├── cloudinary.js
│   └── keys.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── diseaseController.js
│   ├── soilController.js
│   ├── weatherController.js
│   ├── priceController.js
│   └── notificationController.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── DiseaseScan.js
│   ├── SoilReport.js
│   ├── CropRecommendation.js
│   ├── WeatherForecast.js
│   ├── PriceTrend.js
│   └── Notification.js
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── disease.routes.js
│   ├── soil.routes.js
│   ├── weather.routes.js
│   ├── price.routes.js
│   └── notification.routes.js
├── middleware/
│   ├── auth.js
│   ├── role.js
│   ├── validation.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── logger.js
├── services/
│   ├── authService.js
│   ├── emailService.js
│   ├── smsService.js
│   ├── weatherService.js
│   ├── mlService.js
│   ├── paymentService.js
│   └── notificationService.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── validators.js
│   ├── helpers.js
│   └── constants.js
├── jobs/
│   ├── emailQueue.js
│   ├── imageProcessor.js
│   ├── priceUpdater.js
│   └── weatherUpdater.js
├── sockets/
│   ├── index.js
│   ├── handlers.js
│   └── events.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── uploads/
├── logs/
├── .env
├── .env.example
├── server.js
├── app.js
└── package.json
```

## Core Implementation

### Server Setup (server.js)
```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use(morgan('combined'));

// Compression
app.use(compression());

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.io setup
initializeSocketHandlers(io);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

### Authentication Controller
```javascript
// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendEmail } from '../services/emailService.js';
import { generateOTP, verifyOTP } from '../utils/helpers.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, contact, address } = req.body;
  
  // Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User already exists');
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    contact,
    address
  });
  
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();
  
  // Send welcome email
  await sendEmail({
    to: email,
    subject: 'Welcome to AgriSmart',
    template: 'welcome',
    data: { name }
  });
  
  // Response
  res.status(201).json(
    new ApiResponse(201, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    }, 'User registered successfully')
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  
  // Update last login
  user.lastLogin = Date.now();
  await user.save();
  
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Set cookies
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  res.json(
    new ApiResponse(200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    }, 'Login successful')
  );
});

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
```

### Product Controller with Advanced Features
```javascript
// controllers/productController.js
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { processImage } from '../services/imageService.js';
import redisClient from '../config/redis.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    subcategory,
    minPrice,
    maxPrice,
    organic,
    seller,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;
  
  // Check cache
  const cacheKey = `products:${JSON.stringify(req.query)}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Build query
  const query = { isActive: true };
  
  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (seller) query.seller = seller;
  if (organic !== undefined) query.organic = organic === 'true';
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  
  if (search) {
    query.$text = { $search: search };
  }
  
  // Execute query
  const products = await Product.find(query)
    .populate('seller', 'name rating')
    .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Product.countDocuments(query);
  
  const response = new ApiResponse(200, {
    products,
    page: Number(page),
    limit: Number(limit),
    total,
    pages: Math.ceil(total / limit)
  }, 'Products fetched successfully');
  
  // Cache for 5 minutes
  await redisClient.setex(cacheKey, 300, JSON.stringify(response));
  
  res.json(response);
});

export const createProduct = asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    seller: req.user.id
  };
  
  // Process images if uploaded
  if (req.files && req.files.length > 0) {
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        // Optimize image
        const processedBuffer = await processImage(file.buffer, {
          width: 800,
          height: 800,
          quality: 85
        });
        
        // Upload to cloudinary
        const result = await uploadToCloudinary(processedBuffer, {
          folder: 'products',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        });
        
        return result.secure_url;
      })
    );
    
    productData.images = imageUrls;
  }
  
  const product = await Product.create(productData);
  
  // Clear cache
  await redisClient.del('products:*');
  
  // Emit socket event for real-time updates
  io.emit('product:new', product);
  
  res.status(201).json(
    new ApiResponse(201, product, 'Product created successfully')
  );
});
```

### Disease Detection Service
```javascript
// services/mlService.js
import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';

export class MLService {
  constructor() {
    this.apiUrl = process.env.ML_API_URL || 'http://localhost:5001';
  }
  
  async detectDisease(imagePath, crop) {
    try {
      // Preprocess image
      const processedImage = await sharp(imagePath)
        .resize(224, 224)
        .toBuffer();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', processedImage, 'image.jpg');
      formData.append('crop', crop);
      
      // Call ML API
      const response = await axios.post(
        `${this.apiUrl}/detect-disease`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000
        }
      );
      
      const { disease, confidence, severity, recommendations } = response.data;
      
      // Enhance with local knowledge base
      const enhancedRecommendations = await this.enhanceRecommendations(
        disease,
        crop,
        severity
      );
      
      return {
        disease,
        confidence,
        severity,
        symptoms: this.getDiseaseSymptoms(disease),
        recommendedActions: enhancedRecommendations,
        treatmentPlan: this.generateTreatmentPlan(disease, severity)
      };
    } catch (error) {
      console.error('ML Service Error:', error);
      throw new Error('Disease detection failed');
    }
  }
  
  async enhanceRecommendations(disease, crop, severity) {
    // Query knowledge base for recommendations
    const recommendations = await DiseaseKnowledge.findOne({
      disease,
      crop
    });
    
    if (recommendations) {
      return recommendations.actions.filter(
        action => action.severity === severity
      );
    }
    
    // Default recommendations
    return [
      {
        type: 'immediate',
        description: 'Isolate affected plants',
        priority: 1
      },
      {
        type: 'treatment',
        description: 'Apply appropriate fungicide/pesticide',
        priority: 2
      },
      {
        type: 'preventive',
        description: 'Improve field drainage and air circulation',
        priority: 3
      }
    ];
  }
  
  generateTreatmentPlan(disease, severity) {
    const plans = {
      low: {
        immediate: ['Monitor affected areas daily', 'Remove infected leaves'],
        preventive: ['Improve air circulation', 'Avoid overhead watering'],
        organic: ['Neem oil spray', 'Baking soda solution'],
        chemical: ['Contact fungicide if needed']
      },
      medium: {
        immediate: ['Isolate affected plants', 'Remove all infected parts'],
        preventive: ['Apply preventive fungicide to healthy plants'],
        organic: ['Copper-based fungicide', 'Horticultural oil'],
        chemical: ['Systemic fungicide application']
      },
      high: {
        immediate: ['Remove severely infected plants', 'Burn infected debris'],
        preventive: ['Treat entire field', 'Adjust planting schedule'],
        organic: ['Intensive organic treatment schedule'],
        chemical: ['Professional consultation recommended']
      }
    };
    
    return plans[severity] || plans.medium;
  }
}
```

### Real-time Socket Implementation
```javascript
// sockets/handlers.js
export const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join user-specific room
    socket.on('authenticate', async (token) => {
      try {
        const user = await verifyToken(token);
        socket.userId = user.id;
        socket.join(`user:${user.id}`);
        socket.join(`role:${user.role}`);
        
        // Send pending notifications
        const notifications = await Notification.find({
          recipient: user.id,
          read: false
        });
        socket.emit('notifications:pending', notifications);
      } catch (error) {
        socket.emit('auth:error', 'Invalid token');
      }
    });
    
    // Handle price subscription
    socket.on('prices:subscribe', (crops) => {
      crops.forEach(crop => {
        socket.join(`price:${crop}`);
      });
    });
    
    // Handle chat messages
    socket.on('message:send', async (data) => {
      const message = await saveMessage(data);
      io.to(`user:${data.recipientId}`).emit('message:new', message);
    });
    
    // Handle order updates
    socket.on('order:statusUpdate', async (data) => {
      const order = await updateOrderStatus(data);
      io.to(`user:${order.buyer}`).emit('order:updated', order);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  // Scheduled price updates
  setInterval(async () => {
    const priceUpdates = await fetchLatestPrices();
    priceUpdates.forEach(update => {
      io.to(`price:${update.crop}`).emit('price:update', update);
    });
  }, 60000); // Every minute
};
```

### Background Job Processing
```javascript
// jobs/priceUpdater.js
import Bull from 'bull';
import { fetchMarketPrices } from '../services/priceService.js';
import PriceTrend from '../models/PriceTrend.js';

const priceQueue = new Bull('price-updates', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  }
});

priceQueue.process(async (job) => {
  const { markets, crops } = job.data;
  
  for (const market of markets) {
    for (const crop of crops) {
      try {
        const priceData = await fetchMarketPrices(market, crop);
        
        await PriceTrend.create({
          crop,
          market,
          date: new Date(),
          prices: priceData.prices,
          arrivals: priceData.arrivals,
          trend: calculateTrend(priceData)
        });
        
        // Notify subscribers
        io.to(`price:${crop}`).emit('price:update', {
          crop,
          market,
          price: priceData.prices.modal
        });
      } catch (error) {
        console.error(`Price update failed for ${crop} in ${market}:`, error);
      }
    }
  }
});

// Schedule daily price updates
priceQueue.add(
  { markets: ['Delhi', 'Mumbai', 'Bangalore'], crops: ['Tomato', 'Onion', 'Potato'] },
  { repeat: { cron: '0 6 * * *' } } // 6 AM daily
);
```

### Middleware Implementation

#### Authentication Middleware
```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  
  if (!token) {
    throw new ApiError(401, 'Please authenticate');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      throw new ApiError(401, 'User not found');
    }
    
    if (!req.user.isActive) {
      throw new ApiError(403, 'Account deactivated');
    }
    
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
});

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Insufficient permissions');
    }
    next();
  };
};
```

#### Validation Middleware
```javascript
// middleware/validation.js
import Joi from 'joi';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      throw new ApiError(422, 'Validation failed', errors);
    }
    
    next();
  };
};

// Validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    role: Joi.string().valid('Farmer', 'Buyer').required(),
    contact: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    address: Joi.object({
      street: Joi.string(),
      village: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string().pattern(/^\d{6}$/)
    })
  }),
  
  product: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().max(1000),
    price: Joi.number().positive().required(),
    unit: Joi.string().valid('kg', 'gram', 'piece', 'dozen', 'quintal').required(),
    quantity: Joi.number().positive().required(),
    organic: Joi.boolean(),
    harvestDate: Joi.date()
  })
};
```

## Testing Implementation

```javascript
// tests/integration/auth.test.js
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Farmer',
          email: 'test@example.com',
          password: 'Test@1234',
          role: 'Farmer',
          contact: '9876543210',
          address: {
            village: 'Test Village',
            district: 'Test District',
            state: 'Test State'
          }
        });
      
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('accessToken');
    });
  });
});
```

## Deployment Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  nginx:
    image: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```
