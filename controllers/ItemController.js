// controllers/ItemController.js
const Item = require('../models/Item');

exports.getItemsByStatus = async (req, res) => {
  try {
    const items = await Item.find({ status: req.params.status });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
