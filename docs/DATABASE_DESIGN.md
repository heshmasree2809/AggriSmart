# AgriSmart Database Design

## Database Architecture

MongoDB with Mongoose ODM following a hybrid approach of embedding and referencing for optimal performance.

## Core Collections

### 1. Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['Farmer', 'Buyer', 'Admin', 'Expert']),
  contact: String,
  address: {
    street: String,
    village: String,
    district: String,
    state: String,
    zipcode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  location: String (indexed),
  profileImage: String,
  verificationStatus: Boolean,
  rating: Number,
  totalSales: Number (for Farmers),
  totalPurchases: Number (for Buyers),
  preferences: {
    language: String,
    notifications: Boolean,
    newsletter: Boolean
  },
  bankDetails: { // For Farmers
    accountNumber: String (encrypted),
    ifsc: String,
    bankName: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email_1` (unique)
- `location_1`
- `role_1`
- `isActive_1`

### 2. Products Collection

```javascript
{
  _id: ObjectId,
  name: String (required, indexed),
  category: String (indexed),
  subcategory: String,
  description: String,
  price: Number (required),
  unit: String (enum: ['kg', 'gram', 'piece', 'dozen', 'quintal']),
  quantity: Number,
  minimumOrder: Number,
  maximumOrder: Number,
  images: [String],
  seller: ObjectId (ref: 'User', indexed),
  quality: String (enum: ['A', 'B', 'C']),
  organic: Boolean,
  harvestDate: Date,
  expiryDate: Date,
  location: {
    state: String,
    district: String,
    village: String
  },
  tags: [String],
  ratings: {
    average: Number,
    count: Number
  },
  views: Number,
  isActive: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name_text` (text search)
- `category_1_subcategory_1` (compound)
- `seller_1`
- `price_1`
- `isActive_1_category_1` (compound)

### 3. Orders Collection

```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  buyer: ObjectId (ref: 'User', indexed),
  items: [{
    product: ObjectId (ref: 'Product'),
    seller: ObjectId (ref: 'User'),
    quantity: Number,
    unit: String,
    priceAtOrder: Number,
    subtotal: Number,
    status: String (enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  }],
  totalAmount: Number,
  paymentMethod: String,
  paymentStatus: String,
  shippingAddress: {
    street: String,
    village: String,
    district: String,
    state: String,
    zipcode: String,
    phone: String
  },
  orderStatus: String,
  orderType: String (enum: ['B2C', 'B2B']),
  deliveryDate: Date,
  trackingNumber: String,
  notes: String,
  invoice: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `orderNumber_1` (unique)
- `buyer_1_createdAt_-1` (compound)
- `items.seller_1`
- `orderStatus_1`

### 4. DiseaseScan Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', indexed),
  crop: String,
  imageUrl: String,
  imageAnalysis: {
    disease: String,
    confidence: Number,
    severity: String (enum: ['low', 'medium', 'high']),
    affectedArea: Number
  },
  symptoms: [String],
  recommendedActions: [{
    type: String,
    description: String,
    priority: Number
  }],
  treatmentPlan: {
    immediate: [String],
    preventive: [String],
    organic: [String],
    chemical: [String]
  },
  expertReview: {
    reviewedBy: ObjectId (ref: 'User'),
    reviewDate: Date,
    notes: String,
    verificationStatus: Boolean
  },
  weatherAtScan: Object,
  location: Object,
  createdAt: Date
}
```

**Indexes:**
- `user_1_createdAt_-1` (compound)
- `crop_1_disease_1` (compound)

### 5. SoilReport Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', indexed),
  fieldLocation: {
    name: String,
    area: Number,
    coordinates: Object
  },
  soilParameters: {
    pH: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    organicMatter: Number,
    ec: Number,
    micronutrients: {
      zinc: Number,
      iron: Number,
      manganese: Number,
      copper: Number,
      boron: Number
    }
  },
  soilType: String,
  texture: String,
  healthScore: Number,
  recommendations: {
    fertilizers: [{
      name: String,
      quantity: Number,
      timing: String
    }],
    amendments: [String],
    crops: [String]
  },
  labReport: String,
  expertValidation: Object,
  createdAt: Date
}
```

### 6. CropRecommendation Collection

```javascript
{
  _id: ObjectId,
  region: String (indexed),
  state: String (indexed),
  district: String,
  season: String (indexed),
  soilType: String,
  waterAvailability: String,
  recommendations: [{
    crop: String,
    variety: String,
    expectedYield: Number,
    marketDemand: String,
    profitability: Number,
    sowingTime: String,
    harvestTime: String,
    reasons: [String]
  }],
  climateData: Object,
  historicalSuccess: Number,
  updatedAt: Date
}
```

### 7. WeatherForecast Collection

```javascript
{
  _id: ObjectId,
  location: String (indexed),
  coordinates: Object,
  date: Date (indexed),
  current: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    pressure: Number,
    visibility: Number,
    uvIndex: Number
  },
  forecast: [{
    date: Date,
    tempMin: Number,
    tempMax: Number,
    humidity: Number,
    precipitation: Number,
    windSpeed: Number,
    conditions: String,
    alerts: [String]
  }],
  agricultural: {
    evapotranspiration: Number,
    growingDegreeDays: Number,
    chillHours: Number,
    soilMoisture: Number
  },
  source: String,
  lastUpdated: Date
}
```

### 8. PestDiseaseAlert Collection

```javascript
{
  _id: ObjectId,
  title: String,
  type: String (enum: ['pest', 'disease', 'both']),
  severity: String,
  affectedCrops: [String],
  affectedRegions: [{
    state: String,
    districts: [String]
  }],
  description: String,
  symptoms: [String],
  preventiveMeasures: [String],
  controlMeasures: [String],
  images: [String],
  source: String,
  verifiedBy: ObjectId (ref: 'User'),
  isActive: Boolean,
  validFrom: Date,
  validTo: Date,
  createdAt: Date
}
```

### 9. IrrigationSchedule Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  field: String,
  crop: String,
  plantingDate: Date,
  cropStage: String,
  irrigationMethod: String,
  schedule: [{
    date: Date,
    waterAmount: Number,
    duration: Number,
    completed: Boolean,
    actualAmount: Number,
    notes: String
  }],
  soilMoisture: Number,
  weatherConsideration: Boolean,
  waterSource: String,
  totalWaterUsed: Number,
  createdAt: Date
}
```

### 10. GovernmentScheme Collection

```javascript
{
  _id: ObjectId,
  schemeName: String,
  schemeCode: String (unique),
  category: String,
  department: String,
  description: String,
  benefits: [String],
  eligibility: {
    farmerType: [String],
    landSize: Object,
    income: Object,
    crops: [String],
    states: [String]
  },
  documents: [String],
  applicationProcess: String,
  applicationUrl: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  contactInfo: Object,
  isActive: Boolean,
  createdAt: Date
}
```

### 11. PriceTrend Collection

```javascript
{
  _id: ObjectId,
  crop: String (indexed),
  variety: String,
  market: String,
  state: String (indexed),
  district: String,
  date: Date (indexed),
  prices: {
    min: Number,
    max: Number,
    modal: Number,
    average: Number
  },
  arrivals: Number,
  unit: String,
  grade: String,
  trend: String,
  forecast: {
    nextWeek: Number,
    nextMonth: Number
  },
  source: String,
  createdAt: Date
}
```

**Indexes:**
- `crop_1_state_1_date_-1` (compound)
- `market_1_date_-1` (compound)

### 12. Notification Collection

```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: 'User'),
  recipientRole: String,
  type: String,
  title: String,
  message: String,
  data: Object,
  priority: String,
  read: Boolean,
  readAt: Date,
  actionUrl: String,
  expiresAt: Date,
  createdAt: Date
}
```

## Relationships

### One-to-Many
- User → Products (Farmer sells many products)
- User → Orders (Buyer places many orders)
- User → DiseaseScan (Farmer performs many scans)
- User → SoilReport (Farmer has many soil reports)
- User → IrrigationSchedule (Farmer has many schedules)

### Many-to-Many
- Products ↔ Orders (through Order.items)
- Users ↔ GovernmentSchemes (eligibility-based)

### Embedded vs Referenced

**Embedded:**
- Order items in Orders (frequently accessed together)
- Address in Users (1:1 relationship)
- Schedule entries in IrrigationSchedule
- Forecast data in WeatherForecast

**Referenced:**
- User in all other collections (avoid duplication)
- Products in Order items (maintain product integrity)
- Expert reviewers in reports

## Data Integrity

### Indexes for Performance
- Single field indexes on frequently queried fields
- Compound indexes for complex queries
- Text indexes for search functionality
- Geospatial indexes for location-based queries

### Validation Rules
- Required fields enforced at schema level
- Enum values for predefined options
- Min/max values for numeric fields
- Custom validators for complex rules

### Soft Deletes
- `isActive` field for logical deletion
- `deletedAt` timestamp for audit trail
- Cascading soft deletes via middleware

### Audit Trail
- `createdAt` and `updatedAt` timestamps
- `createdBy` and `updatedBy` user references
- Change history collection for critical data
