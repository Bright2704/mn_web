"use client";

import '../../styles/globals.css';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import SideBar2 from './components/side/SideBar2';
import Announcement from './components/Announcement';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (status === 'unauthenticated') {
      // If the user is not authenticated, redirect to /unauthorized
      router.replace('/unauthorized');
    }
  }, [status, router]);

  if (status === 'loading') {
    // While session is loading, you could return a loading state here
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the layout and children
  return (
    <>
        <SideBar2 />
        <div className="flex-grow ml-4"> {/* Add margin-left to create space */}
          <Announcement /> {/* Add the AnnouncementBar */}
          <main className="flex-grow">
            {children}
          </main>
        </div>
    </>
  )
}
