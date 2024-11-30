// models/Chat.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: mongoose.Schema.Types.Mixed, // Can be string for text or object for files
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const ChatSchema = new mongoose.Schema({
  chat_id: String,
  user_id: String,
  user_name: String,
  messages: [MessageSchema],
  lastMessage: String,
  lastMessageTime: Date,
  unreadCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Chat', ChatSchema);