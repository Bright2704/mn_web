// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.get('/', ChatController.getAllChats);
router.get('/:id', ChatController.getChatById);
router.post('/', ChatController.createOrGetChat);  // Changed this route
router.post('/:id/messages', ChatController.addMessage);
router.put('/:id/read', ChatController.markMessagesAsRead);

module.exports = router;