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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
                    <div className={`backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 animate-pulse">
                                RESUME MANAGER
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
                            Your Smart Resume Assistant
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                            Upload, manage, and instantly use your resumes with our Chrome Extension. 
                            Perfect for students and job seekers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login">
                                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl animate-bounce-subtle">
                                    <RocketLaunchIcon className="w-5 h-5" />
                                    Get Started
                                </button>
                            </Link>
                            <a href="#" className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-700/40 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/20 animate-float">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Install Extension
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fade-in">
                        Why Choose Resume Manager?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:transform hover:scale-105 animate-slide-up">
                            <DocumentDuplicateIcon className="w-12 h-12 text-blue-600 mb-4 animate-pulse" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Manage All Your Resumes
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Keep all your resumes organized in one place. Upload, edit, and manage multiple versions effortlessly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:transform hover:scale-105 animate-slide-up delay-200">
                            <ArrowDownTrayIcon className="w-12 h-12 text-blue-600 mb-4 animate-pulse" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Instant Access
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Use our Chrome Extension to instantly access and upload the perfect resume for any job application.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:transform hover:scale-105 animate-slide-up delay-400">
                            <RocketLaunchIcon className="w-12 h-12 text-blue-600 mb-4 animate-pulse" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Built for Students
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Free and optimized for students and job seekers. Start managing your career journey today.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-20 relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 animate-fade-in">
                        <div className="text-center">
                            <p className="text-xl text-gray-600 dark:text-gray-300 italic mb-4 transition-opacity duration-500">
                                {testimonials[currentTestimonial].quote}
                            </p>
                            <p className="text-gray-900 dark:text-white font-medium">
                                - {testimonials[currentTestimonial].author}, {testimonials[currentTestimonial].role}
                            </p>
                            <div className="flex justify-center gap-2 mt-4">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentTestimonial
                                                ? 'bg-blue-600 w-4'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                        onClick={() => setCurrentTestimonial(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            Made with <span className="text-red-500 animate-pulse">❤</span> by Saisriram Kurapati
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}