// routes/announcement.js
const express = require('express');
const router = express.Router();
const { getLatestAnnouncement, getAllAnnouncement, AnnouncementCreate} = require('../controllers/announcement')

// GET latest announcement
router.get('/latest-announcement', getLatestAnnouncement);

// GET all announcement
router.get('/All-announcement', getAllAnnouncement);

// Update announcement
router.post('/announcement', AnnouncementCreate);

module.exports = router