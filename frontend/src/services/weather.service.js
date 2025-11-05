import apiService from './api.service';
import { API_ENDPOINTS } from './api.config';

class WeatherService {
  // Get weather forecast
  async getForecast(location, lat, lon, days = 7) {
    const params = {};
    if (location) params.location = location;
    if (lat) params.lat = lat;
    if (lon) params.lon = lon;
    if (days) params.days = days;
    
    return await apiService.get(API_ENDPOINTS.WEATHER.FORECAST, params);
  }

  // Get historical weather data
  async getHistoricalWeather(location, startDate, endDate) {
    const params = {};
    if (location) params.location = location;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    return await apiService.get(API_ENDPOINTS.WEATHER.HISTORICAL, params);
  }

  // Get weather alerts
  async getWeatherAlerts(location) {
    const params = location ? { location } : {};
    return await apiService.get(API_ENDPOINTS.WEATHER.ALERTS, params);
  }

  // Get agricultural insights
  async getAgriculturalInsights(crop, location) {
    const params = {};
    if (crop) params.crop = crop;
    if (location) params.location = location;
    
    return await apiService.get(API_ENDPOINTS.WEATHER.INSIGHTS, params);
  }
}

export default new WeatherService();
