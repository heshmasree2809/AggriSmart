const mongoose = require('mongoose');

const PriceTrendSchema = new mongoose.Schema({
  crop: { 
    type: String, 
    required: true, 
    index: true 
  },
  region: { 
    type: String, 
    required: true, 
    index: true 
  },
  state: String,
  district: String,
  market: String,
  date: { 
    type: Date, 
    required: true, 
    index: true 
  },
  price: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    modal: { type: Number, required: true }
  },
  unit: { type: String, default: 'quintal' },
  arrivals: Number,
  tradingVolume: Number,
  grade: String,
  variety: String,
  trend: {
    type: String,
    enum: ['Rising', 'Falling', 'Stable'],
    default: 'Stable'
  },
  percentageChange: Number,
  forecast: {
    nextDay: Number,
    nextWeek: Number,
    nextMonth: Number,
    confidence: Number
  },
  factors: [String],
  source: String
}, { timestamps: true });

PriceTrendSchema.index({ crop: 1, region: 1, date: -1 });
PriceTrendSchema.index({ date: -1 });

module.exports = mongoose.model('PriceTrend', PriceTrendSchema);
