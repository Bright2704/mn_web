// models/Chat.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: String,
  sender: {
    type: String,
    enum: ['user', 'admin']
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
  chat_id: {
    type: String,
    unique: true
  },
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

module.exports = mongoose.model('Chat', ChatSchema, 'chats');