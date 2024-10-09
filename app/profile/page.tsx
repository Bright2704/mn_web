"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';

function ProfilePage() {

    const { data: session } = useSession();
    if (!session) redirect("/login");
    if (session?.user?.role == "admin") redirect("/admin")
    if (session?.user?.role == "user") redirect("/user")
    console.log(session)

  return (
    <div className='container mx-auto'>
        <h3 className='text-3xl my-3'> Welcome {session?.user?.name} </h3>
        <p> Email: {session?.user?.email} </p>
        <hr className='my-3'/>
        <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt, alias? </p>
    </div>
  )
}

export default ProfilePage
