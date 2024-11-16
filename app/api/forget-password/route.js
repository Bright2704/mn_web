import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import crypto from "crypto"
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export async function POST(req) {
        
    try {
        const { email } = await req.json();

        await connectMongoDB();

        // Fetch the latest user to determine the last user_id
        const existingUser = await User.findOne({ email }); // Get the latest user by creation date
        

        if (!existingUser) {
            return NextResponse("อีเมลนี้ยังไม่เคยลงทะเบียน!", { status: 400})
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const passwordResetExpires = Date.now() + 3600000;

        existingUser.resetToken = passwordResetToken;
        existingUser.resetTokenExpiry = passwordResetExpires;
        const resetUrl = `localhost:3000/reset-password/${resetToken}`

        console.log(resetUrl)

        const mailerSend = MailerSend({
            apiKey: "mlsn.dcac2ff340878404cbcfa5be55a561dec4be0471b93b51f2b9f051122016cb81",
          });

        const sentFrom = Sender("trial-jpzkmgqr0x14059v.mlsender.net", "nextjs14");

        const recipients = [
            Recipient(existingUser.email, existingUser.name)
          ];

        const emailParams = EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(sentFrom)
          .setSubject("This is a Subject")
          .setHtml("<strong>This is the HTML content</strong>")
          .setText("click this url to reset password: " + resetUrl);

        await mailerSend.email.send(emailParams);

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้งานสำเร็จ" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน", error: error.message }, { status: 500 });
    }

        // try {
        //     await existingUser.save();
        //     return new NextResponse.json({ message: "ลิงค์สำหรับรีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว" }, { status: 200 });
        // } catch(error) {
        //     return new NextResponse.json({ message: "failed sending email. try again"}, { status: 500});
        // }
}
