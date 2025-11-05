const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class AIService {
  constructor() {
    this.model = null;
    this.diseaseClasses = [
      'Healthy',
      'Bacterial Leaf Blight',
      'Brown Spot',
      'Leaf Smut',
      'Bacterial Leaf Streak',
      'Leaf Blast',
      'Tungro',
      'Sheath Blight',
      'False Smut',
      'Downy Mildew',
      'Bacterial Wilt',
      'Powdery Mildew',
      'Black Rot',
      'Anthracnose',
      'Leaf Curl',
      'Mosaic Virus',
      'Gray Leaf Spot',
      'Common Rust',
      'Northern Leaf Blight',
      'Cercospora Leaf Spot'
    ];
    
    this.treatments = {
      'Bacterial Leaf Blight': {
        organic: [
          { name: 'Neem Oil Spray', dosage: '2-3ml per liter', frequency: 'Weekly', cost: 150 },
          { name: 'Pseudomonas fluorescens', dosage: '10g per liter', frequency: 'Bi-weekly', cost: 200 }
        ],
        chemical: [
          { name: 'Streptomycin', dosage: '1g per 3 liters', frequency: 'Weekly', safetyPeriod: '7 days', cost: 250 },
          { name: 'Copper Oxychloride', dosage: '2g per liter', frequency: 'Bi-weekly', safetyPeriod: '10 days', cost: 180 }
        ],
        immediate: ['Remove infected leaves', 'Improve field drainage', 'Avoid excessive nitrogen'],
        preventive: ['Use resistant varieties', 'Maintain proper spacing', 'Balanced fertilization']
      },
      'Powdery Mildew': {
        organic: [
          { name: 'Baking Soda Solution', dosage: '1 tbsp per liter', frequency: 'Weekly', cost: 50 },
          { name: 'Milk Spray', dosage: '1:9 ratio with water', frequency: 'Weekly', cost: 80 }
        ],
        chemical: [
          { name: 'Sulfur', dosage: '2g per liter', frequency: 'Weekly', safetyPeriod: '3 days', cost: 120 },
          { name: 'Propiconazole', dosage: '1ml per liter', frequency: 'Bi-weekly', safetyPeriod: '14 days', cost: 300 }
        ],
        immediate: ['Remove affected parts', 'Increase air circulation', 'Avoid overhead watering'],
        preventive: ['Plant resistant varieties', 'Proper spacing', 'Morning watering only']
      },
      'Leaf Blast': {
        organic: [
          { name: 'Trichoderma', dosage: '5g per liter', frequency: 'Weekly', cost: 180 },
          { name: 'Garlic Extract', dosage: '20ml per liter', frequency: 'Weekly', cost: 100 }
        ],
        chemical: [
          { name: 'Tricyclazole', dosage: '0.6g per liter', frequency: 'Bi-weekly', safetyPeriod: '21 days', cost: 350 },
          { name: 'Carbendazim', dosage: '1g per liter', frequency: 'Bi-weekly', safetyPeriod: '14 days', cost: 200 }
        ],
        immediate: ['Apply fungicide immediately', 'Remove infected leaves', 'Reduce nitrogen application'],
        preventive: ['Seed treatment', 'Use resistant varieties', 'Avoid excess nitrogen']
      }
    };
  }

  async loadModel() {
    try {
      // In production, load a real TensorFlow model
      // this.model = await tf.loadLayersModel('file://./models/disease_detection/model.json');
      console.log('AI Model loaded successfully (simulated)');
      this.model = 'simulated'; // Placeholder
    } catch (error) {
      console.error('Failed to load AI model:', error);
      this.model = 'simulated';
    }
  }

  async preprocessImage(imagePath) {
    try {
      // Resize and normalize image for model input
      const imageBuffer = await sharp(imagePath)
        .resize(224, 224) // Standard input size for many models
        .toBuffer();
      
      // Convert to tensor (in production)
      // const tensor = tf.node.decodeImage(imageBuffer);
      // const normalized = tensor.div(255.0);
      // const batched = normalized.expandDims(0);
      // return batched;
      
      return imageBuffer; // Placeholder
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw error;
    }
  }

  async detectDisease(imagePath, cropType) {
    try {
      // Preprocess image
      const processedImage = await this.preprocessImage(imagePath);
      
      // In production, make actual prediction
      // const predictions = await this.model.predict(processedImage).data();
      // const maxPrediction = Math.max(...predictions);
      // const diseaseIndex = predictions.indexOf(maxPrediction);
      
      // Simulated prediction for development
      const simulatedResults = this.simulatePrediction(cropType);
      
      return simulatedResults;
    } catch (error) {
      console.error('Disease detection failed:', error);
      throw error;
    }
  }

  simulatePrediction(cropType) {
    // Simulate different diseases based on crop type
    const cropDiseases = {
      'Rice': ['Bacterial Leaf Blight', 'Brown Spot', 'Leaf Blast', 'Sheath Blight'],
      'Wheat': ['Powdery Mildew', 'Leaf Rust', 'Black Rust', 'Leaf Blight'],
      'Tomato': ['Bacterial Wilt', 'Leaf Curl', 'Mosaic Virus', 'Anthracnose'],
      'Cotton': ['Bacterial Blight', 'Gray Mildew', 'Leaf Spot', 'Wilt'],
      'Maize': ['Gray Leaf Spot', 'Common Rust', 'Northern Leaf Blight', 'Leaf Blight']
    };

    const diseases = cropDiseases[cropType] || this.diseaseClasses.slice(1, 5);
    const primaryDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const confidence = 70 + Math.random() * 25; // 70-95% confidence
    
    // Generate severity based on confidence
    let severity = 'low';
    if (confidence > 85) severity = 'critical';
    else if (confidence > 75) severity = 'high';
    else if (confidence > 65) severity = 'medium';
    
    // Get treatment plan
    const treatmentPlan = this.treatments[primaryDisease] || this.treatments['Bacterial Leaf Blight'];
    
    return {
      disease: primaryDisease,
      confidence: Math.round(confidence),
      severity,
      affectedArea: Math.round(20 + Math.random() * 60), // 20-80% affected
      stage: confidence > 80 ? 'Advanced' : confidence > 60 ? 'Mid' : 'Early',
      treatmentPlan,
      recommendedActions: [
        {
          type: 'immediate',
          description: treatmentPlan.immediate[0],
          priority: 5,
          timeline: 'Within 24 hours'
        },
        {
          type: 'curative',
          description: `Apply ${treatmentPlan.chemical[0].name}`,
          priority: 4,
          timeline: 'Within 2-3 days'
        },
        {
          type: 'preventive',
          description: treatmentPlan.preventive[0],
          priority: 3,
          timeline: 'Ongoing'
        }
      ],
      symptoms: this.getSymptoms(primaryDisease),
      weatherFactors: {
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        conditions: 'Favorable for disease spread'
      }
    };
  }

  getSymptoms(disease) {
    const symptomMap = {
      'Bacterial Leaf Blight': ['Water-soaked lesions', 'Yellow halos around spots', 'Wilting of leaves'],
      'Powdery Mildew': ['White powdery coating', 'Distorted leaves', 'Stunted growth'],
      'Leaf Blast': ['Diamond-shaped lesions', 'Gray centers with brown borders', 'Leaf death'],
      'Brown Spot': ['Circular brown spots', 'Yellow margins', 'Premature leaf drop'],
      'Bacterial Wilt': ['Wilting during day', 'Recovery at night initially', 'Vascular discoloration']
    };
    
    return symptomMap[disease] || ['Discoloration', 'Spots or lesions', 'Abnormal growth'];
  }

  async getCropRecommendations(soilData, location, season) {
    // Simulated crop recommendations based on soil and location
    const recommendations = [];
    
    const crops = {
      'Rice': { ph: [5.5, 7.0], nitrogen: 100, season: 'Kharif' },
      'Wheat': { ph: [6.0, 7.5], nitrogen: 120, season: 'Rabi' },
      'Maize': { ph: [5.8, 7.0], nitrogen: 150, season: 'Kharif' },
      'Cotton': { ph: [5.8, 8.0], nitrogen: 80, season: 'Kharif' },
      'Sugarcane': { ph: [6.0, 8.0], nitrogen: 200, season: 'Year-round' },
      'Pulses': { ph: [6.0, 7.5], nitrogen: 20, season: 'Rabi' }
    };
    
    for (const [cropName, requirements] of Object.entries(crops)) {
      let suitability = 0;
      
      // Check pH suitability
      if (soilData.pH >= requirements.ph[0] && soilData.pH <= requirements.ph[1]) {
        suitability += 30;
      }
      
      // Check nitrogen
      if (soilData.nitrogen >= requirements.nitrogen * 0.8) {
        suitability += 30;
      }
      
      // Check season
      if (!season || requirements.season === 'Year-round' || requirements.season === season) {
        suitability += 20;
      }
      
      // Random factor for simulation
      suitability += Math.random() * 20;
      
      if (suitability > 50) {
        recommendations.push({
          crop: cropName,
          suitability: Math.min(Math.round(suitability), 100),
          requirements,
          expectedYield: Math.round(3000 + Math.random() * 2000) + ' kg/hectare',
          profitability: suitability > 70 ? 'High' : suitability > 50 ? 'Medium' : 'Low',
          reasons: [
            soilData.pH >= requirements.ph[0] && soilData.pH <= requirements.ph[1] ? 'Suitable pH level' : null,
            soilData.nitrogen >= requirements.nitrogen * 0.8 ? 'Adequate nitrogen' : null,
            'Good market demand'
          ].filter(Boolean)
        });
      }
    }
    
    return recommendations.sort((a, b) => b.suitability - a.suitability);
  }

  async analyzeSoilHealth(soilData) {
    let healthScore = 0;
    const recommendations = [];
    
    // pH Analysis
    if (soilData.pH >= 6.0 && soilData.pH <= 7.5) {
      healthScore += 25;
    } else {
      recommendations.push({
        issue: 'pH imbalance',
        solution: soilData.pH < 6.0 ? 'Add lime to increase pH' : 'Add sulfur to decrease pH'
      });
    }
    
    // NPK Analysis
    if (soilData.nitrogen > 250) healthScore += 20;
    else recommendations.push({ issue: 'Low nitrogen', solution: 'Add urea or organic compost' });
    
    if (soilData.phosphorus > 25) healthScore += 20;
    else recommendations.push({ issue: 'Low phosphorus', solution: 'Add DAP or rock phosphate' });
    
    if (soilData.potassium > 200) healthScore += 20;
    else recommendations.push({ issue: 'Low potassium', solution: 'Add MOP or wood ash' });
    
    // Organic matter
    if (soilData.organicMatter > 2) healthScore += 15;
    else recommendations.push({ issue: 'Low organic matter', solution: 'Add compost or green manure' });
    
    return {
      healthScore: Math.min(healthScore, 100),
      classification: healthScore > 75 ? 'Excellent' : healthScore > 50 ? 'Good' : healthScore > 25 ? 'Fair' : 'Poor',
      recommendations
    };
  }
}

// Create singleton instance
const aiService = new AIService();

// Load model on startup
aiService.loadModel();

module.exports = aiService;
