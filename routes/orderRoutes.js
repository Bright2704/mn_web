// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.get('/status/:status', OrderController.getOrdersByStatus);
router.put('/:id/status', OrderController.updateOrderStatus);
router.post('/', OrderController.createOrder);
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
