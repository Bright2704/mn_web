import '../../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/nav/NavBar'
import Footer from './components/footer/Footer'
import SideBar2 from './components/side/SideBar2'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={'${inter.className} text-slate-700'}>
        <div className="flex flex-col min-h-screen">
        <NavBar/>
          <div className="flex flex-grow">
            <SideBar2/>
            <main className='flex-grow '>
              {children}
            </main>
          </div>
        <Footer/>
        </div>
      </body>
    </html>
  )
}
