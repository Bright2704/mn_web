import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from '../components/header'
import Footer from '../components/Footer'
const inter = Inter({ subsets: ['latin'] })
import { AuthProvider } from './Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
          <body className={'${inter.className} text-slate-700'}>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                  <NavBar/>
                      <div className="flex flex-grow">                          
                            {children}
                      </div>
                  <Footer/>
              </div>
            </AuthProvider>
          </body>
      </html>
  )
}
