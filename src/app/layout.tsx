"use client";

import './globals.css'; // Import global styles
import { Inter } from 'next/font/google';
import { AlertProvider } from './context/AlertContext';
import AlertContainer from './components/AlertContainer';
import type { Metadata } from "next";


const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//     title: "Resume Manager - Your Smart Resume Assistant",
//     description: "Upload, manage, and instantly use your resumes with our Chrome Extension. Perfect for students and job seekers."
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AlertProvider>
          {children} {/* This is where the content of nested layouts and pages will render */}
          <AlertContainer />
        </AlertProvider>
      </body>
    </html>
  );
}
