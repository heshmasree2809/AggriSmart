// Crops Database
export const cropsData = [
  {
    id: 1,
    name: 'Wheat',
    type: 'Rabi',
    season: 'October - March',
    duration: '120-150 days',
    soilType: 'Well-drained loamy soil',
    climate: 'Cool and dry',
    temperature: '20-25°C',
    rainfall: '60-100 cm',
    irrigation: '4-6 irrigations',
    spacing: '20-22.5 cm row spacing',
    seedRate: '100-125 kg/ha',
    fertilizer: {
      nitrogen: '120-150 kg/ha',
      phosphorus: '60-80 kg/ha',
      potassium: '40-60 kg/ha'
    },
    diseases: ['Rust', 'Smut', 'Powdery mildew'],
    pests: ['Aphids', 'Termites', 'Army worm'],
    yield: '40-60 quintals/ha',
    marketPrice: '₹2000-2200/quintal',
    profitability: 'Medium to High',
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    name: 'Rice',
    type: 'Kharif',
    season: 'June - November',
    duration: '120-150 days',
    soilType: 'Clay loam, silt-clay loam',
    climate: 'Hot and humid',
    temperature: '25-35°C',
    rainfall: '100-200 cm',
    irrigation: 'Continuous flooding',
    spacing: '20 x 15 cm',
    seedRate: '60-80 kg/ha',
    fertilizer: {
      nitrogen: '100-120 kg/ha',
      phosphorus: '50-60 kg/ha',
      potassium: '40-50 kg/ha'
    },
    diseases: ['Blast', 'Bacterial blight', 'Sheath blight'],
    pests: ['Stem borer', 'Leaf folder', 'Brown plant hopper'],
    yield: '50-70 quintals/ha',
    marketPrice: '₹1900-2100/quintal',
    profitability: 'Medium',
    image: '/api/placeholder/300/200'
  },
  {
    id: 3,
    name: 'Cotton',
    type: 'Kharif',
    season: 'April - October',
    duration: '160-180 days',
    soilType: 'Black cotton soil',
    climate: 'Warm',
    temperature: '25-35°C',
    rainfall: '60-120 cm',
    irrigation: '5-8 irrigations',
    spacing: '90 x 30 cm',
    seedRate: '15-20 kg/ha (hybrid)',
    fertilizer: {
      nitrogen: '150-200 kg/ha',
      phosphorus: '60-80 kg/ha',
      potassium: '60-80 kg/ha'
    },
    diseases: ['Wilt', 'Root rot', 'Grey mildew'],
    pests: ['Bollworm', 'Aphids', 'Whitefly'],
    yield: '20-30 quintals/ha',
    marketPrice: '₹6000-6500/quintal',
    profitability: 'High',
    image: '/api/placeholder/300/200'
  },
  {
    id: 4,
    name: 'Tomato',
    type: 'Vegetable',
    season: 'Year-round',
    duration: '90-120 days',
    soilType: 'Well-drained sandy loam',
    climate: 'Warm and humid',
    temperature: '20-30°C',
    rainfall: '60-150 cm',
    irrigation: 'Regular watering',
    spacing: '60 x 45 cm',
    seedRate: '400-500 g/ha',
    fertilizer: {
      nitrogen: '120-150 kg/ha',
      phosphorus: '80-100 kg/ha',
      potassium: '80-100 kg/ha'
    },
    diseases: ['Early blight', 'Late blight', 'Wilt'],
    pests: ['Fruit borer', 'Whitefly', 'Leaf miner'],
    yield: '400-500 quintals/ha',
    marketPrice: '₹20-40/kg',
    profitability: 'High (seasonal)',
    image: '/api/placeholder/300/200'
  },
  {
    id: 5,
    name: 'Potato',
    type: 'Rabi Vegetable',
    season: 'October - February',
    duration: '90-120 days',
    soilType: 'Sandy loam',
    climate: 'Cool',
    temperature: '15-25°C',
    rainfall: '60-100 cm',
    irrigation: '8-10 irrigations',
    spacing: '60 x 20 cm',
    seedRate: '2500-3000 kg/ha',
    fertilizer: {
      nitrogen: '150-180 kg/ha',
      phosphorus: '80-100 kg/ha',
      potassium: '100-120 kg/ha'
    },
    diseases: ['Late blight', 'Early blight', 'Black scurf'],
    pests: ['Cutworm', 'Aphids', 'Potato tuber moth'],
    yield: '200-300 quintals/ha',
    marketPrice: '₹15-25/kg',
    profitability: 'Medium to High',
    image: '/api/placeholder/300/200'
  }
];

export const cropSeasons = [
  {
    name: 'Kharif',
    months: 'June - October',
    description: 'Monsoon crops',
    crops: ['Rice', 'Cotton', 'Sugarcane', 'Pulses', 'Millets']
  },
  {
    name: 'Rabi',
    months: 'October - March',
    description: 'Winter crops',
    crops: ['Wheat', 'Gram', 'Mustard', 'Peas', 'Barley']
  },
  {
    name: 'Zaid',
    months: 'April - June',
    description: 'Summer crops',
    crops: ['Watermelon', 'Cucumber', 'Muskmelon', 'Bitter gourd']
  }
];

export const cropCategories = [
  'All',
  'Cereals',
  'Pulses',
  'Oilseeds',
  'Cash Crops',
  'Vegetables',
  'Fruits',
  'Spices'
];
