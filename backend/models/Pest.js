const mongoose = require('mongoose');

const PestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  scientificName: { type: String, trim: true },
  description: { type: String, required: true },
  severity: { type: String, default: 'Medium', index: true },
  affectedCrops: [{ type: String }],
  symptoms: [{ type: String }],
  controlMeasures: {
    cultural: [{ type: String }],
    biological: [{ type: String }],
    chemical: [{ type: String }]
  },
  preventiveMeasures: [{ type: String }],
  treatment: [{ type: String }],
  identificationTips: { type: String },
  seasonalOccurrence: { type: String },
  economicThreshold: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pest', PestSchema);

