// routes/createPaymentRoutes.js
const express = require('express');
const router = express.Router();
const CreatePaymentController = require('../controllers/CreatePaymentController');

router.get('/', CreatePaymentController.getAllPayments);
router.post('/', CreatePaymentController.createPayment);
router.get('/next-id', CreatePaymentController.generateNextPayId);
router.put('/:id/status', CreatePaymentController.updatePaymentStatus);
router.get('/user/:userId', CreatePaymentController.getPaymentsByUserId); // New route to get payments by user_id

module.exports = router;