"use client"

import React, {useState} from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react';
import { useRouter,redirect } from 'next/navigation';
import { FormEvent } from "react";
import { connectMongoDB } from "@/lib/mongodb"

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const { data: session } = useSession();
    if (session) router.replace('profile');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

      try {
        const res = await signIn("credentials", {
          email, password, redirect: false
        })

        if (res?.error) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        }

        // router.replace("welcome")

      } catch(error) {
        console.log(error)
      }
  }

  return (
    <>
      <div className='hidden md:flex justify-center items-center w-1/2' style={{marginBlock:"5%"}}>
        <img src='/banner.jpg' alt="banner image" className='' style={{width:"60%"}}></img>
      </div>
      <div className='flex flex-col justify-center items-center w-full md:w-1/2'>
        <div className='shadow-xl px-14 py-14 rounded-lg' style={{}}>
            <p className='text-3xl'> ยินดีต้อนรับสู่ </p>
            <p className='text-4xl font-semibold text-red-600'> MN 1688 EXPRESS </p>
            <form onSubmit={handleSubmit} className='mt-14'>

                {error && (
                    <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                        {error}
                    </div>
                )}

                <input onChange={(e) => setEmail(e.target.value)} className='block bg-gray-300 p-2 my-3 rounded-md w-full' type="text" placeholder='Enter your email'/>
                <input onChange={(e) => setPassword(e.target.value)} className='block bg-gray-300 p-2 my-3 rounded-md w-full' type="text" placeholder='Enter your password'/>
                <div className='flex my-3 justify-between'>
                  <p> <input type='checkbox'></input> จดจำฉัน </p>
                  <a href='#' className='text-red-500'> ลืมรหัสผ่าน </a>
                </div>
                <button type='submit' className='bg-red-600 p-2 my-3 rounded-md text-white w-full'> เข้าสู่ระบบ </button>
            </form>

            <p className='my-3 text-right'> เพิ่งเคยเข้ามาใน MN 1688 EXPRESS ใช่หรือไม่? <Link className='text-red-500 hover:underline' href="/register">สมัครสมาชิก</Link></p>
        </div>
      </div>
    </>
  )
}

export default LoginPage