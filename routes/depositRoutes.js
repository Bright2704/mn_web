const express = require('express');
const router = express.Router();
const DepositController = require('../controllers/DepositController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure storage for multer (keep existing configuration)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/storage/slips');
  },
  filename: (req, file, cb) => {
    const deposit_id = req.body.deposit_id || 'default';
    cb(null, `${deposit_id}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Updated Routes
router.get('/status/:status', DepositController.getDepositsByStatus);
router.get('/user_id/:user_id/status/:status', DepositController.getDepositsByUserIdAndStatus);
router.post('/', upload.single('slip'), DepositController.createDeposit);
router.get('/next-id', DepositController.getNextDepositId);
router.get('/:deposit_id', DepositController.getDepositById);
router.get('/six_digits/:six_digits', DepositController.getDepositsBySixDigits);

// Fix the PUT routes
router.put('/:depositId', DepositController.updateDepositStatus);  // Main update route
router.put('/:depositId/update-six-digits', DepositController.updateDepositSixDigits);

module.exports = router;