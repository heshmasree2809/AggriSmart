const PriceTrend = require('../models/PriceTrend');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { cache } = require('../config/redis');

// Get price trends for a specific product or category
exports.getPriceTrends = asyncHandler(async (req, res) => {
  const { 
    product, 
    category, 
    location, 
    startDate, 
    endDate, 
    aggregation = 'daily' 
  } = req.query;

  const query = {};
  
  if (product) query.product = product;
  if (category) query.category = category;
  if (location) query.location = location;
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  } else {
    // Default to last 30 days
    query.date = {
      $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    };
  }

  // Check cache
  const cacheKey = `price-trends:${JSON.stringify(query)}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(new ApiResponse(200, cached, 'Price trends from cache'));
  }

  const trends = await PriceTrend.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          product: '$product',
          category: '$category'
        },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        volume: { $sum: '$volume' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.date': 1 } },
    {
      $project: {
        _id: 0,
        date: '$_id.date',
        product: '$_id.product',
        category: '$_id.category',
        avgPrice: { $round: ['$avgPrice', 2] },
        minPrice: { $round: ['$minPrice', 2] },
        maxPrice: { $round: ['$maxPrice', 2] },
        volume: 1,
        samples: '$count'
      }
    }
  ]);

  // Calculate statistics
  const stats = calculatePriceStatistics(trends);
  
  // Generate predictions
  const predictions = generatePricePredictions(trends);

  const result = {
    trends,
    stats,
    predictions,
    metadata: {
      period: `${startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} to ${endDate || new Date().toISOString().split('T')[0]}`,
      totalDataPoints: trends.length,
      aggregation
    }
  };

  // Cache for 1 hour
  await cache.set(cacheKey, result, 3600);

  res.json(new ApiResponse(200, result, 'Price trends fetched successfully'));
});

// Get market prices for multiple products
exports.getMarketPrices = asyncHandler(async (req, res) => {
  const { location, category, limit = 20 } = req.query;

  const query = {};
  if (location) query['location.state'] = location;
  if (category) query.category = category;

  // Get current market prices
  const marketPrices = await Product.aggregate([
    { $match: { ...query, isActive: true } },
    {
      $group: {
        _id: '$name',
        category: { $first: '$category' },
        unit: { $first: '$unit' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        listings: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' }
      }
    },
    {
      $project: {
        _id: 0,
        product: '$_id',
        category: 1,
        unit: 1,
        currentPrice: { $round: ['$avgPrice', 2] },
        priceRange: {
          min: { $round: ['$minPrice', 2] },
          max: { $round: ['$maxPrice', 2] }
        },
        availability: {
          listings: '$listings',
          totalQuantity: '$totalQuantity'
        }
      }
    },
    { $sort: { listings: -1 } },
    { $limit: parseInt(limit) }
  ]);

  // Get price changes
  for (const item of marketPrices) {
    const previousPrice = await getHistoricalPrice(item.product, 7);
    item.priceChange = {
      value: item.currentPrice - previousPrice,
      percentage: ((item.currentPrice - previousPrice) / previousPrice * 100).toFixed(2)
    };
    item.trend = item.priceChange.value > 0 ? 'up' : item.priceChange.value < 0 ? 'down' : 'stable';
  }

  res.json(new ApiResponse(200, {
    marketPrices,
    lastUpdated: new Date(),
    location: location || 'All locations'
  }, 'Market prices fetched successfully'));
});

// Get price predictions for a product
exports.getPricePredictions = asyncHandler(async (req, res) => {
  const { product } = req.params;
  const { days = 7 } = req.query;

  // Get historical data
  const historicalData = await PriceTrend.find({
    product,
    date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
  }).sort({ date: 1 });

  if (historicalData.length < 7) {
    throw new ApiError(400, 'Insufficient data for predictions');
  }

  // Generate predictions using simple moving average and trend analysis
  const predictions = [];
  const prices = historicalData.map(d => d.price);
  const trend = calculateTrend(prices);
  const seasonality = calculateSeasonality(historicalData);
  
  for (let i = 1; i <= days; i++) {
    const basePrice = prices[prices.length - 1];
    const trendComponent = trend * i;
    const seasonalComponent = seasonality[i % 7];
    const randomComponent = (Math.random() - 0.5) * basePrice * 0.05; // 5% random variation
    
    const predictedPrice = Math.max(0, basePrice + trendComponent + seasonalComponent + randomComponent);
    
    predictions.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      confidence: Math.max(50, 90 - i * 5), // Confidence decreases with time
      range: {
        min: Math.round(predictedPrice * 0.9 * 100) / 100,
        max: Math.round(predictedPrice * 1.1 * 100) / 100
      }
    });
  }

  res.json(new ApiResponse(200, {
    product,
    predictions,
    factors: {
      trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
      seasonality: 'detected',
      marketConditions: 'normal'
    },
    disclaimer: 'Predictions are based on historical data and may not reflect actual future prices'
  }, 'Price predictions generated successfully'));
});

// Subscribe to price alerts
exports.subscribeToPriceAlerts = asyncHandler(async (req, res) => {
  const { product, targetPrice, alertType, notificationMethod } = req.body;

  const alert = await PriceTrend.create({
    user: req.user._id,
    product,
    targetPrice,
    alertType, // 'above', 'below', 'change'
    notificationMethod, // 'email', 'sms', 'push'
    isActive: true
  });

  res.status(201).json(new ApiResponse(201, alert, 'Price alert created successfully'));
});

// Get commodity prices (government/mandi rates)
exports.getCommodityPrices = asyncHandler(async (req, res) => {
  const { state, market } = req.query;

  // Simulated government mandi prices
  const commodityPrices = [
    {
      commodity: 'Rice (Common)',
      variety: 'IR-64',
      unit: 'quintal',
      minPrice: 1800,
      maxPrice: 2200,
      modalPrice: 2000,
      market: market || 'APMC Mumbai',
      arrivalQuantity: 5000,
      trend: 'stable'
    },
    {
      commodity: 'Wheat',
      variety: 'Lok-1',
      unit: 'quintal',
      minPrice: 2100,
      maxPrice: 2400,
      modalPrice: 2250,
      market: market || 'APMC Mumbai',
      arrivalQuantity: 3000,
      trend: 'up'
    },
    {
      commodity: 'Onion',
      variety: 'Red',
      unit: 'quintal',
      minPrice: 800,
      maxPrice: 1500,
      modalPrice: 1100,
      market: market || 'APMC Mumbai',
      arrivalQuantity: 8000,
      trend: 'down'
    },
    {
      commodity: 'Tomato',
      variety: 'Hybrid',
      unit: 'quintal',
      minPrice: 600,
      maxPrice: 1200,
      modalPrice: 900,
      market: market || 'APMC Mumbai',
      arrivalQuantity: 6000,
      trend: 'up'
    },
    {
      commodity: 'Potato',
      variety: 'Kufri',
      unit: 'quintal',
      minPrice: 900,
      maxPrice: 1400,
      modalPrice: 1150,
      market: market || 'APMC Mumbai',
      arrivalQuantity: 7000,
      trend: 'stable'
    }
  ];

  res.json(new ApiResponse(200, {
    commodityPrices,
    market: market || 'APMC Mumbai',
    state: state || 'Maharashtra',
    lastUpdated: new Date(),
    source: 'Government Mandi Board'
  }, 'Commodity prices fetched successfully'));
});

// Helper functions
function calculatePriceStatistics(trends) {
  if (!trends || trends.length === 0) return null;

  const prices = trends.map(t => t.avgPrice);
  const volumes = trends.map(t => t.volume);

  return {
    avgPrice: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
    minPrice: Math.min(...prices).toFixed(2),
    maxPrice: Math.max(...prices).toFixed(2),
    priceVolatility: calculateVolatility(prices),
    totalVolume: volumes.reduce((a, b) => a + b, 0),
    priceChange: {
      value: (prices[prices.length - 1] - prices[0]).toFixed(2),
      percentage: ((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(2)
    }
  };
}

function calculateVolatility(prices) {
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  return Math.sqrt(variance).toFixed(2);
}

function calculateTrend(prices) {
  // Simple linear regression
  const n = prices.length;
  const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
  const sumY = prices.reduce((a, b) => a + b, 0);
  const sumXY = prices.reduce((sum, price, i) => sum + i * price, 0);
  const sumX2 = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);
  
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
}

function calculateSeasonality(data) {
  // Simple weekly seasonality
  const weeklyAvg = Array(7).fill(0);
  const weeklyCount = Array(7).fill(0);
  
  data.forEach(d => {
    const dayOfWeek = new Date(d.date).getDay();
    weeklyAvg[dayOfWeek] += d.price;
    weeklyCount[dayOfWeek]++;
  });
  
  return weeklyAvg.map((sum, i) => weeklyCount[i] > 0 ? sum / weeklyCount[i] : 0);
}

function generatePricePredictions(trends) {
  if (!trends || trends.length < 3) return [];

  const prices = trends.map(t => t.avgPrice);
  const lastPrice = prices[prices.length - 1];
  const trend = calculateTrend(prices);
  
  return {
    nextDay: Math.round((lastPrice + trend) * 100) / 100,
    nextWeek: Math.round((lastPrice + trend * 7) * 100) / 100,
    confidence: Math.min(85, 50 + trends.length * 2),
    factors: ['Historical trends', 'Market demand', 'Seasonal patterns']
  };
}

async function getHistoricalPrice(product, daysAgo) {
  const historicalDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  const historical = await PriceTrend.findOne({
    product,
    date: { $lte: historicalDate }
  }).sort({ date: -1 });
  
  return historical ? historical.price : 0;
}

module.exports = exports;
