const express = require('express');
const router = express.Router();
const soilController = require('../controllers/soilController');
const { verifyToken } = require('../middleware/auth');

// All routes are protected - require authentication
router.get('/', verifyToken, soilController.getSoilData);
router.post('/', verifyToken, soilController.updateSoilData);
router.get('/analysis', verifyToken, soilController.getSoilHealthAnalysis);
router.get('/history', verifyToken, soilController.getSoilHistory);
router.get('/compare', verifyToken, soilController.compareSoilData);

module.exports = router;

