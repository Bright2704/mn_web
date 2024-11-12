// controllers/withdrawController.js
const Withdraw = require('../models/withdrawModel');
const mongoose = require('mongoose');
const moment = require('moment');

// Generate next withdraw ID
const generateNextWithdrawId = async () => {
  try {
    const lastWithdraw = await Withdraw.findOne().sort({ withdraw_id: -1 });
    if (!lastWithdraw || !lastWithdraw.withdraw_id) {
      return 'WTD_0001';
    }
    const match = lastWithdraw.withdraw_id.match(/WTD_(\d+)/);
    if (!match) {
      return 'WTD_0001';
    }
    const lastId = parseInt(match[1], 10);
    return `WTD_${(lastId + 1).toString().padStart(4, '0')}`;
  } catch (err) {
    throw new Error('Error generating withdraw ID');
  }
};

exports.createWithdraw = async (req, res) => {
  try {
    const {
      user_id,
      bank,
      account_name,
      account_number,
      branch,
      withdraw_amount
    } = req.body;

    // Generate withdraw ID
    const withdraw_id = await generateNextWithdrawId();

    // Format current date
    const date_withdraw = moment().format('DD/MM/YYYY HH:mm');

    const newWithdraw = new Withdraw({
      withdraw_id,
      user_id,
      date_withdraw,
      date_success: '',
      bank,
      account_name,
      account_number,
      branch,
      withdraw_amount,
      status: 'wait',
      slip: ''
    });

    const savedWithdraw = await newWithdraw.save();
    res.status(201).json(savedWithdraw);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get withdrawals by user ID
exports.getWithdrawsByUser = async (req, res) => {
  try {
    const withdraws = await Withdraw.find({ user_id: req.params.userId });
    res.json(withdraws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific withdrawal
exports.getWithdraw = async (req, res) => {
    try {
      let withdraw;
      
      // First try to find by withdraw_id
      withdraw = await Withdraw.findOne({ withdraw_id: req.params.id });
      
      // If not found and ID is valid ObjectId, try finding by _id
      if (!withdraw && mongoose.Types.ObjectId.isValid(req.params.id)) {
        withdraw = await Withdraw.findById(req.params.id);
      }
  
      if (!withdraw) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลการถอนเงิน' });
      }
      
      res.json(withdraw);
    } catch (err) {
      console.error('Error fetching withdraw:', err);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์' });
    }
  };

// Update withdrawal status
exports.updateWithdrawStatus = async (req, res) => {
  try {
    const { status, date_success } = req.body;
    const withdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        date_success: status === 'success' ? moment().format('DD/MM/YYYY HH:mm') : ''
      },
      { new: true }
    );
    if (!withdraw) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    res.json(withdraw);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this new function to get all withdrawals
exports.getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find({})
      .sort({ date_withdraw: -1 }); // Sort by newest first
    res.json(withdraws);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { withdrawId } = req.params;
    const { status, date_success,note } = req.body;
    
    const updateData = {
      status,
      date_success,
      slip: req.file ? `/storage/slips/withdraw/${req.file.filename}` : undefined,
      note
    };

    const updatedWithdraw = await Withdraw.findOneAndUpdate(
      { withdraw_id: withdrawId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedWithdraw) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    res.json(updatedWithdraw);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};