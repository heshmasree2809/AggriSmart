const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  subcategory: String,
  description: { type: String, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  unit: { 
    type: String, 
    enum: ['kg', 'gram', 'piece', 'dozen', 'quintal'], 
    default: 'kg' 
  },
  quantity: { type: Number, default: 0, min: 0 },
  minimumOrder: { type: Number, default: 1, min: 1 },
  maximumOrder: Number,
  images: [{ type: String }],
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  quality: { 
    type: String, 
    enum: ['A', 'B', 'C'], 
    default: 'A' 
  },
  organic: { type: Boolean, default: false },
  harvestDate: Date,
  expiryDate: Date,
  location: {
    state: String,
    district: String,
    village: String
  },
  tags: [String],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  views: { type: Number, default: 0 },
  bulkPricing: {
    enabled: { type: Boolean, default: false },
    price: Number,
    minimumQuantity: { type: Number, default: 100 }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  deletedAt: Date
}, { timestamps: true });

// Indexes for performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1, category: 1 });
ProductSchema.index({ seller: 1, isActive: 1 });
ProductSchema.index({ 'location.state': 1, 'location.district': 1 });

// Virtual field for availability
ProductSchema.virtual('isAvailable').get(function() {
  return this.isActive && this.quantity > 0;
});

// Method to update stock
ProductSchema.methods.updateStock = async function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    if (this.quantity < quantity) {
      throw new Error('Insufficient stock');
    }
    this.quantity -= quantity;
  } else {
    this.quantity += quantity;
  }
  return this.save();
};

module.exports = mongoose.model('Product', ProductSchema);
