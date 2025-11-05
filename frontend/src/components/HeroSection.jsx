import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Avatar, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Agriculture,
  LocalFlorist,
  CloudQueue,
  TrendingUp,
  WaterDrop,
  BugReport,
  AccountBalance,
  ShoppingCart,
  Dashboard as DashboardIcon,
  Park as Eco
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <ShoppingCart />,
      title: 'Marketplace',
      description: 'Buy & sell fresh produce directly',
      color: '#4CAF50',
      path: '/buy'
    },
    {
      icon: <LocalFlorist />,
      title: 'Disease Detection',
      description: 'AI-powered plant disease identification',
      color: '#FF5722',
      path: '/plant-detection'
    },
    {
      icon: <CloudQueue />,
      title: 'Weather Forecast',
      description: '7-day agricultural weather insights',
      color: '#2196F3',
      path: '/weather-forecast'
    },
    {
      icon: <Eco />,
      title: 'Soil Health',
      description: 'Monitor and improve soil quality',
      color: '#8BC34A',
      path: '/soil-health'
    },
    {
      icon: <Agriculture />,
      title: 'Crop Advisor',
      description: 'Personalized crop recommendations',
      color: '#FF9800',
      path: '/seasonal-crop'
    },
    {
      icon: <TrendingUp />,
      title: 'Price Trends',
      description: 'Market price analysis & forecasts',
      color: '#9C27B0',
      path: '/crop-trends'
    }
  ];

  const stats = [
    { label: 'Active Farmers', value: '10,000+' },
    { label: 'Products Listed', value: '50,000+' },
    { label: 'Disease Scans', value: '100,000+' },
    { label: 'Success Rate', value: '95%' }
  ];

  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/pattern.svg)',
            opacity: 0.1,
            backgroundSize: '200px',
            backgroundRepeat: 'repeat'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  animation: `${pulse} 3s ease-in-out infinite`
                }}
              >
                Welcome to AgriSmart
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.95 }}>
                Your Complete Agriculture Solution Platform
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                Empowering farmers with AI-driven insights, marketplace access, and comprehensive agricultural tools for modern farming success.
              </Typography>
              <Stack direction="row" spacing={2}>
                {user ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/signup')}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': { 
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  animation: `${float} 6s ease-in-out infinite`
                }}
              >
                <img
                  src="/images/hero-illustration.svg"
                  alt="Agriculture"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    height: 'auto'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500';
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
          Everything You Need for Modern Farming
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
          Comprehensive tools and insights to maximize your agricultural productivity
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: feature.color,
                      width: 64,
                      height: 64,
                      margin: '0 auto',
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
          mt: 6
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Transform Your Farming?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Join thousands of farmers already using AgriSmart to increase yields and profits
          </Typography>
          {!user && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Start Your Free Trial
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HeroSection;
