// controllers/LotController.js
const Lot = require('../models/Lot');

exports.getAllLots = async (req, res) => {
  try {
    const lots = await Lot.find();
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLot = async (req, res) => {
  try {
    const newLot = new Lot(req.body);
    const savedLot = await newLot.save();
    res.status(201).json(savedLot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLot = async (req, res) => {
  try {
    const lot = await Lot.findOneAndUpdate({ lot_id: req.params.id }, req.body, { new: true });
    if (!lot) return res.status(404).json({ error: 'Lot not found' });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLot = async (req, res) => {
  try {
    const lot = await Lot.findOneAndDelete({ lot_id: req.params.id });
    if (!lot) return res.status(404).json({ error: 'Lot not found' });
    res.json({ message: 'Lot deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
