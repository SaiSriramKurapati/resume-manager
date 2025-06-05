"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAlert } from '../context/AlertContext';
import Input from "./Input";
import Button from "./Button";

type SignupFormProps = {
    onSignupSuccess: (email: string) => void; // Callback after successful signup
    onToggleView: () => void; // Callback to switch to login view
};

export default function SignupForm({ onSignupSuccess, onToggleView }: SignupFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const { showAlert } = useAlert();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Step 1: Sign up the user with email and password
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'http://localhost:3001/login',
                },
            });

            if (signUpError) throw signUpError;

            const user = data.user; // User might be null here if email confirmation is ON
            
            // Step 2: Create the profile with username immediately after signup
            if (user) {
                 const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id, // Use auth.users.id for foreign key
                        email: user.email, // Get email from authenticated user
                        username: username,
                    });

                if (profileError) throw profileError;
            }

            showAlert('Signed up successfully! Please check your email for confirmation.', 'success');
            onSignupSuccess(email); // Call the success callback

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup.';
            showAlert(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignup} className="space-y-4">
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
                    pattern="^[a-zA-Z0-9_]+$"
                    title="Username can only contain letters, numbers and underscores"
                    disabled={loading}
                />
            </div>

             <div>
                <label className="block text-sm font-medium text-text-secondary">Password</label>
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Ensure you have a password state and input
                    required
                    minLength={6}
                    disabled={loading}
                />
                <p className="mt-1 text-sm text-gray-500">Minimum 6 characters.</p>
             </div>

            <div className="flex w-full justify-center">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !email || !password || !username}
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </Button>
            </div>

            {/* Toggle between login and signup views */}
             <div className="text-center text-sm">
                <p className="text-text-secondary">
                    Already have an account?{' '}
                    <button
                         className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        onClick={onToggleView}
                         type="button" // Prevent form submission
                    >
                        Log In
                    </button>
                </p>
            </div>
        </form>
    );
} 