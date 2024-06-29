// components/LineNotification.tsx
"use client"
import React from 'react';
import { useState } from 'react';

export default function FormPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add form submission logic here
        console.log('Form Submitted:', { phoneNumber, email });
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <h1 className='text-5xl pt-5'>
                ตั้งค่า
            </h1>
            <br/>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="phoneNumber" className='text-2xl'>เบอร์โทรศัพท์:</label>
                    <br/>
                    <input
                        id="phoneNumber"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="081-2345678"
                        required
                        className='my-3 p-2 rounded-full border-4'
                    />
                </div>
                <div>
                    <label htmlFor="email" className='text-2xl'>อีเมล์:</label>
                    <br/>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email1234@hotmail.com"
                        required
                        className='my-3 p-2 rounded-full border-4'
                    />
                </div>
                <h1 className='py-4 text-2xl'>
                    Line connect:
                </h1>
                <div>
                    <button className='mr-10' type="submit" style={{ backgroundColor: '#00c300', color: 'white', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '5px' }}>
                        LINE เชื่อมต่อ
                    </button>
                </div>
                <h1 className='p-4'>
                    OTP เพื่อบันทึก
                </h1>
                {/* <br/> */}
                <div>
                    <input
                        // id="email"
                        // type="email"
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        // placeholder="email1234@hotmail.com"
                        // required
                        className='p-2 rounded-full border-4'
                    />
                </div>
                <div>
                    <button className='py-2 m-3' type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '5px' }}>
                        ขอ OTP
                    </button>
                </div>
            </form>
        </div>
    );
}