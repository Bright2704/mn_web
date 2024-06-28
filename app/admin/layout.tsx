import '../../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/nav/NavBar_Admin'
import SideBar2 from './components/side/SideBar_Admin'
import AnnouncementBar from './components/announcement/AnnouncementBar' // Import the AnnouncementBar

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-700`}>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <div className="flex flex-grow">
            <SideBar2 />
            <div className="flex-grow ml-4"> {/* Add margin-left to create space */}
              <AnnouncementBar /> {/* Add the AnnouncementBar */}
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
