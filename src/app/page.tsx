import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume Manager",
    description: "Manage your resumes efficiently"
}

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Resume Manager 👋</h1>
            <p className="mb-6">Track, categorize, and manage your resumes easily.</p>
            <Link href="/login">
                <button className="bg-gray-400 hover:bg-gray-500 cursor-pointer text-white px-6 py-2 rounded">
                    Get Started
                </button>
            </Link>
        </main>
    )
}