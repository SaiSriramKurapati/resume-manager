"use client"

import { useStore } from '@/store/useStore';


export default function ProfilePage() {
    const profile = useStore(state => state.profile);

    return (
        <div className='max-w-4xl mx-auto p-6'>
            <h1 className='text-2xl font-bold mb-6'>Profile</h1>

            <div className='space-y-8'>
                <section className="p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                    <div className="space-y-4">
                        <div className="pb-4 border-b border-gray-700">
                            <label className="block text-sm font-medium">
                                Username
                            </label>
                            <p className="mt-1">{profile?.username || 'Not set'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Email
                            </label>
                            <p className="mt-1">{profile?.email || 'Not set'}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}