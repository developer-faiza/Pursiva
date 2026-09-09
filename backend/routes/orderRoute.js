const express = require('express');

const router = express.Router();

const ownerAuthMiddleware = require('../middlewares/ownerMiddleware');

const authMiddleware = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

router.post('/', authMiddleware, orderController.createOrder);

router.get('/', authMiddleware, orderController.getMyOrders);

router.get('/all', ownerAuthMiddleware, orderController.getAllOrders);
router.put('/:id/status', ownerAuthMiddleware, orderController.updateOrderStatus);

module.exports = router;
