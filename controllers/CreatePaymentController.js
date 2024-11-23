// controllers/CreatePaymentController.js
const CreatePayment = require('../models/CreatePayment');
const TaxInfo = require('../models/TaxInfo');


exports.getAllPayments = async (req, res) => {
  try {
    const payments = await CreatePayment.find()
      .populate('taxInfo');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const nextPayId = await generateNextPayId();
    const { taxInfo, ...paymentData } = req.body;

    // Initialize payment data with tax info directly from request
    const paymentWithTax = {
      ...paymentData,
      pay_id: nextPayId,
      taxInfo: taxInfo ? {
        name: taxInfo.name,
        address: taxInfo.address,
        phone: taxInfo.phone,
        taxId: taxInfo.taxId,
        customerType: taxInfo.customerType,
        document: taxInfo.document
      } : null
    };

    const newPayment = new CreatePayment(paymentWithTax);
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateNextPayId = async (req, res) => {
  try {
    const nextId = await generateNextPayId();
    res.json({ nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function generateNextPayId() {
  const lastPayment = await CreatePayment.findOne().sort({ pay_id: -1 });
  if (!lastPayment || !lastPayment.pay_id) {
    return 'PAY_0001';
  }
  const match = lastPayment.pay_id.match(/PAY_(\d+)/);
  if (!match) {
    return 'PAY_0001';
  }
  const lastId = parseInt(match[1], 10);
  return `PAY_${(lastId + 1).toString().padStart(4, '0')}`;
}

// controllers/CreatePaymentController.js - Add new methods
exports.updatePaymentStatus = async (req, res) => {
    try {
      const payment = await CreatePayment.findOneAndUpdate(
        { pay_id: req.params.id },
        { status: req.body.status },
        { new: true }
      );
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };