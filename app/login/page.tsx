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
    <div className='container mx-auto py-5'>
        <h3> หน้าเข้าสู่ระบบ </h3>
        <hr className='my-3'/>
        <form onSubmit={handleSubmit}>

            {error && (
                <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                    {error}
                </div>
            )}

            <input onChange={(e) => setEmail(e.target.value)} className='block bg-gray-300 p-2 my-2 rounded-md' type="text" placeholder='Enter your email'/>
            <input onChange={(e) => setPassword(e.target.value)} className='block bg-gray-300 p-2 my-2 rounded-md' type="text" placeholder='Enter your password'/>
            <button type='submit' className='bg-green-500 p-2 rounded-md text-white'> Sign in </button>
        </form>
        <hr className='my-3'/>
        <p> หากยังไงมีบัญชี ไปที่หน้า<Link className='text-blue-500 hover:underline' href="/register">ลงทะเบียน</Link></p>
    </div>
  )
}

export default LoginPage