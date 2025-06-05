"use client";

import Header from '../components/Header'; // Adjust path based on new location
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

// This layout includes the Header
export default function MainLayout({ children }: { children: React.ReactNode }) {
    const fetchResumes = useStore((state) => state.fetchResumes);
    const fetchProfile = useStore((state) => state.fetchProfile);

    // Fetch resumes when this layout mounts (only for pages within (main))
    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children} {/* Render the page content (dashboard or resumes) */}
            </main>
        </>
    );
} 