// routes/bookBankRoutes.js
const express = require('express');
const router = express.Router();
const BookBankController = require('../controllers/BookBankController');

// Routes
router.post('/', BookBankController.createBankAccount); // Create a new bank account
router.get('/', BookBankController.getAllBankAccounts); // Get all bank accounts
router.put('/:id', BookBankController.updateBankAccount); // Update a bank account by ID
router.delete('/:id', BookBankController.deleteBankAccount); // Delete a bank account by ID
router.get('/user/:userId', BookBankController.getBankAccountsByUserId);

module.exports = router;
