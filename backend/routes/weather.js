const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const authMiddleware = require('../authMiddleware');

// This route is protected
router.get('/forecast', authMiddleware, weatherController.getWeatherForecast);

module.exports = router;