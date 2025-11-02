const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../authMiddleware');

// All order routes are protected (require JWT token)
// IMPORTANT: Specific routes must come before parameterized routes
router.post('/checkout', authMiddleware, orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id', authMiddleware, orderController.updateOrder);

module.exports = router;

