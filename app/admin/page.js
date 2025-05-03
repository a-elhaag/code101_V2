'use client';
import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('projects');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
        }
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'admin') return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch projects
                const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`);
                const projectsData = await projectsRes.json();

                // Fetch approvals
                const approvalsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/approvals?code=${process.env.NEXT_PUBLIC_API_KEY}`);
                const approvalsData = await approvalsRes.json();

                // Combine project data with approvals
                const projectsWithStatus = projectsData.map(project => {
                    const approval = approvalsData.find(a => a.project_id === project.project_id && a.admin_id === user.user_id);
                    return {
                        ...project,
                        status: approval ? approval.status : 'pending'
                    };
                });
                setProjects(projectsWithStatus);

                // Fetch users
                const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?code=${process.env.NEXT_PUBLIC_API_KEY}`);
                const usersData = await usersRes.json();
                setUsers(usersData.filter(u => u.user_id !== user.user_id)); // Exclude current admin
            } catch (err) {
                showAlert(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const updateStatus = async (projectId, status) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/approvals?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: projectId,
                    admin_id: user.user_id,
                    status: status
                })
            });

            if (res.ok) {
                setProjects(prev => prev.map(p =>
                    p.project_id === projectId ? { ...p, status } : p
                ));
                showAlert(`Project ${status}`, 'success');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update status');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const deleteProject = async (projectId) => {
        const confirmed = confirm("Are you sure you want to delete this project?");
        if (!confirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete project');
            }

            setProjects(prev => prev.filter(p => p.project_id !== projectId));
            showAlert('Project deleted successfully', 'success');
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const deleteUser = async (userId) => {
        const confirmed = confirm("Are you sure you want to delete this user? This will also delete all their projects.");
        if (!confirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete user');
            }

            setUsers(prev => prev.filter(u => u.user_id !== userId));
            setProjects(prev => prev.filter(p => p.user_id !== userId));
            showAlert('User deleted successfully', 'success');
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const resetPassword = async (userId, username) => {
        const newPassword = 'code1234';
        const confirmed = confirm(`Are you sure you want to reset ${username}'s password to '${newPassword}'?`);
        if (!confirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: newPassword
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to reset password');
            }

            showAlert(`Password for ${username} has been reset to '${newPassword}'`, 'success');
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    if (!user) return <p className="auth-redirect">Please sign in to access the admin panel.</p>;
    if (user.role !== 'admin') return <p className="auth-redirect">Access denied. Admin privileges required.</p>;

    return (
        <div className="admin-panel">
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="tab-buttons">
                <button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>
                    Projects
                </button>
                <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
                    Users
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : tab === 'projects' ? (
                <div className="dashboard-projects-grid">
                    {projects.map((project) => (
                        <div key={project.project_id} style={{ position: "relative" }}>
                            <ProjectCard project={project} />
                            <div className="dashboard-project-status">
                                Status: <strong>{project.status}</strong>
                                {project.status === 'pending' && (
                                    <>
                                        <Button size="sm" color="black" onClick={() => updateStatus(project.project_id, 'approved')}>
                                            Approve
                                        </Button>
                                        <Button size="sm" color="black" onClick={() => updateStatus(project.project_id, 'declined')}>
                                            Decline
                                        </Button>
                                    </>
                                )}
                                <Button size="sm" color="black" onClick={() => deleteProject(project.project_id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="admin-users-grid">
                    {users.map((u) => (
                        <div key={u.user_id} className="user-card">
                            <h3>{u.username}</h3>
                            <p>{u.email}</p>
                            <p>Role: {u.role}</p>
                            <div className="user-actions">
                                <Button size="sm" color="black" onClick={() => resetPassword(u.user_id, u.username)}>
                                    Reset Password
                                </Button>
                                <Button size="sm" color="red" onClick={() => deleteUser(u.user_id)}>
                                    Delete User
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
