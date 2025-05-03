'use client';
import { useEffect } from 'react';
import Button from './Button';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="confirm-dialog-actions">
                    <Button color="red" onClick={onConfirm}>Confirm</Button>
                    <Button color="black" onClick={onCancel}>Cancel</Button>
                </div>
            </div>
            <style jsx>{`
                .confirm-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease-out;
                }

                .confirm-dialog {
                    background: var(--background);
                    border-radius: 12px;
                    padding: 2rem;
                    min-width: 300px;
                    max-width: 90%;
                    box-shadow: var(--shadow-lg);
                    animation: slideUp 0.3s ease-out;
                    border: 1px solid var(--primary-border);
                }

                .confirm-dialog h2 {
                    color: var(--primary-text);
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                    font-family: var(--font-ibm-plex-mono);
                }

                .confirm-dialog p {
                    color: var(--secondary-text);
                    margin-bottom: 2rem;
                    line-height: 1.5;
                }

                .confirm-dialog-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}