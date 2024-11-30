// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Chat = require('../models/Chat');

// Create storage directories
const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storageDirectories = [
  './public/storage/chat/user/file',
  './public/storage/chat/user/image',
  './public/storage/chat/admin/file',
  './public/storage/chat/admin/image'
];

storageDirectories.forEach(createDirIfNotExists);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!req.body.sender) {
      cb(new Error('Sender not specified'));
      return;
    }

    const isImage = file.mimetype.startsWith('image/');
    const baseDir = path.join(process.cwd(), 'public', 'storage', 'chat');
    const directory = path.join(baseDir, req.body.sender, isImage ? 'image' : 'file');

    // Ensure directory exists
    createDirIfNotExists(directory);

    cb(null, directory);
  },
  filename: async function(req, file, cb) {
    try {
      if (!req.params.id || !req.body.sender) {
        cb(new Error('Missing required parameters'));
        return;
      }

      const chat = await Chat.findOne({ chat_id: req.params.id });
      if (!chat) {
        cb(new Error('Chat not found'));
        return;
      }

      const messageIndex = chat.messages.length + 1;
      const extension = path.extname(file.originalname);
      const filename = `${req.params.id}_${req.body.sender}_${messageIndex}${extension}`;
      
      cb(null, filename);
    } catch (error) {
      cb(error);
    }
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Invalid file type'), false);
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware for multer errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: error.message
    });
  }
  next(error);
};

// Routes
router.get('/', ChatController.getAllChats);
router.get('/:id', ChatController.getChatById);
router.post('/', ChatController.createOrGetChat);
router.post('/:id/messages', upload.single('file'), handleUploadError, ChatController.addMessage);
router.put('/:id/read', ChatController.markMessagesAsRead);

module.exports = router;