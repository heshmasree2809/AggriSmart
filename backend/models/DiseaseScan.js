const mongoose = require('mongoose');

const DiseaseScanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  crop: { 
    type: String, 
    required: true,
    index: true 
  },
  imageUrl: { type: String, required: true },
  thumbnailUrl: String,
  imageAnalysis: {
    disease: String,
    confidence: { type: Number, min: 0, max: 100 },
    severity: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'], 
      default: 'medium' 
    },
    affectedArea: Number, // Percentage of affected area
    stage: String // Early, Mid, Advanced
  },
  symptoms: [String],
  recommendedActions: [{
    type: { 
      type: String,
      enum: ['immediate', 'preventive', 'curative', 'monitoring']
    },
    description: String,
    priority: { type: Number, min: 1, max: 5 },
    timeline: String
  }],
  treatmentPlan: {
    immediate: [String],
    preventive: [String],
    organic: [{
      name: String,
      description: String,
      dosage: String,
      frequency: String,
      cost: Number
    }],
    chemical: [{
      name: String,
      activeIngredient: String,
      dosage: String,
      frequency: String,
      safetyPeriod: String,
      cost: Number
    }]
  },
  expertReview: {
    reviewedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    reviewDate: Date,
    diagnosis: String,
    notes: String,
    additionalRecommendations: [String],
    verificationStatus: { type: Boolean, default: false }
  },
  weatherAtScan: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    conditions: String
  },
  location: {
    state: String,
    district: String,
    village: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  followUpRequired: { type: Boolean, default: false },
  followUpDate: Date,
  resolutionDate: Date,
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'analyzed', 'expert_review', 'resolved', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

// Indexes
DiseaseScanSchema.index({ user: 1, createdAt: -1 });
DiseaseScanSchema.index({ crop: 1, 'imageAnalysis.disease': 1 });
DiseaseScanSchema.index({ status: 1 });
DiseaseScanSchema.index({ 'location.state': 1, 'location.district': 1 });

module.exports = mongoose.model('DiseaseScan', DiseaseScanSchema);
