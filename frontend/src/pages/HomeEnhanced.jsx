import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Fade, 
  Grow, 
  Zoom,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Rating,
  LinearProgress
} from '@mui/material';
import { 
  ArrowForward, 
  TrendingUp, 
  People, 
  CheckCircle, 
  Speed,
  Star,
  LocalOffer,
  Verified,
  EmojiEvents,
  Forum,
  PlayCircleOutline
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';

function HomeEnhanced() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const benefits = [
    {
      icon: <TrendingUp />,
      title: 'Increase Yield by 30%',
      description: 'Data-driven insights help optimize crop production'
    },
    {
      icon: <Speed />,
      title: 'Save Time & Money',
      description: 'Automate planning and reduce manual work'
    },
    {
      icon: <CheckCircle />,
      title: 'Reduce Crop Loss',
      description: 'Early disease detection prevents major losses'
    },
    {
      icon: <People />,
      title: 'Direct Market Access',
      description: 'Connect directly with buyers for better prices'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Farmer, Punjab',
      avatar: 'R',
      rating: 5,
      comment: 'AgriSmart helped me increase my wheat yield by 35% through timely disease detection and weather alerts.'
    },
    {
      name: 'Priya Sharma',
      role: 'Organic Farmer, Maharashtra',
      avatar: 'P',
      rating: 5,
      comment: 'The marketplace feature helped me get 20% better prices by connecting directly with buyers.'
    },
    {
      name: 'Suresh Patel',
      role: 'Cotton Farmer, Gujarat',
      avatar: 'S',
      rating: 5,
      comment: 'Soil health analysis saved me thousands on fertilizers by showing exactly what my soil needed.'
    }
  ];

  const latestUpdates = [
    {
      title: 'New AI Model Released',
      description: 'Enhanced disease detection with 98% accuracy',
      date: '2 days ago',
      type: 'feature'
    },
    {
      title: 'Wheat Prices Up 15%',
      description: 'Market analysis shows strong demand',
      date: '3 days ago',
      type: 'market'
    },
    {
      title: 'Monsoon Alert',
      description: 'Heavy rainfall expected in next 48 hours',
      date: '5 days ago',
      type: 'weather'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up',
      description: 'Create your free account in minutes'
    },
    {
      step: '2',
      title: 'Add Your Farm',
      description: 'Input your farm details and crops'
    },
    {
      step: '3',
      title: 'Get Insights',
      description: 'Receive personalized recommendations'
    },
    {
      step: '4',
      title: 'Take Action',
      description: 'Implement suggestions and track results'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Fade in={isLoaded} timeout={1000}>
          <Box>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
              Why Choose AgriSmart?
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
              Join thousands of farmers who are transforming their agricultural practices
            </Typography>
            
            <Grid container spacing={3}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Grow in={isLoaded} timeout={1000 + index * 200}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 56, 
                          height: 56,
                          margin: '0 auto',
                          mb: 2
                        }}
                      >
                        {benefit.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
            How It Works
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
            Get started in 4 simple steps
          </Typography>
          
          <Grid container spacing={3}>
            {howItWorks.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={isLoaded} timeout={1000 + index * 200}>
                  <Box textAlign="center">
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 80,
                        height: 80,
                        margin: '0 auto',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.step}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    {index < howItWorks.length - 1 && (
                      <Box 
                        sx={{ 
                          display: { xs: 'none', md: 'block' },
                          position: 'absolute',
                          top: '40px',
                          right: '-40px',
                          zIndex: 1
                        }}
                      >
                        <ArrowForward sx={{ fontSize: 30, color: 'grey.400' }} />
                      </Box>
                    )}
                  </Box>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
          What Farmers Say
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
          Real stories from real farmers
        </Typography>
        
        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in={isLoaded} timeout={1000 + index * 200}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Latest Updates */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Latest Updates
              </Typography>
              <List>
                {latestUpdates.map((update, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 
                          update.type === 'feature' ? 'success.main' : 
                          update.type === 'market' ? 'warning.main' : 
                          'info.main' 
                        }}>
                          {update.type === 'feature' ? <Star /> : 
                           update.type === 'market' ? <TrendingUp /> : 
                           <CheckCircle />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            {update.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {update.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {update.date}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < latestUpdates.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<PlayCircleOutline />}
                  onClick={() => navigate('/plant-detection')}
                >
                  Scan Plant Disease
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<LocalOffer />}
                  onClick={() => navigate('/buy')}
                >
                  Browse Marketplace
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<Forum />}
                  onClick={() => navigate('/weather-forecast')}
                >
                  Check Weather
                </Button>
              </Stack>
              
              <Box mt={4} p={3} bgcolor="primary.main" borderRadius={2} color="white">
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  <EmojiEvents sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Premium Features
                </Typography>
                <Typography variant="body2" mb={2}>
                  Unlock advanced analytics, priority support, and exclusive market insights
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Upgrade Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust Indicators */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack 
          direction="row" 
          spacing={4} 
          justifyContent="center" 
          alignItems="center"
          flexWrap="wrap"
        >
          <Box display="flex" alignItems="center">
            <Verified sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Government Certified
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              100% Secure
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Speed sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              24/7 Support
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <People sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              10,000+ Farmers Trust Us
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default HomeEnhanced;
