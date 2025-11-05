const WeatherForecast = require('../models/WeatherForecast');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const weatherService = require('../services/weatherService');
const Notification = require('../models/Notification');

// Helper function to get weather data (can be replaced with actual API)
const fetchWeatherData = async (location, lat, lon) => {
  // This is a mock function - replace with actual API call
  // For production, use OpenWeatherMap, WeatherAPI, or similar service
  
  const mockWeatherData = {
    current: {
      temperature: 28 + Math.random() * 10,
      feelsLike: 30 + Math.random() * 8,
      humidity: 60 + Math.random() * 30,
      pressure: 1010 + Math.random() * 20,
      windSpeed: 5 + Math.random() * 15,
      windDirection: Math.random() * 360,
      cloudiness: Math.random() * 100,
      visibility: 8000 + Math.random() * 2000,
      uvIndex: Math.random() * 11,
      description: ['Clear sky', 'Few clouds', 'Scattered clouds', 'Light rain', 'Partly cloudy'][Math.floor(Math.random() * 5)],
      icon: '01d'
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
      tempMin: 20 + Math.random() * 5,
      tempMax: 30 + Math.random() * 8,
      humidity: 60 + Math.random() * 30,
      rainfall: Math.random() > 0.7 ? Math.random() * 50 : 0,
      windSpeed: 5 + Math.random() * 15,
      description: ['Clear', 'Cloudy', 'Light rain', 'Sunny', 'Partly cloudy'][Math.floor(Math.random() * 5)],
      icon: '01d',
      precipitationProbability: Math.random() * 100
    })),
    agricultural: {
      soilMoisture: 40 + Math.random() * 40,
      soilTemperature: 25 + Math.random() * 10,
      evapotranspiration: 3 + Math.random() * 4,
      leafWetness: Math.random() * 100
    }
  };
  
  // If using OpenWeatherMap API (requires API key in .env):
  /*
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (API_KEY) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Weather API error:', error);
    }
  }
  */
  
  return mockWeatherData;
};

// Get weather forecast
exports.getWeatherForecast = asyncHandler(async (req, res) => {
  const { location, lat, lon, days = 7 } = req.query;
  
  let locationName = location || req.user.location || 'Default Location';
  let latitude = lat || 28.6139;  // Default to Delhi coordinates
  let longitude = lon || 77.2090;
  
  // Check if we have recent weather data cached
  const existingForecast = await WeatherForecast.findOne({
    location: locationName,
    date: { $gte: new Date(Date.now() - 3600000) } // Within last hour
  }).sort({ date: -1 });
  
  if (existingForecast) {
    return res.json({
      success: true,
      cached: true,
      weather: existingForecast
    });
  }
  
  // Fetch new weather data
  const weatherData = await fetchWeatherData(locationName, latitude, longitude);
  
  // Generate agricultural recommendations based on weather
  const recommendations = {
    irrigation: weatherData.forecast[0].rainfall > 10 
      ? 'Skip irrigation today due to expected rainfall'
      : weatherData.current.temperature > 35 
        ? 'Increase irrigation frequency due to high temperature'
        : 'Normal irrigation schedule recommended',
    
    pestControl: weatherData.current.humidity > 80
      ? 'High humidity - Monitor for fungal diseases'
      : 'Normal pest monitoring',
    
    harvesting: weatherData.forecast.slice(0, 3).some(d => d.rainfall > 20)
      ? 'Consider early harvesting if crops are ready'
      : 'Good conditions for harvesting',
    
    planting: weatherData.current.temperature >= 20 && weatherData.current.temperature <= 30
      ? 'Optimal conditions for planting'
      : 'Wait for better temperature conditions'
  };
  
  // Save to database
  const forecast = new WeatherForecast({
    location: locationName,
    coordinates: { lat: latitude, lon: longitude },
    date: new Date(),
    current: weatherData.current,
    forecast: weatherData.forecast.slice(0, days),
    agricultural: weatherData.agricultural,
    recommendations,
    alerts: []
  });
  
  await forecast.save();
  
  res.json({
    success: true,
    cached: false,
    weather: forecast
  });
});

// Get historical weather data
exports.getHistoricalWeather = asyncHandler(async (req, res) => {
  const { location, startDate, endDate } = req.query;
  
  const query = {};
  if (location) query.location = location;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  
  const historicalData = await WeatherForecast.find(query)
    .select('-forecast')
    .sort({ date: -1 })
    .limit(30);
  
  res.json({
    success: true,
    historicalWeather: historicalData
  });
});

// Get weather alerts for a region
exports.getWeatherAlerts = asyncHandler(async (req, res) => {
  const { location } = req.query;
  const userLocation = location || req.user.location;
  
  // Mock weather alerts - replace with actual weather alert API
  const alerts = [
    {
      type: 'Heavy Rainfall',
      severity: 'Warning',
      description: 'Heavy rainfall expected in next 24 hours',
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 3600000),
      affectedAreas: [userLocation],
      precautions: [
        'Ensure proper drainage in fields',
        'Protect harvested crops from rain',
        'Postpone fertilizer application'
      ]
    }
  ];
  
  res.json({
    success: true,
    location: userLocation,
    alerts: Math.random() > 0.7 ? alerts : []
  });
});

// Get agricultural weather insights
exports.getAgriculturalInsights = asyncHandler(async (req, res) => {
  const { crop, location } = req.query;
  
  const locationName = location || req.user.location || 'Default Location';
  
  // Get recent weather data
  const recentWeather = await WeatherForecast.findOne({
    location: locationName
  }).sort({ date: -1 });
  
  if (!recentWeather) {
    return res.status(404).json({
      success: false,
      message: 'No weather data available for this location'
    });
  }
  
  // Generate crop-specific insights
  const insights = {
    crop: crop || 'General',
    location: locationName,
    currentConditions: {
      suitable: recentWeather.current.temperature >= 15 && recentWeather.current.temperature <= 35,
      temperature: recentWeather.current.temperature,
      humidity: recentWeather.current.humidity,
      soilMoisture: recentWeather.agricultural?.soilMoisture || 50
    },
    recommendations: {
      watering: recentWeather.agricultural?.soilMoisture < 40 
        ? 'Immediate irrigation needed'
        : 'Adequate soil moisture',
      
      disease_risk: recentWeather.current.humidity > 75
        ? 'High - Monitor for fungal diseases'
        : 'Low to moderate',
      
      optimal_activities: {
        morning: 'Spraying, harvesting',
        afternoon: 'Avoid field work during peak heat',
        evening: 'Irrigation, planting'
      }
    },
    weekForecast: recentWeather.forecast?.slice(0, 7).map(day => ({
      date: day.date,
      condition: day.description,
      rainfall: day.rainfall,
      suitable_for_fieldwork: day.rainfall < 5
    }))
  };
  
  res.json({
    success: true,
    insights
  });
});

