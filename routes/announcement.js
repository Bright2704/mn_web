const express = require('express');
const router = express.Router();
const Markdown = require('../models/Announcement');



router.post('/create', async (req, res) => {
  const { content, color } = req.body;

  try {
    const newAnnouncement = new Markdown({
      content: content || 'ประกาศใหม่',
      color: color || '#FFF9C4',
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update Announcement
router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    await Markdown.findByIdAndUpdate(id, { content });
    res.status(200).json({ message: 'Announcement updated successfully!' });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Get All Announcements
router.get('/get', async (req, res) => {
  try {
    const announcements = await Markdown.find();
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Delete Announcement
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Markdown.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted successfully!' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router;
