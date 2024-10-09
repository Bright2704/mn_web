"use client"

import React from 'react'
import { useSession } from 'next-auth/react';
import { useRouter, redirect } from 'next/navigation';

function UserPage() {

    const router = useRouter();
    const { data: session } = useSession();
    if (!session) router.replace('unauthorized')

  return (
    <div>This is user page</div>
  )
}

export default UserPage
