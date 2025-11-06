require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const winston = require('winston');

// Import custom middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import database config
const { connectDB } = require('./config/database');
const { redisClient } = require('./config/redis');

// Winston logger config
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'agrismart-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  ]
});

// Import routes
const authRoutes = require('./routes/auth');
const infoRoutes = require('./routes/info');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const soilRoutes = require('./routes/soil');
const diseaseRoutes = require('./routes/disease');
const cropRoutes = require('./routes/crop');
const priceRoutes = require('./routes/price');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:5173'],
    credentials: true
  }
});

const PORT = process.env.PORT || 9653;

// Trust proxy (Render requirement)
app.set('trust proxy', 1);

// Secure headers
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limit
app.use('/api/', generalLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/price', priceRoutes);

// ✅ Serve frontend (React build)
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    logger.info("✅ MongoDB connected");

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌐 API available at /api`);
    });
  } catch (error) {
    logger.error("❌ Failed to start:", error);
    process.exit(1);
  }
}

start();
