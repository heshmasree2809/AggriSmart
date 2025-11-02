# 🔌 Backend Integration Guide for AgriSmart

## 📋 Table of Contents
1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [Environment Configuration](#environment-configuration)
4. [API Services](#api-services)
5. [Authentication Flow](#authentication-flow)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Testing API Integration](#testing-api-integration)

## 🎯 Overview

This document provides comprehensive guidance for backend developers to integrate with the AgriSmart frontend application. The app is built with React and is fully prepared for RESTful API integration.

## 🏗️ API Architecture

### Base Configuration
Location: `src/config/api.config.js`

The API configuration uses environment variables for flexibility:
```javascript
BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
```

### Service Layer Structure
```
src/services/
├── api.service.js        # Core API service with interceptors
├── auth.service.js       # Authentication endpoints
├── product.service.js    # Product/vegetable endpoints
└── [feature].service.js  # Other feature-specific services
```

## ⚙️ Environment Configuration

### Required Environment Variables
Create a `.env` file in the root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_KEY=agrismart_token
VITE_AUTH_USER_KEY=agrismart_user

# External APIs
VITE_WEATHER_API_KEY=your_weather_api_key_here
VITE_WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Feature Flags
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=false
```

## 📡 API Services

### Authentication Service
**Endpoints Required:**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/login` | User login | `{email, password}` | `{token, refreshToken, user}` |
| POST | `/auth/signup` | User registration | `{name, email, password, phone}` | `{token, refreshToken, user}` |
| POST | `/auth/logout` | User logout | - | `{message}` |
| POST | `/auth/refresh` | Refresh token | `{refreshToken}` | `{token}` |
| GET | `/auth/profile` | Get user profile | - | `{user}` |
| PUT | `/auth/update-profile` | Update profile | `{name, phone, address}` | `{user}` |

### Products (Vegetables) Service
**Endpoints Required:**

| Method | Endpoint | Description | Request Params | Response |
|--------|----------|-------------|----------------|----------|
| GET | `/products` | List all products | `?page=1&limit=10&category=` | `{items[], total, pages}` |
| GET | `/products/:id` | Get product details | - | `{product}` |
| GET | `/products/categories` | Get all categories | - | `{categories[]}` |
| GET | `/products/search` | Search products | `?q=tomato&filters={}` | `{items[]}` |
| GET | `/products/featured` | Get featured products | - | `{items[]}` |

### Cart Service
**Endpoints Required:**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/cart` | Get user cart | - | `{items[], total}` |
| POST | `/cart/add` | Add to cart | `{productId, quantity}` | `{cart}` |
| PUT | `/cart/update` | Update quantity | `{productId, quantity}` | `{cart}` |
| DELETE | `/cart/remove` | Remove item | `{productId}` | `{cart}` |
| DELETE | `/cart/clear` | Clear cart | - | `{message}` |

### Orders Service
**Endpoints Required:**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/orders` | Get user orders | - | `{orders[]}` |
| POST | `/orders/create` | Create order | `{items[], address, payment}` | `{order}` |
| GET | `/orders/:id` | Get order details | - | `{order}` |
| POST | `/orders/:id/cancel` | Cancel order | - | `{order}` |

### Plant Detection Service
**Endpoints Required:**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/plant/detect-disease` | Detect disease | `FormData with image` | `{disease, confidence, treatment}` |
| GET | `/plant/treatment/:diseaseId` | Get treatment | - | `{treatment}` |
| GET | `/plant/history` | Detection history | - | `{detections[]}` |

### Weather Service
**Endpoints Required:**

| Method | Endpoint | Description | Request Params | Response |
|--------|----------|-------------|----------------|----------|
| GET | `/weather/current` | Current weather | `?lat=&lon=` | `{weather}` |
| GET | `/weather/forecast` | Weather forecast | `?lat=&lon=&days=7` | `{forecast[]}` |
| GET | `/weather/alerts` | Weather alerts | `?location=` | `{alerts[]}` |

## 🔐 Authentication Flow

### Login Flow
1. User submits credentials
2. Backend validates and returns JWT token + refresh token
3. Frontend stores tokens in localStorage
4. All subsequent requests include Bearer token in Authorization header

### Token Management
```javascript
// Request Interceptor (automatically adds token)
config.headers.Authorization = `Bearer ${token}`;

// Response Interceptor (handles token refresh)
if (error.response?.status === 401) {
  // Attempt to refresh token
  // If refresh fails, redirect to login
}
```

## 📊 Data Models

### User Model
```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  role: 'user' | 'farmer' | 'admin',
  address: {
    street: string,
    city: string,
    state: string,
    pincode: string,
    country: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  unit: 'kg' | 'piece' | 'dozen',
  category: string,
  image: string,
  stock: number,
  featured: boolean,
  discount: number,
  rating: number,
  reviews: number,
  farmer: {
    id: string,
    name: string,
    location: string
  }
}
```

### Order Model
```javascript
{
  id: string,
  userId: string,
  items: [{
    productId: string,
    name: string,
    price: number,
    quantity: number,
    total: number
  }],
  total: number,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentMethod: string,
  address: Address,
  createdAt: Date,
  deliveryDate: Date
}
```

## ⚠️ Error Handling

### Standard Error Response Format
```javascript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human readable error message',
    details: {} // Optional additional details
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resources)
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## 🧪 Testing API Integration

### Using the API Test Component
Create a test component to verify endpoints:

```javascript
// src/pages/ApiTest.jsx
import React from 'react';
import apiService from '../services/api.service';

const ApiTest = () => {
  const testEndpoint = async () => {
    const result = await apiService.get('/test');
    console.log('API Response:', result);
  };

  return (
    <button onClick={testEndpoint}>Test API</button>
  );
};
```

### Custom Hooks Usage
```javascript
import { useApi } from '../hooks/useApi';
import productService from '../services/product.service';

const MyComponent = () => {
  const { data, loading, error } = useApi(
    productService.getProducts,
    true // immediate execution
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ProductList products={data} />;
};
```

## 🚀 Deployment Checklist

### Backend Requirements
- [ ] CORS configuration allows frontend domain
- [ ] JWT secret key is secure
- [ ] Rate limiting is implemented
- [ ] Input validation on all endpoints
- [ ] Database indexes for performance
- [ ] Error logging system
- [ ] API documentation (Swagger/Postman)

### Frontend Configuration
- [ ] Update `.env` with production API URL
- [ ] Remove console.log statements
- [ ] Enable HTTPS in production
- [ ] Configure proper error tracking (Sentry)
- [ ] Optimize bundle size
- [ ] Test all API integrations

## 📝 Quick Start for Backend Developer

1. **Clone and Install**
   ```bash
   git clone [repository]
   cd new_agri
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Update with your backend URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test Your Endpoints**
   - Open browser console
   - Navigate to different pages
   - Monitor network requests
   - Check for proper data flow

## 🤝 Frontend-Backend Contract

### Request Headers
```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {token}' // If authenticated
}
```

### Success Response Format
```javascript
{
  success: true,
  data: {}, // Actual response data
  message: 'Optional success message'
}
```

### Pagination Format
```javascript
{
  success: true,
  data: {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 100,
      pages: 10
    }
  }
}
```

## 📞 Support

For questions about frontend integration:
- Check `src/services/` for service implementations
- Review `src/hooks/useApi.js` for custom hook usage
- Examine `src/config/api.config.js` for endpoint definitions

---

**Note:** This guide assumes a RESTful API architecture. For GraphQL or WebSocket implementations, additional configuration may be required.
