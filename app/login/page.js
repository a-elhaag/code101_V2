'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return setError("All fields are required");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid credentials");

            localStorage.setItem('code101-user', JSON.stringify(data.user));
            // Dispatch auth state change event
            window.dispatchEvent(new Event('authStateChange'));
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <form className="form-container" onSubmit={handleSubmit}>
                <h1 className="page-title">Sign In</h1>
                <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <div style={{ textAlign: "center" }}>
                    <Button type="submit">Sign In</Button>
                </div>
            </form>
        </div>
    );
}