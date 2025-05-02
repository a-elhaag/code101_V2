'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [u_name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!u_name || !email || !password) return setError("All fields required");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_name, email, password, u_role: "user" })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Signup failed");

            router.push('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <form className="form-container" onSubmit={handleSignup}>
                <h1 className="page-title">Sign Up</h1>
                <Input label="Full Name" value={u_name} onChange={e => setName(e.target.value)} />
                <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <div style={{ textAlign: "center" }}>
                    <Button type="submit">Create Account</Button>
                </div>
            </form>
        </div>
    );
}