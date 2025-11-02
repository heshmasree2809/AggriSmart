import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  LocalFlorist as LocalFloristIcon,
  WbSunny as WbSunnyIcon,
  Cloud as CloudIcon,
  AcUnit as AcUnitIcon
} from '@mui/icons-material';

function SeasonalCrop() {
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [selectedRegion, setSelectedRegion] = useState('north');

  const seasons = [
    { name: 'Spring', value: 'spring', icon: '🌸', months: 'Mar-May', muiIcon: <LocalFloristIcon /> },
    { name: 'Summer', value: 'summer', icon: '☀️', months: 'Jun-Aug', muiIcon: <WbSunnyIcon /> },
    { name: 'Monsoon', value: 'monsoon', icon: '🌧️', months: 'Sep-Nov', muiIcon: <CloudIcon /> },
    { name: 'Winter', value: 'winter', icon: '❄️', months: 'Dec-Feb', muiIcon: <AcUnitIcon /> },
  ];

  const regions = [
    { name: 'North India', value: 'north', icon: '🏔️' },
    { name: 'South India', value: 'south', icon: '🌴' },
    { name: 'East India', value: 'east', icon: '🌾' },
    { name: 'West India', value: 'west', icon: '🏜️' },
  ];

  const cropRecommendations = {
    spring: {
      north: [
        { name: 'Tomatoes', suitability: 95, reason: 'Ideal temperature and soil conditions', icon: '🍅' },
        { name: 'Cucumbers', suitability: 90, reason: 'Perfect for spring planting', icon: '🥒' },
        { name: 'Lettuce', suitability: 85, reason: 'Cool weather crop', icon: '🥬' },
        { name: 'Carrots', suitability: 80, reason: 'Good root development', icon: '🥕' },
      ],
      south: [
        { name: 'Rice', suitability: 95, reason: 'Main crop season', icon: '🌾' },
        { name: 'Mango', suitability: 90, reason: 'Flowering season', icon: '🥭' },
        { name: 'Coconut', suitability: 85, reason: 'Year-round growth', icon: '🥥' },
        { name: 'Banana', suitability: 80, reason: 'Tropical climate', icon: '🍌' },
      ]
    },
    summer: {
      north: [
        { name: 'Okra', suitability: 95, reason: 'Heat tolerant', icon: '🫒' },
        { name: 'Brinjal', suitability: 90, reason: 'Warm season crop', icon: '🍆' },
        { name: 'Chilli', suitability: 85, reason: 'Hot weather loving', icon: '🌶️' },
        { name: 'Bottle Gourd', suitability: 80, reason: 'Summer vegetable', icon: '🥒' },
      ],
      south: [
        { name: 'Cotton', suitability: 95, reason: 'Main summer crop', icon: '🌿' },
        { name: 'Sugarcane', suitability: 90, reason: 'Long growing season', icon: '🎋' },
        { name: 'Groundnut', suitability: 85, reason: 'Oilseed crop', icon: '🥜' },
        { name: 'Sunflower', suitability: 80, reason: 'Summer oilseed', icon: '🌻' },
      ]
    }
  };

  const currentRecommendations = cropRecommendations[selectedSeason]?.[selectedRegion] || [];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Seasonal Crop <span style={{ color: '#10b981' }}>Prediction</span>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Discover the best crops to grow based on current season and your region's climate conditions.
          </Typography>
        </Box>

        {/* Season & Region Selection */}
        <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <Grid container spacing={4}>
            {/* Season Selection */}
            <Grid item xs={12} lg={6}>
              <Typography variant="h6" fontWeight="semibold" gutterBottom>
                Select Season 🌤️
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {seasons.map((season) => (
                  <Grid item xs={6} key={season.value}>
                    <Button
                      fullWidth
                      variant={selectedSeason === season.value ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => setSelectedSeason(season.value)}
                      sx={{
                        py: 3,
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Typography variant="h4">{season.icon}</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {season.name}
                      </Typography>
                      <Typography variant="caption">{season.months}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Region Selection */}
            <Grid item xs={12} lg={6}>
              <Typography variant="h6" fontWeight="semibold" gutterBottom>
                Select Region 🗺️
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {regions.map((region) => (
                  <Grid item xs={6} key={region.value}>
                    <Button
                      fullWidth
                      variant={selectedRegion === region.value ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => setSelectedRegion(region.value)}
                      sx={{
                        py: 3,
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Typography variant="h4">{region.icon}</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {region.name}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Crop Recommendations */}
        {currentRecommendations.length > 0 && (
          <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
              Recommended Crops for {seasons.find(s => s.value === selectedSeason)?.name} in {regions.find(r => r.value === selectedRegion)?.name}
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {currentRecommendations.map((crop, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      bgcolor: 'primary.light',
                      borderRadius: 3,
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        {crop.icon}
                      </Typography>
                      <Typography variant="h6" fontWeight="semibold" gutterBottom>
                        {crop.name}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinearProgress
                            variant="determinate"
                            value={crop.suitability}
                            sx={{ flex: 1, height: 8, borderRadius: 1 }}
                            color="primary"
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {crop.suitability}%
                          </Typography>
                        </Stack>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {crop.reason}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Seasonal Tips */}
        <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Seasonal Farming Tips 💡
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[
              { icon: '🌱', title: 'Planting Time', desc: 'Plant crops at the optimal time for your region to ensure maximum yield and quality.' },
              { icon: '💧', title: 'Water Management', desc: 'Adjust irrigation based on seasonal rainfall patterns and crop water requirements.' },
              { icon: '🌡️', title: 'Temperature Control', desc: 'Protect crops from extreme temperatures using mulching, shading, or greenhouses.' },
              { icon: '🛡️', title: 'Pest Management', desc: 'Different seasons bring different pests. Plan your pest control strategy accordingly.' },
            ].map((tip, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    bgcolor: 'info.light',
                    borderRadius: 3,
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 2 }}>{tip.icon}</Typography>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tip.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Climate Information */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Climate Information 🌍
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                {[
                  { icon: '📊', title: 'Weather Patterns', desc: 'Monitor local weather forecasts and historical data for better planning.' },
                  { icon: '🌱', title: 'Soil Preparation', desc: 'Prepare soil according to seasonal requirements and crop needs.' },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="h4">{item.icon}</Typography>
                    <Box>
                      <Typography variant="h6" fontWeight="semibold" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                {[
                  { icon: '📅', title: 'Crop Calendar', desc: 'Follow a seasonal crop calendar for optimal planting and harvesting times.' },
                  { icon: '🔄', title: 'Crop Rotation', desc: 'Plan crop rotation to maintain soil health and prevent disease buildup.' },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="h4">{item.icon}</Typography>
                    <Box>
                      <Typography variant="h6" fontWeight="semibold" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default SeasonalCrop;
