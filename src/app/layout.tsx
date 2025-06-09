"use client";

import './globals.css'; // Import global styles
import { Inter } from 'next/font/google';
import { AlertProvider } from './context/AlertContext';
import AlertContainer from './components/AlertContainer';


const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: "ResumeManager",
//   description: "Manage your resumes efficiently",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Resume Manager</title>
        <meta name="description" content="Manage your resumes efficiently" />
        <meta name="google-site-verification" content="sJDSlsI50_C0Z1fJ_p3em7RX8LudJyaOnvkbBVcp9U4" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AlertProvider>
          {children} {/* This is where the content of nested layouts and pages will render */}
          <AlertContainer />
        </AlertProvider>
      </body>
    </html>
  );
}
