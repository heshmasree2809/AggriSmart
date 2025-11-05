const SoilData = require('../models/SoilData');
const CropRecommendation = require('../models/CropRecommendation');
const { asyncHandler } = require('../middleware/errorHandler');

// Helper function to calculate soil health score
const calculateSoilHealthScore = (soilData) => {
  let score = 0;
  let factors = 0;
  
  // pH score (optimal: 6.0-7.5)
  if (soilData.ph) {
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      score += 100;
    } else if (soilData.ph >= 5.5 && soilData.ph <= 8.0) {
      score += 70;
    } else if (soilData.ph >= 5.0 && soilData.ph <= 8.5) {
      score += 40;
    } else {
      score += 20;
    }
    factors++;
  }
  
  // NPK scores
  const npkOptimal = {
    nitrogen: { low: 280, high: 560 },
    phosphorus: { low: 23, high: 57 },
    potassium: { low: 140, high: 280 }
  };
  
  ['nitrogen', 'phosphorus', 'potassium'].forEach(nutrient => {
    if (soilData[nutrient] !== undefined && soilData[nutrient] !== null) {
      const value = soilData[nutrient];
      const optimal = npkOptimal[nutrient];
      
      if (value >= optimal.low && value <= optimal.high) {
        score += 100;
      } else if (value >= optimal.low * 0.5 && value <= optimal.high * 1.5) {
        score += 60;
      } else {
        score += 30;
      }
      factors++;
    }
  });
  
  // Organic matter score
  if (soilData.organicMatter) {
    if (soilData.organicMatter >= 3) {
      score += 100;
    } else if (soilData.organicMatter >= 2) {
      score += 70;
    } else if (soilData.organicMatter >= 1) {
      score += 40;
    } else {
      score += 20;
    }
    factors++;
  }
  
  return factors > 0 ? Math.round(score / factors) : 50;
};

// Generate soil recommendations
const generateRecommendations = (soilData, healthScore) => {
  const recommendations = {
    fertilizers: [],
    amendments: [],
    practices: [],
    crops: []
  };
  
  // pH recommendations
  if (soilData.ph < 6.0) {
    recommendations.amendments.push('Add lime to increase pH');
    recommendations.practices.push('Avoid acidic fertilizers');
  } else if (soilData.ph > 7.5) {
    recommendations.amendments.push('Add sulfur or organic matter to lower pH');
    recommendations.practices.push('Use acidic fertilizers');
  }
  
  // NPK recommendations
  if (soilData.nitrogen < 280) {
    recommendations.fertilizers.push('Urea (46-0-0)');
    recommendations.fertilizers.push('DAP (18-46-0)');
  }
  
  if (soilData.phosphorus < 23) {
    recommendations.fertilizers.push('DAP (18-46-0)');
    recommendations.fertilizers.push('SSP (0-20-0)');
  }
  
  if (soilData.potassium < 140) {
    recommendations.fertilizers.push('MOP (0-0-60)');
    recommendations.fertilizers.push('NPK (10-26-26)');
  }
  
  // Organic matter recommendations
  if (!soilData.organicMatter || soilData.organicMatter < 2) {
    recommendations.amendments.push('Add compost or farmyard manure');
    recommendations.practices.push('Practice crop rotation');
    recommendations.practices.push('Use cover crops');
  }
  
  // Crop recommendations based on soil conditions
  if (healthScore >= 70) {
    recommendations.crops.push('Wheat', 'Rice', 'Maize', 'Vegetables');
  } else if (healthScore >= 50) {
    recommendations.crops.push('Pulses', 'Millets', 'Groundnut');
  } else {
    recommendations.crops.push('Green manure crops', 'Legumes for soil improvement');
  }
  
  return recommendations;
};

// Get user's soil data (Protected)
exports.getSoilData = asyncHandler(async (req, res) => {
  const soilData = await SoilData.findOne({ user: req.user._id })
    .populate('reviewedBy', 'name email');
  
  if (!soilData) {
    return res.json({ 
      success: true, 
      message: 'No soil data found. Please submit soil test results.',
      data: null 
    });
  }
  
  res.json({ 
    success: true, 
    data: soilData 
  });
});

// Submit/Update soil test results
exports.updateSoilData = asyncHandler(async (req, res) => {
  const {
    fieldName,
    fieldArea,
    fieldLocation,
    ph,
    nitrogen,
    phosphorus,
    potassium,
    organicMatter,
    micronutrients,
    soilType,
    texture,
    moisture,
    temperature,
    electricalConductivity,
    testMethod,
    labName
  } = req.body;
  
  // Calculate health score
  const healthScore = calculateSoilHealthScore({
    ph, nitrogen, phosphorus, potassium, organicMatter
  });
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    ph, nitrogen, phosphorus, potassium, organicMatter
  }, healthScore);
  
  // Prepare soil data
  const soilDataFields = {
    user: req.user._id,
    fieldName,
    fieldArea,
    fieldLocation,
    ph,
    nitrogen,
    phosphorus,
    potassium,
    organicMatter,
    micronutrients,
    soilType,
    texture,
    moisture,
    temperature,
    electricalConductivity,
    healthScore,
    recommendations,
    testDate: new Date(),
    testMethod,
    labName
  };
  
  // Find existing data
  let soilData = await SoilData.findOne({ user: req.user._id });
  
  if (soilData) {
    // Add to history before updating
    if (!soilData.history) soilData.history = [];
    soilData.history.push({
      date: soilData.testDate,
      ph: soilData.ph,
      nitrogen: soilData.nitrogen,
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      healthScore: soilData.healthScore
    });
    
    // Update with new data
    Object.assign(soilData, soilDataFields);
    await soilData.save();
  } else {
    // Create new record
    soilData = await SoilData.create(soilDataFields);
  }
  
  res.json({ 
    success: true, 
    message: 'Soil data updated successfully',
    data: soilData 
  });
});

// Get soil health analysis
exports.getSoilHealthAnalysis = asyncHandler(async (req, res) => {
  const soilData = await SoilData.findOne({ user: req.user._id });
  
  if (!soilData) {
    return res.status(404).json({ 
      success: false, 
      message: 'No soil data available. Please submit soil test results first.' 
    });
  }
  
  const healthScore = soilData.healthScore || calculateSoilHealthScore(soilData);
  const recommendations = soilData.recommendations || generateRecommendations(soilData, healthScore);
  
  const analysis = {
    healthScore,
    healthStatus: 
      healthScore >= 80 ? 'Excellent' :
      healthScore >= 60 ? 'Good' :
      healthScore >= 40 ? 'Fair' : 'Poor',
    
    parameters: {
      ph: {
        value: soilData.ph,
        status: 
          soilData.ph >= 6.0 && soilData.ph <= 7.5 ? 'Optimal' :
          soilData.ph < 6.0 ? 'Too Acidic' : 'Too Alkaline',
        ideal: '6.0 - 7.5'
      },
      nitrogen: {
        value: soilData.nitrogen,
        status: 
          soilData.nitrogen >= 280 && soilData.nitrogen <= 560 ? 'Optimal' :
          soilData.nitrogen < 280 ? 'Low' : 'High',
        ideal: '280 - 560 kg/ha'
      },
      phosphorus: {
        value: soilData.phosphorus,
        status: 
          soilData.phosphorus >= 23 && soilData.phosphorus <= 57 ? 'Optimal' :
          soilData.phosphorus < 23 ? 'Low' : 'High',
        ideal: '23 - 57 kg/ha'
      },
      potassium: {
        value: soilData.potassium,
        status: 
          soilData.potassium >= 140 && soilData.potassium <= 280 ? 'Optimal' :
          soilData.potassium < 140 ? 'Low' : 'High',
        ideal: '140 - 280 kg/ha'
      },
      organicMatter: {
        value: soilData.organicMatter,
        status: 
          soilData.organicMatter >= 3 ? 'Optimal' :
          soilData.organicMatter >= 2 ? 'Adequate' : 'Low',
        ideal: '> 3%'
      }
    },
    
    recommendations,
    
    trends: soilData.history?.slice(-5).map(h => ({
      date: h.date,
      healthScore: h.healthScore,
      ph: h.ph
    })),
    
    lastTested: soilData.testDate,
    nextTestRecommended: new Date(soilData.testDate.getTime() + 180 * 24 * 60 * 60 * 1000) // 6 months
  };
  
  res.json({ 
    success: true, 
    analysis 
  });
});

// Get soil test history
exports.getSoilHistory = asyncHandler(async (req, res) => {
  const soilData = await SoilData.findOne({ user: req.user._id });
  
  if (!soilData || !soilData.history || soilData.history.length === 0) {
    return res.json({ 
      success: true, 
      message: 'No historical soil data available',
      history: [] 
    });
  }
  
  res.json({ 
    success: true, 
    history: soilData.history.sort((a, b) => b.date - a.date)
  });
});

// Compare soil data with optimal values
exports.compareSoilData = asyncHandler(async (req, res) => {
  const soilData = await SoilData.findOne({ user: req.user._id });
  
  if (!soilData) {
    return res.status(404).json({ 
      success: false, 
      message: 'No soil data available' 
    });
  }
  
  const comparison = {
    current: {
      ph: soilData.ph,
      nitrogen: soilData.nitrogen,
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      organicMatter: soilData.organicMatter
    },
    optimal: {
      ph: { min: 6.0, max: 7.5 },
      nitrogen: { min: 280, max: 560 },
      phosphorus: { min: 23, max: 57 },
      potassium: { min: 140, max: 280 },
      organicMatter: { min: 3, max: 5 }
    },
    deficiencies: [],
    excesses: []
  };
  
  // Check deficiencies and excesses
  if (soilData.ph < 6.0) comparison.deficiencies.push('pH (Too Acidic)');
  if (soilData.ph > 7.5) comparison.excesses.push('pH (Too Alkaline)');
  
  if (soilData.nitrogen < 280) comparison.deficiencies.push('Nitrogen');
  if (soilData.nitrogen > 560) comparison.excesses.push('Nitrogen');
  
  if (soilData.phosphorus < 23) comparison.deficiencies.push('Phosphorus');
  if (soilData.phosphorus > 57) comparison.excesses.push('Phosphorus');
  
  if (soilData.potassium < 140) comparison.deficiencies.push('Potassium');
  if (soilData.potassium > 280) comparison.excesses.push('Potassium');
  
  if (soilData.organicMatter < 3) comparison.deficiencies.push('Organic Matter');
  
  res.json({ 
    success: true, 
    comparison 
  });
});

