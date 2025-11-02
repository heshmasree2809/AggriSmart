// Irrigation Database
export const irrigationSystems = [
  {
    id: 1,
    name: 'Drip Irrigation',
    type: 'Micro Irrigation',
    description: 'Water delivered directly to plant roots through pipes and emitters',
    efficiency: '90-95%',
    suitableFor: ['Vegetables', 'Fruits', 'Sugarcane', 'Cotton'],
    advantages: [
      'Highest water use efficiency',
      'Reduced weed growth',
      'Fertigation possible',
      'Suitable for all terrains',
      'Reduced labor cost'
    ],
    disadvantages: [
      'High initial cost',
      'Clogging of emitters',
      'Regular maintenance needed',
      'Technical knowledge required'
    ],
    cost: {
      installation: '₹50,000-80,000 per hectare',
      maintenance: '₹5,000-8,000 per year'
    },
    subsidy: 'Up to 55-65% under PMKSY',
    waterSaving: '40-70% compared to flood irrigation'
  },
  {
    id: 2,
    name: 'Sprinkler Irrigation',
    type: 'Pressurized Irrigation',
    description: 'Water sprayed over crops like natural rainfall',
    efficiency: '75-85%',
    suitableFor: ['Wheat', 'Barley', 'Vegetables', 'Tea', 'Coffee'],
    advantages: [
      'Suitable for undulating terrain',
      'Uniform water distribution',
      'Can cover large areas',
      'Frost protection possible',
      'Foliar application of nutrients'
    ],
    disadvantages: [
      'Wind affects distribution',
      'Not suitable in windy areas',
      'Disease spread in humid conditions',
      'High energy requirement'
    ],
    cost: {
      installation: '₹30,000-50,000 per hectare',
      maintenance: '₹3,000-5,000 per year'
    },
    subsidy: 'Up to 50-60% under PMKSY',
    waterSaving: '30-50% compared to flood irrigation'
  },
  {
    id: 3,
    name: 'Surface/Flood Irrigation',
    type: 'Traditional',
    description: 'Water flows over soil surface by gravity',
    efficiency: '40-50%',
    suitableFor: ['Rice', 'Wheat', 'Sugarcane'],
    advantages: [
      'Low initial cost',
      'Simple operation',
      'No technical knowledge needed',
      'Suitable for closely spaced crops'
    ],
    disadvantages: [
      'High water wastage',
      'Uneven distribution',
      'Soil erosion risk',
      'Waterlogging problems',
      'High labor requirement'
    ],
    cost: {
      installation: '₹5,000-10,000 per hectare',
      maintenance: '₹1,000-2,000 per year'
    },
    subsidy: 'Limited subsidies available',
    waterSaving: 'Baseline method'
  },
  {
    id: 4,
    name: 'Furrow Irrigation',
    type: 'Surface Irrigation',
    description: 'Water flows through furrows between crop rows',
    efficiency: '60-70%',
    suitableFor: ['Cotton', 'Maize', 'Vegetables', 'Sugarcane'],
    advantages: [
      'Better than flood irrigation',
      'Reduced water contact with plants',
      'Less soil erosion',
      'Suitable for row crops'
    ],
    disadvantages: [
      'Labor intensive',
      'Requires land leveling',
      'Not suitable for sandy soils',
      'Uneven water distribution'
    ],
    cost: {
      installation: '₹8,000-15,000 per hectare',
      maintenance: '₹1,500-3,000 per year'
    },
    subsidy: 'State-specific schemes',
    waterSaving: '20-30% compared to flood irrigation'
  },
  {
    id: 5,
    name: 'Sub-surface Irrigation',
    type: 'Advanced',
    description: 'Water supplied below ground surface through buried pipes',
    efficiency: '85-90%',
    suitableFor: ['High-value crops', 'Orchards', 'Vegetables'],
    advantages: [
      'Minimal evaporation loss',
      'No interference with cultivation',
      'Reduced weed growth',
      'Long system life'
    ],
    disadvantages: [
      'Very high initial cost',
      'Complex installation',
      'Difficult maintenance',
      'Risk of salt accumulation'
    ],
    cost: {
      installation: '₹80,000-120,000 per hectare',
      maintenance: '₹8,000-12,000 per year'
    },
    subsidy: 'Available under special schemes',
    waterSaving: '50-70% compared to flood irrigation'
  }
];

export const irrigationSchedule = {
  wheat: [
    { stage: 'Crown root initiation', days: '20-25 DAS', critical: true },
    { stage: 'Tillering', days: '40-45 DAS', critical: false },
    { stage: 'Jointing', days: '60-65 DAS', critical: false },
    { stage: 'Flowering', days: '80-85 DAS', critical: true },
    { stage: 'Milking', days: '100-105 DAS', critical: true },
    { stage: 'Dough stage', days: '115-120 DAS', critical: false }
  ],
  rice: [
    { stage: 'Nursery', days: '0-25 days', critical: true },
    { stage: 'Transplanting', days: 'At transplanting', critical: true },
    { stage: 'Tillering', days: '15-45 DAT', critical: true },
    { stage: 'Panicle initiation', days: '45-65 DAT', critical: true },
    { stage: 'Flowering', days: '65-85 DAT', critical: true },
    { stage: 'Grain filling', days: '85-105 DAT', critical: true }
  ],
  cotton: [
    { stage: 'Germination', days: '0-10 DAS', critical: true },
    { stage: 'Vegetative growth', days: '20-45 DAS', critical: false },
    { stage: 'Square formation', days: '45-65 DAS', critical: true },
    { stage: 'Flowering', days: '65-95 DAS', critical: true },
    { stage: 'Boll development', days: '95-140 DAS', critical: true },
    { stage: 'Boll opening', days: '140-160 DAS', critical: false }
  ]
};

export const waterRequirements = [
  { crop: 'Rice', waterNeed: '1200-1500 mm', frequency: 'Continuous/AWD' },
  { crop: 'Wheat', waterNeed: '400-500 mm', frequency: '4-6 irrigations' },
  { crop: 'Cotton', waterNeed: '700-1000 mm', frequency: '6-8 irrigations' },
  { crop: 'Sugarcane', waterNeed: '1500-2000 mm', frequency: '20-25 irrigations' },
  { crop: 'Maize', waterNeed: '500-700 mm', frequency: '5-7 irrigations' },
  { crop: 'Vegetables', waterNeed: '400-600 mm', frequency: 'Every 5-7 days' }
];

export const irrigationTips = [
  'Check soil moisture before irrigation',
  'Irrigate during early morning or evening',
  'Avoid over-irrigation to prevent waterlogging',
  'Maintain irrigation channels properly',
  'Use mulching to reduce water loss',
  'Monitor weather forecast before irrigation',
  'Consider critical growth stages for irrigation',
  'Test water quality periodically'
];
