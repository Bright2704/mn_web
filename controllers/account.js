// controllers/account.js
const User = require('../models/User');

// Get Account Info (GET request)
exports.AccountInfo = async (req, res) =>{
    try{
        const user = await User.findOne({ email: req.body.email });
        // res.send('Get profile information')

        if (!user){
            return res.status(400).json({ message : "user email not found"});
        }

        // Send user profile data excluding sensitive info like password
        const { password , ...userProfile } = user.toObject();
        res.status(200).json(userProfile);
    }catch (err){
        console.log(err)
        res.status(500).json( {message : 'Server Error'})
    }
};

// Update Account Info (POST request)
exports.AccountUpdate = async (req, res)=>{
    try{
        // res.send('Update profile')
        const {user_id, name, email, role, user_type } = req.body;
        const user = await User.findOne({user_id});

        if (!user){
            return res.status(400).json({ message : 'User not found'})
        }

        // Update user profile
        user.name = name || user.name;
        user.email = email || user.email;
        // user.role = role || user.role;
        // user.user_type = user_type || user.user_type;

        // Save updated user
        await user.save();

        const updatedUser = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            user_type: user.user_type,
            // Any other fields you wish to include in the response
        };

        res.status(200).json({ 
            message : 'Account updated Successfully', 
            user : updatedUser
        })
    }catch (err){
        console.log(err)
        res.status(500).json({ message : 'Server Error'})
    }
};

exports.AccountDelete = async (req, res) => {
    try{
        res.send('Account was delete already')
    }catch (err){
        console.log(err)
        res.status(500).json({ message : 'Server Error'})
    }
};