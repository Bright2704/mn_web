'use client';  // Add this directive at the top

import React from 'react';
import '../../styles/globals.css';  // Correct path
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Admin - MN168</title>
      </head>
      <body className={`${inter.className} text-slate-700`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default AdminLayout;
