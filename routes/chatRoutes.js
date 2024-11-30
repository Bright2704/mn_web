// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.get('/', ChatController.getAllChats);
router.post('/', ChatController.createChat);
router.get('/:chatId/messages', ChatController.getChatMessages);
router.post('/message', ChatController.sendMessage);
router.put('/:chatId/read', ChatController.markAsRead);

module.exports = router;