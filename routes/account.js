// routes/account.js
const express = require('express');
const router = express.Router();
const { AccountInfo, AccountUpdate, AccountDelete} = require('../controllers/account');

// Get account info
router.get('/account-info', AccountInfo);

// Update account info
router.post('/account-update', AccountUpdate);


router.delete('/account-delete', AccountDelete)

module.exports = router;