import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume Manager",
    description: "Manage your resumes efficiently"
}

export default function Home() {
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