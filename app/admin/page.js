'use client';
import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';    
import Button from '../components/Button';

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
        }
    }, []);

    useEffect(() => {
        if (!user || user.u_role !== 'admin') return;
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`)
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error('Error loading projects:', err))
            .finally(() => setLoading(false));
    }, [user]);

    const updateStatus = async (projectId, status) => {
        const proj = projects.find(p => p.p_id === projectId);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...proj,
                approval: status
            })
        });
        if (res.ok) {
            setProjects(prev => prev.map(p => p.p_id === projectId ? { ...p, approval: status } : p));
        }
    };

    const deleteProject = async (projectId) => {
        const confirmed = confirm("Are you sure you want to delete this project?");
        if (!confirmed) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            setProjects(prev => prev.filter(p => p.p_id !== projectId));
        } else {
            alert('Failed to delete project');
        }
    };

    if (!user) return <p className="auth-redirect">You must be signed in.</p>;
    if (user.u_role !== 'admin') return <p className="auth-redirect">Access denied. Admins only.</p>;

    return (
        <div className="content-section">
            <h1 className="page-heading">Admin Panel</h1>
            {loading ? (
                <p>Loading projects...</p>
            ) : (
                <div className="dashboard-projects-grid">
                    {projects.map((p) => (
                        <div key={p.p_id} style={{ position: "relative" }}>
                            <ProjectCard project={p} />
                            <div className="dashboard-project-status">
                                Status: <strong>{p.approval}</strong>
                                {p.approval === 'pending' && (
                                    <>
                                        <Button size="sm" color="black" onClick={() => updateStatus(p.p_id, 'approved')}>Approve</Button>
                                        <Button size="sm" color="black" onClick={() => updateStatus(p.p_id, 'declined')}>Decline</Button>
                                    </>
                                )}
                                <Button size="sm" color="black" onClick={() => deleteProject(p.p_id)}>Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
