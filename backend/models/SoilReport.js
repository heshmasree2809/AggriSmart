const mongoose = require('mongoose');

const SoilReportSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  fieldLocation: {
    name: String,
    area: { type: Number, min: 0 },
    areaUnit: { type: String, enum: ['acre', 'hectare', 'bigha'], default: 'acre' },
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: {
      village: String,
      district: String,
      state: String
    }
  },
  soilParameters: {
    pH: { type: Number, min: 0, max: 14 },
    nitrogen: { type: Number, min: 0 },
    phosphorus: { type: Number, min: 0 },
    potassium: { type: Number, min: 0 },
    organicMatter: { type: Number, min: 0, max: 100 },
    ec: { type: Number, min: 0 }, // Electrical Conductivity
    cec: { type: Number, min: 0 }, // Cation Exchange Capacity
    moisture: { type: Number, min: 0, max: 100 },
    temperature: Number,
    micronutrients: {
      zinc: Number,
      iron: Number,
      manganese: Number,
      copper: Number,
      boron: Number,
      molybdenum: Number,
      chlorine: Number,
      nickel: Number
    }
  },
  soilType: {
    type: String,
    enum: ['alluvial', 'black', 'red', 'laterite', 'desert', 'mountain', 'clay', 'sandy', 'loamy', 'peaty', 'saline'],
    required: true
  },
  texture: {
    sand: { type: Number, min: 0, max: 100 },
    silt: { type: Number, min: 0, max: 100 },
    clay: { type: Number, min: 0, max: 100 },
    classification: String // e.g., "Sandy Loam"
  },
  healthScore: { type: Number, min: 0, max: 100 },
  fertility: {
    rating: { type: String, enum: ['very_low', 'low', 'medium', 'high', 'very_high'] },
    limitingFactors: [String],
    improvements: [String]
  },
  recommendations: {
    fertilizers: [{
      name: String,
      type: String, // Organic, Inorganic
      quantity: Number,
      unit: String,
      timing: String,
      method: String,
      cost: Number
    }],
    amendments: [{
      name: String,
      purpose: String,
      quantity: Number,
      unit: String
    }],
    crops: [{
      name: String,
      suitability: { type: String, enum: ['excellent', 'good', 'moderate', 'poor'] },
      expectedYield: Number,
      season: String
    }],
    practices: [String],
    irrigation: {
      method: String,
      frequency: String,
      amount: Number
    }
  },
  testDetails: {
    testDate: { type: Date, default: Date.now },
    sampleDate: Date,
    sampleDepth: Number,
    testMethod: String,
    labName: String,
    labRegistration: String,
    reportNumber: String,
    reportUrl: String,
    certificateUrl: String
  },
  expertValidation: {
    validatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    validationDate: Date,
    notes: String,
    additionalTests: [String],
    verified: { type: Boolean, default: false }
  },
  comparisonData: {
    previousReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SoilReport'
    },
    trend: { type: String, enum: ['improving', 'stable', 'declining'] },
    changes: [{
      parameter: String,
      previousValue: Number,
      currentValue: Number,
      changePercent: Number
    }]
  },
  followUp: {
    required: { type: Boolean, default: false },
    nextTestDate: Date,
    parameters: [String],
    notes: String
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'analyzing', 'completed', 'validated'],
    default: 'submitted'
  }
}, { timestamps: true });

// Calculate health score
SoilReportSchema.methods.calculateHealthScore = function() {
  const params = this.soilParameters;
  let score = 0;
  
  // pH score (optimal 6.0-7.0)
  if (params.pH >= 6.0 && params.pH <= 7.0) score += 20;
  else if (params.pH >= 5.5 && params.pH <= 7.5) score += 10;
  
  // NPK score
  if (params.nitrogen > 250) score += 15;
  else if (params.nitrogen > 150) score += 8;
  
  if (params.phosphorus > 25) score += 15;
  else if (params.phosphorus > 15) score += 8;
  
  if (params.potassium > 250) score += 15;
  else if (params.potassium > 150) score += 8;
  
  // Organic matter score
  if (params.organicMatter > 2) score += 20;
  else if (params.organicMatter > 1) score += 10;
  
  // Micronutrients score
  const microScore = Object.values(params.micronutrients || {})
    .filter(val => val && val > 0).length * 2;
  score += Math.min(microScore, 15);
  
  return Math.min(score, 100);
};

// Indexes
SoilReportSchema.index({ user: 1, createdAt: -1 });
SoilReportSchema.index({ 'fieldLocation.address.state': 1, 'fieldLocation.address.district': 1 });
SoilReportSchema.index({ soilType: 1 });
SoilReportSchema.index({ healthScore: 1 });

module.exports = mongoose.model('SoilReport', SoilReportSchema);
