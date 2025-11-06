import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Opacity,
  Air,
  Visibility,
  Thermostat,
  LocationOn,
  Search
} from '@mui/icons-material';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get API key from environment
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Get user's current location weather on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a city if geolocation fails
          fetchWeatherByCity('Delhi');
        }
      );
    } else {
      fetchWeatherByCity('Delhi');
    }
  }, []);

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherJson = await weatherResponse.json();
      setWeatherData(weatherJson);
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (forecastResponse.ok) {
        const forecastJson = await forecastResponse.json();
        setForecast(forecastJson);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }
      
      const weatherJson = await weatherResponse.json();
      setWeatherData(weatherJson);
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (forecastResponse.ok) {
        const forecastJson = await forecastResponse.json();
        setForecast(forecastJson);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherByCity(city);
  };

  // Get weather icon
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get daily forecasts (one per day)
  const getDailyForecasts = () => {
    if (!forecast) return [];
    
    const dailyData = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });
    
    return Object.values(dailyData).slice(0, 5);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          🌤️ Weather Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get real-time weather information and forecasts
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Search City"
                placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                startIcon={<Search />}
                disabled={loading}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Current Weather */}
      {!loading && weatherData && (
        <>
          <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOn sx={{ fontSize: 32, color: 'white', mr: 1 }} />
                    <Typography variant="h4" color="white" fontWeight="bold">
                      {weatherData.name}, {weatherData.sys.country}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                    {formatDate(weatherData.dt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                    <img 
                      src={getWeatherIcon(weatherData.weather[0].icon)} 
                      alt={weatherData.weather[0].description}
                      style={{ width: 100, height: 100 }}
                    />
                    <Box>
                      <Typography variant="h2" color="white" fontWeight="bold">
                        {Math.round(weatherData.main.temp)}°C
                      </Typography>
                      <Typography variant="h6" color="white" sx={{ textTransform: 'capitalize' }}>
                        {weatherData.weather[0].description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

              {/* Weather Details */}
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <Thermostat sx={{ fontSize: 32, color: 'white', mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Feels Like
                      </Typography>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        {Math.round(weatherData.main.feels_like)}°C
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <Opacity sx={{ fontSize: 32, color: 'white', mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Humidity
                      </Typography>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        {weatherData.main.humidity}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <Air sx={{ fontSize: 32, color: 'white', mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Wind Speed
                      </Typography>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        {weatherData.wind.speed} m/s
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <Visibility sx={{ fontSize: 32, color: 'white', mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Visibility
                      </Typography>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        {(weatherData.visibility / 1000).toFixed(1)} km
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Additional Info */}
              <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                <Chip 
                  label={`Pressure: ${weatherData.main.pressure} hPa`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  label={`Min: ${Math.round(weatherData.main.temp_min)}°C`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  label={`Max: ${Math.round(weatherData.main.temp_max)}°C`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                {weatherData.clouds && (
                  <Chip 
                    label={`Cloudiness: ${weatherData.clouds.all}%`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          {forecast && (
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                📅 5-Day Forecast
              </Typography>
              <Grid container spacing={2}>
                {getDailyForecasts().map((day, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {formatDate(day.dt)}
                        </Typography>
                        <img 
                          src={getWeatherIcon(day.weather[0].icon)} 
                          alt={day.weather[0].description}
                          style={{ width: 60, height: 60 }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                          {Math.round(day.main.temp)}°C
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ textTransform: 'capitalize', display: 'block' }}
                        >
                          {day.weather[0].description}
                        </Typography>
                        <Box mt={1} display="flex" justifyContent="space-around" fontSize="0.75rem">
                          <span>💧 {day.main.humidity}%</span>
                          <span>💨 {day.wind.speed}m/s</span>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Agricultural Insights */}
          <Card sx={{ mt: 4, bgcolor: '#f0f9ff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                🌾 Agricultural Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" paragraph>
                    <strong>Temperature:</strong> {
                      weatherData.main.temp > 35 
                        ? '⚠️ Very hot - Ensure adequate irrigation'
                        : weatherData.main.temp > 25
                        ? '✅ Good for most crops'
                        : '❄️ Cool - Monitor cold-sensitive crops'
                    }
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Humidity:</strong> {
                      weatherData.main.humidity > 80
                        ? '⚠️ High - Watch for fungal diseases'
                        : weatherData.main.humidity > 50
                        ? '✅ Optimal for most crops'
                        : '⚠️ Low - Increase irrigation'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" paragraph>
                    <strong>Wind:</strong> {
                      weatherData.wind.speed > 10
                        ? '⚠️ Strong winds - Protect young plants'
                        : '✅ Favorable conditions'
                    }
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Conditions:</strong> {
                      weatherData.weather[0].main === 'Rain'
                        ? '🌧️ Rainy - Delay spraying activities'
                        : weatherData.weather[0].main === 'Clear'
                        ? '☀️ Clear - Good for field operations'
                        : '☁️ Cloudy - Moderate conditions'
                    }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Data Message */}
      {!loading && !weatherData && !error && (
        <Box textAlign="center" py={8}>
          <Cloud sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Search for a city to view weather information
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default WeatherDashboard;
