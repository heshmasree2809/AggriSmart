import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Badge,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  ShoppingCart,
  LocalFlorist,
  CloudQueue,
  Agriculture,
  WaterDrop,
  BugReport,
  AccountBalance,
  TrendingUp,
  Person,
  Logout,
  Login,
  PersonAdd,
  Notifications,
  Settings,
  Home,
  Park as Eco
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NavbarEnhanced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const cartItemCount = cartItems?.length || 0;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const navigationItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <Dashboard />, 
      requireAuth: true 
    },
    { 
      title: 'Marketplace', 
      path: '/buy', 
      icon: <ShoppingCart />, 
      badge: cartItemCount,
      requireAuth: false 
    },
    { 
      title: 'Disease Detection', 
      path: '/plant-detection', 
      icon: <LocalFlorist />, 
      requireAuth: true 
    },
    { 
      title: 'Weather', 
      path: '/weather-forecast', 
      icon: <CloudQueue />, 
      requireAuth: true 
    },
    { 
      title: 'Soil Health', 
      path: '/soil-health', 
      icon: <Eco />, 
      requireAuth: true 
    },
    { 
      title: 'Crop Advisor', 
      path: '/seasonal-crop', 
      icon: <Agriculture />, 
      requireAuth: true 
    }
  ];

  const moreItems = [
    { title: 'Irrigation', path: '/irrigation', icon: <WaterDrop /> },
    { title: 'Pest Alerts', path: '/pest-alerts', icon: <BugReport /> },
    { title: 'Schemes', path: '/government-schemes', icon: <AccountBalance /> },
    { title: 'Price Trends', path: '/crop-trends', icon: <TrendingUp /> }
  ];

  const isActive = (path) => location.pathname === path;

  const mobileDrawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          AgriSmart
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate('/'); setMobileOpen(false); }}>
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {navigationItems.map((item) => (
          (!item.requireAuth || user) && (
            <ListItem key={item.title} disablePadding>
              <ListItemButton 
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                selected={isActive(item.path)}
              >
                <ListItemIcon>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          )
        ))}
        <Divider sx={{ my: 1 }} />
        {moreItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton 
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              selected={isActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/profile'); setMobileOpen(false); }}>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                <ListItemIcon><Login /></ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/signup'); setMobileOpen(false); }}>
                <ListItemIcon><PersonAdd /></ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'white', 
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                mr: 3
              }}
              onClick={() => navigate('/')}
            >
              <Agriculture sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: 'primary.main',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                AgriSmart
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navigationItems.map((item) => (
                (!item.requireAuth || user) && (
                  <Button
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    startIcon={item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : item.icon}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(item.path) ? 'bold' : 'normal',
                      borderBottom: isActive(item.path) ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 0,
                      px: 2
                    }}
                  >
                    {item.title}
                  </Button>
                )
              ))}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user && (
                <>
                  {/* Notifications */}
                  <Tooltip title="Notifications">
                    <IconButton onClick={handleNotificationOpen}>
                      <Badge badgeContent={3} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* User Role Chip */}
                  <Chip
                    label={user.role}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  />
                </>
              )}

              {/* User Menu */}
              {user ? (
                <Box>
                  <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled>
                      <Stack>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                      <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                      <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                      <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/login')}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 360, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText
            primary="Disease Alert"
            secondary="Leaf blight detected in your area"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText
            primary="Weather Update"
            secondary="Heavy rainfall expected tomorrow"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText
            primary="Price Alert"
            secondary="Tomato prices increased by 20%"
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { navigate('/notifications'); handleNotificationClose(); }}>
          <Typography variant="body2" color="primary" textAlign="center" width="100%">
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 }
        }}
      >
        {mobileDrawer}
      </Drawer>
    </>
  );
};

export default NavbarEnhanced;
