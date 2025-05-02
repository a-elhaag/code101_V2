'use client';
import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('projects');

    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
        }
    }, []);

    useEffect(() => {
        if (!user || user.u_role !== 'admin') return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch projects
                const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`);
                const projectsData = await projectsRes.json();
                setProjects(projectsData);

                // Fetch users
                const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?code=${process.env.NEXT_PUBLIC_API_KEY}`);
                const usersData = await usersRes.json();
                setUsers(usersData.filter(u => u.id !== user.id)); // Exclude current admin
            } catch (err) {
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const deleteUser = async (userId) => {
        const confirmed = confirm("Are you sure you want to delete this user? This will also delete all their projects.");
        if (!confirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
                // Also remove their projects from the projects list
                setProjects(prev => prev.filter(p => p.user_id !== userId));
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete user');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const resetPassword = async (userId) => {
        const confirmed = confirm("Are you sure you want to reset this user's password to 'code1234'?");
        if (!confirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: 'code1234'
                })
            });

            if (res.ok) {
                alert('Password has been reset to code1234');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to reset password');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    if (!user) return <p className="auth-redirect">You must be signed in.</p>;
    if (user.u_role !== 'admin') return <p className="auth-redirect">Access denied. Admins only.</p>;

    return (
        <div className="content-section">
            <h1 className="page-heading">Admin Panel</h1>

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${tab === 'projects' ? 'active' : ''}`}
                    onClick={() => setTab('projects')}
                >
                    Projects
                </button>
                <button
                    className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
                    onClick={() => setTab('users')}
                >
                    Users
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : tab === 'projects' ? (
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
            ) : (
                <div className="admin-users-grid">
                    {users.map((u) => (
                        <div key={u.id} className="admin-user-card">
                            <div className="admin-user-info">
                                <h3>{u.u_name}</h3>
                                <p>{u.email}</p>
                                <p>Role: {u.u_role}</p>
                            </div>
                            <div className="admin-user-actions">
                                <Button size="sm" color="black" onClick={() => resetPassword(u.id)}>Reset Password</Button>
                                <Button size="sm" color="red" onClick={() => deleteUser(u.id)}>Delete User</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
