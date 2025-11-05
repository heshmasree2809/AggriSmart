const mongoose = require('mongoose');

const FertilizerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, default: 'General', index: true },
  usage: { type: String },
  npk: { type: String },
  price: { type: Number },
  unit: { type: String },
  benefits: [{ type: String }],
  precautions: [{ type: String }],
  suitableFor: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Fertilizer', FertilizerSchema);

