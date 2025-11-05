# AgriSmart Master Implementation Prompts

## 🚀 Complete Application Setup Prompt

```
You are an expert MERN stack developer. Create a complete AgriSmart agricultural platform with the following specifications:

TECH STACK:
- Backend: Node.js, Express.js, MongoDB with Mongoose, JWT auth, Redis caching
- Frontend: React with Vite, Material-UI, Tailwind CSS, Redux Toolkit, RTK Query
- Services: Socket.io for real-time, Bull for job queues, Sharp for images
- External: OpenWeatherMap API, ML model for disease detection

CORE FEATURES TO IMPLEMENT:

1. AUTHENTICATION & AUTHORIZATION
- Multi-role system (Farmer, Buyer, Admin, Expert)
- JWT with refresh tokens
- Role-based route protection
- Password reset flow
- Profile management with image upload

2. MARKETPLACE
- Product CRUD with farmer authorization
- Advanced search/filter/sort
- B2C and B2B order flows  
- Shopping cart with real-time updates
- Order tracking and invoice generation
- Rating and review system

3. AI FEATURES
- Plant disease detection from leaf images
- Crop recommendations based on region/soil/season
- Soil health analysis with NPK inputs
- Fertilizer recommendations

4. AGRICULTURAL TOOLS
- Weather integration with 7-day forecast
- Price trends with charts
- Smart irrigation scheduling
- Pest/disease alerts
- Government schemes database

5. REAL-TIME FEATURES
- Price updates via WebSocket
- Order status notifications
- Chat between farmers and buyers
- Alert broadcasts

REQUIREMENTS:
- Responsive design (mobile-first)
- PWA capabilities
- Offline support for critical features
- Multi-language support (English, Hindi, regional)
- Performance optimized (lazy loading, caching)
- Security best practices (rate limiting, input validation)
- Comprehensive error handling
- Logging and monitoring
- Unit and integration tests
- API documentation
- Deployment ready (Docker, CI/CD)

Please create the complete folder structure, all necessary files, and implement the core functionality with production-ready code.
```

## 📁 Database Schema Generation Prompt

```
Create complete Mongoose schemas for an agricultural platform with the following requirements:

COLLECTIONS NEEDED:
1. Users - Multi-role (Farmer/Buyer/Admin/Expert), addresses, bank details, preferences
2. Products - With seller reference, categories, images, organic certification
3. Orders - B2C/B2B support, embedded items, status tracking
4. DiseaseScan - AI results, expert review, treatment plans  
5. SoilReport - NPK levels, health score, recommendations
6. CropRecommendation - Region/season/soil based
7. WeatherForecast - Location-based, agricultural metrics
8. PriceTrend - Historical data, market-wise
9. PestDiseaseAlert - Regional broadcasts
10. IrrigationSchedule - Crop-specific, weather-adjusted
11. GovernmentScheme - Eligibility, documents, deadlines
12. Notification - Multi-channel, role-based

REQUIREMENTS:
- Proper indexes for performance (single, compound, text)
- Validation rules with custom validators
- Pre/post hooks for business logic
- Soft delete functionality
- Timestamps on all models
- Proper relationships (embedded vs referenced)
- Virtual fields where needed
- Instance and static methods
- Password hashing with bcrypt
- Audit trail fields

Generate complete schema files with all fields, types, validations, indexes, and methods.
```

## 🎨 Frontend UI Components Prompt

```
Create a modern, beautiful React component library for AgriSmart using Material-UI and Tailwind CSS:

COMPONENTS NEEDED:

1. LAYOUT COMPONENTS
- Responsive header with role-based navigation
- Sidebar with collapsible menu
- Footer with links and social media
- Dashboard layouts for each role

2. MARKETPLACE COMPONENTS  
- ProductCard with hover effects and quick actions
- ProductGrid with view toggle (grid/list)
- FilterSidebar with price slider, categories
- CartModal with quantity controls
- CheckoutStepper with address/payment

3. FEATURE COMPONENTS
- DiseaseScanner with camera/upload, results display
- SoilAnalyzer with input forms, health gauge
- WeatherWidget with forecast cards
- PriceTrendChart with interactive graphs
- IrrigationScheduler with calendar view

4. COMMON COMPONENTS
- SearchBar with autocomplete
- DataTable with sorting/pagination  
- ImageUpload with preview/crop
- NotificationBell with dropdown
- LoadingSpinner with skeleton screens
- ErrorBoundary with fallback UI
- ConfirmDialog for actions
- Toast notifications

DESIGN REQUIREMENTS:
- Green agricultural theme (#2E7D32 primary)
- Clean, modern aesthetic
- Smooth animations and transitions  
- Mobile-responsive (breakpoints: sm/md/lg/xl)
- Accessibility compliant (ARIA labels, keyboard nav)
- Dark mode support
- RTL language support
- Optimized performance (memo, lazy loading)

Include complete JSX, styling, PropTypes, and usage examples.
```

## 🔌 API Endpoints Implementation Prompt

```
Implement comprehensive REST APIs for AgriSmart with Express.js:

ENDPOINT CATEGORIES:

1. AUTH ENDPOINTS (/api/auth)
- POST /register - Multi-role registration
- POST /login - JWT token generation
- POST /refresh - Refresh token
- POST /logout - Clear tokens
- POST /forgot-password - OTP generation
- POST /reset-password - Password update
- POST /verify-email - Email verification

2. PRODUCT ENDPOINTS (/api/products)
- GET / - List with filters, search, pagination
- GET /:id - Product details with seller info
- POST / - Create product (Farmer only)
- PUT /:id - Update product
- DELETE /:id - Soft delete
- POST /:id/images - Upload images
- GET /trending - Trending products
- GET /recommendations - Personalized

3. ORDER ENDPOINTS (/api/orders)
- POST / - Create order with validation
- GET / - User orders with filters
- GET /:id - Order details
- PUT /:id/status - Update status
- POST /:id/cancel - Cancel order
- GET /analytics - Sales analytics

4. AGRICULTURAL ENDPOINTS
- POST /disease/scan - ML disease detection
- POST /soil/analyze - Health score calculation
- GET /crops/recommendations - Smart suggestions
- GET /weather/forecast - 7-day forecast
- GET /prices/trends - Market prices
- POST /irrigation/schedule - Generate plan

REQUIREMENTS FOR EACH ENDPOINT:
- Request validation with Joi
- Authentication middleware
- Role-based authorization
- Error handling with try-catch
- Response formatting (status, message, data)
- Caching with Redis where applicable
- Rate limiting
- File upload handling with Multer
- Pagination support
- Search functionality
- Sorting options
- Transaction support for critical operations
- Webhook triggers
- Logging

Generate complete controller and route files with all middleware.
```

## 🤖 AI/ML Integration Prompt

```
Implement AI-powered features for agricultural insights:

1. PLANT DISEASE DETECTION SYSTEM
Create a complete pipeline for disease detection:
- Image upload and preprocessing (resize to 224x224)
- Integration with TensorFlow.js or custom Python ML API
- Support for multiple crop types
- Confidence scoring and severity assessment
- Disease information from knowledge base
- Treatment recommendations (organic and chemical)
- Expert review workflow
- Historical tracking and patterns

2. CROP RECOMMENDATION ENGINE
Build intelligent crop suggestions:
- Input: location, season, soil type, water availability, investment
- ML model or decision tree implementation
- Market demand integration
- Profitability scoring
- Risk assessment
- Success rate based on historical data
- Companion planting suggestions
- Rotation recommendations

3. SOIL HEALTH ANALYZER
Develop soil analysis system:
- NPK and micronutrient input processing
- Health score calculation algorithm
- Deficiency detection
- Fertilizer quantity calculations
- Amendment recommendations
- pH balance suggestions
- Organic matter improvements
- Crop-specific preparations

4. PRICE PREDICTION MODEL
Implement price forecasting:
- Time-series analysis with ARIMA/LSTM
- Seasonal pattern detection
- Market trend analysis
- External factor integration (weather, demand)
- Confidence intervals
- Selling time recommendations

5. PEST/DISEASE PREDICTION
Create early warning system:
- Weather pattern analysis
- Historical outbreak data
- Risk scoring by region
- Preventive measure suggestions
- Alert generation logic

Include model training code, API integration, and result visualization.
```

## 📊 Analytics Dashboard Prompt

```
Create comprehensive analytics dashboards for different user roles:

1. FARMER DASHBOARD
- Sales overview (daily/weekly/monthly)
- Product performance metrics
- Order analytics with charts
- Revenue trends and projections
- Customer insights
- Inventory management
- Disease scan history
- Soil health tracking
- Weather impact analysis
- Profit/loss statements

2. BUYER DASHBOARD  
- Purchase history with filters
- Spending analytics
- Favorite products/sellers
- Price comparison tools
- Order tracking map
- Saved addresses
- Payment methods
- Wishlist management

3. ADMIN DASHBOARD
- Platform statistics (users, transactions, revenue)
- User growth charts
- Product category performance
- Geographic distribution maps
- Disease detection accuracy
- System health metrics
- Error logs and monitoring
- Content moderation queue
- Financial reports
- User behavior analytics

VISUALIZATION REQUIREMENTS:
- Interactive charts using Chart.js/Recharts
- Real-time data updates
- Export functionality (PDF, Excel)
- Responsive grid layouts
- Date range filters
- Comparison tools
- Drill-down capabilities
- Custom metrics builder
- Scheduled report generation
- Mobile-optimized views

Generate complete dashboard components with data fetching and visualization.
```

## 🔒 Security Implementation Prompt

```
Implement comprehensive security measures for AgriSmart:

1. AUTHENTICATION SECURITY
- Secure password hashing (bcrypt with salt rounds)
- JWT implementation with refresh tokens
- Token rotation strategy
- Session management
- Account lockout after failed attempts
- Two-factor authentication
- OAuth integration (Google, Facebook)
- Biometric authentication support

2. API SECURITY
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting per endpoint
- API key management
- Request signing
- IP whitelisting for admin

3. DATA SECURITY
- Encryption at rest (sensitive data)
- Encryption in transit (HTTPS)
- PII data masking
- Secure file upload validation
- Database connection security
- Environment variable protection
- Secrets management

4. APPLICATION SECURITY
- Content Security Policy headers
- CORS configuration
- Helmet.js integration
- Security audit logging
- Vulnerability scanning
- Dependency updates
- Code obfuscation
- Error message sanitization

5. COMPLIANCE
- GDPR compliance features
- Data retention policies
- User consent management
- Audit trails
- Right to deletion
- Data export functionality

Generate complete security middleware, utilities, and configuration files.
```

## 🚢 Deployment & DevOps Prompt

```
Setup complete deployment pipeline for AgriSmart:

1. CONTAINERIZATION
- Dockerfile for backend with multi-stage build
- Dockerfile for frontend with nginx
- docker-compose.yml for local development
- docker-compose.prod.yml for production
- Volume management for uploads
- Network configuration
- Environment variable handling

2. CI/CD PIPELINE
- GitHub Actions workflow
- Automated testing (unit, integration, e2e)
- Code quality checks (ESLint, Prettier)
- Security scanning
- Build optimization
- Deployment triggers
- Rollback mechanisms
- Notification on failure

3. CLOUD DEPLOYMENT
- Backend deployment to AWS/Heroku/Railway
- Frontend deployment to Vercel/Netlify
- Database hosting on MongoDB Atlas
- Redis on Redis Labs
- File storage on S3/Cloudinary
- CDN configuration
- Load balancer setup
- Auto-scaling rules

4. MONITORING & LOGGING
- Application monitoring (New Relic/DataDog)
- Error tracking (Sentry)
- Log aggregation (LogStash/CloudWatch)
- Performance monitoring
- Uptime monitoring
- Alert configuration
- Custom metrics
- Dashboard creation

5. INFRASTRUCTURE AS CODE
- Terraform configuration
- Kubernetes manifests
- Helm charts
- Service mesh setup
- Secret management
- Backup strategies
- Disaster recovery plan

Generate all configuration files, scripts, and documentation.
```

## 🧪 Testing Strategy Prompt

```
Implement comprehensive testing for AgriSmart:

1. UNIT TESTS
- Model validation tests
- Controller logic tests
- Service function tests
- Utility function tests
- Component rendering tests
- Redux store tests
- Custom hook tests
- Coverage target: 80%

2. INTEGRATION TESTS
- API endpoint tests
- Database operation tests
- Authentication flow tests
- File upload tests
- Payment processing tests
- Email/SMS delivery tests
- Third-party API tests

3. E2E TESTS
- User registration flow
- Product listing and purchase
- Disease detection workflow
- Dashboard interactions
- Multi-role scenarios
- Mobile responsiveness
- Cross-browser testing
- Performance testing

4. TEST UTILITIES
- Fixture generators
- Mock data factories
- Test database seeders
- API client for testing
- Custom matchers
- Test helpers
- Performance benchmarks

5. TESTING TOOLS
- Jest for unit tests
- Supertest for API tests
- React Testing Library
- Cypress/Playwright for E2E
- K6 for load testing
- Lighthouse for performance
- SonarQube for code quality

Generate complete test suites with setup, teardown, and assertions.
```

## 📱 Mobile App Development Prompt

```
Create a React Native mobile app for AgriSmart:

1. CORE FEATURES
- Cross-platform (iOS & Android)
- Native performance optimization
- Offline-first architecture
- Background sync
- Push notifications
- Biometric authentication
- Camera integration
- GPS location services
- Multi-language support

2. SCREENS TO IMPLEMENT
- Onboarding flow
- Login/Register
- Home dashboard
- Product marketplace
- Product scanner (barcode)
- Disease scanner (camera)
- Order tracking
- Chat interface
- Profile management
- Settings

3. MOBILE-SPECIFIC FEATURES
- Gesture navigation
- Pull to refresh
- Infinite scroll
- Image caching
- Local database (Realm/SQLite)
- Deep linking
- App shortcuts
- Widget support
- Share functionality
- Voice commands

4. OPTIMIZATION
- Code splitting
- Lazy loading
- Image optimization
- Bundle size reduction
- Memory management
- Battery optimization
- Network optimization
- Crash reporting

Generate complete React Native app with navigation, state management, and native modules.
```

## 🎯 Performance Optimization Prompt

```
Optimize AgriSmart for maximum performance:

1. BACKEND OPTIMIZATION
- Database query optimization with proper indexes
- Query result caching with Redis
- Connection pooling
- Aggregation pipeline optimization
- Pagination implementation
- Lazy loading relationships
- Background job processing
- CDN for static assets
- Compression (gzip/brotli)
- HTTP/2 support

2. FRONTEND OPTIMIZATION
- Code splitting and lazy loading
- Bundle size optimization
- Tree shaking
- Image optimization (WebP, lazy load)
- Virtual scrolling for lists
- Debouncing and throttling
- Memoization strategies
- Service worker caching
- Prefetching strategies
- Critical CSS inlining

3. CACHING STRATEGIES
- Browser caching headers
- Redis caching layers
- CDN caching
- API response caching
- Database query caching
- Static asset caching
- Session caching
- Full-page caching

4. MONITORING & METRICS
- Performance budgets
- Lighthouse CI integration
- Real user monitoring (RUM)
- Application Performance Monitoring (APM)
- Database slow query logs
- API response time tracking
- Frontend performance tracking
- Error rate monitoring

Generate optimized code, configuration files, and performance testing scripts.
```

## 📝 Documentation Generation Prompt

```
Create comprehensive documentation for AgriSmart:

1. API DOCUMENTATION
- OpenAPI/Swagger specification
- Postman collection with examples
- Authentication guide
- Rate limiting documentation
- Error codes reference
- Webhook documentation
- WebSocket events guide
- SDK documentation

2. DEVELOPER DOCUMENTATION
- Architecture overview
- Setup and installation guide
- Environment configuration
- Database schema documentation
- Code style guide
- Git workflow
- Testing guide
- Deployment guide
- Troubleshooting guide

3. USER DOCUMENTATION
- User manual for farmers
- Buyer guide
- Admin handbook
- Video tutorials
- FAQ section
- Feature walkthroughs
- Best practices
- Tips and tricks

4. TECHNICAL SPECIFICATIONS
- System requirements
- Performance benchmarks
- Security policies
- Data privacy policy
- Terms of service
- API rate limits
- SLA documentation
- Backup and recovery procedures

Generate all documentation with examples, diagrams, and code snippets.
```

## 🔄 Real-time Features Prompt

```
Implement real-time capabilities using Socket.io:

1. REAL-TIME UPDATES
- Live price updates for crops
- Order status notifications
- New product alerts
- Inventory updates
- Disease detection results
- Weather alerts
- Pest outbreak warnings

2. CHAT SYSTEM
- Farmer-buyer direct messaging
- Group chat for communities
- Expert consultation chat
- Support chat
- Message delivery status
- Typing indicators
- Read receipts
- File sharing
- Voice messages

3. LIVE TRACKING
- Order delivery tracking
- Field activity monitoring
- Irrigation system status
- Weather radar updates
- Market activity feed
- User presence indicators

4. COLLABORATIVE FEATURES
- Shared farming calendars
- Community boards
- Expert Q&A sessions
- Live auctions
- Group buying clubs
- Knowledge sharing

5. NOTIFICATION SYSTEM
- Push notifications (web/mobile)
- Email notifications
- SMS alerts
- In-app notifications
- Notification preferences
- Batch notifications
- Scheduled notifications

Generate complete Socket.io server and client implementation with event handlers.
```

These master prompts can be used individually or combined to build the complete AgriSmart platform. Each prompt is designed to generate production-ready code with best practices and comprehensive functionality.
