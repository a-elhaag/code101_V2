'use client';
import { useState, useRef, useEffect } from "react";
import Button from "./Button";

export default function UserCard({ user, onResetPassword, onDelete, onRoleChange }) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentTheme, setCurrentTheme] = useState("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => cardRef.current && observer.unobserve(cardRef.current);
    }, []);

    useEffect(() => {
        setMounted(true);
        const theme = document.documentElement.getAttribute("data-theme") || "dark";
        setCurrentTheme(theme);
        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute("data-theme") || "dark";
            setCurrentTheme(newTheme);
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e) => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const getRoleColor = (role) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return '#4CAF50';
            default:
                return '#2196F3';
        }
    };

    return (
        <div
            ref={cardRef}
            className={`user-card ${isVisible ? "visible" : ""} ${isHovered ? "hovered" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            style={{
                "--mouse-x": `${mousePos.x}px`,
                "--mouse-y": `${mousePos.y}px`,
            }}
        >
            <div className="card-content">
                <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="card-title">{user.username}</h2>
                <p className="card-info">{user.email}</p>
                <div className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                    {user.role}
                </div>
            </div>

            <div className="card-actions">
                <Button
                    size="sm"
                    color={mounted && currentTheme === "light" ? "black" : "white"}
                    onClick={() => onRoleChange(user.user_id, user.role === 'admin' ? 'user' : 'admin')}
                >
                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </Button>
                <Button
                    size="sm"
                    color={mounted && currentTheme === "light" ? "black" : "white"}
                    onClick={() => onResetPassword(user.user_id, user.username)}
                >
                    Reset Password
                </Button>
                <Button
                    size="sm"
                    color="red"
                    onClick={() => onDelete(user.user_id)}
                >
                    Delete User
                </Button>
            </div>

            <style jsx>{`
                .user-card {
                    width: 280px;
                    height: 400px;
                    border-radius: 12px;
                    padding: 1.5rem;
                    border: 1px solid var(--primary-border);
                    background-color: var(--card-bg);
                    color: var(--foreground);
                    margin: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 1rem;
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(5px);
                    box-shadow: var(--shadow-md);
                    opacity: 0;
                    transform: translateY(10px);
                    animation: fadeIn 0.6s forwards;
                    transition: var(--theme-transition), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .user-card.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .user-card.hovered {
                    background: radial-gradient(circle 80px at var(--mouse-x) var(--mouse-y),
                        var(--color-blue) 0%,
                        rgba(0, 120, 255, 0.4) 40%,
                        transparent 80%),
                        var(--card-bg);
                    box-shadow: 0 0 30px rgba(0, 120, 255, 0.3) inset;
                    transform: translateY(-5px);
                }

                .card-content {
                    position: relative;
                    z-index: 1;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .user-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: var(--color-blue);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 1.5rem;
                    transition: transform 0.3s ease;
                }

                .user-card.hovered .user-avatar {
                    transform: scale(1.05);
                }

                .card-title {
                    font-family: var(--font-ibm-plex-mono);
                    font-size: 1.5rem;
                    margin: 0 0 1rem;
                    color: var(--primary-text);
                    position: relative;
                }

                .card-title::after {
                    content: "";
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: var(--color-blue);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .user-card.hovered .card-title::after {
                    transform: scaleX(1);
                }

                .card-info {
                    font-size: 1rem;
                    color: var(--secondary-text);
                    margin-bottom: 1rem;
                }

                .role-badge {
                    display: inline-block;
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    color: white;
                    font-size: 0.875rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 0.5rem;
                }

                .card-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                @keyframes fadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .user-card {
                        width: 100%;
                        max-width: 350px;
                        height: 380px;
                    }
                }
            `}</style>
        </div>
    );
}