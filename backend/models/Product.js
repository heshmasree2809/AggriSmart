const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: 'https://placehold.co/600x400/22c55e/white?text=AgriSmart' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);

