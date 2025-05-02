import { useState } from 'react';

export default function Button({ children, color = "white", onClick, size = "md" }) {
    const [isHovered, setIsHovered] = useState(false);
    
    const baseStyle = {
        fontFamily: "var(--font-ibm-plex-mono)",
        fontWeight: "bold",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        padding: size === "md" ? "0.6rem 1.4rem" : "0.4rem 1rem",
        fontSize: "1rem",
        boxShadow: isHovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        border: "1px solid transparent",
        position: "relative",
        overflow: "hidden",
        backgroundColor: color === "black" 
            ? (isHovered ? "#1a1a1a" : "#000") 
            : (isHovered ? "rgba(255, 255, 255, 0.9)" : "#fff"),
        color: color === "black" ? "#fff" : "#000",
        transform: isHovered ? "translateY(-2px)" : "none",
    };

    const shimmerStyle = {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
        animation: "shimmer 1.5s infinite",
        display: isHovered ? "block" : "none",
    };

    const shineStyle = {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
        animation: "shine 1.5s ease-in-out infinite",
        display: isHovered ? "block" : "none",
    };

    return (
        <>
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                @keyframes shine {
                    0% {
                        left: -100%;
                    }
                    20% {
                        left: 100%;
                    }
                    100% {
                        left: 100%;
                    }
                }
            `}</style>
            <button 
                style={baseStyle} 
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                onMouseUp={(e) => e.currentTarget.style.transform = isHovered ? "translateY(-2px)" : "none"}
            >
                {isHovered && <div style={{...shineStyle, transform: "translateX(-100%)"}} />}
                {isHovered && <div style={shimmerStyle} />}
                {children}
            </button>
        </>
    );
}