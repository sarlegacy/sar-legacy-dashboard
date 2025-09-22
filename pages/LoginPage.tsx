import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon, SpinnerIcon, EnvelopeIcon, LockClosedIcon, UserCircleIcon, GoogleIcon } from '../components/Icons';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
};

const Input: React.FC<InputProps> = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      className="w-full bg-dark-bg border border-dark-border rounded-xl h-12 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-shadow"
    />
  </div>
);

export const LoginPage: React.FC = () => {
    const { login, signup, loginWithGoogle } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);
        try {
            await login(email, password);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            setIsProcessing(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError('');
        setIsProcessing(true);
        try {
            await signup(name, email);
        } catch (err) {
            setError('Sign-up failed. Please try again.');
            setIsProcessing(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        setError('');
        setIsProcessing(true);
        try {
            await loginWithGoogle();
        } catch (err) {
            setError('Google login failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleForgotPassword = () => {
        alert('A password reset link would be sent to your email address.');
    }

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="bg-dark-card rounded-4xl p-8 md:p-12 border border-dark-border shadow-2xl">
                    <div className="text-center">
                        <LogoIcon className="w-16 h-16 mx-auto text-accent-cyan" />
                        <h1 className="text-3xl font-bold mt-6">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h1>
                        <p className="text-light-gray mt-2">{isSignUp ? 'Join us to manage your projects efficiently.' : 'Sign in to continue to SAR LEGACY.'}</p>
                    </div>

                    {isSignUp ? (
                        <form onSubmit={handleSignUp} className="mt-8 space-y-4 text-left">
                            <Input icon={<UserCircleIcon className="w-5 h-5 text-light-gray" />} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                            <Input icon={<EnvelopeIcon className="w-5 h-5 text-light-gray" />} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                            <Input icon={<LockClosedIcon className="w-5 h-5 text-light-gray" />} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                            <Input icon={<LockClosedIcon className="w-5 h-5 text-light-gray" />} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            <button type="submit" disabled={isProcessing} className="w-full bg-accent-cyan text-black font-bold py-3 px-4 rounded-xl hover:bg-accent-cyan-light transition-colors flex items-center justify-center space-x-3 disabled:bg-mid-gray">
                                {isProcessing ? <SpinnerIcon className="w-5 h-5" /> : <span>Create Account</span>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="mt-8 space-y-4 text-left">
                            <Input icon={<EnvelopeIcon className="w-5 h-5 text-light-gray" />} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                            <Input icon={<LockClosedIcon className="w-5 h-5 text-light-gray" />} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                             <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center space-x-2 text-light-gray cursor-pointer">
                                    <input type="checkbox" className="form-checkbox bg-dark-bg border-dark-border text-accent-cyan focus:ring-accent-cyan rounded-sm" />
                                    <span>Remember me</span>
                                </label>
                                <button type="button" onClick={handleForgotPassword} className="font-semibold text-accent-cyan hover:underline">Forgot password?</button>
                            </div>
                            <button type="submit" disabled={isProcessing} className="w-full bg-accent-cyan text-black font-bold py-3 px-4 rounded-xl hover:bg-accent-cyan-light transition-colors flex items-center justify-center space-x-3 disabled:bg-mid-gray">
                                {isProcessing ? <SpinnerIcon className="w-5 h-5" /> : <span>Sign In</span>}
                            </button>
                        </form>
                    )}

                    {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
                    
                    {!isSignUp && (
                         <>
                            <div className="flex items-center my-6">
                                <hr className="flex-grow border-dark-border" />
                                <span className="mx-4 text-xs text-light-gray">OR</span>
                                <hr className="flex-grow border-dark-border" />
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isProcessing}
                                className="w-full bg-dark-bg border border-dark-border font-semibold py-3 px-4 rounded-xl hover:bg-dark-border transition-colors flex items-center justify-center space-x-3 disabled:opacity-50"
                            >
                                <GoogleIcon />
                                <span>Continue with Google</span>
                            </button>
                        </>
                    )}

                    <div className="mt-8 text-center text-sm">
                        <p className="text-light-gray">
                            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="font-semibold text-accent-cyan hover:underline">
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};