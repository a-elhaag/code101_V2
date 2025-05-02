'use client';
import React, { useState, useRef, useEffect } from "react";

const tableData = [
    {
        key: "what",
        title: "What is Code101?",
        description:
            "Code101 is your open community hub to learn, build, and share coding projects in a friendly, collaborative environment."
    },
    {
        key: "how",
        title: "How do I contribute?",
        description:
            "You can contribute by sharing your projects, offering feedback, or submitting pull requests to help improve our community efforts."
    },
    {
        key: "why",
        title: "Why Code101?",
        description:
            "Because we believe collaboration and continuous learning drive innovation. Join us to level up your skills and make a real impact."
    }
];

export default function Table() {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const tableRef = useRef(null);
    const rowRefs = useRef([]);

    useEffect(() => {
        rowRefs.current = rowRefs.current.slice(0, tableData.length);
    }, []);

    const handleMouseMove = (e, rowKey) => {
        if (hoveredRow === rowKey) {
            const rowElement = rowRefs.current[tableData.findIndex((row) => row.key === rowKey)];
            if (rowElement) {
                const rect = rowElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMousePos({ x, y });
            }
        }
    };

    return (
        <div className="table-container">
            <div className="table-wrapper" ref={tableRef}>
                <table className="slogan-table">
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr
                                key={row.key}
                                ref={(el) => (rowRefs.current[index] = el)}
                                onMouseEnter={() => setHoveredRow(row.key)}
                                onMouseLeave={() => setHoveredRow(null)}
                                onMouseMove={(e) => handleMouseMove(e, row.key)}
                                className={`row-animate ${hoveredRow === row.key ? "hovered" : ""}`}
                                style={{
                                    "--delay": `${index * 0.1}s`,
                                    "--mouse-x": `${mousePos.x}px`,
                                    "--mouse-y": `${mousePos.y}px`
                                }}
                            >
                                <td className="title-cell">
                                    <span className="title-text">{row.title}</span>
                                </td>
                                <td className="desc-cell">
                                    <div className="desc-content">{row.description}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .table-container {
          padding: 2rem;
          width: 100%;
          max-width: 100%;
          display: flex;
          justify-content: center;
        }

        .table-wrapper {
          width: 100%;
          max-width: 900px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          position: relative;
        }

        .slogan-table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--card-bg);
          backdrop-filter: blur(10px);
        }

        .slogan-table tr {
          position: relative;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border-bottom: 1px solid var(--card-border);
        }

        .slogan-table tr:last-child {
          border-bottom: none;
        }

        .row-animate {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeIn 0.6s forwards;
          animation-delay: var(--delay);
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slogan-table tr.hovered {
          background: radial-gradient(
            circle 80px at var(--mouse-x) var(--mouse-y),
            var(--color-blue) 0%,
            rgba(0, 120, 255, 0.4) 40%,
            transparent 80%
          );
          box-shadow: 0 0 30px rgba(0, 120, 255, 0.3) inset;
        }

        .slogan-table tr.hovered::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        .slogan-table td {
          padding: 1.8rem;
          color: var(--foreground);
          transition: all 0.3s ease;
        }

        .title-cell {
          font-family: var(--font-ibm-plex-mono);
          font-weight: 700;
          font-size: 1.5rem;
          width: 30%;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
          border-right: 2px solid var(--color-blue);
          padding-right: 1rem;
        }

        .title-text {
          position: relative;
          display: inline-block;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .title-text::after {
          content: "";
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

        tr.hovered .title-text {
          transform: translateY(-2px);
          color: var(--color-blue);
        }

        tr.hovered .title-text::after {
          transform: scaleX(1.1);
        }

        .desc-cell {
          font-family: var(--font-roboto);
          font-size: 1.1rem;
          line-height: 1.5;
          padding-left: 1rem;
        }

        .desc-content {
          opacity: 0.9;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        tr.hovered .desc-content {
          opacity: 1;
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .table-container {
            padding: 1.5rem;
          }

          .title-cell {
            font-size: 1.2rem;
          }

          .desc-cell {
            font-size: 0.95rem;
          }

          .slogan-table td {
            padding: 1.2rem 1rem;
          }
        }

        @media (max-width: 580px) {
          .table-container {
            padding: 1rem;
          }

          .slogan-table tr {
            display: flex;
            flex-direction: column;
            padding: 1rem;
          }

          .title-cell {
            width: 100%;
            border-right: none;
            border-bottom: 2px solid var(--color-blue);
            padding-bottom: 0.5rem;
            padding-right: 0;
          }

          .desc-cell {
            padding-top: 0.5rem;
          }

          .row-animate {
            transform: translateX(-10px);
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>
        </div>
    );
}