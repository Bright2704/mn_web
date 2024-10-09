"use client"

import React from 'react'
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SideBar2 from './components/side/SideBar_Admin'
import AnnouncementBar from './components/announcement/AnnouncementBar'


function AdminPage() {

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) router.replace("/unauthorized")
  if (session?.user?.role == "user") router.replace("/unauthorized")

  return (
    <div>admin page</div>
  )
}

export default AdminPage
