const mongoose = require('mongoose');

const WeatherForecastSchema = new mongoose.Schema({
  location: { 
    type: String, 
    required: true, 
    index: true 
  },
  coordinates: {
    lat: Number,
    lon: Number
  },
  date: { 
    type: Date, 
    required: true, 
    index: true 
  },
  current: {
    temperature: Number,
    feelsLike: Number,
    humidity: Number,
    pressure: Number,
    windSpeed: Number,
    windDirection: Number,
    cloudiness: Number,
    visibility: Number,
    uvIndex: Number,
    description: String,
    icon: String
  },
  forecast: [{
    date: Date,
    tempMin: Number,
    tempMax: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    description: String,
    icon: String,
    precipitationProbability: Number
  }],
  alerts: [{
    type: String,
    severity: String,
    description: String,
    startTime: Date,
    endTime: Date
  }],
  agricultural: {
    soilMoisture: Number,
    soilTemperature: Number,
    evapotranspiration: Number,
    leafWetness: Number
  },
  recommendations: {
    irrigation: String,
    pestControl: String,
    harvesting: String,
    planting: String
  },
  source: { type: String, default: 'OpenWeatherMap' }
}, { timestamps: true });

WeatherForecastSchema.index({ location: 1, date: -1 });
WeatherForecastSchema.index({ 'coordinates.lat': 1, 'coordinates.lon': 1 });

module.exports = mongoose.model('WeatherForecast', WeatherForecastSchema);
