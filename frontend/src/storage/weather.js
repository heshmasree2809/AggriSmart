// Weather Data and Configuration
export const weatherAlerts = [
  {
    id: 1,
    type: 'Heavy Rainfall',
    severity: 'Warning',
    message: 'Heavy rainfall expected in next 48 hours',
    recommendations: [
      'Postpone harvesting',
      'Ensure proper drainage',
      'Protect harvested produce',
      'Avoid fertilizer application'
    ],
    affectedCrops: ['All crops'],
    icon: '🌧️'
  },
  {
    id: 2,
    type: 'Drought',
    severity: 'Alert',
    message: 'Low rainfall predicted for next 2 weeks',
    recommendations: [
      'Implement water conservation',
      'Use drip irrigation if available',
      'Apply mulching',
      'Prioritize critical growth stages'
    ],
    affectedCrops: ['All crops'],
    icon: '☀️'
  },
  {
    id: 3,
    type: 'Hailstorm',
    severity: 'Danger',
    message: 'Hailstorm likely in next 24 hours',
    recommendations: [
      'Harvest mature crops immediately',
      'Use anti-hail nets if available',
      'Insure crops under PMFBY',
      'Document damage for claims'
    ],
    affectedCrops: ['Fruits', 'Vegetables'],
    icon: '🌨️'
  },
  {
    id: 4,
    type: 'High Temperature',
    severity: 'Caution',
    message: 'Temperature above 40°C expected',
    recommendations: [
      'Increase irrigation frequency',
      'Provide shade to sensitive crops',
      'Spray water during peak hours',
      'Harvest vegetables early morning'
    ],
    affectedCrops: ['Vegetables', 'Fruits'],
    icon: '🌡️'
  },
  {
    id: 5,
    type: 'Frost',
    severity: 'Warning',
    message: 'Frost conditions likely tonight',
    recommendations: [
      'Cover sensitive plants',
      'Light irrigation before sunset',
      'Use smoke to raise temperature',
      'Harvest ripe produce'
    ],
    affectedCrops: ['Vegetables', 'Potato', 'Tomato'],
    icon: '❄️'
  }
];

export const defaultWeatherData = {
  current: {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
    condition: 'Partly Cloudy',
    uvIndex: 6,
    pressure: 1013,
    visibility: 10,
    feelsLike: 30,
    dewPoint: 20
  },
  forecast: [
    {
      day: 'Monday',
      date: '2024-01-15',
      high: 32,
      low: 22,
      condition: 'Sunny',
      rainChance: 10,
      humidity: 60,
      windSpeed: 10,
      icon: '☀️'
    },
    {
      day: 'Tuesday',
      date: '2024-01-16',
      high: 30,
      low: 21,
      condition: 'Partly Cloudy',
      rainChance: 20,
      humidity: 65,
      windSpeed: 12,
      icon: '⛅'
    },
    {
      day: 'Wednesday',
      date: '2024-01-17',
      high: 28,
      low: 20,
      condition: 'Cloudy',
      rainChance: 40,
      humidity: 70,
      windSpeed: 15,
      icon: '☁️'
    },
    {
      day: 'Thursday',
      date: '2024-01-18',
      high: 27,
      low: 19,
      condition: 'Light Rain',
      rainChance: 70,
      humidity: 75,
      windSpeed: 18,
      icon: '🌦️'
    },
    {
      day: 'Friday',
      date: '2024-01-19',
      high: 29,
      low: 20,
      condition: 'Partly Cloudy',
      rainChance: 30,
      humidity: 68,
      windSpeed: 14,
      icon: '⛅'
    },
    {
      day: 'Saturday',
      date: '2024-01-20',
      high: 31,
      low: 22,
      condition: 'Sunny',
      rainChance: 15,
      humidity: 62,
      windSpeed: 11,
      icon: '☀️'
    },
    {
      day: 'Sunday',
      date: '2024-01-21',
      high: 32,
      low: 23,
      condition: 'Clear',
      rainChance: 5,
      humidity: 58,
      windSpeed: 9,
      icon: '☀️'
    }
  ],
  agricultural: {
    soilMoisture: 45,
    soilTemperature: 24,
    leafWetness: 2,
    evapotranspiration: 4.5,
    growingDegreeDays: 350,
    chillHours: 120
  }
};

export const weatherParameters = [
  {
    name: 'Temperature',
    unit: '°C',
    optimal: { min: 20, max: 30 },
    icon: '🌡️'
  },
  {
    name: 'Humidity',
    unit: '%',
    optimal: { min: 50, max: 70 },
    icon: '💧'
  },
  {
    name: 'Rainfall',
    unit: 'mm',
    optimal: { min: 50, max: 100 },
    icon: '🌧️'
  },
  {
    name: 'Wind Speed',
    unit: 'km/h',
    optimal: { min: 5, max: 20 },
    icon: '💨'
  },
  {
    name: 'Soil Moisture',
    unit: '%',
    optimal: { min: 40, max: 60 },
    icon: '💦'
  }
];

export const farmingActivities = {
  sunny: [
    'Harvesting',
    'Drying produce',
    'Land preparation',
    'Pesticide application'
  ],
  rainy: [
    'Transplanting',
    'Avoid harvesting',
    'Check drainage',
    'Disease monitoring'
  ],
  cloudy: [
    'Fertilizer application',
    'Sowing seeds',
    'Weeding',
    'Pruning'
  ],
  windy: [
    'Avoid spraying',
    'Support tall plants',
    'Wind barriers check',
    'Postpone pollination activities'
  ]
};
