import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import User from "@/models/user";

export async function POST(req) {
  try {
    const { password, email, token } = await req.json();

    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 5);
    existingUser.password = hashedPassword;

    existingUser.resetToken = undefined;
    existingUser.resetTokenExpiry = undefined;

    await existingUser.save();

    return new NextResponse(
      "User's password is updated.",
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
    // return new NextResponse(`Error: ที่ไฟล์นี้`, { status: 500 });
  }
}
