const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Example protected route to check if token is valid
router.post('/verifyToken', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Token is valid', user: req.user });
});

module.exports = router;