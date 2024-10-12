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
        <>
            <div className='hidden md:flex justify-center items-center w-1/2' style={{marginBlock:"5%"}}>
                <img src='/banner.jpg' alt="banner image" className='' style={{width:"60%"}}></img>
            </div>
            <div className='flex flex-col justify-center items-center w-full md:w-1/2'>
                <div className='shadow-xl px-14 py-14 rounded-lg'>
                    <p className='text-3xl'> สมัครสมาชิก </p>
                    <p className='text-4xl font-semibold text-red-600'> MN 1688 EXPRESS </p>
                    <form onSubmit={handleSubmit} className='mt-8'>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            className='block bg-gray-300 p-2 my-3 rounded-md w-full'
                            type="text"
                            placeholder='ชื่อผู้ใช้งาน'
                        />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className='block bg-gray-300 p-2 my-3 rounded-md w-full'
                            type="text"
                            placeholder='อีเมล'
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className='block bg-gray-300 p-2 my-3 rounded-md w-full'
                            type="password"
                            placeholder='รหัสผ่าน'
                        />
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='block bg-gray-300 p-2 my-3 rounded-md w-full'
                            type="password"
                            placeholder='ยืนยันรหัสผ่าน'
                        />
                        <div className='my-5'>
                            <p> <input type='checkbox'></input> ท่านรับทราบและตกลงตาม <a href='#' className='text-red-500'> เงื่อนไข </a> และ <a href='#' className='text-red-500'> ข้อตกลงการให้บริการ </a></p>
                            <p> <input type='checkbox'></input> รับข่าวสารจากทางเรา </p>
                        </div>
                        
                        <button type='submit' className='bg-red-600 p-2 rounded-md text-white w-full'> ลงทะเบียน </button>

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
                    <p>คุณมีบัญชีอยู่แล้วใช่หรือไม่? ไปที่หน้า <Link className='text-red-500 hover:underline' href="/login">เข้าสู่ระบบ</Link> </p>
                </div>
            </div>
        </>
        
    )
}

export default RegisterPage;
