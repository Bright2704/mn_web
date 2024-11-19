"use client"

import React, { useEffect, useState, FormEvent} from 'react'
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';
import { useRouter, redirect } from 'next/navigation';
import NavBar from '../../../components/header'
import Footer from '../../../components/Footer'

interface User {
  email: string;
}

const resetPassword = ({params}: any) => {

  console.log(params.token);
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [password,setPassword] = useState("");

  const { data: session } = useSession();
    if (session) redirect("/profile")

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token: params.token})
        });

        if (res.ok) {
            setError("");
            setVerified(true);
            const userData = await res.json();
            setUser(userData);

        } else {
            setError("Invalid token or has expired");
            setVerified(true);
        }

      } catch(error) {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
        console.log(error)
      }
    }
    verifyToken();
  }, [params.token])

  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

      try {
        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              password,
              email: user?.email,
              token: params.token}),
        });

        if (res.ok) {
            setError("");
            setSuccess("รหัสผ่านถูกเปลี่ยนเรียบร้อย");
            router.replace('/login')

        } else {
            setError("Something went wrong");
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
                <p className='text-xl'> กรุณากรอกรหัสผ่านใหม่ที่ต้องการ </p>
                <form onSubmit={handleSubmit} className='mt-14'>

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

                    <input onChange={(e) => setPassword(e.target.value)} className='block bg-gray-300 p-2 my-3 rounded-md w-full' type="password" placeholder='set your new password'/>
                    <button
                      type='submit' 
                      disabled={error.length > 0}
                      className='bg-red-600 p-2 my-3 rounded-md text-white w-full disabled:bg-gray-500'> 
                      {""}
                      ยืนยัน 
                    </button>
                </form>
                <p className='my-3 text-start'> หากต้องการเข้าสู่ระบบ <Link className='text-red-500 hover:underline' href="/login">คลิกที่นี่</Link></p>
            </div>
          </div>
        </div>
      <Footer/>
    </>
  )
}

export default resetPassword