"use client";
import { useRef, useEffect } from "react";
import Table from "./components/Table";
import FAQ from "./components/FAQ";

export default function Home() {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.8;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.reset();
        if (this.y < 0 || this.y > canvas.height) this.reset();
      }

      draw() {
        ctx.fillStyle = `rgba(var(--color-blue-rgb), ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, []);

  const scrollToContent = () => {
    contentRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="hero-section">
        <canvas ref={canvasRef} className="particles-canvas" />
        <div className="hero-content">
          <h1 className="animated-text">
            Code<span className="highlight">1</span>0<span className="highlight">1</span>
          </h1>
          <p className="animated-subtitle">
            <span className="word">Learn</span>
            <span className="accent">.</span>
            <span className="word">Build</span>
            <span className="accent">.</span>
            <span className="word">Share</span>
            <span className="accent">.</span>
          </p>
        </div>

        <button className="scroll-arrow" onClick={scrollToContent} aria-label="Scroll to content">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      <div ref={contentRef}>
        <Table />
        <FAQ />
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          height: 80vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: var(--foreground);
        }
        
        .particles-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .hero-content {
          text-align: center;
          color: var(--foreground);
          z-index: 1;
          padding: 2rem;
          width: 100%;
          max-width: 1200px;
          animation: float 6s ease-in-out infinite;
        }
        
        .hero-content h1 {
          font-size: 7rem;
          margin-bottom: 1rem;
          font-family: var(--font-ibm-plex-mono);
          letter-spacing: -0.05em;
          font-weight: 700;
          text-shadow: 0 0 15px rgba(0, 120, 255, 0.3);
          animation: fadeIn 1.2s ease-out;
          color: var(--foreground);
          transition: transform 0.3s ease;
        }
        
        .hero-content h1:hover {
          transform: scale(1.05);
        }
        
        .highlight {
          color: var(--color-blue);
          display: inline-block;
          animation: pulse 2s infinite;
        }
        
        .animated-subtitle {
          font-size: 1.8rem;
          opacity: 0.9;
          margin-top: 0.5rem;
          font-weight: 300;
        }

        .word {
          display: inline-block;
          color: var(--foreground);
          animation: slideUp 0.5s ease-out backwards;
        }

        .word:nth-child(1) { animation-delay: 0.5s; }
        .word:nth-child(3) { animation-delay: 0.7s; }
        .word:nth-child(5) { animation-delay: 0.9s; }
        
        .accent {
          color: var(--color-blue);
          display: inline-block;
          animation: rotateIn 0.5s ease-out backwards;
        }

        .accent:nth-child(2) { animation-delay: 0.6s; }
        .accent:nth-child(4) { animation-delay: 0.8s; }
        .accent:nth-child(6) { animation-delay: 1s; }
        
        .scroll-arrow {
          position: absolute;
          bottom: 2rem;
          cursor: pointer;
          z-index: 2;
          background: none;
          border: none;
          color: var(--foreground);
          padding: 1rem;
          transition: transform 0.3s ease, color 0.3s ease;
          animation: float 3s ease-in-out infinite;
        }

        .scroll-arrow:hover {
          transform: translateY(-5px);
          color: var(--color-blue);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: rotate(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}