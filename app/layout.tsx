import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
                {children}                  
              </div>
            </AuthProvider>
          </body>
      </html>
  )
}
