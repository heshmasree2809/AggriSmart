const mongoose = require('mongoose');

const CropRecommendationSchema = new mongoose.Schema({
  region: { type: String, required: true, index: true },
  state: { type: String, required: true, index: true },
  district: String,
  season: { 
    type: String, 
    enum: ['kharif', 'rabi', 'zaid', 'summer', 'winter', 'monsoon', 'year-round'],
    required: true,
    index: true
  },
  soilType: { 
    type: String, 
    enum: ['alluvial', 'black', 'red', 'laterite', 'desert', 'mountain', 'clay', 'sandy', 'loamy'],
    required: true 
  },
  waterAvailability: {
    type: String,
    enum: ['abundant', 'adequate', 'limited', 'scarce'],
    default: 'adequate'
  },
  irrigationType: [String], // drip, sprinkler, canal, well, rainfed
  recommendations: [{
    crop: { type: String, required: true },
    variety: String,
    scientificName: String,
    category: { type: String, enum: ['cereal', 'pulse', 'oilseed', 'vegetable', 'fruit', 'spice', 'cash_crop'] },
    suitabilityScore: { type: Number, min: 0, max: 100 },
    expectedYield: {
      value: Number,
      unit: String, // kg/acre, quintal/hectare
      range: {
        min: Number,
        max: Number
      }
    },
    marketDemand: { 
      level: { type: String, enum: ['very_high', 'high', 'medium', 'low', 'very_low'] },
      trend: { type: String, enum: ['increasing', 'stable', 'declining'] }
    },
    profitability: {
      rating: { type: Number, min: 1, max: 5 },
      estimatedIncome: Number,
      investmentRequired: Number,
      roi: Number // Return on Investment percentage
    },
    cultivation: {
      sowingTime: String,
      harvestTime: String,
      duration: Number, // in days
      spacing: {
        row: Number,
        plant: Number,
        unit: String
      }
    },
    requirements: {
      water: {
        total: Number, // in mm
        critical_stages: [String],
        frequency: String
      },
      fertilizer: {
        nitrogen: Number,
        phosphorus: Number,
        potassium: Number,
        organic: String
      },
      temperature: {
        min: Number,
        max: Number,
        optimal: Number
      },
      pH: {
        min: Number,
        max: Number,
        optimal: Number
      }
    },
    practices: {
      landPreparation: [String],
      seedTreatment: String,
      pestManagement: [String],
      diseaseControl: [String],
      harvesting: String,
      postHarvest: [String]
    },
    risks: [{
      type: String,
      severity: { type: String, enum: ['high', 'medium', 'low'] },
      mitigation: String
    }],
    companionCrops: [String],
    rotationCrops: [String],
    reasons: [String], // Why this crop is recommended
    constraints: [String] // Potential limitations
  }],
  climateData: {
    temperature: {
      annual_min: Number,
      annual_max: Number,
      annual_avg: Number,
      monsoon_avg: Number,
      winter_avg: Number,
      summer_avg: Number
    },
    rainfall: {
      annual: Number,
      monsoon: Number,
      winter: Number,
      distribution: String
    },
    humidity: {
      min: Number,
      max: Number,
      avg: Number
    },
    frost: {
      occurs: Boolean,
      months: [String]
    }
  },
  historicalSuccess: {
    rate: Number, // Success rate percentage
    commonCrops: [String],
    failureReasons: [String],
    bestPerformers: [{
      crop: String,
      yield: Number,
      year: Number
    }]
  },
  expertNotes: String,
  dataSource: String,
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for performance
CropRecommendationSchema.index({ region: 1, soilType: 1, season: 1 });
CropRecommendationSchema.index({ state: 1, district: 1 });
CropRecommendationSchema.index({ waterAvailability: 1 });
CropRecommendationSchema.index({ 'recommendations.crop': 1 });

module.exports = mongoose.model('CropRecommendation', CropRecommendationSchema);
