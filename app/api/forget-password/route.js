import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import crypto from "crypto";
const nodemailer = require("nodemailer");

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectMongoDB();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse("อีเมลนี้ยังไม่เคยลงทะเบียน!", { status: 400 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = Date.now() + 3600000;

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetExpires;

    await existingUser.save();

    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    console.log(resetUrl);

    if (!process.env.USER || !process.env.APP_PASSWORD) {
      return NextResponse("Email configuration is missing", { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: 'MN1688',
        address: process.env.USER,
      },
      to: existingUser.email,
      subject: "Reset Your Password",
      text: `Hello ${existingUser.name},\n\nPlease use the following link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error("Error in sending email: ", error);
    return NextResponse("An error occurred while processing the request", { status: 500 });
  }
}

