"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import Button from "../components/Button";

export default function SignUpPage() {
    /* form state */
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    /* card hover / reveal */
    const cardRef = useRef(null);
    const [isVisible, setVisible] = useState(false);
    const [isHovered, setHovered] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    /* intersection fade‑in */
    useEffect(() => {
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); io.unobserve(e.target); } },
            { threshold: 0.1 }
        );
        cardRef.current && io.observe(cardRef.current);
        return () => cardRef.current && io.unobserve(cardRef.current);
    }, []);

    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) return setError("All fields required");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?code=${process.env.NEXT_PUBLIC_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password, role: "user" })
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Signup failed");
            router.push("/login");
        } catch (err) { setError(err.message); }
    };

    /* mouse gradient */
    const onMove = (e) => {
        if (!cardRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
    };

    return (
        <div className="signup-page">
            <div
                ref={cardRef}
                className={`auth-card ${isVisible ? "visible" : ""} ${isHovered ? "hovered" : ""}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseMove={onMove}
                style={{ "--mouse-x": `${mouse.x}px`, "--mouse-y": `${mouse.y}px` }}
            >
                <form className="form" onSubmit={handleSignup}>
                    <h1 className="title">Create&nbsp;Account</h1>

                    <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

                    {error && <p className="error">{error}</p>}

                    <Button type="submit" full>
                        Sign Up
                    </Button>
                </form>
            </div>

            {/* styling */}
            <style jsx>{`
        .signup-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 2rem 2.2rem;
          background: var(--card-bg);
          border: 1px solid var(--primary-border);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          backdrop-filter: blur(8px);
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          transition: var(--theme-transition), transform .5s cubic-bezier(.16,1,.3,1);
        }
        .auth-card.visible { opacity: 1; transform: translateY(0); }

        .auth-card.hovered {
          background:
            radial-gradient(circle 110px at var(--mouse-x) var(--mouse-y),
              var(--primary-color) 0%,
              rgba(var(--primary-color-rgb), .45) 40%,
              transparent 80%
            ),
            var(--card-bg);
          box-shadow: 0 0 30px rgba(var(--primary-color-rgb), .35) inset;
          transform: translateY(-5px);
        }

        .form { display: flex; flex-direction: column; gap: 1.25rem; }
        .title { text-align: center; font-family: var(--font-ibm-plex-mono); }
        .error { color: red; text-align: center; font-size: .9rem; }

        @media (max-width: 480px) {
          .auth-card { padding: 1.5rem; }
        }
      `}</style>
        </div>
    );
}