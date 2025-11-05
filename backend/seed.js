require('dotenv').config();
const mongoose = require('mongoose');
const Fertilizer = require('./models/Fertilizer');
const Pest = require('./models/Pest');
const Scheme = require('./models/Scheme');
const Product = require('./models/Product');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

// Sample Fertilizer Data
const sampleFertilizers = [
  {
    name: 'Urea',
    description: 'High nitrogen content for vegetative growth. Essential for promoting leaf development and improving crop yield.',
    type: 'Nitrogenous',
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
    type: 'Phosphatic',
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
    type: 'Potassic',
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
    type: 'Complex',
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
    type: 'Organic',
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
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    description: 'Larvae feed on cotton bolls and other crops. Causes significant damage to flowers, buds, and fruits.',
    affectedCrops: ['Cotton', 'Chickpea', 'Tomato', 'Okra'],
    severity: 'High',
    symptoms: ['Holes in bolls', 'Damaged flower buds', 'Fruit drop', 'Reduced yield'],
    controlMeasures: {
      cultural: ['Pheromone traps', 'Crop rotation', 'Early sowing', 'Remove crop residues'],
      biological: ['Release Trichogramma wasps', 'Apply NPV (Nuclear Polyhedrosis Virus)'],
      chemical: ['Emamectin Benzoate 5% SG', 'Spinosad 45% SC', 'Neem-based pesticides']
    },
    preventiveMeasures: ['Monitor fields regularly', 'Destroy affected plant parts'],
    identificationTips: 'Look for inverted Y-shaped marking on larval head',
    seasonalOccurrence: 'Throughout the year, peak during monsoon',
    economicThreshold: '5% plants with fresh damage symptoms'
  },
  {
    name: 'Aphids',
    scientificName: 'Aphis spp.',
    description: 'Small insects that suck sap from plants. Causes curling, yellowing of leaves and stunted growth.',
    affectedCrops: ['Mustard', 'Wheat', 'Cotton', 'Vegetables'],
    severity: 'Medium',
    symptoms: ['Curled leaves', 'Honeydew secretion', 'Yellowing', 'Stunted growth'],
    controlMeasures: {
      cultural: ['Yellow sticky traps', 'Proper plant spacing', 'Remove weeds', 'Use resistant varieties'],
      biological: ['Release ladybird beetles', 'Encourage syrphid flies', 'Neem oil spray'],
      chemical: ['Imidacloprid 17.8% SL', 'Spinosad 45% SC', 'Garlic extract']
    },
    preventiveMeasures: ['Balanced fertilization', 'Avoid excess nitrogen'],
    identificationTips: 'Small, soft-bodied insects in colonies on tender shoots',
    seasonalOccurrence: 'Winter months',
    economicThreshold: '5-10% infested plants'
  },
  {
    name: 'Whitefly',
    scientificName: 'Bemisia tabaci',
    description: 'Tiny, winged insects that transmit plant viruses. Causes yellowing and sooty mold formation.',
    affectedCrops: ['Cotton', 'Tomato', 'Brinjal', 'Chilli'],
    severity: 'High',
    symptoms: ['Yellowing leaves', 'Sooty mold', 'Virus transmission', 'Leaf drop'],
    controlMeasures: {
      cultural: ['Yellow sticky traps', 'Field hygiene', 'Crop rotation', 'Remove alternate hosts'],
      biological: ['Release Encarsia parasitoids', 'Encourage lacewings'],
      chemical: ['Thiamethoxam', 'Neonicotinoids', 'Pyrethroids', 'Neem oil spray']
    },
    preventiveMeasures: ['Regular monitoring', 'Use resistant varieties'],
    identificationTips: 'White winged adults fly off when disturbed',
    seasonalOccurrence: 'Warm, dry periods',
    economicThreshold: '5-10 adults per plant'
  },
  {
    name: 'Thrips',
    scientificName: 'Thrips tabaci',
    description: 'Minute insects causing silvering and distortion of leaves. Affects flowering and fruit set.',
    affectedCrops: ['Onion', 'Chilli', 'Cotton', 'Garlic'],
    severity: 'Medium',
    symptoms: ['Silvering of leaves', 'Flower abortion', 'Deformed fruits', 'Reduced yield'],
    controlMeasures: {
      cultural: ['Blue sticky traps', 'Proper irrigation', 'Crop rotation', 'Field sanitation'],
      biological: ['Predatory mites', 'Beauveria bassiana applications'],
      chemical: ['Fipronil', 'Spinosad', 'Imidacloprid', 'Azadirachtin']
    },
    preventiveMeasures: ['Avoid water stress', 'Remove weeds'],
    identificationTips: 'Slender insects that feed on leaf undersides',
    seasonalOccurrence: 'Dry and warm periods',
    economicThreshold: '10 thrips per leaf'
  },
  {
    name: 'Armyworm',
    scientificName: 'Spodoptera litura',
    description: 'Caterpillars that feed on leaves and stems, often in large groups. Causes severe defoliation.',
    affectedCrops: ['Maize', 'Rice', 'Sorghum', 'Wheat'],
    severity: 'High',
    symptoms: ['Defoliation', 'Ragged holes in leaves', 'Skeletonized leaves', 'Crop loss'],
    controlMeasures: {
      cultural: ['Deep ploughing', 'Light traps', 'Crop rotation', 'Remove egg masses'],
      biological: ['Release Trichogramma', 'Use NPV formulations'],
      chemical: ['Chlorantraniliprole', 'Chlorpyriphos', 'Quinalphos', 'Indoxacarb']
    },
    preventiveMeasures: ['Avoid late sowing', 'Monitor for egg masses'],
    identificationTips: 'Dark stripe along larval body with inverted Y on head',
    seasonalOccurrence: 'Post-monsoon months',
    economicThreshold: 'One egg mass per 20 plants'
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

// Sample User Data
const sampleUsers = [
  {
    name: 'Demo Farmer',
    email: 'farmer@example.com',
    password: 'password123',
    role: 'Farmer',
    contact: '+91-9876543210',
    location: 'Sample Village'
  },
  {
    name: 'Demo Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'Buyer',
    contact: '+91-9123456780',
    location: 'Metro City'
  }
];

// Sample Product Data (Vegetables)
const sampleProducts = [
  {
    name: 'Tomato',
    description: 'Fresh, juicy tomatoes perfect for salads and cooking. Rich in Vitamin C and lycopene. Locally grown and organic.',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
    stock: 100,
    category: 'Vegetables',
    unit: 'kg',
    discount: 8,
    rating: 4.6,
    reviews: 248,
    organic: true
  },
  {
    name: 'Potato',
    description: 'Premium quality potatoes suitable for all cooking methods. Good source of potassium and Vitamin C. Fresh from farm.',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1604908177579-529fea0b14df?auto=format&fit=crop&w=800&q=80',
    stock: 150,
    category: 'Vegetables',
    unit: 'kg',
    discount: 5,
    rating: 4.3,
    reviews: 189,
    organic: false
  },
  {
    name: 'Onion',
    description: 'Fresh onions with strong flavor. Essential ingredient in Indian cuisine. Rich in antioxidants and natural preservative.',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    stock: 200,
    category: 'Vegetables',
    unit: 'kg',
    discount: 0,
    rating: 4.4,
    reviews: 312,
    organic: false
  },
  {
    name: 'Carrot',
    description: 'Sweet and crunchy carrots. Excellent source of beta-carotene and Vitamin A. Great for salads, juices, and cooking.',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80',
    stock: 80,
    category: 'Vegetables',
    unit: 'kg',
    discount: 12,
    rating: 4.7,
    reviews: 205,
    organic: true
  },
  {
    name: 'Cauliflower',
    description: 'Fresh white cauliflower heads. Low in calories and high in fiber. Perfect for curries and stir-fries. Organic produce.',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1584270354949-1f5bea2c9f2d?auto=format&fit=crop&w=800&q=80',
    stock: 70,
    category: 'Vegetables',
    unit: 'piece',
    discount: 10,
    rating: 4.5,
    reviews: 176,
    organic: true
  },
  {
    name: 'Cabbage',
    description: 'Crisp and fresh cabbage heads. High in Vitamin K and fiber. Perfect for salads and traditional dishes.',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-399372c8cf8d?auto=format&fit=crop&w=800&q=80',
    stock: 120,
    category: 'Vegetables',
    unit: 'piece',
    discount: 6,
    rating: 4.2,
    reviews: 143,
    organic: false
  },
  {
    name: 'Brinjal',
    description: 'Fresh purple brinjal. Rich in fiber and antioxidants. Staple in Indian cooking, especially for curries and bharta.',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    stock: 90,
    category: 'Vegetables',
    unit: 'kg',
    discount: 9,
    rating: 4.3,
    reviews: 167,
    organic: true
  },
  {
    name: 'Capsicum',
    description: 'Colorful bell peppers - green, red, and yellow. Rich in Vitamin C and antioxidants. Perfect for stir-fries and salads.',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=800&q=80',
    stock: 60,
    category: 'Vegetables',
    unit: 'kg',
    discount: 15,
    rating: 4.8,
    reviews: 154,
    organic: true
  },
  {
    name: 'Spinach',
    description: 'Fresh leafy spinach packed with iron and essential vitamins. Perfect for salads, curries, and smoothies.',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    stock: 110,
    category: 'Leafy Greens',
    unit: 'bunch',
    discount: 5,
    rating: 4.6,
    reviews: 132,
    organic: true
  },
  {
    name: 'Broccoli',
    description: 'Crunchy broccoli florets rich in antioxidants. Ideal for steaming, roasting, and stir-fries.',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1582515073490-d78086eea66c?auto=format&fit=crop&w=800&q=80',
    stock: 55,
    category: 'Vegetables',
    unit: 'kg',
    discount: 10,
    rating: 4.7,
    reviews: 98,
    organic: true
  },
  {
    name: 'Pumpkin',
    description: 'Sweet and tender pumpkin slices perfect for soups, curries, and desserts.',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1601000937797-8ad275bafd0c?auto=format&fit=crop&w=800&q=80',
    stock: 75,
    category: 'Vegetables',
    unit: 'kg',
    discount: 7,
    rating: 4.1,
    reviews: 76,
    organic: false
  },
  {
    name: 'Bitter Gourd',
    description: 'Fresh bitter gourd packed with nutrients. Great for traditional recipes and healthy juices.',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1622050812023-62c13c2b9034?auto=format&fit=crop&w=800&q=80',
    stock: 65,
    category: 'Vegetables',
    unit: 'kg',
    discount: 11,
    rating: 4.0,
    reviews: 88,
    organic: true
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
    await User.deleteMany({});
    console.log('Existing data cleared');

    // Insert new data
    console.log('Inserting sample data...');

    const createdUsers = [];
    for (const userData of sampleUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = new User(userData);
        await user.save();
      }
      createdUsers.push(user);
    }
    console.log(`✓ Users ensured (${createdUsers.length})`);

    await Fertilizer.insertMany(sampleFertilizers);
    console.log('✓ Fertilizers inserted');

    await Pest.insertMany(samplePests);
    console.log('✓ Pests inserted');

    await Scheme.insertMany(sampleSchemes);
    console.log('✓ Schemes inserted');

    const seller = createdUsers.find(user => user.role === 'Farmer');
    if (!seller) {
      throw new Error('No farmer user available to assign as product seller');
    }

    const productsWithSeller = sampleProducts.map(product => ({
      ...product,
      seller: seller._id
    }));

    await Product.insertMany(productsWithSeller);
    console.log('✓ Products inserted');

    console.log('\n✅ Data Imported Successfully!');
    console.log(`   - ${sampleFertilizers.length} Fertilizers`);
    console.log(`   - ${samplePests.length} Pests`);
    console.log(`   - ${sampleSchemes.length} Schemes`);
    console.log(`   - ${sampleProducts.length} Products`);
    console.log(`   - ${createdUsers.length} Users (ensured)`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

// Run the seeding function
importData();

