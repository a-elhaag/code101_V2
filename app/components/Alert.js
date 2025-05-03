'use client';
import { useEffect } from 'react';

export default function Alert({ message, type = 'info', duration = 3000, onClose }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={`alert alert-${type}`}>
            <div className="alert-content">{message}</div>
            <button className="alert-close" onClick={onClose}>×</button>
            <style jsx>{`
                .alert {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem;
                    border-radius: 8px;
                    background: var(--background);
                    color: var(--foreground);
                    box-shadow: var(--shadow-md);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    min-width: 300px;
                    max-width: 500px;
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }

                .alert-success {
                    border-left: 4px solid #4caf50;
                }

                .alert-error {
                    border-left: 4px solid #f44336;
                }

                .alert-info {
                    border-left: 4px solid var(--color-blue);
                }

                .alert-content {
                    flex: 1;
                }

                .alert-close {
                    background: none;
                    border: none;
                    color: var(--foreground);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    opacity: 0.6;
                    transition: opacity 0.3s;
                }

                .alert-close:hover {
                    opacity: 1;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}