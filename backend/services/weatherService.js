const axios = require('axios');
const { cache } = require('../config/redis');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.geoUrl = 'https://api.openweathermap.org/geo/1.0';
  }

  async getCoordinates(location) {
    try {
      // Check cache first
      const cacheKey = `coordinates:${location}`;
      const cached = await cache.get(cacheKey);
      if (cached) return cached;

      // Geocoding API to get coordinates
      const response = await axios.get(`${this.geoUrl}/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: this.apiKey
        }
      });

      if (response.data.length === 0) {
        throw new Error('Location not found');
      }

      const coordinates = {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        name: response.data[0].name,
        state: response.data[0].state,
        country: response.data[0].country
      };

      // Cache for 1 day
      await cache.set(cacheKey, coordinates, 86400);
      return coordinates;
    } catch (error) {
      console.error('Geocoding error:', error);
      // Return default coordinates for demo
      return {
        lat: 19.0760,
        lon: 72.8777,
        name: 'Mumbai',
        state: 'Maharashtra',
        country: 'IN'
      };
    }
  }

  async getCurrentWeather(location) {
    try {
      const coords = await this.getCoordinates(location);
      
      // Check cache
      const cacheKey = `weather:current:${coords.lat}:${coords.lon}`;
      const cached = await cache.get(cacheKey);
      if (cached) return cached;

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const weatherData = {
        location: coords.name,
        coordinates: { lat: coords.lat, lon: coords.lon },
        current: {
          temperature: response.data.main.temp,
          feelsLike: response.data.main.feels_like,
          humidity: response.data.main.humidity,
          pressure: response.data.main.pressure,
          windSpeed: response.data.wind.speed,
          windDirection: response.data.wind.deg,
          cloudiness: response.data.clouds.all,
          visibility: response.data.visibility,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon
        },
        agricultural: this.generateAgriculturalData(response.data)
      };

      // Cache for 30 minutes
      await cache.set(cacheKey, weatherData, 1800);
      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeatherData(location);
    }
  }

  async getForecast(location, days = 5) {
    try {
      const coords = await this.getCoordinates(location);
      
      // Check cache
      const cacheKey = `weather:forecast:${coords.lat}:${coords.lon}`;
      const cached = await cache.get(cacheKey);
      if (cached) return cached;

      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 data points per day (3-hour intervals)
        }
      });

      const forecastData = this.processForecastData(response.data, coords);
      
      // Cache for 1 hour
      await cache.set(cacheKey, forecastData, 3600);
      return forecastData;
    } catch (error) {
      console.error('Forecast API error:', error);
      return this.getMockForecast(location);
    }
  }

  processForecastData(data, coords) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          humidity: item.main.humidity,
          rainfall: item.rain ? item.rain['3h'] || 0 : 0,
          windSpeed: item.wind.speed,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          precipitationProbability: item.pop * 100
        };
      } else {
        // Update min/max temps
        dailyForecasts[date].tempMin = Math.min(dailyForecasts[date].tempMin, item.main.temp_min);
        dailyForecasts[date].tempMax = Math.max(dailyForecasts[date].tempMax, item.main.temp_max);
        dailyForecasts[date].rainfall += item.rain ? item.rain['3h'] || 0 : 0;
      }
    });

    const forecast = Object.values(dailyForecasts);
    const alerts = this.generateWeatherAlerts(forecast);
    const recommendations = this.generateRecommendations(forecast);

    return {
      location: coords.name,
      coordinates: { lat: coords.lat, lon: coords.lon },
      forecast: forecast.slice(0, 5), // 5-day forecast
      alerts,
      recommendations,
      agricultural: {
        soilMoisture: this.estimateSoilMoisture(forecast),
        evapotranspiration: this.estimateEvapotranspiration(forecast),
        pestRisk: this.assessPestRisk(forecast),
        diseaseRisk: this.assessDiseaseRisk(forecast)
      }
    };
  }

  generateAgriculturalData(weatherData) {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const rainfall = weatherData.rain ? weatherData.rain['1h'] || 0 : 0;

    return {
      soilMoisture: this.calculateSoilMoisture(rainfall, temp, humidity),
      soilTemperature: temp - 2, // Simplified estimation
      evapotranspiration: this.calculateET(temp, humidity, weatherData.wind.speed),
      leafWetness: humidity > 85 ? 'High' : humidity > 60 ? 'Medium' : 'Low',
      growingDegreeDays: Math.max(0, temp - 10), // Base temperature 10°C
      chillHours: temp < 7 ? 1 : 0
    };
  }

  calculateSoilMoisture(rainfall, temp, humidity) {
    // Simplified soil moisture calculation
    let moisture = 30; // Base moisture
    moisture += rainfall * 5; // Add rainfall effect
    moisture += humidity * 0.3; // Add humidity effect
    moisture -= temp * 0.5; // Subtract evaporation
    return Math.max(0, Math.min(100, moisture));
  }

  calculateET(temp, humidity, windSpeed) {
    // Simplified Evapotranspiration calculation (Hargreaves method)
    const tempRange = 5; // Assumed daily temperature range
    const extraterrestrialRadiation = 15; // MJ/m²/day (simplified)
    const et = 0.0023 * extraterrestrialRadiation * Math.sqrt(tempRange) * (temp + 17.8);
    return Math.round(et * 10) / 10;
  }

  estimateSoilMoisture(forecast) {
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    const avgTemp = forecast.reduce((sum, day) => sum + (day.tempMax + day.tempMin) / 2, 0) / forecast.length;
    return this.calculateSoilMoisture(totalRainfall / forecast.length, avgTemp, 70);
  }

  estimateEvapotranspiration(forecast) {
    const avgTemp = forecast.reduce((sum, day) => sum + (day.tempMax + day.tempMin) / 2, 0) / forecast.length;
    return this.calculateET(avgTemp, 70, 10);
  }

  assessPestRisk(forecast) {
    const avgTemp = forecast.reduce((sum, day) => sum + (day.tempMax + day.tempMin) / 2, 0) / forecast.length;
    const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length;
    
    if (avgTemp > 25 && avgTemp < 35 && avgHumidity > 60) return 'High';
    if (avgTemp > 20 && avgTemp < 30 && avgHumidity > 50) return 'Medium';
    return 'Low';
  }

  assessDiseaseRisk(forecast) {
    const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length;
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    
    if (avgHumidity > 80 && totalRainfall > 50) return 'High';
    if (avgHumidity > 60 && totalRainfall > 20) return 'Medium';
    return 'Low';
  }

  generateWeatherAlerts(forecast) {
    const alerts = [];
    
    forecast.forEach(day => {
      if (day.rainfall > 50) {
        alerts.push({
          type: 'Heavy Rainfall',
          severity: 'High',
          description: `Heavy rainfall expected on ${day.date}`,
          startTime: new Date(day.date),
          recommendations: ['Ensure proper drainage', 'Postpone pesticide application', 'Protect young seedlings']
        });
      }
      
      if (day.tempMax > 40) {
        alerts.push({
          type: 'Heat Wave',
          severity: 'High',
          description: `High temperature (${day.tempMax}°C) expected on ${day.date}`,
          startTime: new Date(day.date),
          recommendations: ['Increase irrigation', 'Provide shade to sensitive crops', 'Avoid field work during peak hours']
        });
      }
      
      if (day.tempMin < 5) {
        alerts.push({
          type: 'Cold Wave',
          severity: 'Medium',
          description: `Low temperature (${day.tempMin}°C) expected on ${day.date}`,
          startTime: new Date(day.date),
          recommendations: ['Protect sensitive crops', 'Use mulching', 'Consider frost protection measures']
        });
      }
      
      if (day.windSpeed > 20) {
        alerts.push({
          type: 'Strong Winds',
          severity: 'Medium',
          description: `Strong winds expected on ${day.date}`,
          startTime: new Date(day.date),
          recommendations: ['Support tall crops', 'Secure greenhouse covers', 'Avoid pesticide spraying']
        });
      }
    });
    
    return alerts;
  }

  generateRecommendations(forecast) {
    const recommendations = {
      irrigation: '',
      pestControl: '',
      harvesting: '',
      planting: '',
      fieldPreparation: ''
    };
    
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    const avgTemp = forecast.reduce((sum, day) => sum + (day.tempMax + day.tempMin) / 2, 0) / forecast.length;
    const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length;
    
    // Irrigation recommendations
    if (totalRainfall < 10) {
      recommendations.irrigation = 'Increase irrigation frequency due to low expected rainfall';
    } else if (totalRainfall > 50) {
      recommendations.irrigation = 'Reduce or skip irrigation due to expected rainfall';
    } else {
      recommendations.irrigation = 'Maintain normal irrigation schedule';
    }
    
    // Pest control
    if (avgTemp > 25 && avgHumidity > 60) {
      recommendations.pestControl = 'High pest risk - Schedule preventive pesticide application';
    } else if (totalRainfall > 30) {
      recommendations.pestControl = 'Postpone pesticide application until after rainfall';
    } else {
      recommendations.pestControl = 'Monitor crops for pest activity';
    }
    
    // Harvesting
    if (totalRainfall < 5 && avgHumidity < 60) {
      recommendations.harvesting = 'Ideal conditions for harvesting';
    } else if (totalRainfall > 20) {
      recommendations.harvesting = 'Postpone harvesting to avoid moisture damage';
    } else {
      recommendations.harvesting = 'Check crop maturity before harvesting';
    }
    
    // Planting
    if (avgTemp > 20 && avgTemp < 30 && totalRainfall > 10) {
      recommendations.planting = 'Good conditions for planting';
    } else if (avgTemp > 35) {
      recommendations.planting = 'Delay planting due to high temperatures';
    } else {
      recommendations.planting = 'Prepare seedlings for transplanting';
    }
    
    // Field preparation
    if (totalRainfall < 10 && avgTemp < 35) {
      recommendations.fieldPreparation = 'Good time for land preparation and plowing';
    } else {
      recommendations.fieldPreparation = 'Focus on weed control and mulching';
    }
    
    return recommendations;
  }

  getMockWeatherData(location) {
    // Fallback mock data for development/demo
    return {
      location,
      coordinates: { lat: 19.0760, lon: 72.8777 },
      current: {
        temperature: 25 + Math.random() * 10,
        feelsLike: 26 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        pressure: 1010 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 10,
        windDirection: Math.random() * 360,
        cloudiness: Math.random() * 100,
        visibility: 8000 + Math.random() * 2000,
        description: 'Partly cloudy',
        icon: '02d'
      },
      agricultural: {
        soilMoisture: 40 + Math.random() * 30,
        soilTemperature: 23 + Math.random() * 5,
        evapotranspiration: 3 + Math.random() * 2,
        leafWetness: 'Medium',
        growingDegreeDays: 15 + Math.random() * 10,
        chillHours: 0
      }
    };
  }

  getMockForecast(location) {
    const forecast = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        tempMin: 20 + Math.random() * 5,
        tempMax: 30 + Math.random() * 8,
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() > 0.7 ? Math.random() * 50 : 0,
        windSpeed: 5 + Math.random() * 15,
        description: ['Clear', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
        icon: '02d',
        precipitationProbability: Math.random() * 100
      });
    }
    
    return {
      location,
      coordinates: { lat: 19.0760, lon: 72.8777 },
      forecast,
      alerts: this.generateWeatherAlerts(forecast),
      recommendations: this.generateRecommendations(forecast),
      agricultural: {
        soilMoisture: 50,
        evapotranspiration: 4,
        pestRisk: 'Medium',
        diseaseRisk: 'Low'
      }
    };
  }
}

// Create singleton instance
const weatherService = new WeatherService();

module.exports = weatherService;
