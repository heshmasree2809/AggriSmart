const mongoose = require('mongoose');

const PestDiseaseAlertSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  type: { 
    type: String, 
    enum: ['Pest', 'Disease', 'Both'], 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  description: { type: String, required: true },
  affectedCrops: [String],
  regions: [{ type: String, index: true }],
  states: [String],
  districts: [String],
  symptoms: [String],
  preventiveMeasures: [String],
  treatments: [{
    name: String,
    type: { type: String, enum: ['Chemical', 'Organic', 'Biological', 'Cultural'] },
    description: String,
    dosage: String,
    applicationMethod: String,
    precautions: [String]
  }],
  images: [String],
  expertAdvice: String,
  isActive: { type: Boolean, default: true },
  validFrom: { type: Date, default: Date.now },
  validUntil: Date,
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  source: String,
  references: [String]
}, { timestamps: true });

PestDiseaseAlertSchema.index({ regions: 1, severity: 1, isActive: 1 });
PestDiseaseAlertSchema.index({ affectedCrops: 1, type: 1 });

module.exports = mongoose.model('PestDiseaseAlert', PestDiseaseAlertSchema);
