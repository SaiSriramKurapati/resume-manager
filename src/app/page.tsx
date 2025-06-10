"use client";

import Link from "next/link";
import { ArrowDownTrayIcon, DocumentDuplicateIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const testimonials = [
    {
        quote: "Resume Manager has completely transformed how I handle job applications. I can now focus on finding the right opportunities instead of managing my resumes.",
        author: "Sarah J.",
        role: "Recent Graduate"
    },
    {
        quote: "The Chrome extension is a game-changer. I can instantly upload the perfect resume for any job application with just one click.",
        author: "Michael T.",
        role: "Software Engineer"
    },
    {
        quote: "As a student, this tool has been invaluable for managing different versions of my resume for various internship applications.",
        author: "Emily R.",
        role: "Computer Science Student"
    }
];

export default function Home() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Resume Manager 👋</h1>
                <p className="mb-6">Track, categorize, and manage your resumes easily.</p>
                <Link href="/login">
                    <button className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-6 py-2 rounded">
                        Get Started
                    </button>
                </Link>
            </main>
            <footer className="py-4 text-center text-sm text-gray-500">
                <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            </footer>
        </div>
    )
}