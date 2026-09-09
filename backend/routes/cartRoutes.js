const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.post('/', authMiddleware, cartController.addToCart);

router.get('/', authMiddleware, cartController.getCart);

router.put('/:productId', authMiddleware, cartController.updateCartQuantity);

router.delete('/:productId', authMiddleware, cartController.removeFromCart);

module.exports = router;
