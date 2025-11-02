// Fertilizers Database
export const fertilizersData = [
  {
    id: 1,
    name: 'Urea (46-0-0)',
    type: 'Nitrogenous',
    npk: '46-0-0',
    description: 'High nitrogen content fertilizer for vegetative growth',
    usage: '20-25 kg per acre for cereals',
    benefits: [
      'Promotes leafy growth',
      'Enhances protein synthesis',
      'Improves crop yield',
      'Cost-effective nitrogen source'
    ],
    applicationTime: 'During vegetative stage',
    precautions: [
      'Avoid over-application to prevent burning',
      'Apply when soil is moist',
      'Store in dry place'
    ],
    price: 350,
    unit: 'per 50kg bag',
    suitableFor: ['Wheat', 'Rice', 'Maize', 'Vegetables']
  },
  {
    id: 2,
    name: 'DAP (18-46-0)',
    type: 'Phosphatic',
    npk: '18-46-0',
    description: 'Di-Ammonium Phosphate for root development',
    usage: '100-125 kg per acre as basal dose',
    benefits: [
      'Promotes root development',
      'Enhances flowering',
      'Improves seed formation',
      'Contains both N and P'
    ],
    applicationTime: 'At sowing/planting time',
    precautions: [
      'Apply below seed level',
      'Avoid direct seed contact',
      'Use protective gear'
    ],
    price: 1350,
    unit: 'per 50kg bag',
    suitableFor: ['All crops', 'Pulses', 'Oilseeds']
  },
  {
    id: 3,
    name: 'MOP (0-0-60)',
    type: 'Potassic',
    npk: '0-0-60',
    description: 'Muriate of Potash for fruit development',
    usage: '40-50 kg per acre',
    benefits: [
      'Improves fruit quality',
      'Enhances disease resistance',
      'Increases drought tolerance',
      'Better grain filling'
    ],
    applicationTime: 'During fruit development stage',
    precautions: [
      'Not suitable for chloride-sensitive crops',
      'Apply in splits for better efficiency',
      'Store away from moisture'
    ],
    price: 800,
    unit: 'per 50kg bag',
    suitableFor: ['Fruits', 'Vegetables', 'Cereals']
  },
  {
    id: 4,
    name: 'NPK (10-26-26)',
    type: 'Complex',
    npk: '10-26-26',
    description: 'Balanced complex fertilizer',
    usage: '150-200 kg per acre',
    benefits: [
      'Complete nutrition',
      'Suitable for all stages',
      'Improves overall yield',
      'Better nutrient use efficiency'
    ],
    applicationTime: 'Basal and top dressing',
    precautions: [
      'Calculate based on soil test',
      'Avoid mixing with alkaline substances',
      'Apply when soil moisture is adequate'
    ],
    price: 1150,
    unit: 'per 50kg bag',
    suitableFor: ['All crops']
  },
  {
    id: 5,
    name: 'Zinc Sulphate',
    type: 'Micronutrient',
    npk: 'Zn 21%',
    description: 'Essential micronutrient fertilizer',
    usage: '10-25 kg per acre',
    benefits: [
      'Prevents zinc deficiency',
      'Improves enzyme function',
      'Better grain quality',
      'Enhanced protein synthesis'
    ],
    applicationTime: 'As basal dose or foliar spray',
    precautions: [
      'Do not mix with phosphatic fertilizers',
      'Use as per soil test recommendation',
      'Can be used as foliar spray (0.5%)'
    ],
    price: 120,
    unit: 'per kg',
    suitableFor: ['Rice', 'Wheat', 'Maize', 'Citrus']
  },
  {
    id: 6,
    name: 'Organic Compost',
    type: 'Organic',
    npk: '1-1-1',
    description: 'Well-decomposed organic matter',
    usage: '5-10 tons per acre',
    benefits: [
      'Improves soil structure',
      'Enhances water retention',
      'Promotes beneficial microbes',
      'Slow-release nutrients'
    ],
    applicationTime: 'Before land preparation',
    precautions: [
      'Ensure proper decomposition',
      'Apply 15-20 days before sowing',
      'Mix well with soil'
    ],
    price: 3000,
    unit: 'per ton',
    suitableFor: ['All crops', 'Organic farming']
  },
  {
    id: 7,
    name: 'Neem Cake',
    type: 'Organic',
    npk: '4-1-2',
    description: 'Organic fertilizer with pest control properties',
    usage: '400-600 kg per acre',
    benefits: [
      'Natural pesticide',
      'Improves soil health',
      'Slow nutrient release',
      'Eco-friendly'
    ],
    applicationTime: 'During land preparation',
    precautions: [
      'Use well-dried neem cake',
      'Can be mixed with other organic fertilizers',
      'Store in dry conditions'
    ],
    price: 25,
    unit: 'per kg',
    suitableFor: ['Vegetables', 'Fruits', 'Organic farming']
  },
  {
    id: 8,
    name: 'SSP (0-16-0)',
    type: 'Phosphatic',
    npk: '0-16-0',
    description: 'Single Super Phosphate with calcium and sulphur',
    usage: '125-150 kg per acre',
    benefits: [
      'Contains calcium and sulphur',
      'Improves oil content in oilseeds',
      'Better root development',
      'Suitable for all soil types'
    ],
    applicationTime: 'As basal dose',
    precautions: [
      'Apply at proper depth',
      'Can be mixed with organic manures',
      'Store in moisture-free area'
    ],
    price: 350,
    unit: 'per 50kg bag',
    suitableFor: ['Oilseeds', 'Pulses', 'Groundnut']
  }
];

export const fertilizerCategories = [
  'All',
  'Nitrogenous',
  'Phosphatic',
  'Potassic',
  'Complex',
  'Micronutrient',
  'Organic'
];

export const applicationMethods = [
  {
    method: 'Broadcasting',
    description: 'Uniform spreading over field',
    suitable: 'For basal application'
  },
  {
    method: 'Band Placement',
    description: 'Placing in bands near crop rows',
    suitable: 'For row crops'
  },
  {
    method: 'Foliar Spray',
    description: 'Spraying on leaves',
    suitable: 'For micronutrients and quick correction'
  },
  {
    method: 'Fertigation',
    description: 'Through irrigation water',
    suitable: 'For water-soluble fertilizers'
  },
  {
    method: 'Deep Placement',
    description: 'Placing at root zone depth',
    suitable: 'For efficient nutrient use'
  }
];
