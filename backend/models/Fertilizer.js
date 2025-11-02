const mongoose = require('mongoose');

const FertilizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  usage: { type: String }
});

module.exports = mongoose.model('Fertilizer', FertilizerSchema);

