# AgriSmart Frontend Architecture

## Technology Stack

- **React 18.x** - Component library
- **Vite** - Build tool and dev server
- **Material-UI (MUI) v5** - Component library
- **Tailwind CSS v3** - Utility-first CSS
- **React Router v6** - Routing
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching
- **React Hook Form** - Form handling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Socket.io-client** - Real-time updates

## Project Structure

```
frontend/
├── public/
│   ├── images/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── marketplace/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   ├── CartModal.jsx
│   │   │   └── CheckoutForm.jsx
│   │   ├── dashboard/
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── BuyerDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   └── features/
│   │       ├── DiseaseScan.jsx
│   │       ├── SoilAnalyzer.jsx
│   │       ├── WeatherWidget.jsx
│   │       └── PriceTrends.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Marketplace.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   └── Tools.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   └── weather.service.js
│   ├── store/
│   │   ├── index.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   └── productSlice.js
│   │   └── api/
│   │       ├── authApi.js
│   │       └── productApi.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useDebounce.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── tailwind.css
│   │   └── mui-theme.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Component Architecture

### Core Components

#### Layout Component
```jsx
// components/common/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
```

#### Protected Route Component
```jsx
// components/auth/ProtectedRoute.jsx
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

## State Management

### Redux Store Configuration
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
```

### RTK Query API Setup
```javascript
// store/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    // Endpoints defined here
  }),
});
```

## Routing Structure

```javascript
// App.jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="product/:id" element={<ProductDetail />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Farmer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Farmer']} />}>
          <Route path="my-products" element={<MyProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="soil-analysis" element={<SoilAnalysis />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="admin/*" element={<AdminPanel />} />
        </Route>
      </Route>
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
```

## MUI Theme Configuration

```javascript
// styles/mui-theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green for agriculture
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6F00', // Orange accent
      light: '#FFB300',
      dark: '#E65100',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

## Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5E9',
          500: '#4CAF50',
          700: '#388E3C',
        },
        secondary: {
          500: '#FF6F00',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

## Key Features Implementation

### 1. Responsive Product Grid
```jsx
const ProductGrid = ({ products }) => {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};
```

### 2. Real-time Price Updates
```javascript
// hooks/useWebSocket.js
const useWebSocket = (url) => {
  useEffect(() => {
    const socket = io(url);
    
    socket.on('price:update', (data) => {
      dispatch(updatePrice(data));
    });
    
    return () => socket.disconnect();
  }, [url]);
};
```

### 3. Image Upload with Preview
```jsx
const ImageUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState([]);
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
    onUpload(files);
  };
  
  return (
    <Box>
      <input type="file" multiple onChange={handleFileSelect} />
      <Grid container spacing={2}>
        {preview.map((url, i) => (
          <Grid item xs={3} key={i}>
            <img src={url} className="w-full h-32 object-cover rounded" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
```

### 4. Advanced Filter Component
```jsx
const ProductFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    organic: false,
    rating: 0,
  });
  
  return (
    <Paper className="p-4">
      <Typography variant="h6">Filters</Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box mt={2}>
        <Typography>Price Range</Typography>
        <Slider
          value={filters.priceRange}
          onChange={(e, value) => updateFilter('priceRange', value)}
          valueLabelDisplay="auto"
          max={10000}
        />
      </Box>
      
      <FormControlLabel
        control={
          <Switch
            checked={filters.organic}
            onChange={(e) => updateFilter('organic', e.target.checked)}
          />
        }
        label="Organic Only"
      />
    </Paper>
  );
};
```

## Performance Optimization

### 1. Code Splitting
```javascript
// Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Wrap with Suspense
<Suspense fallback={<Loader />}>
  <Dashboard />
</Suspense>
```

### 2. Image Optimization
```jsx
const OptimizedImage = ({ src, alt, ...props }) => {
  const [loading, setLoading] = useState(true);
  
  return (
    <Box position="relative">
      {loading && <Skeleton variant="rectangular" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        {...props}
      />
    </Box>
  );
};
```

### 3. Memoization
```jsx
const ProductList = memo(({ products }) => {
  return products.map(product => (
    <ProductCard key={product.id} product={product} />
  ));
}, (prevProps, nextProps) => {
  return prevProps.products.length === nextProps.products.length;
});
```

## Testing Strategy

### Unit Testing
```javascript
// components/__tests__/ProductCard.test.jsx
describe('ProductCard', () => {
  it('should display product information', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });
});
```

### Integration Testing
```javascript
// pages/__tests__/Marketplace.test.jsx
describe('Marketplace', () => {
  it('should filter products by category', async () => {
    render(<Marketplace />);
    const filter = screen.getByRole('combobox', { name: /category/i });
    userEvent.selectOptions(filter, 'Vegetables');
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(5);
    });
  });
});
```

## Accessibility Features

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- Alt text for images
- Semantic HTML structure
- Skip navigation links

## Progressive Web App Configuration

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AgriSmart',
        short_name: 'AgriSmart',
        theme_color: '#2E7D32',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
};
```

## Deployment Configuration

### Environment Variables
```env
VITE_API_URL=https://api.agrismart.com
VITE_WEATHER_API_KEY=your_api_key
VITE_GOOGLE_MAPS_KEY=your_maps_key
VITE_CLOUDINARY_URL=your_cloudinary_url
VITE_SOCKET_URL=wss://api.agrismart.com
```

### Build Optimization
```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --mode analyze",
    "build:staging": "vite build --mode staging"
  }
}
```
