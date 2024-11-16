const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const LotController = require('../controllers/LotController');

// Configure multer storage for lot files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'lotFile') {
      cb(null, './public/storage/lot/lot_file/');
    } else if (file.fieldname === 'lotImage') {
      cb(null, './public/storage/lot/lot_image/');
    } else {
      cb(new Error('Invalid file fieldname!'));
    }
  },
  filename: function (req, file, cb) {
    const lotId = req.params.lotId || req.body.lot_id || 'default';
    cb(null, `${lotId}${path.extname(file.originalname)}`);
  }
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Error: Invalid file type!'));
  }
});

const uploadLotFiles = upload.fields([
  { name: 'lotFile', maxCount: 1 },
  { name: 'lotImage', maxCount: 1 }
]);

// Routes
router.get('/', LotController.getAllLots);
router.get('/latest', LotController.getLatestLot);
router.post('/', LotController.createLot);
router.get('/:lotId', LotController.getLotById);
router.put('/:lotId', uploadLotFiles, LotController.updateLot);
router.get('/:lotId/attachments', LotController.getLotAttachments);
router.delete('/:lotId', LotController.deleteLot);

module.exports = router;