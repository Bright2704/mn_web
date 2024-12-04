const { getSession } = require("next-auth/react");
const User = require('../models/User');
const { getToken } = require('next-auth/jwt');

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ user_id: userId }, { password: 0 });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, line_id, facebook } = req.body;

    // Check for duplicate email
    const existingUserWithEmail = await User.findOne({ 
      email, 
      user_id: { $ne: userId } 
    });
    if (existingUserWithEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Check for duplicate phone
    const existingUserWithPhone = await User.findOne({ 
      phone, 
      user_id: { $ne: userId } 
    });
    if (existingUserWithPhone) {
      return res.status(400).json({ error: 'Phone number already in use' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { 
        name,
        email,
        phone,
        line_id,
        facebook
      },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/UserControllers.js

exports.updateLineId = async (req, res) => {
  try {
    const { userId } = req.params;  // userId from the URL params
    const { lineId } = req.body;    // lineId from the request body

    if (!lineId) {
      return res.status(400).json({ error: "Line ID is required" });
    }

    console.log('User ID from request params:', userId);  // Check the userId from the URL params

    // Find and update the user by userId
    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },  // Find the user by userId from the URL
      { 
        line_id: lineId,    // Update the line_id
        status_line: true    // Set status_line to true
      },
      { new: true }           // Return the updated user document
    );

    // If no user is found with the given userId
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the updated user information
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating Line ID" });
  }
};



exports.getUserIdFromSession = async (req, res) => {
  try {
    const { getToken } = require('next-auth/jwt');  // นำเข้า getToken จาก next-auth/jwt
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });  // ถ้าไม่มี token จะส่งสถานะ 401 (Unauthorized)
    }

    // ถ้ามี token ให้ส่งข้อมูล user_id
    res.status(200).json({ user_id: token.user_id });  // ส่ง user_id ที่อยู่ใน token
  } catch (error) {
    console.error('Error fetching user ID from token:', error);
    res.status(500).json({ message: "Internal server error" });  // ถ้ามีข้อผิดพลาดในการดึงข้อมูลจะส่งสถานะ 500 (Internal Server Error)
  }
};

// controllers/UserController.js

exports.removeUserLineId = async (req, res) => {
  try {
    const { userId } = req.params;  // รับ userId จาก URL params

    // ค้นหาผู้ใช้และลบ lineId
    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },  // ค้นหาผู้ใช้โดยใช้ user_id
      { line_id: null, status_line: false },  // ลบ line_id และตั้ง status_line เป็น false
      { new: true }  // คืนค่าผู้ใช้ที่อัปเดตแล้ว
    );

    // ถ้าผู้ใช้ไม่พบ
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ส่งข้อมูลผู้ใช้ที่อัปเดตแล้วกลับไป
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error removing Line ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getStatusLine = async (req, res) => {
  try {
    // รับ userId จาก URL params
    const { userId } = req.params;

    // ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้ user_id
    const user = await User.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ส่งสถานะ status_line ของผู้ใช้กลับไป
    res.status(200).json({ status_line: user.status_line });
  } catch (error) {
    console.error('Error fetching status line:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
