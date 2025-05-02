"use client";
import { useRef } from "react";
import Table from "./components/Table";
import FAQ from "./components/FAQ";

export default function Home() {
  const contentRef = useRef(null);

  const scrollToContent = () => {
    contentRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Code<span className="highlight">1</span>0<span className="highlight">1</span>
          </h1>
          <p>Learn<span className="accent">.</span> Build<span className="accent">.</span> Share<span className="accent">.</span></p>
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
        
        .hero-content {
          text-align: center;
          color: var(--foreground);
          z-index: 1;
          padding: 2rem;
          width: 100%;
          max-width: 1200px;
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
        }
        
        .highlight {
          color: var(--color-blue);
        }
        
        .accent {
          color: var(--color-blue);
        }
        
        .hero-content p {
          font-size: 1.8rem;
          color: var(--color-blue);
          opacity: 0.9;
          margin-top: 0.5rem;
          font-weight: 300;
          animation: fadeIn 1.2s ease-out 0.3s both;
        }
        
        .scroll-arrow {
          position: absolute;
          bottom: 2rem;
          cursor: pointer;
          animation: bounce 2s infinite;
          z-index: 2;
          background: none;
          border: none;
          color: var(--foreground);
          padding: 1rem;
        }
        
        .project-grid {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding: 3rem 1.5rem;
          justify-content: center;
          background-color: black;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 0.5rem;
          }
          
          .hero-content p {
            font-size: 1.2rem;
          }
          
          .project-grid {
            padding: 2rem 1rem;
          }
        }
        
        /* Small mobile devices */
        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 3.5rem;
          }
          
          .hero-content p {
            font-size: 1rem;
            padding: 0 0.5rem;
          }
          
          .hero-section {
            height: 70vh;
          }
          
          .scroll-arrow svg {
            width: 30px;
            height: 30px;
          }
        }

        @media (min-width: 1200px) {
          .hero-content h1 {
            font-size: 8rem;
          }
        }
      `}</style>
    </>
  );
}