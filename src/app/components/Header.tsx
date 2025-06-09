"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { Menu, MenuItem, Transition } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/20/solid";
import { useStore } from "@/store/useStore";

export default function Header() {
    const profile = useStore(state => state.profile);
    const pathname = usePathname();


    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
        window.dispatchEvent(new CustomEvent('supabase-session', { detail: null }));
    };

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 backdrop-blur-sm  border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-xl font-bold text-text-primary">
                            ResumeManager
                        </Link>
                        <nav className="ml-10 flex items-center space-x-4">
                            <Link
                                href="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive("/dashboard")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-text-primary hover:bg-gray-700"
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/resumes"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive("/resumes")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-text-primary hover:bg-gray-700"
                                }`}
                            >
                                Resumes
                            </Link>
                        </nav>
                    </div>

                    {/* User Profile and Logout */}
                    <div className="flex items-center">
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors focus:outline-none">
                                <span>{profile?.username || 'Guest'}</span>
                                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                            </Menu.Button>

                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <MenuItem>
                                        {({ focus }) => (
                                            <Link   
                                                href="/profile"
                                                className={`${
                                                    focus ? 'bg-gray-100' : ''
                                                } block px-4 py-2 text-sm text-gray-700 w-full text-left rounded-md flex items-center gap-2`}
                                            >
                                                <UserCircleIcon className="h-5 w-5" />
                                                Profile
                                            </Link>
                                        )}
                                    </MenuItem>
                                    
                                    <MenuItem>
                                        {({ focus }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`${
                                                    focus ? 'bg-gray-100' : ''
                                                } block w-full px-4 py-2 text-left text-sm text-gray-700 rounded-md cursor-pointer flex items-center gap-2`}
                                            >
                                                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                                                Logout
                                            </button>
                                        )}
                                    </MenuItem>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
} 