"use client"; // This ensures the layout is client-side rendered

import '../../styles/globals.css';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SideBar2 from './components/side/SideBar_Admin';
import AnnouncementBar from './components/announcement/AnnouncementBar';
import NavBar from '@/components/header'
import Footer from '@/app/user/components/footer/Footer'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // While the session is loading, do nothing
    if (status === 'loading') return;

    // If the user is not authenticated, redirect to /unauthorized
    if (!session) {
      router.replace('/unauthorized');
    }

    // If the user is authenticated but the role is 'user', redirect to /unauthorized
    if (session?.user?.role === 'user') {
      router.replace('/unauthorized');
    }
  }, [session, status, router]);

  // While session is being loaded, show a loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // If the user is authenticated and has the right role, render the layout
  return (
    <div className='flex'>
      <section>
        <SideBar2 />
      </section>
      <section className='w-full flex flex-col min-h-screen'>
        <NavBar/>
        <div className="flex-grow ml-4">
          <AnnouncementBar />
          <main className="flex-grow">
            {children} {/* Render the page content */}
          </main>
        </div>
        <Footer/>
      </section>
    </div>
  );
}
