// components/LineNotification.tsx
"use client"
import React, { useState, FormEvent } from 'react';

export default function FormPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add form submission logic here
        console.log('Form Submitted:', { phoneNumber, email });
    };

    // Function to generate a random string for state parameter
    const generateRandomString = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    // Handle LINE Login
    const handleLineLogin = () => {
        const clientId = process.env.LINE_CHANNEL_ID; // Replace with your LINE Channel ID
        const redirectUri = 'https://yourapp.com/line-callback'; // Replace with your redirect URI
        const state = generateRandomString(16);
        const scope = 'profile openid email';
        const responseType = 'code';

        // Store state parameter to validate later
        localStorage.setItem('line_login_state', state);

        const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

        // Redirect to LINE Login
        window.location.href = lineAuthUrl;
    };
    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-3xl md:text-5xl pt-5 text-center">
                ตั้งค่า
            </h1>
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="mb-6">
                    <label htmlFor="phoneNumber" className="text-xl md:text-2xl">
                        เบอร์โทรศัพท์:
                    </label>
                    <input
                        id="phoneNumber"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0xx-xxxxxxx"
                        required
                        className="w-full mt-2 p-2 rounded-full border-2"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="text-xl md:text-2xl">
                        อีเมล์:
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email1234@hotmail.com"
                        required
                        className="w-full mt-2 p-2 rounded-full border-2"
                    />
                </div>
                <h1 className="py-4 text-xl md:text-2xl">
                    Line Connect:
                </h1>
                <div className="mb-6">
                    <button
                        onClick={handleLineLogin}
                        type="button"
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg w-full"
                    >
                        LINE เชื่อมต่อ
                    </button>
                </div>
                <h1 className="py-4 text-center">
                    OTP เพื่อบันทึก
                </h1>
                <div className="mb-6">
                    <input
                        className="w-full p-2 rounded-full border-2"
                        placeholder="Enter OTP"
                    />
                </div>
                <div className="mb-6">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
                    >
                        ขอ OTP
                    </button>
                </div>
            </form>
        </div>
    );
}