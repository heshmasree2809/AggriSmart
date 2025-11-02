require('dotenv').config();
const mongoose = require('mongoose');
const Fertilizer = require('./models/Fertilizer');
const Pest = require('./models/Pest');
const Scheme = require('./models/Scheme');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI;

// Sample Fertilizer Data
const sampleFertilizers = [
  {
    name: 'Urea',
    description: 'High nitrogen content for vegetative growth. Essential for promoting leaf development and improving crop yield.',
    usage: 'Broadcast or band placement. Apply 240 kg/hectare for wheat, 120 kg/hectare for pulses.',
    npk: '46-0-0',
    price: 266.50,
    unit: 'per 45kg bag',
    benefits: ['Promotes vegetative growth', 'Enhances protein synthesis', 'Improves crop yield'],
    precautions: ['Avoid excess application', 'Don\'t apply during flowering', 'Store in dry place'],
    suitableFor: ['Wheat', 'Rice', 'Maize', 'Cotton']
  },
  {
    name: 'DAP (Diammonium Phosphate)',
    description: 'Good for root development. Promotes early crop maturity and strong root systems.',
    usage: 'Basal application at sowing time. Apply 100-150 kg/hectare.',
    npk: '18-46-0',
    price: 1350,
    unit: 'per 50kg bag',
    benefits: ['Root development', 'Early crop maturity', 'Increases flowering'],
    precautions: ['Mix well with soil', 'Keep away from seeds', 'Avoid contact with moisture'],
    suitableFor: ['All crops', 'Wheat', 'Rice', 'Pulses']
  },
  {
    name: 'MOP (Muriate of Potash)',
    description: 'Enhances disease resistance. Improves fruit quality and overall plant health.',
    usage: 'Broadcasting before planting. Apply 40-60 kg/hectare.',
    npk: '0-0-60',
    price: 1700,
    unit: 'per 50kg bag',
    benefits: ['Disease resistance', 'Improves fruit quality', 'Enhances water retention'],
    precautions: ['Not for chloride sensitive crops', 'Avoid direct contact with roots', 'Apply during early stages'],
    suitableFor: ['Fruits', 'Vegetables', 'Potato', 'Sugarcane']
  },
  {
    name: 'NPK (10:26:26)',
    description: 'Balanced complex fertilizer for overall growth. Provides complete nutrition to crops.',
    usage: 'Basal or top dressing. Apply based on soil test recommendations.',
    npk: '10-26-26',
    price: 1500,
    unit: 'per 50kg bag',
    benefits: ['Balanced nutrition', 'Increased yield', 'Better crop quality'],
    precautions: ['Apply as per soil test', 'Store in cool dry place', 'Mix before application'],
    suitableFor: ['Sugarcane', 'Potato', 'Cotton', 'Vegetables']
  },
  {
    name: 'Organic Compost',
    description: 'Enriches soil with organic matter and microbes. Natural and eco-friendly fertilizer option.',
    usage: 'Mix well with soil before planting. Apply 5-10 tonnes/hectare.',
    npk: '1-1-1',
    price: 500,
    unit: 'per 25kg bag',
    benefits: ['Improves soil structure', 'Enhances water retention', 'Eco-friendly'],
    precautions: ['Ensure proper decomposition', 'Check for weed seeds', 'Apply before monsoon'],
    suitableFor: ['All crops', 'Organic farming', 'Vegetables', 'Fruits']
  }
];

// Sample Pest Data
const samplePests = [
  {
    name: 'Bollworm',
    description: 'Larvae feed on cotton bolls and other crops. Causes significant damage to flowers, buds, and fruits.',
    affectedCrops: ['Cotton', 'Chickpea', 'Tomato', 'Okra'],
    severity: 'High',
    symptoms: ['Holes in bolls', 'Damaged flower buds', 'Fruit drop', 'Reduced yield'],
    preventiveMeasures: ['Pheromone traps', 'Crop rotation', 'Early sowing', 'Remove crop residues'],
    treatment: ['Emamectin Benzoate 5% SG', 'Spinosad 45% SC', 'Neem-based pesticides', 'Biological control with Trichogramma']
  },
  {
    name: 'Aphids',
    description: 'Small insects that suck sap from plants. Causes curling, yellowing of leaves and stunted growth.',
    affectedCrops: ['Mustard', 'Wheat', 'Cotton', 'Vegetables'],
    severity: 'Medium',
    symptoms: ['Curled leaves', 'Honeydew secretion', 'Yellowing', 'Stunted growth'],
    preventiveMeasures: ['Yellow sticky traps', 'Proper plant spacing', 'Remove weeds', 'Use resistant varieties'],
    treatment: ['Imidacloprid 17.8% SL', 'Natural predators (ladybugs)', 'Neem oil spray', 'Garlic extract']
  },
  {
    name: 'Whitefly',
    description: 'Tiny, winged insects that transmit plant viruses. Causes yellowing and sooty mold formation.',
    affectedCrops: ['Cotton', 'Tomato', 'Brinjal', 'Chilli'],
    severity: 'High',
    symptoms: ['Yellowing leaves', 'Sooty mold', 'Virus transmission', 'Leaf drop'],
    preventiveMeasures: ['Yellow sticky traps', 'Field hygiene', 'Crop rotation', 'Remove alternate hosts'],
    treatment: ['Thiamethoxam', 'Neonicotinoids', 'Pyrethroids', 'Neem oil spray']
  },
  {
    name: 'Thrips',
    description: 'Minute insects causing silvering and distortion of leaves. Affects flowering and fruit set.',
    affectedCrops: ['Onion', 'Chilli', 'Cotton', 'Garlic'],
    severity: 'Medium',
    symptoms: ['Silvering of leaves', 'Flower abortion', 'Deformed fruits', 'Reduced yield'],
    preventiveMeasures: ['Blue sticky traps', 'Proper irrigation', 'Crop rotation', 'Field sanitation'],
    treatment: ['Fipronil', 'Spinosad', 'Imidacloprid', 'Azadirachtin']
  },
  {
    name: 'Armyworm',
    description: 'Caterpillars that feed on leaves and stems, often in large groups. Causes severe defoliation.',
    affectedCrops: ['Maize', 'Rice', 'Sorghum', 'Wheat'],
    severity: 'High',
    symptoms: ['Defoliation', 'Ragged holes in leaves', 'Skeletonized leaves', 'Crop loss'],
    preventiveMeasures: ['Deep ploughing', 'Light traps', 'Crop rotation', 'Remove egg masses'],
    treatment: ['Chlorantraniliprole', 'Chlorpyriphos', 'Quinalphos', 'Biological control']
  }
];

// Sample Scheme Data
const sampleSchemes = [
  {
    title: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    description: 'Direct income support scheme providing financial assistance to small and marginal farmers.',
    eligibility: 'Small and marginal farmers with land holding up to 2 hectares. Must have valid Aadhaar card and bank account linked with Aadhaar.',
    benefits: ['₹6,000 per year', 'Three equal installments', 'Direct benefit transfer', 'No middlemen'],
    documentsRequired: ['Aadhaar card', 'Bank account details', 'Land ownership documents', 'Mobile number'],
    link: 'https://pmkisan.gov.in',
    status: 'Active'
  },
  {
    title: 'PM Fasal Bima Yojana',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support in case of crop failure due to natural calamities, pests, or diseases.',
    eligibility: 'All farmers including sharecroppers. Compulsory for loanee farmers, optional for non-loanee farmers.',
    benefits: ['Crop loss compensation', 'Low premium rates', 'Quick claim settlement', 'Coverage for all risks'],
    documentsRequired: ['Land documents', 'Bank account details', 'Crop details', 'Aadhaar card'],
    link: 'https://pmfby.gov.in',
    status: 'Active'
  },
  {
    title: 'PMKSY',
    fullName: 'Pradhan Mantri Krishi Sinchai Yojana',
    description: 'Per Drop More Crop - Scheme to improve irrigation coverage and water use efficiency through micro-irrigation.',
    eligibility: 'All farmers. Preference to small and marginal farmers. Must have legal land ownership or lease documents.',
    benefits: ['Micro-irrigation subsidy', 'Water conservation', 'Increased productivity', '55% subsidy for small farmers'],
    documentsRequired: ['Land ownership documents', 'Aadhaar card', 'Bank account', 'Project proposal'],
    link: 'https://pmksy.gov.in',
    status: 'Active'
  },
  {
    title: 'PKVY',
    fullName: 'Paramparagat Krishi Vikas Yojana',
    description: 'Promotes organic farming practices. Provides financial assistance for organic inputs and certification.',
    eligibility: 'Farmers interested in organic farming. Must join a cluster of minimum 50 farmers. Should have valid land documents.',
    benefits: ['Organic farming promotion', 'Financial assistance ₹31,000/hectare', 'Organic certification support', 'Market linkages'],
    documentsRequired: ['Land documents', 'Cluster membership proof', 'Organic farming plan', 'Bank account'],
    link: 'https://pgsindia-ncof.gov.in',
    status: 'Active'
  },
  {
    title: 'Kisan Credit Card',
    fullName: 'Kisan Credit Card Scheme',
    description: 'Credit facility for farmers to meet short-term credit requirements for cultivation and other needs with low interest rates.',
    eligibility: 'All farmers including tenant farmers and oral lessees. Age between 18-75 years. Must have valid land documents.',
    benefits: ['Short-term credit facility', 'Low interest rates (7%)', 'Flexible repayment', 'Crop insurance included'],
    documentsRequired: ['Land documents', 'Aadhaar card', 'Bank account', 'Identity proof'],
    link: 'https://www.nabard.org/content.aspx?id=518',
    status: 'Active'
  }
];

// Sample Product Data (Vegetables)
const sampleProducts = [
  {
    name: 'Tomato',
    description: 'Fresh, juicy tomatoes perfect for salads and cooking. Rich in Vitamin C and lycopene. Locally grown and organic.',
    price: 50,
    imageUrl: '/images/vegetables.png',
    stock: 100,
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    name: 'Potato',
    description: 'Premium quality potatoes suitable for all cooking methods. Good source of potassium and Vitamin C. Fresh from farm.',
    price: 30,
    imageUrl: '/images/vegetables.png',
    stock: 150,
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    name: 'Onion',
    description: 'Fresh onions with strong flavor. Essential ingredient in Indian cuisine. Rich in antioxidants and natural preservative.',
    price: 35,
    imageUrl: '/images/vegetables.png',
    stock: 200,
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    name: 'Carrot',
    description: 'Sweet and crunchy carrots. Excellent source of beta-carotene and Vitamin A. Great for salads, juices, and cooking.',
    price: 60,
    imageUrl: '/images/vegetables.png',
    stock: 80,
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    name: 'Cauliflower',
    description: 'Fresh white cauliflower heads. Low in calories and high in fiber. Perfect for curries and stir-fries. Organic produce.',
    price: 45,
    imageUrl: '/images/vegetables.png',
    stock: 70,
    category: 'Vegetables',
    unit: 'piece'
  },
  {
    name: 'Cabbage',
    description: 'Crisp and fresh cabbage heads. High in Vitamin K and fiber. Perfect for salads and traditional dishes.',
    price: 25,
    imageUrl: '/images/vegetables.png',
    stock: 120,
    category: 'Vegetables',
    unit: 'piece'
  },
  {
    name: 'Brinjal',
    description: 'Fresh purple brinjal. Rich in fiber and antioxidants. Staple in Indian cooking, especially for curries and bharta.',
    price: 40,
    imageUrl: '/images/vegetables.png',
    stock: 90,
    category: 'Vegetables',
    unit: 'kg'
  },
  {
    name: 'Capsicum',
    description: 'Colorful bell peppers - green, red, and yellow. Rich in Vitamin C and antioxidants. Perfect for stir-fries and salads.',
    price: 80,
    imageUrl: '/images/vegetables.png',
    stock: 60,
    category: 'Vegetables',
    unit: 'kg'
  }
];

// Main seeding function
async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Fertilizer.deleteMany({});
    await Pest.deleteMany({});
    await Scheme.deleteMany({});
    await Product.deleteMany({});
    console.log('Existing data cleared');

    // Insert new data
    console.log('Inserting sample data...');
    await Fertilizer.insertMany(sampleFertilizers);
    console.log('✓ Fertilizers inserted');

    await Pest.insertMany(samplePests);
    console.log('✓ Pests inserted');

    await Scheme.insertMany(sampleSchemes);
    console.log('✓ Schemes inserted');

    await Product.insertMany(sampleProducts);
    console.log('✓ Products inserted');

    console.log('\n✅ Data Imported Successfully!');
    console.log(`   - ${sampleFertilizers.length} Fertilizers`);
    console.log(`   - ${samplePests.length} Pests`);
    console.log(`   - ${sampleSchemes.length} Schemes`);
    console.log(`   - ${sampleProducts.length} Products`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

// Run the seeding function
importData();

