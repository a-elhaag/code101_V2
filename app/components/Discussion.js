'use client';
import { useState } from 'react';
import Button from './Button';

export default function Discussion({ discussion, currentUser, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(discussion.message);

    const handleUpdate = async () => {
        if (!editedMessage.trim()) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/discussions/${discussion.discussion_id}?code=${process.env.NEXT_PUBLIC_API_KEY}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: editedMessage })
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update comment');
            }

            onUpdate({ ...discussion, message: editedMessage });
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/discussions/${discussion.discussion_id}?code=${process.env.NEXT_PUBLIC_API_KEY}`,
                { method: 'DELETE' }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete comment');
            }

            onDelete(discussion.discussion_id);
        } catch (err) {
            alert(err.message);
        }
    };

    const canModify = currentUser && (
        currentUser.user_id === discussion.user_id ||
        currentUser.role === 'admin'
    );

    return (
        <div className="discussion-item" style={{
            background: 'var(--background)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--primary-border)'
        }}>
            <div className="discussion-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-gray)'
            }}>
                <span className="discussion-author" style={{ fontWeight: 'bold' }}>
                    User #{discussion.user_id}
                </span>
                <span className="discussion-date">
                    {new Date(discussion.posted_at).toLocaleString()}
                </span>
            </div>

            {isEditing ? (
                <div className="discussion-edit" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <textarea
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid var(--primary-border)',
                            background: 'var(--card-bg)',
                            color: 'var(--foreground)',
                            fontSize: '1rem',
                            fontFamily: 'var(--font-roboto)',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button size="sm" onClick={handleUpdate}>Save</Button>
                        <Button size="sm" color="black" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="discussion-message" style={{
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: canModify ? '1rem' : 0,
                        color: 'var(--foreground)'
                    }}>
                        {discussion.message}
                    </p>
                    {canModify && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                            <Button size="sm" color="red" onClick={handleDelete}>Delete</Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}