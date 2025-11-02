// Utility Helper Functions

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Calculate discount price
export const calculateDiscountPrice = (price, discount) => {
  return price - (price * discount / 100);
};

// Get season based on month
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 10 || month <= 3) return 'Rabi';
  return 'Zaid';
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone
export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

// Validate Aadhaar
export const validateAadhaar = (aadhaar) => {
  const re = /^\d{12}$/;
  return re.test(aadhaar);
};

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Sort array by property
export const sortByProperty = (array, property, order = 'asc') => {
  return array.sort((a, b) => {
    if (order === 'asc') {
      return a[property] > b[property] ? 1 : -1;
    }
    return a[property] < b[property] ? 1 : -1;
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, properties) => {
  if (!searchTerm) return array;
  
  return array.filter(item => {
    return properties.some(prop => {
      const value = item[prop];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });
};

// Get weather icon based on condition
export const getWeatherIcon = (condition) => {
  const icons = {
    'Clear': '☀️',
    'Sunny': '☀️',
    'Partly Cloudy': '⛅',
    'Cloudy': '☁️',
    'Overcast': '☁️',
    'Light Rain': '🌦️',
    'Rain': '🌧️',
    'Heavy Rain': '⛈️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return icons[condition] || '☁️';
};

// Calculate days between dates
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Get crop stage based on days after sowing
export const getCropStage = (sowingDate, cropDuration) => {
  const daysElapsed = daysBetween(sowingDate, new Date());
  const percentage = (daysElapsed / cropDuration) * 100;
  
  if (percentage < 25) return 'Seedling';
  if (percentage < 50) return 'Vegetative';
  if (percentage < 75) return 'Reproductive';
  if (percentage < 90) return 'Maturity';
  return 'Harvest Ready';
};

// Calculate fertilizer requirement
export const calculateFertilizer = (area, recommendedRate) => {
  return Math.round(area * recommendedRate);
};

// Get pest severity color
export const getSeverityColor = (severity) => {
  const colors = {
    'Low': 'green',
    'Medium': 'yellow',
    'High': 'orange',
    'Very High': 'red'
  };
  return colors[severity] || 'gray';
};

// Format area
export const formatArea = (area, unit = 'hectare') => {
  if (unit === 'hectare') {
    return `${area} ha`;
  } else if (unit === 'acre') {
    return `${(area * 2.47105).toFixed(2)} acres`;
  }
  return `${area} ${unit}`;
};

// Get recommendation based on soil test
export const getSoilRecommendation = (parameter, value, optimal) => {
  if (value < optimal.min) {
    return `Low - Increase ${parameter}`;
  } else if (value > optimal.max) {
    return `High - Reduce ${parameter}`;
  }
  return 'Optimal';
};

// Calculate irrigation water requirement
export const calculateWaterRequirement = (area, cropWaterNeed, efficiency) => {
  const grossRequirement = (area * cropWaterNeed * 10000) / efficiency;
  return Math.round(grossRequirement);
};

// Get crop suitability score
export const getCropSuitability = (crop, conditions) => {
  let score = 100;
  
  // Check temperature
  if (conditions.temperature < crop.tempMin || conditions.temperature > crop.tempMax) {
    score -= 20;
  }
  
  // Check rainfall
  if (conditions.rainfall < crop.rainfallMin || conditions.rainfall > crop.rainfallMax) {
    score -= 20;
  }
  
  // Check soil type
  if (crop.soilTypes && !crop.soilTypes.includes(conditions.soilType)) {
    score -= 30;
  }
  
  return Math.max(0, score);
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};
