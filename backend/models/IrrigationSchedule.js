const mongoose = require('mongoose');

const IrrigationScheduleSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  crop: { type: String, required: true },
  fieldArea: { type: Number, required: true },
  fieldUnit: { type: String, default: 'hectare' },
  soilType: { type: String },
  irrigationType: {
    type: String,
    enum: ['Drip', 'Sprinkler', 'Flood', 'Furrow', 'Manual'],
    default: 'Manual'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  schedule: [{
    date: Date,
    time: String,
    duration: Number,
    waterAmount: Number,
    unit: { type: String, default: 'liters' },
    completed: { type: Boolean, default: false },
    notes: String
  }],
  waterSource: String,
  totalWaterRequired: Number,
  frequency: {
    type: String,
    enum: ['Daily', 'Alternate', 'Weekly', 'Custom'],
    default: 'Weekly'
  },
  weatherAdjustment: { type: Boolean, default: true },
  moistureThreshold: {
    min: Number,
    max: Number
  },
  notifications: {
    enabled: { type: Boolean, default: true },
    beforeHours: { type: Number, default: 2 }
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Completed', 'Cancelled'],
    default: 'Active'
  }
}, { timestamps: true });

IrrigationScheduleSchema.index({ user: 1, status: 1 });
IrrigationScheduleSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('IrrigationSchedule', IrrigationScheduleSchema);
