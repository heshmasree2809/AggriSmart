const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

// All order routes are protected (require JWT token)
// IMPORTANT: Specific routes must come before parameterized routes
router.post('/checkout', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.put('/:id', verifyToken, orderController.updateOrder);

module.exports = router;

