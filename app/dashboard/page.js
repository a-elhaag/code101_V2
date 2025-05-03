'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCard from '../components/ProjectCard';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [tab, setTab] = useState("profile");
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '', github_link: '', category: '' });
    const [loading, setLoading] = useState(false);
    const categories = ['MOBILE APP', 'WEB', 'AI/ML', 'CYBERSECURITY', 'DATA SCIENCE'];

    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            const userData = JSON.parse(stored);
            setUser(userData);
            setForm({ username: userData.username || "", email: userData.email, password: "" });
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const fetchProjects = async () => {
            try {
                // Fetch all projects
                const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`);
                const projectsData = await projectsRes.json();

                // Filter user's projects
                const userProjects = projectsData.filter(p => p.user_id === user.user_id);

                // Fetch approvals for these projects
                const approvalsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/approvals?code=${process.env.NEXT_PUBLIC_API_KEY}`);
                const approvalsData = await approvalsRes.json();

                // Combine project data with approvals
                const projectsWithStatus = userProjects.map(project => {
                    const approval = approvalsData.find(a => a.project_id === project.project_id);
                    return {
                        ...project,
                        status: approval ? approval.status : 'pending'
                    };
                });

                setProjects(projectsWithStatus);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [user]);

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        if (!user) return;

        const payload = {
            email: form.email,
            username: form.username,
            ...(form.password && { password: form.password })
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.user_id}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");

            alert("Profile updated.");
            const updatedUser = { ...user, ...form };
            localStorage.setItem("code101-user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteProfile = async () => {
        if (!user) return;

        const confirmed = confirm("Are you sure you want to delete your profile? This action cannot be undone and will delete all your projects.");
        if (!confirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.user_id}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete profile');
            }

            localStorage.removeItem('code101-user');
            router.push('/');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Sign in required.");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.user_id,
                    name: newProject.name,
                    description: newProject.description,
                    github_link: newProject.github_link,
                    category: newProject.category
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Submission failed");

            alert("Project submitted!");
            setNewProject({ name: '', description: '', github_link: '', category: '' });

            // Add new project to list
            setProjects(prev => [...prev, {
                ...newProject,
                project_id: data.project_id,
                user_id: user.user_id,
                status: 'pending',
                created_at: new Date().toISOString()
            }]);

            setTab("projects");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteProject = async (projectId) => {
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
        } catch (err) {
            alert(err.message);
        }
    };

    if (!user) return <p className="auth-redirect">Please sign in to access your dashboard.</p>;

    return (
        <div className="dashboard-tabs">
            <div className="tab-buttons">
                <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>Profile</button>
                <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>My Projects</button>
                <button className={tab === "submit" ? "active" : ""} onClick={() => setTab("submit")}>Submit Project</button>
            </div>

            {tab === "profile" && (
                <div className="dashboard-tab-content">
                    <form onSubmit={handleUserUpdate} className="dashboard-form">
                        <h2 className="page-heading" style={{ fontSize: "1.8rem" }}>Update Profile</h2>
                        <Input label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                        <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        <Input label="New Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <Button type="submit">Save Changes</Button>
                            <Button type="button" color="red" onClick={handleDeleteProfile}>Delete Profile</Button>
                        </div>
                    </form>
                </div>
            )}

            {tab === "projects" && (
                <div className="dashboard-tab-content">
                    <h2 className="page-heading" style={{ fontSize: "1.8rem" }}>Your Projects</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : projects.length === 0 ? (
                        <p>You haven't submitted any projects yet.</p>
                    ) : (
                        <div className="dashboard-projects-grid">
                            {projects.map((project) => (
                                <div key={project.project_id} style={{ position: "relative" }}>
                                    <ProjectCard project={project} />
                                    <div className="dashboard-project-status">
                                        Status: {project.status || "pending"} •
                                        <button className="delete-btn" onClick={() => handleDeleteProject(project.project_id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === "submit" && (
                <form onSubmit={handleProjectSubmit} className="dashboard-tab-content">
                    <h2 className="page-heading" style={{ fontSize: "1.8rem" }}>Submit a New Project</h2>
                    <Input label="Project Name" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
                    <Input label="GitHub Link" value={newProject.github_link} onChange={e => setNewProject({ ...newProject, github_link: e.target.value })} />
                    <Input label="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
                    <label style={{ fontFamily: "var(--font-ibm-plex-mono)", margin: "1rem auto 0.5rem", display: "block" }}>Category</label>
                    <select
                        className="styled-input"
                        style={{ width: '100%', maxWidth: '400px', margin: '0 auto 1.5rem', display: 'block' }}
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div style={{ textAlign: "center" }}>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            )}
        </div>
    );
}
