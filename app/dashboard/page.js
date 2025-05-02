'use client';
import { useEffect, useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ProjectCard from '@/components/ProjectCard';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({
        p_name: '',
        p_desc: '',
        github_link: '',
        categories: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Load user from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    // Fetch this user's projects
    useEffect(() => {
        if (!user) return;
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                const myProjects = data.filter(p => p.user_id === user.id);
                setProjects(myProjects);
            })
            .catch(err => console.error('Fetch error:', err))
            .finally(() => setLoading(false));
    }, [user]);

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('You must be signed in');

        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    user_id: user.id,
                    approval: "pending"
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to submit project');

            setForm({ p_name: '', p_desc: '', github_link: '', categories: '' });
            alert('Project submitted!');
            setProjects(prev => [...prev, { ...form, approval: "pending", user_id: user.id }]);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return <p style={{ textAlign: 'center', marginTop: '3rem', color: 'white' }}>Please sign in to access your dashboard.</p>;

    return (
        <div className="content-section">
            <h1 className="page-heading">Your Dashboard</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
                <Input label="Project Name" value={form.p_name} onChange={handleChange('p_name')} />
                <Input label="GitHub Repo Link" value={form.github_link} onChange={handleChange('github_link')} />
                <Input label="Description" value={form.p_desc} onChange={handleChange('p_desc')} />
                <Input label="Categories" value={form.categories} onChange={handleChange('categories')} />
                <div style={{ textAlign: "center" }}>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Project"}
                    </Button>
                </div>
            </form>

            <h2 className="page-heading" style={{ fontSize: "1.8rem" }}>Your Projects</h2>
            {loading ? (
                <p>Loading...</p>
            ) : projects.length === 0 ? (
                <p>You haven’t submitted any projects yet.</p>
            ) : (
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "2rem"
                }}>
                    {projects.map((p, i) => (
                        <ProjectCard key={i} project={p} />
                    ))}
                </div>
            )}
        </div>
    );
}