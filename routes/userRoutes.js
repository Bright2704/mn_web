// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Add this specific route before other routes to avoid conflicts
router.get('/ids', userController.getUserIds);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUser);
router.patch('/update/:userId', userController.updateLineId);
router.get('/get-user-id', userController.getUserIdFromSession);

module.exports = router;