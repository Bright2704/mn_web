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

exports.AccountUpdate = async (req, res)=>{
    try{
        res.send('Update profile')
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