import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();

        // Fetch the latest user to determine the last user_id
        const latestUser = await User.findOne().sort({ createdAt: -1 }); // Get the latest user by creation date

        let newUserId = 'MN_0001'; // Default for the first user

        if (latestUser) {
            const lastUserId = latestUser.user_id;
            const userNumber = parseInt(lastUserId.split('_')[1], 10); // Extract the number from "MN_xxxx"
            newUserId = `MN_${(userNumber + 1).toString().padStart(4, '0')}`; // Increment and pad with zeros
        }

        // Create new user with user_type set to "normal"
        await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            user_id: newUserId,
            user_type: "normal"  // Default value for user_type
        });

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้งานสำเร็จ" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน", error: error.message }, { status: 500 });
    }
}
