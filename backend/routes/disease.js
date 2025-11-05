const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');
const { verifyToken } = require('../middleware/auth');
const { requireFarmer, requireExpert } = require('../middleware/roleAuth');

// Upload and scan disease (Farmers and Experts)
router.post(
  '/scan',
  verifyToken,
  diseaseController.upload.single('image'),
  diseaseController.scanDisease
);

// Get user's disease scans
router.get('/my-scans', verifyToken, diseaseController.getMyScans);

// Get single scan
router.get('/scan/:id', verifyToken, diseaseController.getScanById);

// Delete scan
router.delete('/scan/:id', verifyToken, diseaseController.deleteScan);

// Get disease statistics
router.get('/stats', verifyToken, diseaseController.getDiseaseStats);

// Expert review (Experts only)
router.put(
  '/scan/:id/review',
  verifyToken,
  requireExpert,
  diseaseController.reviewScan
);

module.exports = router;
