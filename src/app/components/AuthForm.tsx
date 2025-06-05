"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAlert } from '../context/AlertContext';
import { Input } from "@headlessui/react";
import Button from "./Button";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'signup'>('login');

    const { showAlert } = useAlert();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            showAlert('Logged in successfully!', 'success');
            // Redirect to dashboard or desired page after login
            // window.location.href = '/dashboard'; // Or use Next.js router

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login.';
            showAlert(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Step 1: Sign up the user with email and password
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) throw signUpError;

            const user = data.user; // User is available immediately after signup if email confirmation is off
            
            // Step 2: Create the profile with username immediately after signup
            if (user) {
                 const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id, // Use auth.users.id for foreign key
                        email: user.email, // Get email from authenticated user
                        username: username, // Use the username from the state
                    });

                if (profileError) throw profileError;
            }

            showAlert('Signed up successfully! Please check your email for confirmation.', 'success');
            // Note: If email confirmation is required, the user won't be logged in yet
            // They will be logged in automatically after confirming their email via the link
            // Redirecting here might be premature if confirmation is on.

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup.';
            showAlert(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-semibold text-text-primary text-center">Welcome to Resume Manager</h1>
                <p className="mt-2 text-gray-500 text-center">
                    {view === 'login' ? 'Log in to your account' : 'Create a new account'}
                </p>
            </div>

            <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Email</label>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {view === 'signup' && (
                    <div>
                         <label className="block text-sm font-medium text-text-secondary">Username</label>
                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                            maxLength={20}
                             // Optional: Add pattern/title if you have username constraints
                            pattern="^[a-zA-Z0-9_]+$"
                            title="Username can only contain letters, numbers and underscores"
                            disabled={loading}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-text-secondary">Password</label>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Ensure you have a password state and input
                        required
                        minLength={6} // Supabase default minimum password length
                        disabled={loading}
                    />
                     {view === 'signup' && (
                        <p className="mt-1 text-sm text-gray-500">Minimum 6 characters.</p>
                     )}
                </div>

                <div className="flex w-full justify-center">
                    <Button
                        type="submit" // Use type submit to trigger form onSubmit
                        variant="primary"
                        disabled={loading || !email || !password || (view === 'signup' && !username)}
                    >
                        {loading ? 'Loading...' : view === 'login' ? 'Log In' : 'Sign Up'}
                    </Button>
                </div>
            </form>

            {/* Toggle between login and signup views */}
            <div className="text-center text-sm">
                {view === 'login' ? (
                    <p className="text-text-secondary">
                        Don't have an account?{' '}
                        <button
                            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                            onClick={() => setView('signup')}
                        >
                            Sign Up
                        </button>
                    </p>
                ) : (
                    <p className="text-text-secondary">
                        Already have an account?{' '}
                        <button
                             className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                            onClick={() => setView('login')}
                        >
                            Log In
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}


