import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Agriculture,
  Inventory,
  AttachMoney,
  Visibility,
  Add,
  Edit,
  Delete,
  MoreVert,
  CloudUpload,
  Scanner,
  Water,
  WbSunny,
  Warning,
  CheckCircle,
  Schedule,
  LocalShipping,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { productAPI, orderAPI } from '../services/api';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalViews: 0,
    outOfStock: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsRes = await productAPI.getMyProducts({ status: 'all' });
      setProducts(productsRes.data.data.products);
      setStats(prev => ({ ...prev, ...productsRes.data.data.stats }));

      // Fetch orders
      const ordersRes = await orderAPI.getSellerOrders({ limit: 5 });
      setOrders(ordersRes.data.data.orders);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  // Chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const productCategoryData = {
    labels: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Others'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#22c55e',
          '#3b82f6',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444',
        ],
      },
    ],
  };

  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    datasets: [
      {
        label: 'Orders',
        data: [5, 8, 12, 20],
        backgroundColor: ['#fbbf24', '#60a5fa', '#a78bfa', '#34d399'],
      },
    ],
  };

  // Quick Stats Card
  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-start justify-between">
          <Box>
            <Typography variant="body2" className="text-gray-600 mb-1">
              {title}
            </Typography>
            <Typography variant="h4" className="font-bold mb-1">
              {value}
            </Typography>
            {change && (
              <Box className="flex items-center gap-1">
                {change > 0 ? (
                  <TrendingUp className="text-green-500" fontSize="small" />
                ) : (
                  <TrendingDown className="text-red-500" fontSize="small" />
                )}
                <Typography
                  variant="caption"
                  className={change > 0 ? 'text-green-500' : 'text-red-500'}
                >
                  {Math.abs(change)}% from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar className={`bg-${color}-100`}>
            <Icon className={`text-${color}-600`} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header */}
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Here's what's happening with your farm today
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2} className="mb-8">
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/products/new')}
            className="bg-gradient-to-r from-green-600 to-green-700 py-3"
          >
            Add Product
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Scanner />}
            onClick={() => navigate('/disease-scan')}
            className="py-3"
          >
            Disease Scan
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Water />}
            onClick={() => navigate('/soil-test')}
            className="py-3"
          >
            Soil Test
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<WbSunny />}
            onClick={() => navigate('/weather')}
            className="py-3"
          >
            Weather
          </Button>
        </Grid>
      </Grid>

      {/* Stats Grid */}
      {loading ? (
        <LinearProgress className="mb-4" />
      ) : (
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={Inventory}
              title="Total Products"
              value={stats.totalProducts}
              color="green"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={ShoppingBag}
              title="Total Orders"
              value={stats.totalOrders}
              change={12}
              color="blue"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={AttachMoney}
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              change={8}
              color="purple"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={Visibility}
              title="Product Views"
              value={stats.totalViews}
              change={-5}
              color="orange"
            />
          </Grid>
        </Grid>
      )}

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Revenue Overview
              </Typography>
              <Box className="h-64">
                <Line
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Categories */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Product Categories
              </Typography>
              <Box className="h-64">
                <Doughnut
                  data={productCategoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Products & Orders Tabs */}
        <Grid item xs={12}>
          <Card>
            <Box className="border-b">
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab label="My Products" />
                <Tab label="Recent Orders" />
                <Tab label="Notifications" />
              </Tabs>
            </Box>

            {/* Products Tab */}
            {tabValue === 0 && (
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Products ({products.length})
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate('/products/manage')}
                  >
                    View All
                  </Button>
                </Box>
                <List>
                  {products.slice(0, 5).map((product) => (
                    <React.Fragment key={product._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={product.images?.[0]}
                            variant="rounded"
                            className="w-12 h-12"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.name}
                          secondary={
                            <Box className="flex items-center gap-2 mt-1">
                              <Chip
                                label={`₹${product.price}/${product.unit}`}
                                size="small"
                                color="primary"
                              />
                              <Chip
                                label={`Stock: ${product.quantity}`}
                                size="small"
                                color={product.quantity > 0 ? 'success' : 'error'}
                              />
                              {product.organic && (
                                <Chip label="Organic" size="small" color="success" />
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => navigate(`/products/edit/${product._id}`)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton>
                            <MoreVert />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            )}

            {/* Orders Tab */}
            {tabValue === 1 && (
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Recent Orders
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate('/orders')}
                  >
                    View All
                  </Button>
                </Box>
                <List>
                  {orders.slice(0, 5).map((order) => (
                    <React.Fragment key={order._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <LocalShipping />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Order #${order.orderNumber}`}
                          secondary={
                            <Box className="flex items-center gap-2 mt-1">
                              <Typography variant="caption">
                                {order.buyer?.name}
                              </Typography>
                              <Chip
                                label={order.orderStatus}
                                size="small"
                                color={
                                  order.orderStatus === 'delivered'
                                    ? 'success'
                                    : order.orderStatus === 'cancelled'
                                    ? 'error'
                                    : 'warning'
                                }
                              />
                              <Typography variant="caption">
                                ₹{order.totalAmount}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button
                            size="small"
                            onClick={() => navigate(`/orders/${order._id}`)}
                          >
                            View
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            )}

            {/* Notifications Tab */}
            {tabValue === 2 && (
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Recent Notifications
                </Typography>
                <Box className="space-y-2">
                  <Alert severity="success">
                    New order received for Tomatoes - 5kg
                  </Alert>
                  <Alert severity="info">
                    Weather alert: Heavy rainfall expected tomorrow
                  </Alert>
                  <Alert severity="warning">
                    Low stock alert: Onions - Only 2kg remaining
                  </Alert>
                </Box>
              </CardContent>
            )}
          </Card>
        </Grid>

        {/* Order Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Order Status
              </Typography>
              <Box className="h-64">
                <Bar
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Quick Insights
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className="bg-green-100">
                      <CheckCircle className="text-green-600" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Top Selling Product"
                    secondary="Tomatoes - 150kg sold this month"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className="bg-orange-100">
                      <Warning className="text-orange-600" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Stock Alert"
                    secondary="3 products running low on stock"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className="bg-blue-100">
                      <Schedule className="text-blue-600" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Pending Actions"
                    secondary="2 orders awaiting confirmation"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FarmerDashboard;
