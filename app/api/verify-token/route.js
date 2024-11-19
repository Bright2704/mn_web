import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/user";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    await connectMongoDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new NextResponse("Invalid token or has expired", { status: 400 });
    }

    return new NextResponse(
      JSON.stringify({ id: user.user_id, email: user.email }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
