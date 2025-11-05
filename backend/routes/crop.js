const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');

// Get crop recommendations (Protected)
router.get('/recommendations', verifyToken, cropController.getCropRecommendations);

// Get crop details
router.get('/details/:crop', verifyToken, cropController.getCropDetails);

// Get seasonal calendar
router.get('/calendar', verifyToken, cropController.getSeasonalCalendar);

// Save crop recommendation (Admin only)
router.post(
  '/recommendation',
  verifyToken,
  requireAdmin,
  cropController.saveCropRecommendation
);

module.exports = router;
