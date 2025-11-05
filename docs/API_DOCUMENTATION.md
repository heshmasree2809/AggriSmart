# AgriSmart API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.agrismart.com/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All responses follow a consistent JSON structure:

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": []
}
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "Farmer|Buyer",
  "contact": "string",
  "address": {
    "street": "string",
    "village": "string",
    "district": "string",
    "state": "string",
    "zipcode": "string"
  }
}
```

**Response:** User object with JWT token

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** User object with JWT token

#### Refresh Token
```http
POST /auth/refresh
```

#### Logout
```http
POST /auth/logout
```

#### Forgot Password
```http
POST /auth/forgot-password
```

#### Reset Password
```http
POST /auth/reset-password/:token
```

### User Management

#### Get Profile
```http
GET /users/profile
```
**Auth Required:** Yes

#### Update Profile
```http
PUT /users/profile
```
**Auth Required:** Yes

#### Upload Profile Image
```http
POST /users/profile/image
```
**Auth Required:** Yes

#### Get User by ID
```http
GET /users/:id
```

#### Update Bank Details (Farmers)
```http
PUT /users/bank-details
```
**Auth Required:** Yes (Farmer only)

### Product Management

#### List Products
```http
GET /products
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `category`
- `subcategory`
- `minPrice`
- `maxPrice`
- `organic` (boolean)
- `seller`
- `search` (text search)
- `sortBy` (price, createdAt, rating)
- `order` (asc, desc)

#### Get Product Details
```http
GET /products/:id
```

#### Create Product (Farmer)
```http
POST /products
```
**Auth Required:** Yes (Farmer only)

**Request Body:**
```json
{
  "name": "string",
  "category": "string",
  "subcategory": "string",
  "description": "string",
  "price": "number",
  "unit": "kg|gram|piece|dozen|quintal",
  "quantity": "number",
  "minimumOrder": "number",
  "organic": "boolean",
  "harvestDate": "date",
  "images": ["string"]
}
```

#### Update Product
```http
PUT /products/:id
```
**Auth Required:** Yes (Owner only)

#### Delete Product
```http
DELETE /products/:id
```
**Auth Required:** Yes (Owner only)

#### Upload Product Images
```http
POST /products/:id/images
```
**Auth Required:** Yes (Owner only)

### Order Management

#### Create Order
```http
POST /orders
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "items": [
    {
      "product": "productId",
      "quantity": "number"
    }
  ],
  "shippingAddress": {},
  "paymentMethod": "string",
  "orderType": "B2C|B2B"
}
```

#### Get User Orders
```http
GET /orders
```
**Auth Required:** Yes

#### Get Order Details
```http
GET /orders/:id
```
**Auth Required:** Yes

#### Update Order Status
```http
PUT /orders/:id/status
```
**Auth Required:** Yes (Seller/Admin)

#### Cancel Order
```http
PUT /orders/:id/cancel
```
**Auth Required:** Yes

### Disease Detection

#### Scan Disease
```http
POST /disease/scan
```
**Auth Required:** Yes

**Request:** Multipart form data with image file

**Response:**
```json
{
  "status": "success",
  "data": {
    "disease": "string",
    "confidence": "number",
    "severity": "low|medium|high",
    "symptoms": [],
    "recommendedActions": [],
    "treatmentPlan": {}
  }
}
```

#### Get Scan History
```http
GET /disease/history
```
**Auth Required:** Yes

#### Get Scan Details
```http
GET /disease/scan/:id
```
**Auth Required:** Yes

#### Expert Review
```http
PUT /disease/scan/:id/review
```
**Auth Required:** Yes (Expert only)

### Soil Analysis

#### Submit Soil Report
```http
POST /soil/report
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "fieldLocation": {},
  "soilParameters": {
    "pH": "number",
    "nitrogen": "number",
    "phosphorus": "number",
    "potassium": "number",
    "organicMatter": "number"
  }
}
```

#### Get Soil Reports
```http
GET /soil/reports
```
**Auth Required:** Yes

#### Get Soil Health Score
```http
POST /soil/health-score
```
**Auth Required:** Yes

### Crop Recommendations

#### Get Recommendations
```http
GET /crops/recommendations
```

**Query Parameters:**
- `region`
- `state`
- `district`
- `season`
- `soilType`
- `waterAvailability`

#### Get Crop Details
```http
GET /crops/:cropName
```

### Weather Services

#### Get Current Weather
```http
GET /weather/current
```

**Query Parameters:**
- `location` or
- `lat` & `lng`

#### Get Forecast
```http
GET /weather/forecast
```

**Query Parameters:**
- `location`
- `days` (1-7)

#### Get Agricultural Weather
```http
GET /weather/agricultural
```

### Pest & Disease Alerts

#### Get Active Alerts
```http
GET /alerts
```

**Query Parameters:**
- `state`
- `district`
- `crop`
- `type` (pest|disease)

#### Create Alert (Admin)
```http
POST /alerts
```
**Auth Required:** Yes (Admin/Expert)

#### Subscribe to Alerts
```http
POST /alerts/subscribe
```
**Auth Required:** Yes

### Irrigation Management

#### Get Irrigation Schedule
```http
GET /irrigation/schedule
```
**Auth Required:** Yes

#### Create Schedule
```http
POST /irrigation/schedule
```
**Auth Required:** Yes

#### Update Schedule
```http
PUT /irrigation/schedule/:id
```
**Auth Required:** Yes

#### Get Water Usage Analytics
```http
GET /irrigation/analytics
```
**Auth Required:** Yes

### Government Schemes

#### List Schemes
```http
GET /schemes
```

**Query Parameters:**
- `state`
- `category`
- `eligibleFor` (farmer type)

#### Get Scheme Details
```http
GET /schemes/:id
```

#### Check Eligibility
```http
POST /schemes/:id/check-eligibility
```
**Auth Required:** Yes

### Market Price Trends

#### Get Price Trends
```http
GET /prices/trends
```

**Query Parameters:**
- `crop`
- `state`
- `market`
- `from` (date)
- `to` (date)

#### Get Price Forecast
```http
GET /prices/forecast/:crop
```

#### Compare Prices
```http
GET /prices/compare
```

**Query Parameters:**
- `crops` (comma-separated)
- `markets` (comma-separated)

### Notifications

#### Get Notifications
```http
GET /notifications
```
**Auth Required:** Yes

#### Mark as Read
```http
PUT /notifications/:id/read
```
**Auth Required:** Yes

#### Update Preferences
```http
PUT /notifications/preferences
```
**Auth Required:** Yes

### Analytics (Admin)

#### Dashboard Stats
```http
GET /analytics/dashboard
```
**Auth Required:** Yes (Admin)

#### User Analytics
```http
GET /analytics/users
```
**Auth Required:** Yes (Admin)

#### Transaction Analytics
```http
GET /analytics/transactions
```
**Auth Required:** Yes (Admin)

#### Product Analytics
```http
GET /analytics/products
```
**Auth Required:** Yes (Admin)

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limiting

- General endpoints: 100 requests per minute
- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute

## Webhooks

### Order Status Update
```http
POST /webhooks/order-status
```

### Payment Confirmation
```http
POST /webhooks/payment
```

### Disease Detection Complete
```http
POST /webhooks/disease-scan
```

## WebSocket Events

### Connection
```javascript
socket.connect('wss://api.agrismart.com')
```

### Events

#### Price Updates
```javascript
socket.on('price:update', (data) => {})
```

#### Order Updates
```javascript
socket.on('order:update', (data) => {})
```

#### Alert Broadcasts
```javascript
socket.on('alert:new', (data) => {})
```

#### Chat Messages
```javascript
socket.on('message:new', (data) => {})
```
