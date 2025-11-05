import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Grain,
  WaterDrop,
  Air,
  Thermostat,
  Visibility,
  Compress,
  LocationOn,
  Warning,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Agriculture,
  BubbleChart,
  Notifications,
  NotificationsActive,
  Search,
  Refresh,
  ArrowForward,
  ArrowBack,
  OpacityTwoTone,
  AcUnit,
  Thunderstorm,
  Timer
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { weatherAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';

const WeatherDashboard = () => {
  const user = useSelector(selectUser);
  const [location, setLocation] = useState(user?.address?.district || 'Mumbai');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Fetch current weather
      const weatherRes = await weatherAPI.getForecast(location);
      setCurrentWeather(weatherRes.data.data.current);
      setForecast(weatherRes.data.data.forecast);
      
      // Fetch alerts
      const alertsRes = await weatherAPI.getAlerts(location);
      setAlerts(alertsRes.data.data || []);
      
      // Fetch insights
      const insightsRes = await weatherAPI.getInsights(location);
      setInsights(insightsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Use mock data for demo
      setMockWeatherData();
    } finally {
      setLoading(false);
    }
  };

  const setMockWeatherData = () => {
    setCurrentWeather({
      temperature: 28,
      feelsLike: 30,
      humidity: 75,
      pressure: 1012,
      windSpeed: 12,
      windDirection: 180,
      cloudiness: 40,
      visibility: 10000,
      uvIndex: 6,
      description: 'Partly cloudy',
      icon: '02d'
    });
    
    setForecast([
      { date: '2024-01-15', tempMin: 22, tempMax: 32, humidity: 70, rainfall: 0, description: 'Sunny', precipitationProbability: 10 },
      { date: '2024-01-16', tempMin: 23, tempMax: 31, humidity: 75, rainfall: 5, description: 'Light rain', precipitationProbability: 60 },
      { date: '2024-01-17', tempMin: 21, tempMax: 29, humidity: 80, rainfall: 15, description: 'Moderate rain', precipitationProbability: 80 },
      { date: '2024-01-18', tempMin: 20, tempMax: 28, humidity: 85, rainfall: 25, description: 'Heavy rain', precipitationProbability: 90 },
      { date: '2024-01-19', tempMin: 22, tempMax: 30, humidity: 70, rainfall: 2, description: 'Cloudy', precipitationProbability: 30 },
    ]);
    
    setAlerts([
      {
        type: 'Heavy Rainfall',
        severity: 'High',
        description: 'Heavy rainfall expected in next 24-48 hours',
        recommendations: ['Ensure proper drainage', 'Protect harvested crops', 'Postpone fertilizer application']
      }
    ]);
    
    setInsights({
      agricultural: {
        soilMoisture: 65,
        evapotranspiration: 4.5,
        pestRisk: 'Medium',
        diseaseRisk: 'High',
        growingDegreeDays: 18
      },
      recommendations: {
        irrigation: 'Reduce irrigation due to expected rainfall',
        pestControl: 'Monitor for fungal diseases due to high humidity',
        harvesting: 'Complete harvesting before heavy rain',
        planting: 'Good conditions for transplanting',
        fieldPreparation: 'Avoid tillage operations'
      }
    });
  };

  const handleLocationSearch = () => {
    if (searchLocation) {
      setLocation(searchLocation);
      setSearchLocation('');
    }
  };

  const getWeatherIcon = (description) => {
    if (description?.includes('rain')) return <WaterDrop />;
    if (description?.includes('cloud')) return <Cloud />;
    if (description?.includes('storm')) return <Thunderstorm />;
    if (description?.includes('snow')) return <AcUnit />;
    return <WbSunny />;
  };

  const getUVIndexColor = (index) => {
    if (index <= 2) return 'success';
    if (index <= 5) return 'warning';
    if (index <= 7) return 'error';
    return 'error';
  };

  const getUVIndexLabel = (index) => {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    if (index <= 10) return 'Very High';
    return 'Extreme';
  };

  // Chart data for forecast
  const forecastChartData = {
    labels: forecast?.map(f => new Date(f.date).toLocaleDateString('en', { weekday: 'short' })) || [],
    datasets: [
      {
        label: 'Max Temp (°C)',
        data: forecast?.map(f => f.tempMax) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4
      },
      {
        label: 'Min Temp (°C)',
        data: forecast?.map(f => f.tempMin) || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4
      }
    ]
  };

  const rainfallChartData = {
    labels: forecast?.map(f => new Date(f.date).toLocaleDateString('en', { weekday: 'short' })) || [],
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: forecast?.map(f => f.rainfall) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const WeatherCard = ({ title, value, unit, icon: Icon, color = 'primary', trend }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-center justify-between mb-2">
          <Typography variant="body2" className="text-gray-600">
            {title}
          </Typography>
          <Avatar className={`bg-${color}-100 w-8 h-8`}>
            <Icon className={`text-${color}-600`} fontSize="small" />
          </Avatar>
        </Box>
        <Typography variant="h4" className="font-bold mb-1">
          {value}
          <Typography component="span" variant="body1" className="ml-1">
            {unit}
          </Typography>
        </Typography>
        {trend && (
          <Box className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp className="text-green-500" fontSize="small" />
            ) : (
              <TrendingDown className="text-red-500" fontSize="small" />
            )}
            <Typography variant="caption" className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(trend)}% from yesterday
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <LinearProgress />
        <Typography className="text-center mt-4">Loading weather data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex justify-between items-center mb-4">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Weather Dashboard ☁️
            </Typography>
            <Box className="flex items-center gap-2">
              <LocationOn className="text-gray-500" />
              <Typography variant="body1" className="text-gray-600">
                {location}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                • Last updated: {new Date().toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
          <Box className="flex gap-2 items-center">
            <TextField
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton onClick={fetchWeatherData}>
              <Refresh />
            </IconButton>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              }
              label={<NotificationsActive />}
            />
          </Box>
        </Box>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <Box className="mb-4">
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                severity={alert.severity === 'High' ? 'error' : 'warning'}
                className="mb-2"
              >
                <Box>
                  <Typography variant="subtitle2" className="font-semibold">
                    {alert.type}: {alert.description}
                  </Typography>
                  <Box className="mt-2 flex flex-wrap gap-2">
                    {alert.recommendations?.map((rec, idx) => (
                      <Chip key={idx} label={rec} size="small" />
                    ))}
                  </Box>
                </Box>
              </Alert>
            ))}
          </Box>
        )}
      </Box>

      {/* Current Weather */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={4}>
          <Paper className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Box className="flex items-center justify-between mb-4">
              <Box>
                <Typography variant="h2" className="font-bold">
                  {currentWeather?.temperature}°C
                </Typography>
                <Typography variant="body1">
                  Feels like {currentWeather?.feelsLike}°C
                </Typography>
                <Typography variant="h6" className="mt-2">
                  {currentWeather?.description}
                </Typography>
              </Box>
              <WbSunny className="text-6xl" />
            </Box>
            <Divider className="bg-white/20 my-4" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box className="flex items-center gap-2">
                  <WaterDrop />
                  <Box>
                    <Typography variant="caption">Humidity</Typography>
                    <Typography variant="body2">{currentWeather?.humidity}%</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="flex items-center gap-2">
                  <Air />
                  <Box>
                    <Typography variant="caption">Wind</Typography>
                    <Typography variant="body2">{currentWeather?.windSpeed} km/h</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="flex items-center gap-2">
                  <Compress />
                  <Box>
                    <Typography variant="caption">Pressure</Typography>
                    <Typography variant="body2">{currentWeather?.pressure} hPa</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="flex items-center gap-2">
                  <Visibility />
                  <Box>
                    <Typography variant="caption">Visibility</Typography>
                    <Typography variant="body2">{(currentWeather?.visibility / 1000).toFixed(1)} km</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Weather Metrics */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <WeatherCard
                title="UV Index"
                value={currentWeather?.uvIndex}
                unit=""
                icon={WbSunny}
                color={getUVIndexColor(currentWeather?.uvIndex)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <WeatherCard
                title="Cloudiness"
                value={currentWeather?.cloudiness}
                unit="%"
                icon={Cloud}
                color="info"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <WeatherCard
                title="Soil Moisture"
                value={insights?.agricultural?.soilMoisture || 0}
                unit="%"
                icon={OpacityTwoTone}
                color="success"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <WeatherCard
                title="Evapotranspiration"
                value={insights?.agricultural?.evapotranspiration || 0}
                unit="mm"
                icon={BubbleChart}
                color="warning"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs for Detailed Information */}
      <Paper className="mb-6">
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="5-Day Forecast" />
          <Tab label="Agricultural Insights" />
          <Tab label="Recommendations" />
        </Tabs>

        {/* 5-Day Forecast Tab */}
        {tabValue === 0 && (
          <Box className="p-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" className="mb-3">Temperature Trend</Typography>
                <Box className="h-64">
                  <Line
                    data={forecastChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" className="mb-3">Expected Rainfall</Typography>
                <Box className="h-64">
                  <Bar
                    data={rainfallChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} className="mt-4">
              {forecast?.map((day, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Card className="text-center">
                    <CardContent>
                      <Typography variant="subtitle2">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric' })}
                      </Typography>
                      <Box className="my-3">
                        {getWeatherIcon(day.description)}
                      </Box>
                      <Typography variant="h6">
                        {day.tempMax}° / {day.tempMin}°
                      </Typography>
                      <Typography variant="caption" className="block">
                        {day.description}
                      </Typography>
                      <Box className="flex items-center justify-center gap-1 mt-2">
                        <WaterDrop fontSize="small" className="text-blue-500" />
                        <Typography variant="caption">
                          {day.precipitationProbability}%
                        </Typography>
                      </Box>
                      {day.rainfall > 0 && (
                        <Typography variant="caption" className="text-blue-600">
                          {day.rainfall}mm
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Agricultural Insights Tab */}
        {tabValue === 1 && (
          <Box className="p-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="mb-3">
                      Risk Assessment
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Agriculture />
                        </ListItemIcon>
                        <ListItemText
                          primary="Pest Risk"
                          secondary={insights?.agricultural?.pestRisk || 'Medium'}
                        />
                        <Chip
                          label={insights?.agricultural?.pestRisk || 'Medium'}
                          color={insights?.agricultural?.pestRisk === 'High' ? 'error' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Warning />
                        </ListItemIcon>
                        <ListItemText
                          primary="Disease Risk"
                          secondary={`Due to ${currentWeather?.humidity}% humidity`}
                        />
                        <Chip
                          label={insights?.agricultural?.diseaseRisk || 'High'}
                          color={insights?.agricultural?.diseaseRisk === 'High' ? 'error' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Thermostat />
                        </ListItemIcon>
                        <ListItemText
                          primary="Growing Degree Days"
                          secondary="Accumulated heat units"
                        />
                        <Typography variant="body2">
                          {insights?.agricultural?.growingDegreeDays || 18} GDD
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="mb-3">
                      Field Conditions
                    </Typography>
                    <Box className="space-y-3">
                      <Box>
                        <Box className="flex justify-between mb-1">
                          <Typography variant="body2">Soil Moisture</Typography>
                          <Typography variant="body2">{insights?.agricultural?.soilMoisture}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={insights?.agricultural?.soilMoisture || 65}
                          className="h-2"
                        />
                      </Box>
                      <Box>
                        <Box className="flex justify-between mb-1">
                          <Typography variant="body2">Field Work Suitability</Typography>
                          <Typography variant="body2">
                            {currentWeather?.humidity < 70 ? 'Good' : 'Poor'}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={currentWeather?.humidity < 70 ? 80 : 30}
                          color={currentWeather?.humidity < 70 ? 'success' : 'error'}
                          className="h-2"
                        />
                      </Box>
                      <Alert severity="info" className="mt-3">
                        <Typography variant="caption">
                          Optimal spraying window: Early morning (6-9 AM) with wind speed below 15 km/h
                        </Typography>
                      </Alert>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Recommendations Tab */}
        {tabValue === 2 && (
          <Box className="p-4">
            <Grid container spacing={3}>
              {Object.entries(insights?.recommendations || {}).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card className="h-full">
                    <CardContent>
                      <Box className="flex items-center gap-2 mb-2">
                        <Avatar className="bg-green-100">
                          {key === 'irrigation' && <WaterDrop className="text-green-600" />}
                          {key === 'pestControl' && <Agriculture className="text-orange-600" />}
                          {key === 'harvesting' && <Grain className="text-yellow-600" />}
                          {key === 'planting' && <CheckCircle className="text-blue-600" />}
                          {key === 'fieldPreparation' && <Timer className="text-purple-600" />}
                        </Avatar>
                        <Typography variant="h6" className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" className="text-gray-600">
                        {value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Alert severity="success" className="mt-4">
              <Typography variant="subtitle2" className="font-semibold mb-1">
                Today's Action Items:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Monitor field moisture levels" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Check for pest activity during evening hours" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Prepare for upcoming rainfall - ensure drainage" />
                </ListItem>
              </List>
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">
                Subscribe to Alerts
              </Typography>
              <Box className="space-y-2">
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Heavy Rainfall"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Extreme Temperature"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Frost Warning"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="High Wind Speed"
                />
                <Button
                  fullWidth
                  variant="contained"
                  className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700"
                  startIcon={<NotificationsActive />}
                >
                  Update Preferences
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">
                Historical Comparison
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Temperature"
                    secondary={`${currentWeather?.temperature}°C (Avg: 26°C)`}
                  />
                  <Chip
                    label="+2°C"
                    size="small"
                    color="warning"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Rainfall (Monthly)"
                    secondary="125mm (Avg: 150mm)"
                  />
                  <Chip
                    label="-25mm"
                    size="small"
                    color="error"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Humidity"
                    secondary={`${currentWeather?.humidity}% (Avg: 70%)`}
                  />
                  <Chip
                    label="+5%"
                    size="small"
                    color="info"
                  />
                </ListItem>
              </List>
              <Button
                fullWidth
                variant="outlined"
                className="mt-3"
                onClick={() => {}}
              >
                View Full Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">
                Crop-Specific Advisory
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-3">
                Get customized weather insights for your specific crops
              </Typography>
              <Button
                fullWidth
                variant="contained"
                className="mb-2 bg-gradient-to-r from-green-600 to-green-700"
                onClick={() => {}}
              >
                Rice Advisory
              </Button>
              <Button
                fullWidth
                variant="outlined"
                className="mb-2"
                onClick={() => {}}
              >
                Wheat Advisory
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {}}
              >
                Vegetable Advisory
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WeatherDashboard;
