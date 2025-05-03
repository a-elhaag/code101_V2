"use client";
import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";

export default function ProjectCard({ project }) {
    const { name, description, github_link, owner, project_id } = project;

    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const descriptionRef = useRef(null);
    const [currentTheme, setCurrentTheme] = useState("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (descriptionRef.current) {
            const isOverflowing =
                descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
            setIsTruncated(isOverflowing);
        }
    }, [description]);

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

        const currentRef = cardRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
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

    return (
        <div
            ref={cardRef}
            className={`project-card ${isVisible ? "visible" : ""} ${isHovered ? "hovered" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            style={{
                "--mouse-x": `${mousePos.x}px`,
                "--mouse-y": `${mousePos.y}px`,
            }}
        >
            <div className="card-content">
                <h2 className="card-title">{name}</h2>
                <p className="card-owner">Submitted by {owner}</p>
                <div className="description-container">
                    <p className="card-description" ref={descriptionRef}>{description}</p>
                    {isTruncated && <span className="ellipsis">...</span>}
                </div>
            </div>

            <div className="card-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                <Button
                    size="sm"
                    color={mounted && currentTheme === "light" ? "black" : "white"}
                    onClick={() => github_link && window.open(github_link, "_blank")}
                >
                    View the repo
                </Button>
                <Button
                    size="sm"
                    color={mounted && currentTheme === "light" ? "black" : "white"}
                    onClick={() => window.location.href = `/projects/${project_id}/discussions`}
                >
                    Discuss
                </Button>
            </div>
        </div>
    );
}