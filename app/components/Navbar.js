'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('code101-user');
        setUser(null);
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
                        {user.u_role === 'admin' && (
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