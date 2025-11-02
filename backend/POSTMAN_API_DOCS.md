# AgriSmart Backend API - Postman Documentation

Base URL: `http://localhost:9653`

---

## 🔐 Authentication

### 1. Sign Up (POST)
**Endpoint:** `POST /api/signup`  
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Signup successful"
}
```

---

### 2. Login (POST)
**Endpoint:** `POST /api/login`  
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**💡 Save the `token` from this response - you'll need it for protected routes!**

---

### 3. Verify Token (POST)
**Endpoint:** `POST /api/verifyToken`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": { ... }
}
```

---

## 📦 Products (All Public - No Auth Required)

### 1. Get All Products (GET)
**Endpoint:** `GET /api/products`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Tomato",
      "description": "Fresh red tomatoes",
      "price": 50,
      "imageUrl": "https://...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 2. Get Single Product (GET)
**Endpoint:** `GET /api/products/:id`

**Example:** `GET /api/products/60f7b3b3b3b3b3b3b3b3b3b3`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Tomato",
    "description": "Fresh red tomatoes",
    "price": 50,
    "imageUrl": "https://..."
  }
}
```

---

### 3. Create Product (POST)
**Endpoint:** `POST /api/products`  
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Carrot",
  "description": "Fresh organic carrots",
  "price": 30,
  "imageUrl": "https://placehold.co/600x400/22c55e/white?text=Carrot"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 4. Update Product (PUT)
**Endpoint:** `PUT /api/products/:id`  
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Updated Carrot",
  "description": "Updated description",
  "price": 35,
  "imageUrl": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 5. Delete Product (DELETE)
**Endpoint:** `DELETE /api/products/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 🛒 Orders (Protected - Requires JWT Token)

**⚠️ IMPORTANT:** Add this header for all order requests:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 1. Create Order / Checkout (POST)
**Endpoint:** `POST /api/orders/checkout`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Request Body:**
```json
{
  "products": [
    {
      "product": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 2
    },
    {
      "product": "60f7b3b3b3b3b3b3b3b3b3b4",
      "quantity": 1
    }
  ],
  "totalAmount": 130
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "products": [...],
    "totalAmount": 130,
    "status": "Pending",
    "createdAt": "..."
  }
}
```

---

### 2. Get My Orders (GET)
**Endpoint:** `GET /api/orders/my-orders`  
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "user": "...",
      "products": [...],
      "totalAmount": 130,
      "status": "Pending"
    }
  ]
}
```

---

### 3. Get Single Order (GET)
**Endpoint:** `GET /api/orders/:id`  
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 4. Update Order Status (PUT)
**Endpoint:** `PUT /api/orders/:id`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Request Body:**
```json
{
  "status": "Processing"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 🌱 Soil Data (Protected - Requires JWT Token)

### 1. Get Soil Data (GET)
**Endpoint:** `GET /api/soil`  
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "ph": 7.0,
    "nitrogen": 0,
    "potassium": 0,
    "phosphorus": 0,
    "lastUpdated": "..."
  }
}
```

---

### 2. Update Soil Data (POST)
**Endpoint:** `POST /api/soil`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Request Body:**
```json
{
  "ph": 6.5,
  "nitrogen": 25,
  "potassium": 30,
  "phosphorus": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 📚 Info (All Public - No Auth Required)

### 1. Get All Fertilizers (GET)
**Endpoint:** `GET /api/info/fertilizers`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "NPK Fertilizer",
      "description": "...",
      "usage": "..."
    }
  ]
}
```

---

### 2. Get All Pests (GET)
**Endpoint:** `GET /api/info/pests`

**Response (200):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

### 3. Get All Schemes (GET)
**Endpoint:** `GET /api/info/schemes`

**Response (200):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## 🌤️ Weather (Protected - Requires JWT Token)

### 1. Get Weather Forecast (GET)
**Endpoint:** `GET /api/weather/forecast?location=Mumbai`  
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Query Parameters:**
- `location` (optional): City name

**Response (200):**
```json
{
  "success": true,
  "data": {
    "temp": "29°C",
    "condition": "Sunny",
    "location": "Mumbai",
    "requestedBy": "John Doe"
  }
}
```

---

## 📋 Quick Postman Setup Guide

### Step 1: Create Environment in Postman
1. Click "Environments" → "Create Environment"
2. Add variables:
   - `base_url`: `http://localhost:9653`
   - `token`: (leave empty for now)

### Step 2: Login and Save Token
1. Create a POST request: `{{base_url}}/api/login`
2. Add body with your credentials
3. In Tests tab, add:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### Step 3: Use Token in Protected Routes
1. Go to "Authorization" tab
2. Select "Bearer Token"
3. Enter: `{{token}}`

---

## 🚀 Quick Start Testing Flow

1. **Sign Up:** `POST /api/signup` (create account)
2. **Login:** `POST /api/login` (get token)
3. **Get Products:** `GET /api/products` (see available products)
4. **Create Order:** `POST /api/orders/checkout` (with token)
5. **Get Orders:** `GET /api/orders/my-orders` (with token)
6. **Update Soil:** `POST /api/soil` (with token)

---

## 📝 Notes

- All timestamps are in ISO format
- Protected routes require `Authorization: Bearer <token>` header
- Token expires in 7 days
- Server runs on port 9653 by default
- API documentation available at: `GET /api/docs`

---

## ⚠️ Common Errors

**401 Unauthorized:**
- Token missing or invalid
- Solution: Login again to get new token

**404 Not Found:**
- Invalid endpoint or ID
- Check URL and ID format

**500 Server Error:**
- Database connection issue
- Check MongoDB connection in server logs

---

Happy Testing! 🎉

