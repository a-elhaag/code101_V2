'use client';
import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import styles from './page.module.css';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/approved-projects')
            .then((res) => res.json())
            .then((data) => {
                setProjects(data.projects || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching projects:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.projectsPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageHeading}>Community Projects</h1>
                <p className={styles.pageDescription}>
                    Explore projects submitted by the Code101 community
                </p>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <LoadingSpinner size="large" color="blue" />
                </div>
            ) : projects.length > 0 ? (
                <div className={styles.projectsGrid}>
                    {projects.map((project) => (
                        <ProjectCard key={project.project_id} project={project} />
                    ))}
                </div>
            ) : (
                <div className={styles.noProjects}>
                    <p>No approved projects yet. Be the first to submit one!</p>
                </div>
            )}
        </div>
    );
}