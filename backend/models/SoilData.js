const mongoose = require('mongoose');

const SoilDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  ph: { type: Number, default: 7.0 },
  nitrogen: { type: Number, default: 0 },
  potassium: { type: Number, default: 0 },
  phosphorus: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SoilData', SoilDataSchema);

