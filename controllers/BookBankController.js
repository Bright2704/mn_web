// controllers/BookBankController.js
const BookBank = require('../models/BookBank');

// Create a new bank account entry
exports.createBankAccount = async (req, res) => {
    try {
      const { user_id, bank, account_name, account_number, branch } = req.body;
  
      // Check if user_id is provided
      if (!user_id) {
        return res.status(400).json({ error: "User ID is required." });
      }
  
      const newBankAccount = new BookBank({
        user_id,
        bank,
        account_name,
        account_number,
        branch,
      });
  
      const savedBankAccount = await newBankAccount.save();
      res.status(201).json(savedBankAccount);
    } catch (error) {
      console.error('Error creating bank account:', error);
      res.status(500).json({ error: error.message });
    }
  };

// Fetch all bank accounts
exports.getAllBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BookBank.find();
    res.json(bankAccounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bank accounts' });
  }
};

// Update a bank account by ID
exports.updateBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBankAccount = await BookBank.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBankAccount) {
      return res.status(404).json({ error: 'Bank account not found' });
    }

    res.json(updatedBankAccount);
  } catch (err) {
    console.error('Error updating bank account:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a bank account by ID
exports.deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBankAccount = await BookBank.findByIdAndDelete(id);
    if (!deletedBankAccount) {
      return res.status(404).json({ error: 'Bank account not found' });
    }

    res.json({ message: 'Bank account deleted successfully' });
  } catch (err) {
    console.error('Error deleting bank account:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBankAccountsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const bankAccounts = await BookBank.find({ user_id: userId });
    res.json(bankAccounts);
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

