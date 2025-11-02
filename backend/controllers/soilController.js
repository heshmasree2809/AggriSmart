const SoilData = require('../models/SoilData');

// Get user's soil data (Protected)
exports.getSoilData = async (req, res) => {
  try {
    const data = await SoilData.findOne({ user: req.user._id });
    if (!data) {
      // Create a default entry if none exists
      const newData = new SoilData({ user: req.user._id });
      await newData.save();
      return res.json({ success: true, data: newData });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// Update user's soil data (Protected)
exports.updateSoilData = async (req, res) => {
  try {
    const { ph, nitrogen, potassium, phosphorus } = req.body;
    const soilFields = {
      ph,
      nitrogen,
      potassium,
      phosphorus,
      user: req.user._id,
      lastUpdated: Date.now()
    };
    
    // Find and update, or create if it doesn't exist (upsert)
    const data = await SoilData.findOneAndUpdate(
      { user: req.user._id },
      { $set: soilFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

