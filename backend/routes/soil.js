const express = require('express');
const router = express.Router();
const soilController = require('../controllers/soilController');
const authMiddleware = require('../authMiddleware');

// These routes must be protected
router.get('/', authMiddleware, soilController.getSoilData);
router.post('/', authMiddleware, soilController.updateSoilData);

module.exports = router;

