import '../../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/nav/NavBar'
import Footer from './components/footer/Footer'
import SideBar2 from './components/side/SideBar2'
import Announcement from './components/Announcement'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
        <SideBar2/>
        <div className="flex-grow"> {/* Add margin-left to create space */}
            <Announcement /> {/* Add the AnnouncementBar */}
                <main className='flex-grow '>
                    {children}
                </main>
        </div>
      </>
                          
  )
}
