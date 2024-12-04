const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TrackingController = require('../controllers/TrackingController');

// Configure storage for multer (keep your existing multer configuration)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'trackingFile') {
      cb(null, './public/storage/tracking/tracking_file/');
    } else if (file.fieldname === 'trackingImages') {
      cb(null, './public/storage/tracking/tracking_image/');
    }
  },
  filename: function (req, file, cb) {
    const tracking_id = req.body.tracking_id;
    if (file.fieldname === 'trackingFile') {
      cb(null, `${tracking_id}${path.extname(file.originalname)}`);
    } else if (file.fieldname === 'trackingImages') {
      const imageIndex = req.imageIndex || 1;
      cb(null, `${tracking_id}_${String(imageIndex).padStart(2, '0')}${path.extname(file.originalname)}`);
      req.imageIndex = (req.imageIndex || 1) + 1;
    }
  }
});

// Configure multer upload (keep your existing multer configuration)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5001000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Error: Invalid file type!'));
  }
}).fields([
  { name: 'trackingFile', maxCount: 1 },
  { name: 'trackingImages', maxCount: 10 }
]);

// Define routes - Reordered for proper routing
// Specific routes first
router.get('/search', TrackingController.searchTracking);
router.get('/lot-dates/:lotId', TrackingController.getLotDates);
router.get('/lot/:lotId', TrackingController.getTrackingByLotId);

// CRUD operations with ID parameters
router.put('/:trackingId/updateFields', TrackingController.updateTrackingFields);
router.put('/:trackingId/update-lot-id', TrackingController.updateLotId);
router.put('/:trackingId/removeFromLot', TrackingController.removeFromLot);
router.put('/:trackingId/resetDates', TrackingController.resetDates);

// Generic ID route
router.get('/:trackingId', TrackingController.getTrackingById);
router.put('/:trackingId', (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'Error uploading files' });
    }
    TrackingController.updateTracking(req, res, req.files);
  });
});

// Most generic routes last
router.get('/', TrackingController.getAllTracking);
router.post('/', (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'Error uploading files' });
    }
    TrackingController.createTracking(req, res, req.files);
  });
});

module.exports = router;