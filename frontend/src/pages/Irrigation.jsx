import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  WaterDrop as WaterDropIcon,
  Opacity as OpacityIcon,
  Agriculture as AgricultureIcon,
  WbSunny as WbSunnyIcon,
  Cloud as CloudIcon,
  Thunderstorm as ThunderstormIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  LocalDrink as LocalDrinkIcon,
  Thermostat as ThermostatIcon,
  ExpandMore as ExpandMoreIcon,
  Park as EcoIcon,
  Savings as SavingsIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Grass as GrassIcon,
  Terrain as TerrainIcon
} from '@mui/icons-material';
import irrigationDataJSON from '../data/irrigation.json';
import cropsDataJSON from '../data/crops.json';

const irrigationSystems = irrigationDataJSON.irrigationMethods || [];
const irrigationScheduleData = irrigationDataJSON.irrigationSchedule || [];
const irrigationScheduleMap = irrigationScheduleData.reduce((acc, item) => {
  if (item?.crop) {
    acc[item.crop.toLowerCase()] = item;
  }
  return acc;
}, {});
const waterRequirements = irrigationScheduleData.map(s => ({
  crop: s.crop,
  totalWaterRequirement: s.totalWaterRequirement,
  frequency: s.frequency
}));
const irrigationTips = irrigationDataJSON.waterManagementTips || [];
const cropsData = cropsDataJSON.cropDetails || [];

function Irrigation() {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSystem, setExpandedSystem] = useState(false);
  const [area, setArea] = useState(1);

  // Get crop specific water requirements
  const cropWaterData = useMemo(() => {
    return waterRequirements.find(w => w.crop === selectedCrop) || waterRequirements[0] || { crop: selectedCrop, totalWaterRequirement: 'N/A', frequency: 'N/A' };
  }, [selectedCrop]);

  // Get irrigation schedule for selected crop
  const cropSchedule = useMemo(() => {
    const scheduleKey = selectedCrop.toLowerCase();
    return irrigationScheduleMap[scheduleKey]?.criticalStages || irrigationScheduleMap['wheat']?.criticalStages || [];
  }, [selectedCrop]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Smart <span style={{ color: '#10b981' }}>Irrigation</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Optimize water usage with intelligent irrigation systems, scheduling, and conservation techniques
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} centered>
          <Tab label="Irrigation Systems" icon={<OpacityIcon />} iconPosition="start" />
          <Tab label="Crop Schedule" icon={<ScheduleIcon />} iconPosition="start" />
          <Tab label="Water Conservation" icon={<SavingsIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        /* Irrigation Systems Tab */
        <Grid container spacing={3}>
          {irrigationSystems.map((system) => (
            <Grid item xs={12} md={6} key={system.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {system.name}
                      </Typography>
                      <Chip 
                        label={system.type} 
                        color="primary" 
                        size="small" 
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                      <WaterDropIcon />
                    </Avatar>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {system.description}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Efficiency
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {system.efficiency}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Water Saving
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {system.waterSaving}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Accordion 
                    expanded={expandedSystem === system.id}
                    onChange={() => setExpandedSystem(expandedSystem === system.id ? false : system.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">View Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Advantages:
                        </Typography>
                        <List dense>
                          {system.advantages && Array.isArray(system.advantages) && system.advantages.length > 0 ? (
                            system.advantages.map((adv, idx) => (
                              <ListItem key={idx}>
                                <ListItemIcon>
                                  <CheckIcon fontSize="small" color="success" />
                                </ListItemIcon>
                                <ListItemText primary={adv} />
                              </ListItem>
                            ))
                          ) : (
                            <ListItem>
                              <ListItemText primary="No advantages listed" secondary="Information not available" />
                            </ListItem>
                          )}
                        </List>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Suitable For:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {system.suitableFor && Array.isArray(system.suitableFor) && system.suitableFor.length > 0 ? (
                            system.suitableFor.map((crop, idx) => (
                              <Chip 
                                key={idx} 
                                label={crop} 
                                size="small" 
                                icon={<AgricultureIcon />}
                                variant="outlined"
                              />
                            ))
                          ) : (
                            <Chip 
                              label="Various crops" 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        {system.cost && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            <AlertTitle>Cost</AlertTitle>
                            <Typography variant="body2">
                              {system.cost.installation && (
                                <>Installation: {system.cost.installation}<br /></>
                              )}
                              {system.cost.maintenance && (
                                <>Maintenance: {system.cost.maintenance}</>
                              )}
                              {!system.cost.installation && !system.cost.maintenance && (
                                <>Cost information not available</>
                              )}
                            </Typography>
                          </Alert>
                        )}
                        
                        {system.subsidy && (
                          <Alert severity="success" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              <strong>Subsidy:</strong> {system.subsidy}
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        /* Crop Schedule Tab */
        <Box>
          {/* Crop Selection */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Crop for Irrigation Schedule
            </Typography>
            <ToggleButtonGroup
              value={selectedCrop}
              exclusive
              onChange={(e, newCrop) => newCrop && setSelectedCrop(newCrop)}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {waterRequirements.map((req) => (
                <ToggleButton key={req.crop} value={req.crop}>
                  <AgricultureIcon sx={{ mr: 1 }} />
                  {req.crop}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Paper>

          {/* Water Requirements */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <WaterDropIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Water Requirements
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Water Need
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {cropWaterData?.totalWaterRequirement || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Frequency
                      </Typography>
                      <Typography variant="h5" color="secondary">
                        {cropWaterData?.frequency || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Critical Irrigation Stages
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Stage</TableCell>
                          <TableCell>Days</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cropSchedule && Array.isArray(cropSchedule) && cropSchedule.length > 0 ? (
                          cropSchedule.slice(0, 4).map((stage, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{stage?.stage || 'N/A'}</TableCell>
                              <TableCell>{stage?.days || 'N/A'}</TableCell>
                              <TableCell>
                                {stage?.critical ? (
                                  <Chip label="Critical" color="error" size="small" />
                                ) : (
                                  <Chip label="Normal" size="small" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No schedule data available
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        /* Water Conservation Tab */
        <Grid container spacing={3}>
          {/* Tips Grid */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Water Conservation Techniques
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: 'info.main', mb: 2 }}>
                  <WaterDropIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Drip Irrigation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use drip irrigation systems to deliver water directly to plant roots, reducing waste by up to 50%.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: 'success.main', mb: 2 }}>
                  <EcoIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Mulching
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Apply organic mulch around plants to retain soil moisture and reduce watering frequency.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: 'warning.main', mb: 2 }}>
                  <ThermostatIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Soil Moisture Sensors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Install soil moisture sensors to monitor water levels and irrigate only when needed.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: 'secondary.main', mb: 2 }}>
                  <TimerIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Timing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Water during early morning hours to minimize evaporation and maximize water absorption.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                  <CloudIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Rainwater Harvesting
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Collect and store rainwater for irrigation during dry periods to reduce dependency on groundwater.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: 'error.main', mb: 2 }}>
                  <InfoIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Smart Monitoring
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use smart irrigation controllers that adjust watering based on weather data and soil conditions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tips Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Quick Irrigation Tips
              </Typography>
              <List>
                {irrigationTips && Array.isArray(irrigationTips) && irrigationTips.length > 0 ? (
                  irrigationTips.map((tip, idx) => {
                    const primaryText = typeof tip === 'string' ? tip : tip.tip;
                    const secondaryText = typeof tip === 'string' ? null : tip.description;
                    return (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={primaryText} secondary={secondaryText} />
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItem>
                    <ListItemText primary="Tips information will be available soon" secondary="Data not available" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Irrigation;
