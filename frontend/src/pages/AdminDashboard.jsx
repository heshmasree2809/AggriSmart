import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingBag,
  Assessment,
  Settings,
  Block,
  CheckCircle,
  Warning,
  TrendingUp,
  AttachMoney,
  Agriculture,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  PersonAdd,
  Download,
  Upload,
  Notifications,
  Security,
  BugReport,
  Timer
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { authAPI, productAPI, orderAPI } from '../services/api';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dashboard statistics
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeUsers: 892,
    totalProducts: 3456,
    totalOrders: 8921,
    totalRevenue: 2456780,
    monthlyRevenue: 456780,
    pendingVerifications: 23,
    reportedIssues: 15
  });

  // Users data
  const [users, setUsers] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'Farmer', status: 'Active', joined: '2024-01-15', lastActive: '2024-12-14', products: 45, orders: 120, revenue: 125000 },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'Buyer', status: 'Active', joined: '2024-02-20', lastActive: '2024-12-13', products: 0, orders: 35, revenue: 0 },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', role: 'Farmer', status: 'Inactive', joined: '2024-03-10', lastActive: '2024-11-20', products: 28, orders: 67, revenue: 89000 },
    { id: 4, name: 'Sunita Verma', email: 'sunita@example.com', role: 'Expert', status: 'Active', joined: '2024-01-05', lastActive: '2024-12-14', products: 0, orders: 0, revenue: 0 }
  ]);

  // System health
  const [systemHealth, setSystemHealth] = useState({
    serverStatus: 'operational',
    databaseStatus: 'operational',
    storageUsed: 65,
    apiLatency: 125,
    uptime: '99.98%',
    lastBackup: '2024-12-14 03:00',
    activeConnections: 234
  });

  // Chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [120000, 150000, 180000, 165000, 210000, 245000, 290000, 320000, 285000, 310000, 345000, 380000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  const userDistributionData = {
    labels: ['Farmers', 'Buyers', 'Experts', 'Admins'],
    datasets: [
      {
        data: [580, 420, 45, 5],
        backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
      }
    ]
  };

  const categoryPerformanceData = {
    labels: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Others'],
    datasets: [
      {
        label: 'Orders',
        data: [3200, 2800, 1950, 1200, 850],
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      },
      {
        label: 'Revenue',
        data: [450000, 380000, 220000, 180000, 120000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real data from APIs
      // const statsRes = await api.getAdminStats();
      // setStats(statsRes.data);
      
      // Using mock data for now
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setShowUserDialog(true);
        break;
      case 'edit':
        toast.info(`Editing user: ${user.name}`);
        break;
      case 'block':
        toast.warning(`Blocking user: ${user.name}`);
        break;
      case 'delete':
        toast.error(`Deleting user: ${user.name}`);
        break;
      default:
        break;
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-start justify-between mb-2">
          <Box>
            <Typography variant="body2" className="text-gray-600 mb-1">
              {title}
            </Typography>
            <Typography variant="h4" className="font-bold">
              {value}
            </Typography>
            {change && (
              <Box className="flex items-center gap-1 mt-2">
                <TrendingUp className={change > 0 ? 'text-green-500' : 'text-red-500'} fontSize="small" />
                <Typography variant="caption" className={change > 0 ? 'text-green-500' : 'text-red-500'}>
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

  const SystemStatusCard = ({ title, status, value, icon: Icon }) => (
    <Card className="h-full">
      <CardContent>
        <Box className="flex items-center justify-between mb-2">
          <Typography variant="subtitle2" className="font-medium">
            {title}
          </Typography>
          <Icon className="text-gray-600" fontSize="small" />
        </Box>
        <Typography variant="h6" className="font-bold mb-1">
          {value}
        </Typography>
        <Chip
          label={status}
          size="small"
          color={status === 'operational' ? 'success' : status === 'degraded' ? 'warning' : 'error'}
        />
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
        <Box className="mb-6 flex justify-between items-center">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Admin Dashboard
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Platform overview and management
            </Typography>
          </Box>
          <Box className="flex gap-2">
            <Button variant="outlined" startIcon={<Download />}>
              Export Report
            </Button>
            <Button variant="contained" startIcon={<Settings />}>
              Settings
            </Button>
          </Box>
        </Box>

        {/* Stats Grid */}
        {loading ? (
          <LinearProgress className="mb-4" />
        ) : (
          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                change={12}
                icon={People}
                color="blue"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Products"
                value={stats.totalProducts.toLocaleString()}
                change={8}
                icon={ShoppingBag}
                color="green"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                change={15}
                icon={Agriculture}
                color="purple"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
                change={20}
                icon={AttachMoney}
                color="orange"
              />
            </Grid>
          </Grid>
        )}

        {/* Main Content Tabs */}
        <Paper>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Overview" />
            <Tab label="Users" />
            <Tab label="Products" />
            <Tab label="Orders" />
            <Tab label="System Health" />
          </Tabs>

          {/* Overview Tab */}
          {tabValue === 0 && (
            <Box className="p-4">
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">
                        Revenue Trend
                      </Typography>
                      <Box className="h-64">
                        <Line
                          data={revenueChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">
                        User Distribution
                      </Typography>
                      <Box className="h-64">
                        <Doughnut
                          data={userDistributionData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">
                        Category Performance
                      </Typography>
                      <Box className="h-64">
                        <Bar
                          data={categoryPerformanceData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">
                        Recent Activities
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar className="bg-green-100">
                              <PersonAdd className="text-green-600" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="New user registration"
                            secondary="Mahesh Singh joined as Farmer - 2 hours ago"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar className="bg-blue-100">
                              <ShoppingBag className="text-blue-600" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Large order placed"
                            secondary="Order #8921 worth ₹45,000 - 3 hours ago"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar className="bg-orange-100">
                              <Warning className="text-orange-600" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Product reported"
                            secondary="Quality issue reported for Tomatoes - 5 hours ago"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">
                        Pending Actions
                      </Typography>
                      <Box className="space-y-3">
                        <Alert severity="warning">
                          <Typography variant="subtitle2">
                            {stats.pendingVerifications} user verifications pending
                          </Typography>
                        </Alert>
                        <Alert severity="error">
                          <Typography variant="subtitle2">
                            {stats.reportedIssues} reported issues need review
                          </Typography>
                        </Alert>
                        <Alert severity="info">
                          <Typography variant="subtitle2">
                            5 expert reviews awaiting approval
                          </Typography>
                        </Alert>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Users Tab */}
          {tabValue === 1 && (
            <Box className="p-4">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6">User Management</Typography>
                <Button variant="contained" startIcon={<PersonAdd />}>
                  Add User
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Last Active</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box className="flex items-center gap-2">
                            <Avatar>{user.name[0]}</Avatar>
                            {user.name}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === 'Farmer' ? 'success' : user.role === 'Expert' ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            size="small"
                            color={user.status === 'Active' ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleUserAction('view', user)}>
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleUserAction('edit', user)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleUserAction('block', user)}>
                            <Block />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={users.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              />
            </Box>
          )}

          {/* Products Tab */}
          {tabValue === 2 && (
            <Box className="p-4">
              <Alert severity="info">
                Product management interface - View, moderate, and manage all marketplace products
              </Alert>
              <Box className="mt-4">
                <Typography variant="h6">Coming Soon</Typography>
              </Box>
            </Box>
          )}

          {/* Orders Tab */}
          {tabValue === 3 && (
            <Box className="p-4">
              <Alert severity="info">
                Order management interface - Track, manage, and resolve order issues
              </Alert>
              <Box className="mt-4">
                <Typography variant="h6">Coming Soon</Typography>
              </Box>
            </Box>
          )}

          {/* System Health Tab */}
          {tabValue === 4 && (
            <Box className="p-4">
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <SystemStatusCard
                    title="Server Status"
                    status={systemHealth.serverStatus}
                    value="All Systems"
                    icon={CheckCircle}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SystemStatusCard
                    title="Database"
                    status={systemHealth.databaseStatus}
                    value="MongoDB"
                    icon={Dashboard}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SystemStatusCard
                    title="API Latency"
                    status="operational"
                    value={`${systemHealth.apiLatency}ms`}
                    icon={Timer}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SystemStatusCard
                    title="Uptime"
                    status="operational"
                    value={systemHealth.uptime}
                    icon={TrendingUp}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" className="mb-3">
                        System Metrics
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box className="space-y-3">
                            <Box>
                              <Box className="flex justify-between mb-1">
                                <Typography variant="body2">Storage Used</Typography>
                                <Typography variant="body2">{systemHealth.storageUsed}%</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={systemHealth.storageUsed} />
                            </Box>
                            <Box>
                              <Typography variant="body2" className="mb-1">
                                Active Connections: {systemHealth.activeConnections}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" className="mb-1">
                                Last Backup: {systemHealth.lastBackup}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Alert severity="success">
                            All systems operational. No critical issues detected.
                          </Alert>
                          <Box className="mt-3 space-y-2">
                            <Button fullWidth variant="outlined" startIcon={<Upload />}>
                              Manual Backup
                            </Button>
                            <Button fullWidth variant="outlined" startIcon={<BugReport />}>
                              View Logs
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* User Details Dialog */}
        <Dialog open={showUserDialog} onClose={() => setShowUserDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box className="space-y-4 mt-4">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" className="text-gray-600">Name</Typography>
                    <Typography variant="body1">{selectedUser.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" className="text-gray-600">Email</Typography>
                    <Typography variant="body1">{selectedUser.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" className="text-gray-600">Role</Typography>
                    <Typography variant="body1">{selectedUser.role}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" className="text-gray-600">Status</Typography>
                    <Typography variant="body1">{selectedUser.status}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" className="text-gray-600">Products Listed</Typography>
                    <Typography variant="h6">{selectedUser.products}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" className="text-gray-600">Orders</Typography>
                    <Typography variant="h6">{selectedUser.orders}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" className="text-gray-600">Revenue</Typography>
                    <Typography variant="h6">₹{selectedUser.revenue.toLocaleString()}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUserDialog(false)}>Close</Button>
            <Button variant="contained" color="error">
              Block User
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;
