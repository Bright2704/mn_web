"use client";

import '../../styles/globals.css';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/header'
import Footer from './components/footer/Footer';
import SideBar2 from './components/side/SideBar3';
import Announcement from './components/Announcement';
import ChatWidget from './components/ChatWidget'; // Add this import
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
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/unauthorized');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex'>
      <section>
        <SideBar2 />
      </section>
      <section className='w-full flex flex-col min-h-screen'>
        <NavBar/>
        <div className="flex-grow ml-4">
          <Announcement />
          <main className="flex-grow">
            {children}
          </main>
        </div>
        <Footer/>
      </section>
      <ChatWidget /> {/* Add the ChatWidget here */}
    </div>
  );
}