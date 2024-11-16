"use client"

import React, {useState} from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react';
import { useRouter,redirect } from 'next/navigation';
import { FormEvent } from "react";
import { connectMongoDB } from "@/lib/mongodb"
import NavBar from '../../components/header'
import Footer from '../../components/Footer'

function forgotPassword() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    const { data: session } = useSession();
    if (session) router.replace('profile');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

      try {
        const res = await fetch("/api/forget-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email})
        });

        if (res.ok) {
            const form = e.target as HTMLFormElement;
            setError("");
            setSuccess("ลิงค์สำหรับรีเซ็ตรหัสผ่าน ถูกส่งไปยังอีเมลของคุณแล้ว");
            // form.reset();
            router.push("/login");

        } else {
            setError("อีเมลนี้ยังไม่เคยลงทะเบียน");
            setSuccess("")
            const errorData = await res.json();
            console.log("Error response:", errorData);
        }

      } catch(error) {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
        console.log(error)
      }
  }

  return (
    <>
      <NavBar/>
        <div className="flex flex-grow">
          <div className='hidden md:flex justify-center items-center w-1/2' style={{marginBlock:"5%"}}>
            <img src='/banner.jpg' alt="banner image" className='' style={{width:"60%"}}></img>
          </div>
          <div className='flex flex-col justify-center items-center w-full md:w-1/2'>
            <div className='shadow-xl px-14 py-14 rounded-lg' style={{}}>
                <p className='text-xl'> กรุณากรอกอีเมลของคุณที่ต้องการจะรีเซ็ตรหัสผ่าน </p>
                <form onSubmit={handleSubmit} className='mt-14'>

                    {error && (
                        <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                            {error}
                        </div>
                    )}

                    <input onChange={(e) => setEmail(e.target.value)} className='block bg-gray-300 p-2 my-3 rounded-md w-full' type="email" placeholder='Enter your email'/>
                    <button type='submit' className='bg-red-600 p-2 my-3 rounded-md text-white w-full'> ยืนยัน </button>
                </form>
                <p className='my-3 text-start'> หากต้องการเข้าสู่ระบบ <Link className='text-red-500 hover:underline' href="/login">คลิกที่นี่</Link></p>
            </div>
          </div>
        </div>
      <Footer/>
    </>
  )
}

export default forgotPassword