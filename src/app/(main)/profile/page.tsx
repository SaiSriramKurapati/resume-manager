"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import { useStore } from '@/store/useStore';


export default function ProfilePage() {
    const profile = useStore(state => state.profile);
    const setProfile = useStore(state => state.setProfile);
    
    // Username state
    const [newUsername, setNewUsername] = useState(profile?.username || "");
    
    // Common states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Update local states when profile changes
    useEffect(() => {
        if (profile) {
            setNewUsername(profile.username);
        }
    }, [profile]);

    // Username update (existing code)
    const updateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!profile) {
            setError("No profile found");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ username: newUsername })
                .eq("id", profile.id);

            if (error) throw error;

            setProfile({ ...profile, username: newUsername });
            setSuccess("Username updated successfully");
        } catch (error) {
            setError("Failed to update username");
            console.error("Error updating username:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='max-w-4xl mx-auto p-6'>
            <h1 className='text-2xl font-bold mb-6'>Profile Settings</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                    {success}
                </div>
            )}

            <div className='space-y-8'>
                {/* Username Section */}
                <section className="p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Username</h2>
                    <form onSubmit={updateUsername} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <Input
                                type="text"
                                id="username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                required
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={loading || newUsername === profile?.username}
                        >
                            {loading ? "Updating..." : "Update Username"}
                        </Button>
                    </form>
                </section>
            </div>
        </div>
    )
}