# AgriSmart Backend API

A complete REST API backend for the AgriSmart project built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file is already configured with your MongoDB connection string.

### 3. Start Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:9653`

## 📋 Environment Variables

The `.env` file contains:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 9653)

## 🔧 Fixed Issues

✅ **Nodemon crashes fixed** - Server now runs even if MongoDB connection fails (in dev mode)  
✅ **.env file configured** - MongoDB connection string properly set  
✅ **Full CRUD operations** - GET, POST, PUT, DELETE routes added  
✅ **Postman-friendly** - All endpoints documented and tested  

## 📚 API Endpoints

### Public Routes (No Auth Required)
- `GET /` - Health check and API info
- `GET /api/docs` - API documentation
- `POST /api/signup` - Register new user
- `POST /api/login` - Login and get token
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/info/fertilizers` - Get fertilizers
- `GET /api/info/pests` - Get pests
- `GET /api/info/schemes` - Get schemes

### Protected Routes (Requires JWT Token)
Add header: `Authorization: Bearer <your_token>`

- `POST /api/verifyToken` - Verify token validity
- `POST /api/orders/checkout` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status
- `GET /api/soil` - Get soil data
- `POST /api/soil` - Update soil data
- `GET /api/weather/forecast` - Get weather forecast

## 🧪 Testing with Postman

See `POSTMAN_API_DOCS.md` for complete Postman testing guide with:
- All endpoints documented
- Request/response examples
- Authentication setup
- Quick start flow

## 📁 Project Structure

```
backend/
├── controllers/     # Business logic
├── models/          # MongoDB schemas
├── routes/          # API routes
├── authMiddleware.js # JWT authentication
├── server.js        # Main server file
├── .env            # Environment variables
├── package.json    # Dependencies
└── POSTMAN_API_DOCS.md # Postman documentation
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check `.env` file has correct `MONGODB_URI`
- Verify IP is whitelisted in MongoDB Atlas
- Ensure cluster is running
- In dev mode, server will start anyway (check logs)

### Nodemon Crashes
- ✅ Fixed! Nodemon now handles MongoDB connection failures gracefully
- Server runs in dev mode even if DB is disconnected
- Check `nodemon.json` for configuration

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill process using port 9653

## 📝 Notes

- JWT tokens expire in 7 days
- All timestamps in ISO format
- CORS enabled for all origins (development)
- Server auto-reconnects to MongoDB on restart

---

**Happy Coding! 🎉**

