// models/Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  chat_id: String,
  user_id: String,
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', ChatSchema, 'chats');