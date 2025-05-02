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
    const [form, setForm] = useState({ u_name: "", email: "", password: "" });
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ p_name: '', p_desc: '', github_link: '', categories: '' });
    const [loading, setLoading] = useState(false);
    const categoriesEnum = ['web', 'AI/ML', 'mobile app', 'desktop', 'cloud', 'software testing'];

    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            const userData = JSON.parse(stored);
            setUser(userData);
            setForm({ u_name: userData.u_name || "", email: userData.email, password: "" });
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                const myProjects = data.filter(p => p.user_id === user.id);
                setProjects(myProjects);
            })
            .finally(() => setLoading(false));
    }, [user]);

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        if (!user) return;

        const payload = {
            email: form.email,
            u_role: "user",
            ...(form.password && { password: form.password })
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.id}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            alert("Profile updated.");
            const updatedUser = { ...user, ...form };
            localStorage.setItem("code101-user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } else {
            alert(data.error || "Failed to update.");
        }
    };

    const handleDeleteProfile = async () => {
        if (!user) return;

        const confirmed = confirm("Are you sure you want to delete your profile? This action cannot be undone and will delete all your projects.");
        if (!confirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.id}?code=${process.env.NEXT_PUBLIC_API_KEY}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                localStorage.removeItem('code101-user');
                router.push('/');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete profile');
            }
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
                    ...newProject,
                    approval: "pending",
                    user_id: user.id
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Submission failed");

            alert("Project submitted!");
            setNewProject({ p_name: '', p_desc: '', github_link: '', categories: '' });
            setProjects(prev => [...prev, { ...newProject, approval: "pending", user_id: user.id }]);
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

            if (res.ok) {
                setProjects(prev => prev.filter(p => p.p_id !== projectId));
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete project');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleProjectVisibility = (index) => {
        setProjects(prev => {
            const copy = [...prev];
            copy[index].hidden = !copy[index].hidden;
            return copy;
        });
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
                        <Input label="Username" value={form.u_name} onChange={e => setForm({ ...form, u_name: e.target.value })} />
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
                            {projects.map((p, i) => (
                                <div key={i} style={{ position: "relative", opacity: p.hidden ? 0.3 : 1 }}>
                                    <ProjectCard project={p} />
                                    <div className="dashboard-project-status">
                                        Status: {p.approval || "pending"} •
                                        <button className="hide-btn" onClick={() => toggleProjectVisibility(i)}>
                                            {p.hidden ? "Unhide" : "Hide"}
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteProject(p.p_id)}>
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
                    <Input label="Project Name" value={newProject.p_name} onChange={e => setNewProject({ ...newProject, p_name: e.target.value })} />
                    <Input label="GitHub Link" value={newProject.github_link} onChange={e => setNewProject({ ...newProject, github_link: e.target.value })} />
                    <Input label="Description" value={newProject.p_desc} onChange={e => setNewProject({ ...newProject, p_desc: e.target.value })} />
                    <label style={{ fontFamily: "var(--font-ibm-plex-mono)", margin: "1rem auto 0.5rem", display: "block" }}>Category</label>
                    <select
                        className="styled-input"
                        style={{ width: '100%', maxWidth: '400px', margin: '0 auto 1.5rem', display: 'block' }}
                        value={newProject.categories}
                        onChange={(e) => setNewProject({ ...newProject, categories: e.target.value })}
                    >
                        <option value="">Select a category</option>
                        {categoriesEnum.map(cat => (
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
