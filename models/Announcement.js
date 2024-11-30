// models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  Items: {
    type: [mongoose.Schema.Types.Mixed], // หรือ type: Array
    required: false, // ทำให้ฟิลด์นี้ไม่จำเป็น
  },
  content: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#FFF9C4',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Create an index on 'create_date' for faster queries
AnnouncementSchema.index({ create_date: -1 });

module.exports = mongoose.model('Announcement', AnnouncementSchema);