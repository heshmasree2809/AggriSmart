const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { verifyToken } = require('../middleware/auth');

// Weather routes - all protected
router.get('/forecast', verifyToken, weatherController.getWeatherForecast);
router.get('/historical', verifyToken, weatherController.getHistoricalWeather);
router.get('/alerts', verifyToken, weatherController.getWeatherAlerts);
router.get('/insights', verifyToken, weatherController.getAgriculturalInsights);

module.exports = router;