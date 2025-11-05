import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  TextField,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart,
  TableChart,
  Notifications,
  Download,
  Refresh,
  Info,
  ArrowUpward,
  ArrowDownward,
  AttachMoney,
  Assessment,
  Timeline,
  NotificationAdd,
  Search
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line, Bar, Candlestick } from 'react-chartjs-2';
import { priceAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PriceTrends = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('chart');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('30');
  const [marketPrices, setMarketPrices] = useState([]);
  const [commodityPrices, setCommodityPrices] = useState([]);
  const [priceTrends, setPriceTrends] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    product: '',
    targetPrice: 0,
    alertType: 'below'
  });

  const categories = ['all', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices'];
  const timeRanges = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' }
  ];

  useEffect(() => {
    fetchPriceData();
  }, [selectedCategory, timeRange]);

  const fetchPriceData = async () => {
    setLoading(true);
    try {
      // Fetch market prices
      const marketRes = await priceAPI.getMarketPrices({ 
        category: selectedCategory !== 'all' ? selectedCategory : undefined 
      });
      setMarketPrices(marketRes.data.data.marketPrices || getMockMarketPrices());

      // Fetch commodity prices
      const commodityRes = await priceAPI.getCommodityPrices({});
      setCommodityPrices(commodityRes.data.data.commodityPrices || getMockCommodityPrices());

      // Fetch price trends
      if (selectedProduct) {
        const trendsRes = await priceAPI.getTrends({ 
          product: selectedProduct,
          days: timeRange 
        });
        setPriceTrends(trendsRes.data.data || getMockPriceTrends());
      }
    } catch (error) {
      console.error('Failed to fetch price data:', error);
      // Use mock data
      setMarketPrices(getMockMarketPrices());
      setCommodityPrices(getMockCommodityPrices());
      setPriceTrends(getMockPriceTrends());
    } finally {
      setLoading(false);
    }
  };

  const getMockMarketPrices = () => [
    { product: 'Tomato', category: 'Vegetables', currentPrice: 32, unit: 'kg', priceChange: { value: 5, percentage: '18.52' }, trend: 'up', availability: { listings: 45, totalQuantity: 1200 } },
    { product: 'Onion', category: 'Vegetables', currentPrice: 28, unit: 'kg', priceChange: { value: -3, percentage: '-9.68' }, trend: 'down', availability: { listings: 62, totalQuantity: 2500 } },
    { product: 'Potato', category: 'Vegetables', currentPrice: 22, unit: 'kg', priceChange: { value: 0, percentage: '0.00' }, trend: 'stable', availability: { listings: 38, totalQuantity: 1800 } },
    { product: 'Rice', category: 'Grains', currentPrice: 45, unit: 'kg', priceChange: { value: 2, percentage: '4.65' }, trend: 'up', availability: { listings: 28, totalQuantity: 3000 } },
    { product: 'Wheat', category: 'Grains', currentPrice: 38, unit: 'kg', priceChange: { value: -1, percentage: '-2.56' }, trend: 'down', availability: { listings: 35, totalQuantity: 2800 } },
    { product: 'Apple', category: 'Fruits', currentPrice: 120, unit: 'kg', priceChange: { value: 10, percentage: '9.09' }, trend: 'up', availability: { listings: 22, totalQuantity: 500 } }
  ];

  const getMockCommodityPrices = () => [
    { commodity: 'Rice (Common)', variety: 'IR-64', unit: 'quintal', minPrice: 1800, maxPrice: 2200, modalPrice: 2000, market: 'APMC Mumbai', arrivalQuantity: 5000, trend: 'stable' },
    { commodity: 'Wheat', variety: 'Lok-1', unit: 'quintal', minPrice: 2100, maxPrice: 2400, modalPrice: 2250, market: 'APMC Mumbai', arrivalQuantity: 3000, trend: 'up' },
    { commodity: 'Onion', variety: 'Red', unit: 'quintal', minPrice: 800, maxPrice: 1500, modalPrice: 1100, market: 'APMC Mumbai', arrivalQuantity: 8000, trend: 'down' }
  ];

  const getMockPriceTrends = () => {
    const trends = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        avgPrice: 30 + Math.random() * 20,
        minPrice: 25 + Math.random() * 10,
        maxPrice: 40 + Math.random() * 15,
        volume: 1000 + Math.random() * 500
      });
    }
    return {
      trends,
      stats: {
        avgPrice: '35.50',
        minPrice: '28.00',
        maxPrice: '45.00',
        priceVolatility: '5.25',
        priceChange: { value: '3.50', percentage: '10.94' }
      },
      predictions: {
        nextDay: 36.80,
        nextWeek: 38.50,
        confidence: 75
      }
    };
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    setLoading(true);
    try {
      const trendsRes = await priceAPI.getTrends({ product, days: timeRange });
      setPriceTrends(trendsRes.data.data || getMockPriceTrends());
      
      const predictionsRes = await priceAPI.getPredictions(product);
      setPredictions(predictionsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch product trends:', error);
      setPriceTrends(getMockPriceTrends());
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    try {
      await priceAPI.subscribeToAlerts(alertSettings);
      toast.success('Price alert created successfully');
      setShowAlertDialog(false);
    } catch (error) {
      toast.error('Failed to create price alert');
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-600" />;
      case 'down': return <TrendingDown className="text-red-600" />;
      default: return <TrendingFlat className="text-gray-600" />;
    }
  };

  const chartData = priceTrends ? {
    labels: priceTrends.trends.map(t => new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Average Price',
        data: priceTrends.trends.map(t => t.avgPrice),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4
      },
      {
        label: 'Min Price',
        data: priceTrends.trends.map(t => t.minPrice),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderDash: [5, 5],
        tension: 0.4
      },
      {
        label: 'Max Price',
        data: priceTrends.trends.map(t => t.maxPrice),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  } : null;

  const volumeChartData = priceTrends ? {
    labels: priceTrends.trends.map(t => new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Volume Traded',
        data: priceTrends.trends.map(t => t.volume),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  } : null;

  const PriceCard = ({ item }) => (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleProductSelect(item.product)}
    >
      <CardContent>
        <Box className="flex justify-between items-start mb-3">
          <Box>
            <Typography variant="h6">{item.product}</Typography>
            <Typography variant="caption" className="text-gray-600">
              {item.category}
            </Typography>
          </Box>
          {getTrendIcon(item.trend)}
        </Box>
        <Typography variant="h4" className="font-bold mb-2">
          ₹{item.currentPrice}
          <Typography component="span" variant="body2" className="text-gray-600 ml-1">
            /{item.unit}
          </Typography>
        </Typography>
        <Box className="flex items-center gap-2">
          {item.priceChange.value > 0 ? (
            <ArrowUpward className="text-green-600" fontSize="small" />
          ) : item.priceChange.value < 0 ? (
            <ArrowDownward className="text-red-600" fontSize="small" />
          ) : null}
          <Typography 
            variant="body2" 
            className={item.priceChange.value > 0 ? 'text-green-600' : item.priceChange.value < 0 ? 'text-red-600' : 'text-gray-600'}
          >
            {item.priceChange.value > 0 ? '+' : ''}{item.priceChange.value} ({item.priceChange.percentage}%)
          </Typography>
        </Box>
        <Typography variant="caption" className="text-gray-500 mt-2 block">
          {item.availability.listings} sellers • {item.availability.totalQuantity} units
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h3" className="font-bold text-gray-800 mb-4">
            Market Price Trends 📈
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Track real-time market prices, analyze historical trends, and get price predictions
          </Typography>
        </Box>

        {/* Filters */}
        <Paper className="p-4 mb-6">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  {timeRanges.map(range => (
                    <MenuItem key={range.value} value={range.value}>{range.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search product..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box className="flex gap-2">
                <Button
                  variant="outlined"
                  startIcon={<NotificationAdd />}
                  onClick={() => setShowAlertDialog(true)}
                >
                  Set Alert
                </Button>
                <IconButton onClick={fetchPriceData}>
                  <Refresh />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper className="mb-6">
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Market Prices" />
            <Tab label="Government Rates" />
            <Tab label="Price Analysis" />
            <Tab label="Predictions" />
          </Tabs>

          {loading && <LinearProgress />}

          {/* Market Prices Tab */}
          {tabValue === 0 && (
            <Box className="p-4">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6">Current Market Prices</Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, v) => v && setViewMode(v)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <ShowChart />
                  </ToggleButton>
                  <ToggleButton value="table">
                    <TableChart />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {marketPrices.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <PriceCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Current Price</TableCell>
                        <TableCell align="right">Change</TableCell>
                        <TableCell align="center">Trend</TableCell>
                        <TableCell align="right">Availability</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {marketPrices.map((item, index) => (
                        <TableRow 
                          key={index}
                          hover
                          className="cursor-pointer"
                          onClick={() => handleProductSelect(item.product)}
                        >
                          <TableCell>{item.product}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell align="right">₹{item.currentPrice}/{item.unit}</TableCell>
                          <TableCell align="right" className={item.priceChange.value > 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.priceChange.value > 0 ? '+' : ''}{item.priceChange.value} ({item.priceChange.percentage}%)
                          </TableCell>
                          <TableCell align="center">{getTrendIcon(item.trend)}</TableCell>
                          <TableCell align="right">{item.availability.listings} sellers</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Government Rates Tab */}
          {tabValue === 1 && (
            <Box className="p-4">
              <Alert severity="info" className="mb-4">
                Official APMC Mandi rates updated daily at 6:00 AM
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Commodity</TableCell>
                      <TableCell>Variety</TableCell>
                      <TableCell align="right">Min Price</TableCell>
                      <TableCell align="right">Max Price</TableCell>
                      <TableCell align="right">Modal Price</TableCell>
                      <TableCell>Market</TableCell>
                      <TableCell align="right">Arrivals</TableCell>
                      <TableCell align="center">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commodityPrices.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.commodity}</TableCell>
                        <TableCell>{item.variety}</TableCell>
                        <TableCell align="right">₹{item.minPrice}/{item.unit}</TableCell>
                        <TableCell align="right">₹{item.maxPrice}/{item.unit}</TableCell>
                        <TableCell align="right" className="font-semibold">
                          ₹{item.modalPrice}/{item.unit}
                        </TableCell>
                        <TableCell>{item.market}</TableCell>
                        <TableCell align="right">{item.arrivalQuantity} {item.unit}</TableCell>
                        <TableCell align="center">{getTrendIcon(item.trend)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Price Analysis Tab */}
          {tabValue === 2 && (
            <Box className="p-4">
              {selectedProduct ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Alert severity="info" className="mb-4">
                      Showing price analysis for <strong>{selectedProduct}</strong>
                    </Alert>
                  </Grid>
                  {priceTrends && (
                    <>
                      <Grid item xs={12} md={8}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" className="mb-3">Price Trend</Typography>
                            <Box className="h-64">
                              <Line
                                data={chartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: { position: 'bottom' }
                                  }
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" className="mb-3">Statistics</Typography>
                            <Box className="space-y-3">
                              <Box>
                                <Typography variant="body2" className="text-gray-600">Average Price</Typography>
                                <Typography variant="h5">₹{priceTrends.stats.avgPrice}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" className="text-gray-600">Price Range</Typography>
                                <Typography variant="body1">
                                  ₹{priceTrends.stats.minPrice} - ₹{priceTrends.stats.maxPrice}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" className="text-gray-600">Volatility</Typography>
                                <Typography variant="body1">{priceTrends.stats.priceVolatility}%</Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" className="text-gray-600">Change</Typography>
                                <Typography 
                                  variant="body1"
                                  className={parseFloat(priceTrends.stats.priceChange.value) > 0 ? 'text-green-600' : 'text-red-600'}
                                >
                                  {priceTrends.stats.priceChange.value > 0 ? '+' : ''}{priceTrends.stats.priceChange.value} ({priceTrends.stats.priceChange.percentage}%)
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" className="mb-3">Volume Analysis</Typography>
                            <Box className="h-48">
                              <Bar
                                data={volumeChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  )}
                </Grid>
              ) : (
                <Alert severity="warning">
                  Select a product from the market prices to view detailed analysis
                </Alert>
              )}
            </Box>
          )}

          {/* Predictions Tab */}
          {tabValue === 3 && (
            <Box className="p-4">
              <Alert severity="warning" className="mb-4">
                Predictions are based on historical data and AI analysis. Use for reference only.
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">7-Day Forecast</Typography>
                      {priceTrends?.predictions ? (
                        <Box className="space-y-2">
                          <Box className="flex justify-between">
                            <Typography>Tomorrow</Typography>
                            <Typography className="font-semibold">₹{priceTrends.predictions.nextDay}</Typography>
                          </Box>
                          <Box className="flex justify-between">
                            <Typography>Next Week</Typography>
                            <Typography className="font-semibold">₹{priceTrends.predictions.nextWeek}</Typography>
                          </Box>
                          <Box className="mt-3">
                            <Typography variant="caption">Confidence Level</Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={priceTrends.predictions.confidence} 
                              className="mt-1"
                            />
                            <Typography variant="caption" className="text-gray-600">
                              {priceTrends.predictions.confidence}%
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography className="text-gray-600">
                          Select a product to view predictions
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">Market Insights</Typography>
                      <Alert severity="success" className="mb-2">
                        <strong>Best Time to Sell:</strong> Prices expected to rise in next 3-5 days
                      </Alert>
                      <Alert severity="info">
                        <strong>Demand Forecast:</strong> High demand expected due to upcoming festival season
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Alert Dialog */}
        <Dialog open={showAlertDialog} onClose={() => setShowAlertDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogContent>
            <Box className="space-y-4 mt-4">
              <TextField
                fullWidth
                label="Product"
                value={alertSettings.product}
                onChange={(e) => setAlertSettings({ ...alertSettings, product: e.target.value })}
              />
              <TextField
                fullWidth
                label="Target Price"
                type="number"
                value={alertSettings.targetPrice}
                onChange={(e) => setAlertSettings({ ...alertSettings, targetPrice: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Alert Type</InputLabel>
                <Select
                  value={alertSettings.alertType}
                  onChange={(e) => setAlertSettings({ ...alertSettings, alertType: e.target.value })}
                  label="Alert Type"
                >
                  <MenuItem value="above">When price goes above</MenuItem>
                  <MenuItem value="below">When price falls below</MenuItem>
                  <MenuItem value="change">On any price change</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAlertDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateAlert}>
              Create Alert
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default PriceTrends;
