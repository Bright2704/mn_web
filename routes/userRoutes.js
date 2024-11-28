const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/ids', UserController.getAllUserIds);
router.get('/search', UserController.searchUsers);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);

module.exports = router;