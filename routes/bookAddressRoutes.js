// routes/bookAddressRoutes.js
const express = require('express');
const router = express.Router();
const BookAddressController = require('../controllers/BookAddressController');

// Routes
router.post('/', BookAddressController.createAddress); // Create a new address
router.get('/', BookAddressController.getAllAddresses); // Get all addresses
router.put('/:id', BookAddressController.updateAddress); // Update an address by ID
router.delete('/:id', BookAddressController.deleteAddress); // Delete an address by ID
router.get('/user/:userId', BookAddressController.getAddressByUserId); // Get addresses by user ID

module.exports = router;