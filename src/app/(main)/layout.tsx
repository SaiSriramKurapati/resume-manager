"use client";

import Header from '../components/Header'; // Adjust path based on new location
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

// This layout includes the Header
export default function MainLayout({ children }: { children: React.ReactNode }) {
    const fetchResumes = useStore((state) => state.fetchResumes);
    const fetchProfile = useStore(state => state.fetchProfile);

    // Fetch resumes when this layout mounts (only for pages within (main))
    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children} {/* Render the page content (dashboard or resumes) */}
            </main>
            <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200/50">
                <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            </footer>
        </div>
    );
} 