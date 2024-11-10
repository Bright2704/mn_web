// routes/withdrawRoutes.js
const express = require('express');
const router = express.Router();
const withdrawController = require('../controllers/withdrawController');

// Create new withdrawal
router.post('/', withdrawController.createWithdraw);

// Get withdrawals by user ID
router.get('/user/:userId', withdrawController.getWithdrawsByUser);

// Get specific withdrawal
router.get('/:id', withdrawController.getWithdraw);

// Update withdrawal status
router.patch('/:id/status', withdrawController.updateWithdrawStatus);

module.exports = router;