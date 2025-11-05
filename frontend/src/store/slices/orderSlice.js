import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  stats: {
    totalSpent: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.orders;
      state.stats = action.payload.stats || state.stats;
      state.loading = false;
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      state.stats.totalOrders += 1;
      state.stats.totalSpent += action.payload.finalAmount;
      state.stats.pendingOrders += 1;
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(o => o._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrder,
  setLoading,
  setError,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrderStats = (state) => state.orders.stats;
