const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { 
    type: String, 
    enum: ['Farmer', 'Buyer', 'Admin', 'Expert'], 
    default: 'Buyer' 
  },
  contact: { type: String },
  address: {
    street: String,
    village: String,
    district: String,
    state: String,
    zipcode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  location: { type: String, index: true },
  profileImage: String,
  verificationStatus: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalSales: { type: Number, default: 0 },
  totalPurchases: { type: Number, default: 0 },
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false }
  },
  bankDetails: {
    accountNumber: { type: String, select: false },
    ifsc: String,
    bankName: String
  },
  refreshToken: { type: String, select: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  deletedAt: Date
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.checkPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateVerificationToken = function() {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

UserSchema.methods.generatePasswordResetToken = function() {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  this.passwordResetToken = token;
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

// Virtual field for full address
UserSchema.virtual('fullAddress').get(function() {
  const parts = [];
  if (this.address.street) parts.push(this.address.street);
  if (this.address.village) parts.push(this.address.village);
  if (this.address.district) parts.push(this.address.district);
  if (this.address.state) parts.push(this.address.state);
  if (this.address.zipcode) parts.push(this.address.zipcode);
  return parts.join(', ');
});

// Indexes
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ 'address.state': 1, 'address.district': 1 });

module.exports = mongoose.model('User', UserSchema);