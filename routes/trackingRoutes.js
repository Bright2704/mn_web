const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TrackingController = require('../controllers/TrackingController');

// Configure storage for multer
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

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
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

// Define routes
router.get('/search', TrackingController.searchTracking);
router.get('/', TrackingController.getAllTracking);
router.get('/:trackingId', TrackingController.getTrackingById);
router.get('/lot/:lotId', TrackingController.getTrackingByLotId);

router.post('/', (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'Error uploading files' });
    }
    TrackingController.createTracking(req, res, req.files);
  });
});

router.put('/:trackingId', (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'Error uploading files' });
    }
    TrackingController.updateTracking(req, res, req.files);
  });
});

router.put('/:trackingId/updateFields', TrackingController.updateTrackingFields);
router.put('/:trackingId/update-lot-id', TrackingController.updateLotId);

module.exports = router;