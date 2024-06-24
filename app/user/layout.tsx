'use client';  // Add this directive at the top

import React from 'react';
import '../../styles/globals.css';  // Correct path
import { Inter } from 'next/font/google';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';

const inter = Inter({ subsets: ['latin'] });

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>User - MN168</title>
      </head>
      <body className={`${inter.className} text-slate-700`}>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default UserLayout;
