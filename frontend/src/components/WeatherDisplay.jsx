import React from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, Wind, Droplets, Eye } from 'lucide-react';

const WeatherDisplay = ({ data }) => {
  // Safety checks
  if (!data || !data.list || data.list.length === 0 || !data.city) {
    return (
      <div className="text-white text-center py-8">
        <p>Invalid weather data received.</p>
      </div>
    );
  }

  // Get current weather from first item in list
  const current = data.list[0];
  const cityName = data.city.name || 'Unknown City';
  const country = data.city.country || '';

  // Filter to get one forecast per day (12:00 PM each day)
  const getDailyForecasts = () => {
    const dailyMap = new Map();
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      // Prefer noon forecasts (12:00 PM), but take any if not available
      const hour = date.getHours();
      if (!dailyMap.has(dateKey) || (hour >= 11 && hour <= 13)) {
        dailyMap.set(dateKey, item);
      }
    });

    // Convert to array and take next 5 days (excluding today)
    const forecasts = Array.from(dailyMap.values()).slice(1, 6);
    return forecasts;
  };

  const dailyForecasts = getDailyForecasts();

  // Get weather icon based on condition
  const getWeatherIcon = (weatherMain, weatherId) => {
    const size = 48;
    const className = "w-12 h-12 text-yellow-400";
    
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun size={size} className={className} />;
      case 'clouds':
        return <Cloud size={size} className={className} />;
      case 'rain':
        return <CloudRain size={size} className={className} />;
      case 'drizzle':
        return <CloudDrizzle size={size} className={className} />;
      case 'snow':
        return <CloudSnow size={size} className={className} />;
      default:
        return <Cloud size={size} className={className} />;
    }
  };

  // Get day name
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  // Get weather description
  const getWeatherDescription = (weather) => {
    if (!weather || !Array.isArray(weather) || weather.length === 0) {
      return 'Clear';
    }
    return weather[0]?.description || 'Clear';
  };

  // Get weather main condition
  const getWeatherMain = (weather) => {
    if (!weather || !Array.isArray(weather) || weather.length === 0) {
      return 'clear';
    }
    return weather[0]?.main?.toLowerCase() || 'clear';
  };

  return (
    <div className="space-y-6">
      {/* Main Card - Today's Weather */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {cityName}, {country}
          </h2>
          <p className="text-white/80 text-lg capitalize">
            {getWeatherDescription(current.weather)}
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center justify-center">
            {getWeatherIcon(getWeatherMain(current.weather), current.weather[0]?.id)}
          </div>
          <div className="text-center">
            <div className="text-7xl font-bold text-white mb-2">
              {Math.round(current.main.temp)}°
            </div>
            <div className="text-white/80 text-lg">
              Feels like {Math.round(current.main.feels_like)}°
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <Droplets className="w-6 h-6 text-blue-300 mx-auto mb-2" />
            <div className="text-white/80 text-sm mb-1">Humidity</div>
            <div className="text-white text-xl font-semibold">{current.main.humidity}%</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <Wind className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <div className="text-white/80 text-sm mb-1">Wind Speed</div>
            <div className="text-white text-xl font-semibold">{Math.round(current.wind.speed)} m/s</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <Eye className="w-6 h-6 text-purple-300 mx-auto mb-2" />
            <div className="text-white/80 text-sm mb-1">Visibility</div>
            <div className="text-white text-xl font-semibold">{(current.visibility / 1000).toFixed(1)} km</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <Cloud className="w-6 h-6 text-white/70 mx-auto mb-2" />
            <div className="text-white/80 text-sm mb-1">Pressure</div>
            <div className="text-white text-xl font-semibold">{current.main.pressure} hPa</div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">5-Day Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {dailyForecasts.map((forecast, index) => (
            <div
              key={index}
              className="bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="text-white/90 font-semibold mb-2 text-sm">
                {getDayName(forecast.dt)}
              </div>
              <div className="flex justify-center mb-3">
                {getWeatherIcon(getWeatherMain(forecast.weather), forecast.weather[0]?.id)}
              </div>
              <div className="text-white text-xl font-bold mb-1">
                {Math.round(forecast.main.temp)}°
              </div>
              <div className="text-white/70 text-xs capitalize">
                {getWeatherDescription(forecast.weather)}
              </div>
              <div className="flex justify-center gap-2 mt-2 text-white/60 text-xs">
                <span>↑ {Math.round(forecast.main.temp_max)}°</span>
                <span>↓ {Math.round(forecast.main.temp_min)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
