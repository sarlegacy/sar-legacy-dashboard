import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { AuthUser } from '../types';
import { LogService } from '../services/LogService';

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string) => Promise<void>;
    logout: () => void;
    loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'sar-legacy-auth-user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            LogService.log('Failed to parse user from localStorage.', 'ERROR');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        // Simulate API call and validation
        if (!email || !password) {
            throw new Error("Email and password are required.");
        }
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                LogService.log(`Attempting login for user: ${email}`, 'INFO');
                // In a real app, you'd validate credentials here.
                // For this simulation, any non-empty input for the default user's email works.
                if (email.toLowerCase() === 'saiful@sarlegacy.com') {
                    const mockUser: AuthUser = {
                        name: 'Saiful Alam Rafi',
                        email: email,
                        avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                    };
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
                    setUser(mockUser);
                    LogService.log(`User ${email} logged in successfully.`, 'INFO');
                    resolve();
                } else {
                    // Simulate login for any new user that has signed up
                     const mockUser: AuthUser = {
                        name: email.split('@')[0], // a simple mock name
                        email: email,
                        avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
                    };
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
                    setUser(mockUser);
                    LogService.log(`User ${email} logged in successfully.`, 'INFO');
                    resolve();
                }
            }, 1500);
        });
    };
    
    const signup = async (name: string, email: string) => {
        // Simulate API call for user creation
        if (!name || !email) {
            throw new Error("Name and email are required.");
        }
        return new Promise<void>(resolve => {
            setTimeout(() => {
                LogService.log(`Attempting signup for new user: ${name} (${email})`, 'INFO');
                const newUser: AuthUser = {
                    name: name,
                    email: email,
                    // Use a generic avatar for new users
                    avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
                };
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
                setUser(newUser);
                LogService.log(`User ${email} signed up and logged in successfully.`, 'INFO');
                resolve();
            }, 1500);
        });
    };
    
    const loginWithGoogle = async () => {
        // Simulate Google OAuth flow
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                LogService.log('Attempting login with Google.', 'INFO');
                const mockUser: AuthUser = {
                    name: 'Saiful Alam Rafi',
                    email: 'saiful.google@sarlegacy.com',
                    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                };
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
                setUser(mockUser);
                LogService.log(`User ${mockUser.email} logged in successfully via Google.`, 'INFO');
                resolve();
            }, 1500);
        });
    };

    const logout = () => {
        if (user) {
            LogService.log(`User ${user.email} logged out.`, 'INFO');
        }
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, signup, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};