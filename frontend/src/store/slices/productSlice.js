import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  currentProduct: null,
  categories: [],
  filters: {
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    organic: false,
    quality: '',
    state: '',
    district: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
  featuredProducts: [],
  trendingProducts: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    setTrendingProducts: (state, action) => {
      state.trendingProducts = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateProductInList: (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProductFromList: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload);
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  setCategories,
  setFeaturedProducts,
  setTrendingProducts,
  updateFilters,
  clearFilters,
  setPage,
  setLoading,
  setError,
  updateProductInList,
  removeProductFromList,
} = productSlice.actions;

export default productSlice.reducer;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectCategories = (state) => state.products.categories;
export const selectFilters = (state) => state.products.filters;
export const selectPagination = (state) => state.products.pagination;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectFeaturedProducts = (state) => state.products.featuredProducts;
export const selectTrendingProducts = (state) => state.products.trendingProducts;
