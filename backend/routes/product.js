const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const { requireFarmer } = require('../middleware/roleAuth');

// Public routes (no authentication required)
router.get('/categories', productController.getCategories);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes (authentication required)
// Farmers only routes
router.post('/', verifyToken, requireFarmer, productController.createProduct);
router.put('/:id', verifyToken, requireFarmer, productController.updateProduct);
router.delete('/:id', verifyToken, requireFarmer, productController.deleteProduct);
router.get('/my/products', verifyToken, requireFarmer, productController.getMyProducts);

module.exports = router;

