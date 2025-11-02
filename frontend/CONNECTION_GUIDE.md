# Connection Guide - Frontend to Backend

## ✅ What Has Been Fixed

1. **API Service** (`frontend/src/services/api.service.js`)
   - Simplified error handling
   - Proper response extraction
   - Clear error messages

2. **AuthContext** (`frontend/src/context/AuthContext.jsx`)
   - Fixed signup/login response handling
   - Proper token and user extraction

3. **All Pages Updated** to use API:
   - FertilizerInfo.jsx → `/api/info/fertilizers`
   - PestAlerts.jsx → `/api/info/pests`
   - GovernmentSchemes.jsx → `/api/info/schemes`
   - BuyVegetables.jsx → `/api/products`
   - SoilHealth.jsx → `/api/soil` (protected)
   - WeatherForecast.jsx → `/api/weather/forecast` (protected)

4. **Backend CORS** - Now allows all origins in development

## 🚀 Setup Instructions

### 1. Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Server started on port 9653
🌐 API available at http://localhost:9653
```

### 2. Test Backend Connection
Open in browser: `http://localhost:9653/api/test`

Should return:
```json
{
  "success": true,
  "message": "API test successful - backend is reachable",
  "timestamp": "...",
  "mongooseStatus": "connected" or "disconnected"
}
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar)

### 4. Test Signup/Login

1. Go to Signup page
2. Fill in the form
3. Check browser console (F12) for any errors
4. If connection error appears, check:
   - Backend is running on port 9653
   - No firewall blocking
   - Browser console for detailed error

## 🔍 Troubleshooting

### "Cannot connect to server" Error

1. **Verify Backend is Running:**
   - Check terminal: Should show "Server started on port 9653"
   - Visit `http://localhost:9653` in browser
   - Should see API info

2. **Check Port Conflicts:**
   ```bash
   # Windows
   netstat -ano | findstr :9653
   
   # Mac/Linux
   lsof -i :9653
   ```

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for detailed error messages
   - Check Network tab for failed requests

4. **Test API Directly:**
   ```bash
   # Using curl or Postman
   curl http://localhost:9653/api/test
   ```

### CORS Errors

If you see CORS errors in console:
- Backend CORS is set to allow all origins (`origin: true`)
- If still seeing errors, check backend logs
- Try restarting backend server

### MongoDB Connection

Backend will run even if MongoDB is disconnected (in dev mode).
- Signup/Login will work
- Data fetching may return empty arrays until DB is connected
- Run `npm run seed` after MongoDB is connected to populate data

## 📋 API Endpoints Reference

### Public (No Auth Required):
- `POST /api/signup` - Register user
- `POST /api/login` - Login user  
- `GET /api/products` - Get all products
- `GET /api/info/fertilizers` - Get fertilizers
- `GET /api/info/pests` - Get pests
- `GET /api/info/schemes` - Get schemes

### Protected (Requires JWT Token):
- `GET /api/soil` - Get soil data
- `POST /api/soil` - Save soil data
- `GET /api/weather/forecast` - Get weather
- `POST /api/orders/checkout` - Create order
- `GET /api/orders/my-orders` - Get user orders

## 🧪 Quick Test

1. Open browser console (F12)
2. Try to signup
3. Watch console for:
   - Request being made
   - Response received
   - Any errors

If you see the request in Network tab but get error, check the response details.

