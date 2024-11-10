// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const TrackingController = require('../controllers/TrackingController');

router.get('/', TrackingController.getAllTracking);
router.post('/', TrackingController.createTracking);
router.put('/:id/status', TrackingController.updateTrackingStatus);
router.delete('/:id', TrackingController.deleteTracking);

module.exports = router;
