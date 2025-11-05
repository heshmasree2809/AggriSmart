import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  InputAdornment,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Science,
  Grass,
  WaterDrop,
  BubbleChart,
  TrendingUp,
  Warning,
  CheckCircle,
  Agriculture,
  LocationOn,
  CloudUpload,
  Download,
  Share,
  Refresh,
  CompareArrows,
  Timeline,
  Eco,
  LocalFlorist,
  Opacity,
  Thermostat,
  Speed,
  Info,
  Add,
  Remove
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import { soilAPI, cropAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SoilAnalysis = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  // Form state
  const [soilData, setSoilData] = useState({
    location: '',
    sampleDepth: 15,
    pH: 7.0,
    nitrogen: 280,
    phosphorus: 30,
    potassium: 250,
    organicMatter: 2.5,
    electricalConductivity: 0.5,
    sulfur: 20,
    zinc: 1.5,
    iron: 5,
    manganese: 3,
    copper: 1,
    boron: 0.5,
    moisture: 40,
    texture: 'loam'
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const steps = ['Soil Parameters', 'Location & Details', 'Analysis', 'Recommendations'];
  
  const soilTextures = ['Sandy', 'Loamy Sand', 'Sandy Loam', 'Loam', 'Silt Loam', 'Clay Loam', 'Clay'];
  const depthOptions = [15, 30, 45, 60];

  const handleInputChange = (field, value) => {
    setSoilData(prev => ({ ...prev, [field]: value }));
  };

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const response = await soilAPI.createReport(soilData);
      setAnalysisResult(response.data.data);
      
      // Get crop recommendations
      const cropRes = await cropAPI.getRecommendations({
        soilType: soilData.texture,
        pH: soilData.pH,
        nitrogen: soilData.nitrogen,
        location: soilData.location
      });
      setRecommendations(cropRes.data.data);
      
      setActiveStep(3);
      toast.success('Soil analysis completed successfully!');
    } catch (error) {
      console.error('Analysis failed:', error);
      // Use mock data for demo
      setMockAnalysisResult();
      setActiveStep(3);
    } finally {
      setLoading(false);
    }
  };

  const setMockAnalysisResult = () => {
    setAnalysisResult({
      healthScore: 75,
      classification: 'Good',
      fertility: 'Medium-High',
      suitableFor: ['Rice', 'Wheat', 'Maize', 'Vegetables'],
      improvements: [
        { issue: 'Nitrogen slightly low', solution: 'Add 50kg/ha Urea or organic compost', priority: 'high' },
        { issue: 'Organic matter below optimal', solution: 'Incorporate 5 tons/ha farmyard manure', priority: 'medium' },
        { issue: 'Zinc deficiency', solution: 'Apply 25kg/ha Zinc Sulphate', priority: 'medium' }
      ],
      fertilizationPlan: {
        preSowing: [
          { nutrient: 'DAP', quantity: '100 kg/acre', timing: '1 week before sowing' },
          { nutrient: 'MOP', quantity: '50 kg/acre', timing: '1 week before sowing' }
        ],
        atSowing: [
          { nutrient: 'Urea', quantity: '50 kg/acre', timing: 'At sowing' }
        ],
        topDressing: [
          { nutrient: 'Urea', quantity: '50 kg/acre', timing: '30 days after sowing' },
          { nutrient: 'Urea', quantity: '25 kg/acre', timing: '60 days after sowing' }
        ]
      }
    });
    
    setRecommendations([
      {
        crop: 'Rice',
        suitability: 85,
        expectedYield: '4500 kg/hectare',
        profitability: 'High',
        reasons: ['Suitable pH level', 'Good water retention', 'Adequate NPK levels']
      },
      {
        crop: 'Wheat',
        suitability: 78,
        expectedYield: '3800 kg/hectare',
        profitability: 'Medium',
        reasons: ['Good soil texture', 'Suitable pH', 'May need additional nitrogen']
      },
      {
        crop: 'Maize',
        suitability: 82,
        expectedYield: '5200 kg/hectare',
        profitability: 'High',
        reasons: ['Excellent drainage', 'Good nutrient profile', 'Suitable organic matter']
      }
    ]);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  // Chart configurations
  const nutrientChartData = {
    labels: ['N', 'P', 'K', 'S', 'Zn', 'Fe'],
    datasets: [
      {
        label: 'Current Levels',
        data: [soilData.nitrogen, soilData.phosphorus * 10, soilData.potassium, soilData.sulfur * 10, soilData.zinc * 100, soilData.iron * 50],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2
      },
      {
        label: 'Optimal Levels',
        data: [300, 350, 280, 250, 200, 250],
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }
    ]
  };

  const soilCompositionData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'Organic Matter', 'Others'],
    datasets: [
      {
        data: [30, 15, 25, 20, 10],
        backgroundColor: [
          '#22c55e',
          '#3b82f6',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444'
        ]
      }
    ]
  };

  const NutrientCard = ({ nutrient, value, unit, optimal, icon: Icon, color }) => {
    const percentage = (value / optimal) * 100;
    const status = percentage >= 80 ? 'Optimal' : percentage >= 50 ? 'Moderate' : 'Deficient';
    
    return (
      <Card className="h-full">
        <CardContent>
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center gap-2">
              <Avatar className={`bg-${color}-100 w-10 h-10`}>
                <Icon className={`text-${color}-600`} fontSize="small" />
              </Avatar>
              <Typography variant="h6">{nutrient}</Typography>
            </Box>
            <Chip
              label={status}
              size="small"
              color={percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
            />
          </Box>
          <Typography variant="h4" className="font-bold mb-1">
            {value}
            <Typography component="span" variant="body1" className="ml-1 text-gray-600">
              {unit}
            </Typography>
          </Typography>
          <Box className="mt-3">
            <Box className="flex justify-between mb-1">
              <Typography variant="caption">Optimal: {optimal} {unit}</Typography>
              <Typography variant="caption">{Math.round(percentage)}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(percentage, 100)}
              color={percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
              className="h-2"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box className="text-center mb-8">
          <Typography variant="h3" className="font-bold text-gray-800 mb-4">
            Soil Health Analysis 🌱
          </Typography>
          <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
            Analyze your soil's nutrient profile and get personalized recommendations
            for optimal crop growth and fertilizer management.
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper className="p-4 mb-6">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step 1: Soil Parameters */}
        {activeStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Paper className="p-6">
              <Typography variant="h5" className="mb-4">
                Enter Soil Test Results
              </Typography>
              
              <Grid container spacing={3}>
                {/* pH Level */}
                <Grid item xs={12} md={6}>
                  <Card className="p-4">
                    <Typography variant="h6" className="mb-3">pH Level</Typography>
                    <Box className="px-3">
                      <Slider
                        value={soilData.pH}
                        onChange={(e, v) => handleInputChange('pH', v)}
                        min={4}
                        max={10}
                        step={0.1}
                        marks={[
                          { value: 4, label: '4 (Acidic)' },
                          { value: 7, label: '7 (Neutral)' },
                          { value: 10, label: '10 (Alkaline)' }
                        ]}
                        valueLabelDisplay="on"
                        color={soilData.pH >= 6 && soilData.pH <= 7.5 ? 'success' : 'warning'}
                      />
                    </Box>
                  </Card>
                </Grid>

                {/* Organic Matter */}
                <Grid item xs={12} md={6}>
                  <Card className="p-4">
                    <Typography variant="h6" className="mb-3">Organic Matter (%)</Typography>
                    <Box className="px-3">
                      <Slider
                        value={soilData.organicMatter}
                        onChange={(e, v) => handleInputChange('organicMatter', v)}
                        min={0}
                        max={10}
                        step={0.5}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 5, label: '5%' },
                          { value: 10, label: '10%' }
                        ]}
                        valueLabelDisplay="on"
                        color={soilData.organicMatter >= 2.5 ? 'success' : 'warning'}
                      />
                    </Box>
                  </Card>
                </Grid>

                {/* NPK Values */}
                <Grid item xs={12}>
                  <Typography variant="h6" className="mb-3">Primary Nutrients (NPK)</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Nitrogen (N)"
                        type="number"
                        value={soilData.nitrogen}
                        onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">kg/ha</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Phosphorus (P)"
                        type="number"
                        value={soilData.phosphorus}
                        onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">kg/ha</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Potassium (K)"
                        type="number"
                        value={soilData.potassium}
                        onChange={(e) => handleInputChange('potassium', e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">kg/ha</InputAdornment>
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Box className="flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      startIcon={<CloudUpload />}
                    >
                      Upload Lab Report
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(1)}
                      className="bg-gradient-to-r from-green-600 to-green-700"
                    >
                      Next: Location Details
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}

        {/* Step 2: Location & Details */}
        {activeStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Paper className="p-6">
              <Typography variant="h5" className="mb-4">
                Location & Sampling Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location / Field Name"
                    value={soilData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Soil Texture</InputLabel>
                    <Select
                      value={soilData.texture}
                      onChange={(e) => handleInputChange('texture', e.target.value)}
                      label="Soil Texture"
                    >
                      {soilTextures.map(texture => (
                        <MenuItem key={texture} value={texture.toLowerCase()}>
                          {texture}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box className="flex justify-between">
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(0)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setActiveStep(2);
                        performAnalysis();
                      }}
                      className="bg-gradient-to-r from-green-600 to-green-700"
                    >
                      Analyze Soil
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}

        {/* Step 3: Analysis in Progress */}
        {activeStep === 2 && loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Paper className="p-8 text-center">
              <Science className="text-6xl text-green-600 mb-4 animate-pulse" />
              <Typography variant="h5" className="mb-4">
                Analyzing Soil Health...
              </Typography>
              <LinearProgress className="max-w-md mx-auto mb-4" />
              <Typography variant="body2" className="text-gray-600">
                Calculating nutrient levels and generating recommendations
              </Typography>
            </Paper>
          </motion.div>
        )}

        {/* Step 4: Results & Recommendations */}
        {activeStep === 3 && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Grid container spacing={3}>
              {/* Soil Health Score */}
              <Grid item xs={12}>
                <Paper className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Box className="text-center">
                        <Typography variant="h2" className="font-bold">
                          {analysisResult.healthScore}%
                        </Typography>
                        <Typography variant="h5">
                          Soil Health Score
                        </Typography>
                        <Chip
                          label={getHealthLabel(analysisResult.healthScore)}
                          className="mt-2 bg-white/20 text-white"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" className="mb-2">
                        Soil Classification: {analysisResult.classification}
                      </Typography>
                      <Typography variant="body1" className="mb-3">
                        Fertility Level: {analysisResult.fertility}
                      </Typography>
                      <Box className="flex flex-wrap gap-2">
                        <Typography variant="body2">Suitable for:</Typography>
                        {analysisResult.suitableFor.map(crop => (
                          <Chip
                            key={crop}
                            label={crop}
                            size="small"
                            className="bg-white/20 text-white"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Tabs */}
              <Grid item xs={12}>
                <Paper>
                  <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                    <Tab label="Nutrient Analysis" />
                    <Tab label="Crop Recommendations" />
                    <Tab label="Fertilization Plan" />
                    <Tab label="Improvements Needed" />
                  </Tabs>

                  {/* Tab Content */}
                  <Box className="p-4">
                    {tabValue === 0 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <NutrientCard
                            nutrient="Nitrogen"
                            value={soilData.nitrogen}
                            unit="kg/ha"
                            optimal={300}
                            icon={BubbleChart}
                            color="green"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <NutrientCard
                            nutrient="Phosphorus"
                            value={soilData.phosphorus}
                            unit="kg/ha"
                            optimal={35}
                            icon={Science}
                            color="blue"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <NutrientCard
                            nutrient="Potassium"
                            value={soilData.potassium}
                            unit="kg/ha"
                            optimal={280}
                            icon={LocalFlorist}
                            color="purple"
                          />
                        </Grid>
                      </Grid>
                    )}

                    {tabValue === 3 && (
                      <Grid container spacing={2}>
                        {analysisResult.improvements?.map((improvement, idx) => (
                          <Grid item xs={12} key={idx}>
                            <Alert 
                              severity={improvement.priority === 'high' ? 'error' : 'warning'}
                              action={
                                <Button size="small" color="inherit">
                                  Fix Now
                                </Button>
                              }
                            >
                              <Typography variant="subtitle2" className="font-semibold">
                                {improvement.issue}
                              </Typography>
                              <Typography variant="body2">
                                {improvement.solution}
                              </Typography>
                            </Alert>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box className="flex justify-center gap-3">
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => {
                      setActiveStep(0);
                      setAnalysisResult(null);
                    }}
                  >
                    New Analysis
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    className="bg-gradient-to-r from-green-600 to-green-700"
                  >
                    Download Report
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/marketplace?category=fertilizers')}
                  >
                    Buy Fertilizers
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default SoilAnalysis;
