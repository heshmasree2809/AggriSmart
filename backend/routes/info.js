const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

// All these routes are public
router.get('/fertilizers', infoController.getFertilizers);
router.get('/pests', infoController.getPests);
router.get('/schemes', infoController.getSchemes);

module.exports = router;