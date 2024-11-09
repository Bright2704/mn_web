const Deposit = require('../models/Deposit');


// Helper function to validate date format
const isValidDateFormat = (dateString) => {
  // Matches DD/MM/YYYY HH:MM format
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
  return dateRegex.test(dateString);
};

// Helper function to validate date values
const isValidDate = (day, month, year) => {
  const date = new Date(year, month - 1, day);
  return date.getDate() === parseInt(day) &&
         date.getMonth() === month - 1 &&
         date.getFullYear() === parseInt(year);
};

// Generate next deposit ID
async function generateNextDepositId() {
  try {
    const lastDeposit = await Deposit.findOne().sort({ deposit_id: -1 });
    if (!lastDeposit || !lastDeposit.deposit_id) {
      return 'DEP_0001';
    }
    const match = lastDeposit.deposit_id.match(/DEP_(\d+)/);
    if (!match) {
      console.error('Unexpected deposit_id format:', lastDeposit.deposit_id);
      return 'DEP_0001';
    }
    const lastId = parseInt(match[1], 10);
    if (isNaN(lastId)) {
      console.error('Failed to parse last deposit_id:', lastDeposit.deposit_id);
      return 'DEP_0001';
    }
    const nextId = lastId + 1;
    return `DEP_${nextId.toString().padStart(4, '0')}`;
  } catch (err) {
    console.error('Error generating next deposit_id:', err);
    return 'DEP_0001';
  }
}

// Fetch deposits by status
exports.getDepositsByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const deposits = status === 'all' ? await Deposit.find() : await Deposit.find({ status });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDeposit = async (req, res) => {
  try {
    const { date_deposit, date_success, user_id, amount, bank, status, note, six_digits } = req.body;

    // Validate required fields
    if (!date_deposit || !user_id || !amount || !bank || !status) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Validate date format
    if (date_deposit && !isValidDateFormat(date_deposit)) {
      return res.status(400).json({ error: 'Invalid date_deposit format. Use DD/MM/YYYY HH:MM' });
    }

    if (date_success && !isValidDateFormat(date_success)) {
      return res.status(400).json({ error: 'Invalid date_success format. Use DD/MM/YYYY HH:MM' });
    }

    const deposit_id = await generateNextDepositId();

    const newDeposit = new Deposit({
      deposit_id,
      date_deposit,
      date_success,
      user_id,
      amount,
      bank,
      status,
      slip: req.file ? `/storage/slips/${req.file.filename}` : null,
      note,
      six_digits
    });

    const savedDeposit = await newDeposit.save();
    res.status(201).json(savedDeposit);
  } catch (err) {
    console.error('Error creating new deposit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateDepositStatus = async (req, res) => {
  try {
    const { depositId } = req.params;
    const updateData = req.body;

    // Validate date_success format if it's included in the update
    if (updateData.date_success && !isValidDateFormat(updateData.date_success)) {
      return res.status(400).json({ error: 'Invalid date_success format. Use DD/MM/YYYY HH:MM' });
    }

    const updatedDeposit = await Deposit.findOneAndUpdate(
      { deposit_id: depositId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDeposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    res.json(updatedDeposit);
  } catch (err) {
    console.error('Error updating deposit:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch deposit by deposit_id
exports.getDepositById = async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ deposit_id: req.params.deposit_id });
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }
    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch deposits by user_id and status
exports.getDepositsByUserIdAndStatus = async (req, res) => {
  const { user_id, status } = req.params;
  try {
      const query = { user_id };
      if (status !== 'all') query.status = status;

      const deposits = await Deposit.find(query);

      if (deposits.length === 0) {
          // No deposits found, return an empty array with a success status
          return res.status(200).json([]);
      }

      res.json(deposits);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deposits' });
  }
};

// Endpoint to generate the next deposit ID
exports.getNextDepositId = async (req, res) => {
  try {
    const nextDepositId = await generateNextDepositId();
    res.json({ next_deposit_id: nextDepositId });
  } catch (err) {
    console.error('Error in /deposits/next-id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDepositsBySixDigits = async (req, res) => {
  try {
    const { six_digits } = req.params;
    
    // Change the response handling to return empty array instead of 404
    const deposits = await Deposit.find({ six_digits });
    
    // Return the deposits array even if empty
    res.json(deposits);
    
  } catch (err) {
    console.error('Error fetching deposits by six_digits:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update the front-end handling as well
exports.updateDepositSixDigits = async (req, res) => {
  try {
    const { depositId } = req.params;
    const { six_digits } = req.body;

    if (!six_digits || six_digits.length !== 6) {
      return res.status(400).json({ error: 'Six digits code is required and must be exactly 6 characters.' });
    }

    // First check if any other deposit has this six_digits
    const existingDeposit = await Deposit.findOne({ 
      six_digits,
      deposit_id: { $ne: depositId } // Exclude current deposit
    });

    if (existingDeposit) {
      return res.status(409).json({ 
        error: 'Six digits already in use',
        conflictingDeposit: existingDeposit
      });
    }

    const updatedDeposit = await Deposit.findOneAndUpdate(
      { deposit_id: depositId },
      { six_digits },
      { new: true, runValidators: true }
    );

    if (!updatedDeposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    res.json(updatedDeposit);
  } catch (err) {
    console.error('Error updating six_digits for deposit:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


