// ./models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            default: "user",
        },
        user_id: {
            type: String,
            required: true,
            unique: true,
        },
        user_type: {
            type: String,
            required: true,
            default: "normal", // New field with default value "normal"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);