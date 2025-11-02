import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
  Fade,
  Zoom
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Science as ScienceIcon,
  PhotoCamera as PhotoCameraIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import localStorageService from '../services/localStorage.service';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/NotificationSystem';

function PlantDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [disease, setDisease] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  // Load detection history
  useEffect(() => {
    const history = localStorageService.getDetections();
    setDetectionHistory(history);
  }, []);

  // Mock diseases database
  const mockDiseases = [
    {
      name: 'Leaf Spot',
      confidence: 85,
      description: 'Fungal disease causing circular spots on leaves',
      treatment: 'Apply fungicide, remove affected leaves, improve air circulation',
      severity: 'Medium',
      preventiveMeasures: ['Avoid overhead watering', 'Space plants properly', 'Use resistant varieties']
    },
    {
      name: 'Powdery Mildew',
      confidence: 92,
      description: 'White powdery fungal growth on leaves and stems',
      treatment: 'Apply neem oil, use sulfur-based fungicides, prune affected areas',
      severity: 'Low',
      preventiveMeasures: ['Ensure good air circulation', 'Avoid overcrowding', 'Water at soil level']
    },
    {
      name: 'Bacterial Blight',
      confidence: 78,
      description: 'Bacterial infection causing brown spots and wilting',
      treatment: 'Remove infected plants, apply copper-based bactericide',
      severity: 'High',
      preventiveMeasures: ['Use disease-free seeds', 'Rotate crops', 'Avoid working with wet plants']
    },
    {
      name: 'Healthy Plant',
      confidence: 95,
      description: 'No disease detected, plant appears healthy',
      treatment: 'Continue regular maintenance',
      severity: 'None',
      preventiveMeasures: ['Maintain current care routine', 'Monitor regularly']
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setDisease(null);
        showInfo('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) {
      showError('Please upload an image first');
      return;
    }
    
    setAnalyzing(true);
    showInfo('Analyzing image...');
    
    // Simulate API call with random disease detection
    setTimeout(() => {
      const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      setDisease(randomDisease);
      
      // Save to history
      const detection = {
        disease: randomDisease.name,
        confidence: randomDisease.confidence,
        severity: randomDisease.severity,
        image: selectedImage,
        userId: user?.id || 'guest'
      };
      
      const saved = localStorageService.saveDetection(detection);
      setDetectionHistory([saved, ...detectionHistory.slice(0, 9)]);
      
      setAnalyzing(false);
      
      if (randomDisease.name === 'Healthy Plant') {
        showSuccess('Great! Your plant appears to be healthy!');
      } else {
        showWarning(`Disease detected: ${randomDisease.name} (${randomDisease.confidence}% confidence)`);
      }
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setDisease(null);
    setAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'None') return 'success';
    if (severity === 'Moderate') return 'warning';
    return 'error';
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Plant Disease <span style={{ color: '#10b981' }}>Detection</span>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Upload a photo of your plant and get instant AI-powered disease diagnosis with treatment recommendations.
          </Typography>
        </Box>

        {/* Upload Section */}
        <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <Box textAlign="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.light',
                mx: 'auto',
                mb: 3
              }}
            >
              🌱
            </Avatar>
            
            <Typography variant="h5" fontWeight="semibold" gutterBottom>
              Upload Plant Image
            </Typography>
            
            <Paper
              elevation={2}
              sx={{
                border: '2px dashed',
                borderColor: 'primary.light',
                bgcolor: 'grey.50',
                borderRadius: 3,
                p: 6,
                mt: 3,
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
              
              <Box>
                <Typography variant="h2" sx={{ mb: 2 }}>📸</Typography>
                <Typography variant="h6" fontWeight="medium" gutterBottom>
                  {selectedImage ? 'Image Selected' : 'Drag & drop your image here'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or <span style={{ color: '#10b981', fontWeight: 'bold' }}>click to browse</span>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Supports JPG, PNG, GIF up to 10MB
                </Typography>
              </Box>
            </Paper>

            {selectedImage && (
              <Fade in>
                <Box sx={{ mt: 3 }}>
                  <Paper
                    elevation={2}
                    sx={{
                      bgcolor: 'primary.light',
                      p: 3,
                      mb: 3,
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PhotoCameraIcon color="primary" sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography fontWeight="medium">Image uploaded</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ready for analysis
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={analyzeImage}
                      disabled={analyzing}
                      startIcon={analyzing ? <CircularProgress size={20} color="inherit" /> : <ScienceIcon />}
                      sx={{ minWidth: 200 }}
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze Plant Health'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={resetAnalysis}
                      startIcon={<RefreshIcon />}
                    >
                      Choose Different Image
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>

        {/* Analysis Results */}
        {disease && (
          <Fade in>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
              <Box textAlign="center" mb={4}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.light',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  🔍
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Analysis Complete
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Here's what we found about your plant
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {/* Disease Info */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      bgcolor: 'primary.light',
                      height: '100%',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="semibold" gutterBottom>
                        Disease Detection Result
                      </Typography>
                      <Stack spacing={2} mt={2}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Detected Disease
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" gutterBottom color="error">
                            {disease.name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            Confidence:
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <LinearProgress
                              variant="determinate"
                              value={disease.confidence}
                              sx={{ flex: 1, height: 8, borderRadius: 1 }}
                              color="primary"
                            />
                            <Typography variant="body2" fontWeight="medium">
                              {disease.confidence}%
                            </Typography>
                          </Stack>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            Severity:
                          </Typography>
                          <Chip
                            label={disease.severity}
                            color={getSeverityColor(disease.severity)}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Treatment Info */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Card
                      sx={{
                        bgcolor: 'info.light',
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight="semibold" gutterBottom>
                          Treatment
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {disease.treatment}
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card
                      sx={{
                        bgcolor: 'secondary.light',
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight="semibold" gutterBottom>
                          Prevention
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {disease.preventiveMeasures ? disease.preventiveMeasures.join(', ') : 'Maintain regular monitoring'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>

              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={resetAnalysis}
                  startIcon={<RefreshIcon />}
                >
                  Analyze Another Plant
                </Button>
              </Box>
            </Paper>
          </Fade>
        )}

        {/* Tips Section */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            📸 Photography Tips
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" sx={{ mb: 2 }}>🌞</Typography>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                  Good Lighting
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Take photos in natural daylight for best results
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" sx={{ mb: 2 }}>🔍</Typography>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                  Clear Focus
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ensure the affected area is clearly visible and in focus
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" sx={{ mb: 2 }}>📏</Typography>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                  Close-up View
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get close enough to show disease symptoms clearly
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default PlantDetection;
