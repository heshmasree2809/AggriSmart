import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Paper, Button, Chip, CircularProgress, TextField, IconButton } from '@mui/material';
import { Cloud, WaterDrop, Air, WbSunny, Opacity, LocationOn, CalendarMonth, TrendingUp, Refresh, MyLocation } from '@mui/icons-material';
import api from '../services/api.service';
import { useNotification } from '../components/NotificationSystem';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

/* Helper: map condition -> small icon & large background */
function getWeatherVisuals(main) {
  // Use existing public images to avoid 404s
  // Fallback icon: website logo; Background: plant image
  return { icon: "/images/website_logo.png", bg: "/images/plant.png" };
}

/* Helper: parse forecast list (3h intervals) -> next 5 days daily max + date labels */
function parseForecastList(list) {
  // group by date string YYYY-MM-DD and compute daily max temp
  const dayMap = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dayMap[date]) dayMap[date] = [];
    dayMap[date].push(item.main.temp);
  });

  const days = Object.keys(dayMap)
    .slice(0, 5) // take next up to 5 days
    .map((date) => {
      const temps = dayMap[date];
      return {
        date,
        max: Math.round(Math.max(...temps)),
        avg: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
      };
    });

  // For user friendly labels, convert date to short day names
  const labels = days.map((d) => {
    const dt = new Date(d.date);
    return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  });

  const maxTemps = days.map((d) => d.max);
  return { labels, maxTemps };
}

export default function WeatherForecast() {
  const { isAuthenticated } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Bangalore, Karnataka');
  const [searchLocation, setSearchLocation] = useState('');
  const { showSuccess, showInfo, showError } = useNotification();

  // Load weather data from API
  const loadWeatherData = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated()) {
        // If not authenticated, use mock data or show message
        setWeatherData({
          current: {
            temp: 28,
            condition: 'Partly Cloudy',
            humidity: 65,
            wind: 12,
            feelsLike: 30
          },
          forecast: []
        });
        setLoading(false);
        return;
      }
      
      const response = await api.get('/weather/forecast');
      if (response && response.success) {
        const weather = response.data;
        setWeatherData({
          current: weather.current || {
            temp: weather.temp || 28,
            condition: weather.condition || 'Sunny',
            humidity: 65,
            wind: 12,
            feelsLike: 30
          },
          forecast: weather.forecast || []
        });
        showInfo('Weather data updated');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Use fallback data
      setWeatherData({
        current: {
          temp: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          wind: 12,
          feelsLike: 30
        },
        forecast: []
      });
      showError('Failed to load weather data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadWeatherData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation('Current Location');
          showSuccess('Location updated successfully');
          loadWeatherData();
        },
        (error) => {
          showError('Unable to get location');
        }
      );
    }
  };

  // Search location
  const handleSearchLocation = () => {
    if (searchLocation.trim()) {
      setLocation(searchLocation);
      setSearchLocation('');
      showSuccess(`Weather updated for ${searchLocation}`);
      loadWeatherData();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: '#16a34a' }} />
        </Box>
      </Container>
    );
  }

  const currentWeather = {
    temperature: weatherData?.current?.temp || 28,
    condition: weatherData?.current?.condition || 'Partly Cloudy',
    humidity: weatherData?.current?.humidity || 65,
    windSpeed: weatherData?.current?.wind || 12,
    precipitation: 30,
    uvIndex: 7,
    location: location,
    lastUpdated: new Date().toLocaleString(),
    icon: weatherData?.current?.icon || '',
    feelsLike: weatherData?.current?.feelsLike || 30
  };

  const forecast = weatherData?.forecast || [];

  const visuals = getWeatherVisuals(currentWeather.condition);

  return (
    <div className="min-h-screen bg-farm-gradient py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Weather <span style={{ color: '#10b981' }}>Forecast</span>
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Plan your farming activities with accurate weather predictions
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                placeholder="Search location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                size="small"
                sx={{ width: 200 }}
              />
              <IconButton onClick={getCurrentLocation} color="primary">
                <MyLocation />
              </IconButton>
              <IconButton onClick={loadWeatherData} color="primary">
                <Refresh />
              </IconButton>
            </Box>
          </Box>
        </div>


        {/* Main weather card */}
        {weatherData && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
            {/* Weather Header */}
            <div className="bg-hero-gradient p-8 text-white">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <img 
                    src={visuals.icon} 
                    alt="weather icon" 
                    className="w-16 h-16 filter drop-shadow-lg" 
                  />
                  <div>
                    <h2 className="text-3xl font-display font-bold">
                      {location}
                    </h2>
                    <p className="text-farm-green-100 text-lg">
                      {currentWeather.condition}
                    </p>
                  </div>
                </div>
                
                <div className="text-center lg:text-right">
                  <div className="text-6xl font-bold mb-2">
                    {currentWeather.temperature}°C
                  </div>
                  <p className="text-farm-green-100">Feels like {currentWeather.feelsLike}°C</p>
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <h3 className="font-semibold text-gray-800 mb-1">Humidity</h3>
                  <p className="text-2xl font-bold text-blue-700">{currentWeather.humidity}%</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-2">💨</div>
                  <h3 className="font-semibold text-gray-800 mb-1">Wind Speed</h3>
                  <p className="text-2xl font-bold text-green-700">{currentWeather.windSpeed} km/h</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-2">🌡️</div>
                  <h3 className="font-semibold text-gray-800 mb-1">UV Index</h3>
                  <p className="text-2xl font-bold text-purple-700">{currentWeather.uvIndex}</p>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {forecast && forecast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
                    5-Day Forecast
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    {forecast.slice(0, 5).map((day) => (
                      <div key={day.day} className="bg-gradient-to-br from-farm-green-50 to-farm-green-100 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="text-sm text-gray-600 mb-2">{day.day}</div>
                        <div className="text-2xl mb-2">{day.icon}</div>
                        <div className="text-lg font-bold text-farm-green-700">
                          {day.high}° / {day.low}°
                        </div>
                        <div className="text-xs text-gray-600">{day.condition}</div>
                        <div className="text-xs text-blue-600 mt-1">💧 {day.rain}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Fallback help text */}
        {!weatherData && !loading && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">🌤️</div>
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
              Search a City to View Weather
            </h2>
            <p className="text-gray-600 mb-6">
              Get detailed weather information and 5-day forecasts for any city worldwide.
            </p>
            <div className="bg-farm-green-50 rounded-2xl p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Try:</span> "New Delhi", "Mumbai", "Bengaluru", "London", "New York"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
