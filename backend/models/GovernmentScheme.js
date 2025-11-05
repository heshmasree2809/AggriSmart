const mongoose = require('mongoose');

const GovernmentSchemeSchema = new mongoose.Schema({
  schemeName: { 
    type: String, 
    required: true,
    index: true 
  },
  schemeCode: { 
    type: String, 
    unique: true,
    sparse: true 
  },
  category: { 
    type: String,
    required: true,
    index: true 
  },
  department: String,
  description: { 
    type: String, 
    required: true 
  },
  benefits: [String],
  eligibility: {
    farmerType: [String],
    landSize: {
      min: Number,
      max: Number,
      unit: String
    },
    income: {
      min: Number,
      max: Number
    },
    crops: [String],
    states: [String]
  },
  documents: [String],
  applicationProcess: String,
  applicationUrl: String,
  applicationDeadline: Date,
  startDate: Date,
  endDate: Date,
  budget: Number,
  contactInfo: {
    phone: String,
    email: String,
    office: String,
    website: String
  },
  faqs: [{
    question: String,
    answer: String
  }],
  successStories: [{
    farmerName: String,
    location: String,
    benefit: String,
    year: Number
  }],
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  applicationsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes
GovernmentSchemeSchema.index({ 'eligibility.states': 1 });
GovernmentSchemeSchema.index({ category: 1, isActive: 1 });
GovernmentSchemeSchema.index({ startDate: 1, endDate: 1 });

// Virtual for scheme status
GovernmentSchemeSchema.virtual('status').get(function() {
  const now = new Date();
  if (this.endDate && this.endDate < now) return 'expired';
  if (this.startDate && this.startDate > now) return 'upcoming';
  if (this.applicationDeadline && this.applicationDeadline < now) return 'closed';
  return 'active';
});

module.exports = mongoose.model('GovernmentScheme', GovernmentSchemeSchema);
