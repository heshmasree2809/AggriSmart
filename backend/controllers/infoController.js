const Fertilizer = require('../models/Fertilizer');
const Pest = require('../models/Pest');
const Scheme = require('../models/Scheme');

// Get all fertilizers
exports.getFertilizers = async (req, res) => {
  try {
    const data = await Fertilizer.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all pests
exports.getPests = async (req, res) => {
  try {
    const data = await Pest.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all schemes
exports.getSchemes = async (req, res) => {
  try {
    const data = await Scheme.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

