import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Skeleton,
  Pagination,
  Fab,
  Badge,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import {
  FilterList,
  GridView,
  ViewList,
  ShoppingCart,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import { productAPI } from '../services/api';
import {
  setProducts,
  setCategories,
  setLoading,
  setError,
  setPage,
  selectProducts,
  selectPagination,
  selectFilters,
  selectProductsLoading,
  selectProductsError,
  selectCategories,
} from '../store/slices/productSlice';
import { selectCartItemsCount } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const categories = useSelector(selectCategories);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [states, setStates] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await productAPI.getAll({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.limit,
      });
      dispatch(setProducts(response.data.data));
      
      // Set available states from filters
      if (response.data.data.filters?.available?.states) {
        setStates(response.data.data.filters.available.states);
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error('Failed to fetch products');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      dispatch(setCategories(response.data.data));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (event, value) => {
    dispatch(setPage(value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Loading skeleton
  const ProductSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box>
        <Skeleton variant="rectangular" height={200} />
        <Box className="p-3">
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={36} className="mt-2" />
        </Box>
      </Box>
    </Grid>
  );

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Fresh Products
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            {pagination.totalProducts} products available
          </Typography>
        </Box>

        <Box className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="grid">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterOpen(true)}
          >
            Filters
            {Object.keys(filters).filter(k => filters[k]).length > 0 && (
              <Badge
                badgeContent={Object.keys(filters).filter(k => filters[k]).length}
                color="primary"
                className="ml-2"
              />
            )}
          </Button>

          {/* Trending Button */}
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => navigate('/products/trending')}
          >
            Trending
          </Button>
        </Box>
      </Box>

      {/* Active Filters Display */}
      {Object.keys(filters).some(k => filters[k]) && (
        <Paper className="p-3 mb-4 bg-green-50">
          <Box className="flex items-center gap-2 flex-wrap">
            <Typography variant="subtitle2" className="font-medium">
              Active Filters:
            </Typography>
            {filters.category && (
              <Chip label={`Category: ${filters.category}`} onDelete={() => dispatch(updateFilters({ category: '' }))} />
            )}
            {filters.organic && (
              <Chip label="Organic" onDelete={() => dispatch(updateFilters({ organic: false }))} />
            )}
            {filters.minPrice && (
              <Chip label={`Min: ₹${filters.minPrice}`} onDelete={() => dispatch(updateFilters({ minPrice: '' }))} />
            )}
            {filters.maxPrice && (
              <Chip label={`Max: ₹${filters.maxPrice}`} onDelete={() => dispatch(updateFilters({ maxPrice: '' }))} />
            )}
          </Box>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => dispatch(setError(null))}>
          {error}
        </Alert>
      )}

      {/* Products Grid/List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box className="text-center py-16">
              <img
                src="/empty-products.svg"
                alt="No products"
                className="w-64 mx-auto mb-4 opacity-50"
              />
              <Typography variant="h5" className="text-gray-600 mb-2">
                No products found
              </Typography>
              <Typography variant="body1" className="text-gray-500 mb-4">
                Try adjusting your filters or search criteria
              </Typography>
              <Button
                variant="contained"
                onClick={() => dispatch(clearFilters())}
                className="bg-gradient-to-r from-green-600 to-green-700"
              >
                Clear Filters
              </Button>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Grid container spacing={3}>
              {products.map((product, index) => (
                <Grid
                  item
                  key={product._id}
                  xs={12}
                  sm={viewMode === 'list' ? 12 : 6}
                  md={viewMode === 'list' ? 12 : 4}
                  lg={viewMode === 'list' ? 12 : 3}
                >
                  <ProductCard product={product} index={index} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && products.length > 0 && pagination.totalPages > 1 && (
        <Box className="flex justify-center mt-8">
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Filter Drawer */}
      <ProductFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        states={states}
      />

      {/* Floating Cart Button */}
      <Fab
        color="primary"
        className="fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-green-700"
        onClick={() => navigate('/cart')}
      >
        <Badge badgeContent={cartItemsCount} color="error">
          <ShoppingCart />
        </Badge>
      </Fab>
    </Container>
  );
};

export default ProductListing;
