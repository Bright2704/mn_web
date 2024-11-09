// controllers/TrackingController.js
const Tracking = require('../models/Tracking');

exports.getAllTracking = async (req, res) => {
  try {
    const trackingData = await Tracking.find();
    res.json(trackingData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTracking = async (req, res) => {
  try {
    const newTracking = new Tracking(req.body);
    const savedTracking = await newTracking.save();
    res.status(201).json(savedTracking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTrackingStatus = async (req, res) => {
  try {
    const tracking = await Tracking.findOneAndUpdate(
      { tracking_id: req.params.id },
      req.body,
      { new: true }
    );
    if (!tracking) return res.status(404).json({ error: 'Tracking not found' });
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTracking = async (req, res) => {
  try {
    const tracking = await Tracking.findOneAndDelete({ tracking_id: req.params.id });
    if (!tracking) return res.status(404).json({ error: 'Tracking not found' });
    res.json({ message: 'Tracking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
