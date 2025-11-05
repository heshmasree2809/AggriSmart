# AgriSmart Quick Start Guide

## 📋 Project Overview

AgriSmart is a comprehensive MERN-stack agricultural platform that connects farmers directly with consumers, provides AI-powered agricultural insights, and offers tools for modern farming practices.

## 🚀 Quick Setup

### Prerequisites
- Node.js v18+ and npm
- MongoDB Atlas account
- Redis (local or cloud)
- Git

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/agrismart.git
cd agrismart

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your configurations
```

### Step 2: Environment Configuration

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrismart

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-secret-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-key
REFRESH_TOKEN_EXPIRY=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# External APIs
WEATHER_API_KEY=your-openweathermap-key
ML_API_URL=http://localhost:5001

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client URL
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_KEY=your-google-maps-key
```

### Step 3: Database Setup

```bash
# Run from backend directory
npm run seed        # Seeds initial data
npm run migrate     # Run migrations if any
```

### Step 4: Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Start Redis (if local)
redis-server
```

### Step 5: Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Docs: http://localhost:5000/api-docs

## 🏗️ Project Structure

```
agrismart/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/      # API services
│   │   ├── store/        # Redux store
│   │   └── utils/        # Utilities
│   └── public/           # Static assets
│
├── backend/              # Node.js/Express API
│   ├── controllers/      # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
│
└── docs/                # Documentation
    ├── API_DOCUMENTATION.md
    ├── DATABASE_DESIGN.md
    └── DEPLOYMENT.md
```

## 🔑 Default Credentials

### Admin Account
- Email: admin@agrismart.com
- Password: Admin@123

### Test Farmer Account
- Email: farmer@test.com
- Password: Farmer@123

### Test Buyer Account
- Email: buyer@test.com
- Password: Buyer@123

## 🛠️ Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run tests
npm run lint        # Run ESLint
npm run seed        # Seed database
npm run build       # Build for production
```

### Frontend Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run test        # Run tests
npm run lint        # Run ESLint
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 📦 Key Features

### For Farmers
- ✅ Product listing and management
- ✅ AI-powered disease detection
- ✅ Soil health analysis
- ✅ Smart irrigation planning
- ✅ Real-time price updates
- ✅ Weather forecasts
- ✅ Order management

### For Buyers
- ✅ Browse fresh produce
- ✅ Direct farmer purchases
- ✅ Order tracking
- ✅ Multiple payment options
- ✅ Product reviews
- ✅ Bulk ordering (B2B)

### For Platform
- ✅ Multi-role authentication
- ✅ Real-time notifications
- ✅ Analytics dashboard
- ✅ Multi-language support
- ✅ Mobile responsive
- ✅ Offline capability

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Farmer)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update status

### Agricultural Tools
- `POST /api/disease/scan` - Disease detection
- `POST /api/soil/analyze` - Soil analysis
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/crops/recommendations` - Crop suggestions

## 🚨 Common Issues & Solutions

### MongoDB Connection Error
```bash
# Check MongoDB URI in .env
# Ensure IP whitelist includes your IP
# Verify network connectivity
```

### Redis Connection Error
```bash
# Ensure Redis is running
redis-cli ping
# Should return PONG
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Deploy to Production

#### Backend (Heroku)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create agrismart-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📖 Documentation Links

- [Complete Documentation](./docs/README.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_DESIGN.md)
- [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)
- [Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)
- [Implementation Tasks](./docs/IMPLEMENTATION_TASKS.md)
- [Master Prompts](./docs/MASTER_PROMPTS.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Development Workflow

```mermaid
graph LR
    A[Plan Feature] --> B[Create Branch]
    B --> C[Develop]
    C --> D[Test]
    D --> E[Code Review]
    E --> F[Merge to Main]
    F --> G[Deploy]
```

## 🔒 Security Best Practices

1. Never commit `.env` files
2. Use strong passwords
3. Keep dependencies updated
4. Validate all inputs
5. Use HTTPS in production
6. Implement rate limiting
7. Regular security audits

## 📞 Support

- Documentation: [docs.agrismart.com](https://docs.agrismart.com)
- Email: support@agrismart.com
- Discord: [Join our community](https://discord.gg/agrismart)
- Issues: [GitHub Issues](https://github.com/yourusername/agrismart/issues)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- TensorFlow for ML models
- MongoDB Atlas for database hosting
- The open-source community

---

**Happy Farming! 🌱**
