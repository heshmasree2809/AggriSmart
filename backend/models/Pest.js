const mongoose = require('mongoose');

const PestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  control_measures: { type: String }
});

module.exports = mongoose.model('Pest', PestSchema);

