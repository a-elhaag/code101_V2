'use client';
import React, { useState, useRef, useEffect } from "react";

const faqData = [
    {
        question: "What is Code101?",
        answer:
            "Code101 is a platform to discover, learn, and share open-source projects with an amazing community."
    },
    {
        question: "How can I contribute?",
        answer:
            "You can contribute by submitting pull requests, filing issues, or creating new projects and linking them here!"
    },
    {
        question: "Is Code101 free to use?",
        answer:
            "Absolutely! Code101 is open-source and free for everyone to explore and collaborate."
    },
    {
        question: "Why use Code101?",
        answer:
            "It's a vibrant community where you can level up your skills, collaborate with peers, and showcase your projects."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);
    const faqRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredItem, setHoveredItem] = useState(null);

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

        if (faqRef.current) {
            observer.observe(faqRef.current);
        }

        return () => {
            if (faqRef.current) {
                observer.unobserve(faqRef.current);
            }
        };
    }, []);

    const handleToggle = (index) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    const handleMouseMove = (e, index) => {
        if (hoveredItem === index) {
            const item = document.getElementById(`faq-item-${index}`);
            if (item) {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMousePos({ x, y });
            }
        }
    };

    return (
        <div
            ref={faqRef}
            className={`faq-container ${isVisible ? "visible" : ""}`}
        >
            <h2 className="faq-heading">Frequently Asked Questions</h2>

            <div className="faq-items">
                {faqData.map((item, index) => {
                    const isOpen = index === activeIndex;
                    const isHovered = index === hoveredItem;
                    return (
                        <div
                            id={`faq-item-${index}`}
                            key={index}
                            className={`faq-item ${isOpen ? "open" : ""} ${isHovered ? "hovered" : ""}`}
                            style={{
                                "--delay": `${index * 0.1 + 0.2}s`,
                                "--mouse-x": `${mousePos.x}px`,
                                "--mouse-y": `${mousePos.y}px`
                            }}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                        >
                            <button
                                className="faq-question"
                                onClick={() => handleToggle(index)}
                                aria-expanded={isOpen}
                            >
                                <span className="question-text">{item.question}</span>
                                <span className="icon">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <line
                                            x1="2"
                                            y1="8"
                                            x2="14"
                                            y2="8"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <line
                                            className="vertical"
                                            x1="8"
                                            y1="2"
                                            x2="8"
                                            y2="14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                            </button>
                            <div className="faq-answer-wrapper" style={{
                                height: isOpen ? `${item.answer.length * 0.5 + 40}px` : "0px"
                            }}>
                                <div className="faq-answer">{item.answer}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        .faq-container {
          width: 100%;
          max-width: 900px;
          margin: 3rem auto;
          padding: 2rem;
          background-color: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid var(--card-border);
          padding: 0 1rem;
          text-align: center;
        }

        .faq-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-heading {
          font-family: var(--font-ibm-plex-mono);
          font-size: 2rem;
          margin-bottom: 2.5rem;
          text-align: center;
          color: var(--foreground);
          position: relative;
          padding-bottom: 0.5rem;
        }

        .faq-heading::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background-color: var(--color-blue);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .faq-container.visible .faq-heading::after {
          width: 120px;
        }

        .faq-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          background: var(--card-bg);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
          animation: itemFadeIn 0.5s forwards;
          animation-delay: var(--delay);
          position: relative;
          cursor: pointer;
        }
        
        @keyframes itemFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-item.open {
          background: var(--card-bg);
          box-shadow: var(--shadow-sm);
        }

        .faq-item.hovered {
          background: radial-gradient(
            circle 80px at var(--mouse-x) var(--mouse-y),
            var(--color-blue) 0%,
            rgba(0, 120, 255, 0.4) 40%,
            transparent 80%
          ) var(--card-bg);
          box-shadow: 0 0 30px rgba(0, 120, 255, 0.3) inset;
        }

        .faq-item.hovered::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 8px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          pointer-events: none;
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }

        .faq-question {
          width: 100%;
          text-align: left;
          font-family: var(--font-ibm-plex-mono);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--foreground);
          background: none;
          border: none;
          padding: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .faq-question:hover {
          color: var(--color-blue);
        }
        
        .faq-item.open .faq-question,
        .faq-item.hovered .faq-question {
          color: var(--color-blue);
        }

        .question-text {
          position: relative;
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .question-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--color-blue);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .faq-item.open .question-text::after,
        .faq-item.hovered .question-text::after {
          transform: scaleX(1);
        }

        .faq-item.open .question-text,
        .faq-item.hovered .question-text {
          transform: translateY(-2px);
        }

        .icon {
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        
        .icon svg {
          width: 16px;
          height: 16px;
        }
        
        .vertical {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .faq-item.open .vertical {
          transform: scaleY(0);
          opacity: 0;
        }

        .faq-answer-wrapper {
          overflow: hidden;
          transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          z-index: 1;
        }

        .faq-answer {
          font-family: var(--font-roboto);
          font-size: 1rem;
          color: var(--foreground);
          opacity: 0.85;
          line-height: 1.6;
          padding: 0 1.2rem 1.2rem;
          border-top: 1px solid var(--card-border);
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .faq-item.open .faq-answer {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .faq-container {
            padding: 1.5rem;
            margin: 2rem 1rem;
            width: 90%;
            margin: 2rem auto;
            padding: 1rem;
          }
          
          .faq-heading {
            font-size: 1.8rem;
            margin-bottom: 2rem;
          }

          .faq-question {
            font-size: 1rem;
            padding: 1rem;
          }
          
          .faq-answer {
            padding: 0 1rem 1rem;
          }

          .faq-items {
            text-align: left;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .faq-container {
            padding: 1.2rem;
            margin: 1.5rem 0.8rem;
          }
          
          .faq-heading {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .faq-question {
            font-size: 0.95rem;
            padding: 0.8rem;
          }
          
          .faq-answer {
            font-size: 0.9rem;
            padding: 0 0.8rem 0.8rem;
          }
        }
      `}</style>
        </div>
    );
}