const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String },
  link: { type: String }
});

module.exports = mongoose.model('Scheme', SchemeSchema);

