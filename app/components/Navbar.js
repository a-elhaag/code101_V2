'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [user, setUser] = useState(null);

    // Check for user updates
    useEffect(() => {
        const checkUser = () => {
            const stored = localStorage.getItem('code101-user');
            if (stored) {
                const parsed = JSON.parse(stored);
                setUser(parsed);
            } else {
                setUser(null);
            }
        };

        // Initial check
        checkUser();

        // Set up event listener for storage changes
        window.addEventListener('storage', checkUser);

        // Custom event listener for auth changes
        window.addEventListener('authStateChange', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('authStateChange', checkUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('code101-user');
        setUser(null);
        // Dispatch auth state change event
        window.dispatchEvent(new Event('authStateChange'));
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link href="/">Code101</Link>
            </div>
            <div className="nav-links">
                <Link href="/projects">Projects</Link>
                {user ? (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        {user.role === 'admin' && (
                            <Link href="/admin">Admin</Link>
                        )}
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}
                <ThemeToggle />
            </div>
        </nav>
    );
}