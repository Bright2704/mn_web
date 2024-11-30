// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message_id: String,
  chat_id: String,
  sender_id: String,
  sender_type: {
    type: String,
    enum: ['user', 'admin'],
  },
  content: String,
  read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema, 'messages');