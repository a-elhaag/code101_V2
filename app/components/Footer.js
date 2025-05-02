'use client';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Code101</h3>
                    <p>Explore and learn from open source projects.</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/projects">Browse Projects</a></li>
                        <li><a href="/dashboard">Dashboard</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Connect</h3>
                    <ul>
                        <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Code101. All rights reserved.</p>
            </div>
        </footer>
    );
}