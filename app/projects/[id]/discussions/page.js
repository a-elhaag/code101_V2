'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Discussion from '../../../components/Discussion';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function ProjectDiscussions() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('code101-user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch project details
                const projectRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`
                );
                const projects = await projectRes.json();
                const projectData = projects.find(p => p.project_id.toString() === id);
                if (!projectData) throw new Error('Project not found');
                setProject(projectData);

                // Fetch discussions
                const discussionsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/discussions?code=${process.env.NEXT_PUBLIC_API_KEY}`
                );
                const allDiscussions = await discussionsRes.json();
                const projectDiscussions = allDiscussions.filter(d => d.project_id.toString() === id);
                setDiscussions(projectDiscussions.sort((a, b) =>
                    new Date(b.posted_at) - new Date(a.posted_at)
                ));
            } catch (err) {
                console.error('Error fetching data:', err);
                alert('Failed to load project discussions');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please sign in to post a comment');
            return;
        }
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/discussions?code=${process.env.NEXT_PUBLIC_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_id: parseInt(id),
                        user_id: user.user_id,
                        message: newMessage.trim()
                    })
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to post comment');
            }

            // Refresh discussions
            const discussionsRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/discussions?code=${process.env.NEXT_PUBLIC_API_KEY}`
            );
            const allDiscussions = await discussionsRes.json();
            const projectDiscussions = allDiscussions.filter(d => d.project_id.toString() === id);
            setDiscussions(projectDiscussions.sort((a, b) =>
                new Date(b.posted_at) - new Date(a.posted_at)
            ));

            setNewMessage('');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdate = (updatedDiscussion) => {
        setDiscussions(prev => prev.map(d =>
            d.discussion_id === updatedDiscussion.discussion_id ? updatedDiscussion : d
        ));
    };

    const handleDelete = (discussionId) => {
        setDiscussions(prev => prev.filter(d => d.discussion_id !== discussionId));
    };

    if (loading) {
        return (
            <div className="discussions-page loading" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <LoadingSpinner size="large" color="blue" />
            </div>
        );
    }

    if (!project) {
        return <div className="discussions-page">Project not found</div>;
    }

    return (
        <div className="discussions-page">
            <div className="discussions-header" style={{
                textAlign: 'center',
                marginBottom: '2rem',
                padding: '2rem',
                background: 'var(--card-bg)',
                borderRadius: '12px',
                border: '1px solid var(--primary-border)'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: 'var(--color-blue)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-ibm-plex-mono)'
                }}>{project.name}</h1>
                <p className="project-owner" style={{
                    fontSize: '1.1rem',
                    color: 'var(--secondary-text)'
                }}>by {project.owner}</p>
            </div>

            <div className="discussions-content" style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 1rem'
            }}>
                <div className="new-discussion" style={{
                    background: 'var(--card-bg)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    border: '1px solid var(--primary-border)'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        color: 'var(--color-blue)',
                        fontFamily: 'var(--font-ibm-plex-mono)'
                    }}>Add a Comment</h2>
                    {user ? (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write your comment here..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--primary-border)',
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-roboto)',
                                    resize: 'vertical'
                                }}
                            />
                            <Button type="submit" style={{ alignSelf: 'flex-end' }}>Post Comment</Button>
                        </form>
                    ) : (
                        <p className="signin-prompt" style={{
                            textAlign: 'center',
                            color: 'var(--text-gray)',
                            fontStyle: 'italic'
                        }}>Please sign in to post comments</p>
                    )}
                </div>

                <div className="discussions-list" style={{
                    background: 'var(--card-bg)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--primary-border)'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        marginBottom: '1.5rem',
                        color: 'var(--color-blue)',
                        fontFamily: 'var(--font-ibm-plex-mono)'
                    }}>Comments ({discussions.length})</h2>
                    {discussions.length === 0 ? (
                        <p className="no-discussions" style={{
                            textAlign: 'center',
                            color: 'var(--text-gray)',
                            fontStyle: 'italic',
                            padding: '2rem 0'
                        }}>No comments yet. Be the first to comment!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {discussions.map(discussion => (
                                <Discussion
                                    key={discussion.discussion_id}
                                    discussion={discussion}
                                    currentUser={user}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}