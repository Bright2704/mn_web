const Announcement = require('../models/Announcement');
const marked = require('marked');

// สร้างประกาศใหม่
exports.createAnnouncement = async (req, res) => {
  const { content, color, Items } = req.body;

  try {
    // แปลง Markdown เป็น HTML ก่อนบันทึก
    const contentHtml = marked(content || 'ประกาศใหม่');

    // สร้างประกาศใหม่โดยใช้ HTML ที่แปลงแล้ว
    const newAnnouncement = new Announcement({
      content: contentHtml, // บันทึกเป็น HTML ที่แปลงแล้ว
      color: color || '#FFF9C4',
      Items: Items || [], // ส่ง Items ถ้ามี หรือใช้ [] หากไม่มี
    });

    // บันทึกลงฐานข้อมูล
    await newAnnouncement.save();

    // ส่งประกาศที่บันทึกแล้วกลับไป
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

// อัปเดตประกาศ
exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
};

// ดึงประกาศทั้งหมด
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// ลบประกาศ
exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Announcement.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted successfully!' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};
