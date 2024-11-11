// models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    Items: {
        type: Object,
        required: true,
    },
    User_id: {
        type: String,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now,
    },
});
// Create an index on 'create_date' for faster queries
AnnouncementSchema.index({ create_date: -1 });

module.exports = mongoose.model('Announcement', AnnouncementSchema);