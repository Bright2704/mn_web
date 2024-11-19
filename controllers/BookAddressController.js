// controllers/BookAddressController.js
const BookAddress = require('../models/BookAddress');

// Create a new address entry
exports.createAddress = async (req, res) => {
  try {
    const { 
      user_id, 
      name, 
      address, 
      province, 
      districts, 
      subdistricts, 
      postalCode, 
      phone 
    } = req.body;

    // Check if user_id is provided
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const newAddress = new BookAddress({
      user_id,
      name,
      address,
      province,
      districts,
      subdistricts,
      postalCode,
      phone
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await BookAddress.find();
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Update an address by ID
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAddress = await BookAddress.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(updatedAddress);
  } catch (err) {
    console.error('Error updating address:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an address by ID
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await BookAddress.findByIdAndDelete(id);
    if (!deletedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('Error deleting address:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get addresses by user ID
exports.getAddressByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const addresses = await BookAddress.find({ user_id: userId });
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};