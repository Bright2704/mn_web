const express = require('express');
const router = express.Router();
const BalanceController = require('../controllers/BalanceController');

// Existing routes
router.get('/', BalanceController.getAllBalances);
router.post('/', BalanceController.createBalance);
router.put('/:id', BalanceController.updateBalance);
router.delete('/:id', BalanceController.deleteBalance);

// New routes for getting the last balance and generating the next balance ID
router.get('/user/:userId/last', BalanceController.getLastBalanceByUserId);
router.get('/next-id', BalanceController.generateNextBalanceId);

module.exports = router;
