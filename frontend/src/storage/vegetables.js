// Vegetables Database
export const vegetablesData = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    price: 40,
    category: 'Vegetables',
    image: '/api/placeholder/300/200',
    unit: 'kg',
    description: 'Farm fresh red tomatoes, perfect for cooking and salads',
    inStock: true,
    discount: 10,
    rating: 4.5,
    reviews: 234,
    farmer: 'Green Valley Farms',
    location: 'Maharashtra',
    organic: true,
    harvestDate: '2024-01-15',
    shelfLife: '5-7 days',
    nutritionInfo: {
      calories: 18,
      protein: '0.9g',
      carbs: '3.9g',
      fiber: '1.2g',
      vitamins: ['Vitamin C', 'Vitamin K', 'Vitamin A']
    }
  },
  {
    id: 2,
    name: 'Organic Potatoes',
    price: 35,
    category: 'Vegetables',
    image: '/api/placeholder/300/200',
    unit: 'kg',
    description: 'Premium quality potatoes, ideal for multiple dishes',
    inStock: true,
    discount: 15,
    rating: 4.3,
    reviews: 189,
    farmer: 'Sunrise Organic Farm',
    location: 'Punjab',
    organic: true,
    harvestDate: '2024-01-10',
    shelfLife: '2-3 weeks',
    nutritionInfo: {
      calories: 77,
      protein: '2g',
      carbs: '17g',
      fiber: '2.2g',
      vitamins: ['Vitamin C', 'Vitamin B6', 'Potassium']
    }
  },
  {
    id: 3,
    name: 'Green Capsicum',
    price: 60,
    category: 'Vegetables',
    image: '/api/placeholder/300/200',
    unit: 'kg',
    description: 'Fresh green bell peppers, crunchy and flavorful',
    inStock: true,
    discount: 5,
    rating: 4.6,
    reviews: 156,
    farmer: 'Nature\'s Best Farm',
    location: 'Karnataka',
    organic: false,
    harvestDate: '2024-01-12',
    shelfLife: '1 week',
    nutritionInfo: {
      calories: 20,
      protein: '0.9g',
      carbs: '4.6g',
      fiber: '1.7g',
      vitamins: ['Vitamin C', 'Vitamin A', 'Vitamin B6']
    }
  },
  {
    id: 4,
    name: 'Fresh Carrots',
    price: 45,
    category: 'Vegetables',
    image: '/api/placeholder/300/200',
    unit: 'kg',
    description: 'Sweet and crunchy orange carrots, rich in vitamins',
    inStock: true,
    discount: 20,
    rating: 4.7,
    reviews: 298,
    farmer: 'Happy Harvest Farms',
    location: 'Haryana',
    organic: true,
    harvestDate: '2024-01-14',
    shelfLife: '2 weeks',
    nutritionInfo: {
      calories: 41,
      protein: '0.9g',
      carbs: '9.6g',
      fiber: '2.8g',
      vitamins: ['Vitamin A', 'Vitamin K', 'Biotin']
    }
  },
  {
    id: 5,
    name: 'Fresh Spinach',
    price: 30,
    category: 'Leafy Greens',
    image: '/api/placeholder/300/200',
    unit: 'bunch',
    description: 'Nutrient-rich green leafy vegetable',
    inStock: true,
    discount: 0,
    rating: 4.4,
    reviews: 167,
    farmer: 'Green Leaf Gardens',
    location: 'West Bengal',
    organic: true,
    harvestDate: '2024-01-16',
    shelfLife: '3-4 days',
    nutritionInfo: {
      calories: 23,
      protein: '2.9g',
      carbs: '3.6g',
      fiber: '2.2g',
      vitamins: ['Vitamin K', 'Vitamin A', 'Folate', 'Iron']
    }
  },
  {
    id: 6,
    name: 'Broccoli',
    price: 80,
    category: 'Vegetables',
    image: '/api/placeholder/300/200',
    unit: 'kg',
    description: 'Premium quality broccoli, perfect for healthy meals',
    inStock: true,
    discount: 10,
    rating: 4.8,
    reviews: 145,
    farmer: 'Valley Fresh Produce',
    location: 'Himachal Pradesh',
    organic: false,
    harvestDate: '2024-01-13',
    shelfLife: '1 week',
    nutritionInfo: {
      calories: 34,
      protein: '2.8g',
      carbs: '6.6g',
      fiber: '2.6g',
      vitamins: ['Vitamin C', 'Vitamin K', 'Folate']
    }
  },
  {
    id: 7,
    name: 'Red Onions',
    price: 25,
    category: 'Vegetables',
    image: '/api/placeholder/300/200',
    unit: 'kg',
    description: 'Fresh red onions, essential for Indian cooking',
    inStock: true,
    discount: 0,
    rating: 4.2,
    reviews: 412,
    farmer: 'Kisan Connect',
    location: 'Maharashtra',
    organic: false,
    harvestDate: '2024-01-11',
    shelfLife: '3-4 weeks',
    nutritionInfo: {
      calories: 40,
      protein: '1.1g',
      carbs: '9.3g',
      fiber: '1.7g',
      vitamins: ['Vitamin C', 'Vitamin B6', 'Folate']
    }
  },
  {
    id: 8,
    name: 'Fresh Cauliflower',
    price: 50,
    category: 'Vegetables',
    image: '/api/placeholder/300/200',
    unit: 'piece',
    description: 'White, fresh cauliflower perfect for various dishes',
    inStock: true,
    discount: 15,
    rating: 4.5,
    reviews: 223,
    farmer: 'Pure Harvest',
    location: 'Uttar Pradesh',
    organic: true,
    harvestDate: '2024-01-15',
    shelfLife: '1 week',
    nutritionInfo: {
      calories: 25,
      protein: '1.9g',
      carbs: '5g',
      fiber: '2g',
      vitamins: ['Vitamin C', 'Vitamin K', 'Vitamin B6']
    }
  }
];

export const categories = [
  'All',
  'Vegetables',
  'Leafy Greens',
  'Root Vegetables',
  'Herbs',
  'Exotic',
  'Organic',
  'Local Produce'
];

export const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'price-high', label: 'Price (High to Low)' },
  { value: 'rating', label: 'Rating' },
  { value: 'discount', label: 'Best Discount' }
];
