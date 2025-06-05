"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAlert } from '../context/AlertContext';
import Input from "./Input";
import Button from "./Button";


type LoginFormProps = {
    onLoginSuccess: () => void; // Callback after successful login
    onToggleView: () => void; // Callback to switch to signup view
};

export default function LoginForm({ onLoginSuccess, onToggleView }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

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
            onLoginSuccess(); // Call the success callback

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login.';
            showAlert(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
         <form onSubmit={handleLogin} className="space-y-4">
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
             </div>

            <div className="flex w-full justify-center">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !email || !password}
                >
                    {loading ? 'Loading...' : 'Log In'}
                </Button>
            </div>

             <div className="text-center text-sm">
                <p className="text-text-secondary">
                    Don't have an account?{' '}
                    <button
                        className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        onClick={onToggleView}
                        type="button" // Prevent form submission
                    >
                        Sign Up
                    </button>
                </p>
            </div>
         </form>
    );
} 