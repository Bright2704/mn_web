// routes/withdrawRoutes.js
const express = require('express');
const router = express.Router();
const withdrawController = require('../controllers/withdrawController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/storage/slips/withdraw');
    },
    filename: (req, file, cb) => {
      const withdraw_id = req.params.withdrawId;
      cb(null, `${withdraw_id}${path.extname(file.originalname)}`);
    }
  });
  
  const upload = multer({ storage: storage });

router.patch('/:withdrawId/status', upload.single('slip'), withdrawController.updateStatus);

// Create new withdrawal
router.post('/', withdrawController.createWithdraw);

// Get withdrawals by user ID
router.get('/user/:userId', withdrawController.getWithdrawsByUser);

// Get specific withdrawal
router.get('/:id', withdrawController.getWithdraw);

// Update withdrawal status
router.patch('/:id/status', withdrawController.updateWithdrawStatus);

// Add this new route to get all withdrawals
router.get('/', withdrawController.getAllWithdraws);

module.exports = router;