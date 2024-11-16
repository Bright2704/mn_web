// controllers/UserController.js
const User = require('../models/User');

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ user_id: userId }, { password: 0 }); // Exclude password
    
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