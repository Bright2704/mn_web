import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
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
            type: String, // Format "MN_xxxx"
            required: true,
            unique: true, // Ensure unique user_id
        },
    },
    { timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
