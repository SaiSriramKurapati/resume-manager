"use client";

import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { useAlert } from '../context/AlertContext';

export default function AuthContainer() {
    const [view, setView] = useState<'login' | 'signup'>('login');
    const [signupEmail, setSignupEmail] = useState<string | null>(null);
    const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);
    const [resending, setResending] = useState(false);
    const {showAlert} = useAlert();
    const router = useRouter();

    const handleLoginSuccess = () => {
        // Redirect to dashboard or desired page after successful login
        router.push('/dashboard');
    };

    const handleSignupSuccess = (email: string) => {
        // After signup, show the check email message
        setSignupEmail(email);
        setShowCheckEmailMessage(true);
        setView('login');
    };

    const handleResendVerification = async () => {
        if (!signupEmail) return;
        setResending(true);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: signupEmail
            });

            if (error) throw error;
            showAlert('Verification link resent successfully!', 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification link.';
            showAlert(errorMessage, 'error');
        } finally {
            setResending(false);
        }
    };

    const handleGoToLogin = () => {
        setShowCheckEmailMessage(false);
        setView('login');
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
             <div className="max-w-md mx-auto text-center">
                <h1 className="text-2xl font-semibold text-text-primary">Welcome to Resume Manager</h1>
                <p className="mt-2 text-gray-500">
                    {showCheckEmailMessage ?
                        'Please check your email' :
                        view === 'login' ? 'Log in to your account' : 'Create a new account'}
                </p>
            </div>

            {showCheckEmailMessage ? (
                <div className="text-center space-y-4">
                    <p className="text-text-secondary">
                        A confirmation email has been sent to: {' '} <strong>{signupEmail}</strong>.
                        Please click the link in the email to verify your account and log in.
                    </p>

                    <div className='flex justify-center gap-4'>
                    <Button variant="secondary" onClick={handleResendVerification} disabled={resending}>
                    {resending ? 'Resending...' : 'Resend Verification Link'}
                </Button>
                    <Button variant="secondary" onClick={handleGoToLogin}>Go to Login</Button>
                    </div>
                </div>
            ) : view === 'login' ? (
                <LoginForm onLoginSuccess={handleLoginSuccess} onToggleView={() => setView('signup')} />
            ) : (
                <SignupForm onSignupSuccess={handleSignupSuccess} onToggleView={() => setView('login')} />
            )}
        </div>
    );
} 