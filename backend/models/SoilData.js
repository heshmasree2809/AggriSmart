const mongoose = require('mongoose');

const SoilDataSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  fieldName: String,
  fieldArea: Number,
  fieldLocation: {
    lat: Number,
    lon: Number
  },
  ph: { type: Number, min: 0, max: 14 },
  nitrogen: { type: Number, min: 0 },
  phosphorus: { type: Number, min: 0 },
  potassium: { type: Number, min: 0 },
  organicMatter: { type: Number, min: 0, max: 100 },
  micronutrients: {
    iron: Number,
    manganese: Number,
    zinc: Number,
    copper: Number,
    boron: Number,
    molybdenum: Number
  },
  soilType: {
    type: String,
    enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain', 'Clay', 'Sandy', 'Loamy']
  },
  texture: {
    sand: Number,
    silt: Number,
    clay: Number
  },
  moisture: Number,
  temperature: Number,
  electricalConductivity: Number,
  cationExchangeCapacity: Number,
  healthScore: { type: Number, min: 0, max: 100 },
  recommendations: {
    fertilizers: [String],
    amendments: [String],
    crops: [String],
    practices: [String]
  },
  testDate: { type: Date, default: Date.now },
  testMethod: String,
  labName: String,
  reportUrl: String,
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  history: [{
    date: Date,
    ph: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    healthScore: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('SoilData', SoilDataSchema);

