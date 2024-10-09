"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { FormEvent } from "react";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import generateUserId from '../generateUID';

function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { data: session } = useSession();
    if (session) redirect("/profile")

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            setSuccess(""); // Clear success message if there's an error
            return;
        }

        if (!name || !email || !password || !confirmPassword) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            setSuccess(""); // Clear success message if there's an error
            return;
        }

        try {

            const resCheckUser = await fetch("http://localhost:3000/api/checkUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })

            const { user } = await resCheckUser.json();

            if (user) {
                setError("User alredy exists!");
                return;
            }

            const res = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            });

            if (res.ok) {
                const form = e.target as HTMLFormElement;
                setError("");
                setSuccess("User registration successful!");
                form.reset(); // Reset form after setting success

            } else {
                setError("ผู้ใช้งานลงทะเบียนล้มเหลว");
                setSuccess("");
            }

        } catch (error) {
            setError("เกิดข้อผิดพลาดระหว่างการลงทะเบียน");
            setSuccess("");
            console.error("Error during registration:", error);
        }
    }
    

    return (
        <div className='container mx-auto py-5'>
            <h3>หน้าลงทะเบียน</h3>
            <hr className='my-3'></hr>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setName(e.target.value)}
                    className='block bg-gray-300 p-2 my-2 rounded-md'
                    type="text"
                    placeholder='Enter your name'
                />
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    className='block bg-gray-300 p-2 my-2 rounded-md'
                    type="text"
                    placeholder='Enter your email'
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    className='block bg-gray-300 p-2 my-2 rounded-md'
                    type="password"
                    placeholder='Enter your password'
                />
                <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='block bg-gray-300 p-2 my-2 rounded-md'
                    type="password"
                    placeholder='Confirm password'
                />
                <button type='submit' className='bg-green-500 p-2 rounded-md text-white'> ลงทะเบียน </button>

                {error && (
                    <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                        {error}
                    </div>
                )}

                {success && (
                    <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                        {success}
                    </div>
                )}
            </form>
            <hr className='my-3'/>
            <p>คุณมีบัญชีอยู่แล้วใช่หรือไม่? ไปที่หน้า <Link className='text-blue-500 hover:underline' href="/login">เข้าสู่ระบบ</Link> </p>
        </div>
    )
}

export default RegisterPage;
