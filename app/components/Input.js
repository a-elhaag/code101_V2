"use client";
import React, { useState, useRef } from "react";

export default function Input({ label, placeholder, value, onChange, type = "text", ...restProps }) {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef(null);

    return (
        <div
            className={`input-container ${isFocused ? "focused" : ""} ${isHovered ? "hovered" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {label && <label className="input-label">{label}</label>}
            <input
                ref={inputRef}
                className="styled-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                type={type}
                {...restProps}
            />

            <style jsx>{`
        .input-container {
          width: 100%;
          max-width: 400px;
          margin: 1rem auto;
          position: relative;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(10px);
          animation: fadeIn 0.6s forwards;
          transition: all 0.3s ease;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .input-label {
          font-family: var(--font-ibm-plex-mono);
          font-size: 1.1rem;
          color: var(--foreground);
          margin-bottom: 0.5rem;
          position: relative;
        }
        .input-label::after {
          content: "";
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--color-blue);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .input-container.focused .input-label,
        .input-container.hovered .input-label {
          color: var(--color-blue);
        }
        .input-container.focused .input-label {
          transform: translateY(-2px);
        }
        .input-container.focused .input-label::after,
        .input-container.hovered .input-label::after {
          transform: scaleX(1);
        }
        .styled-input {
          font-family: var(--font-roboto);
          font-size: 1rem;
          padding: 0.8rem 1rem;
          border: 1px solid var(--input-border);
          border-radius: 8px;
          background-color: var(--input-bg);
          color: var(--foreground);
          outline: none;
          transition: all 0.3s ease;
        }
        .input-container.hovered .styled-input {
          border-color: var(--color-blue-light);
          box-shadow: 0 0 15px rgba(0, 120, 255, 0.1);
        }
        .styled-input:focus {
          border-color: var(--color-blue);
          box-shadow: 0 0 15px rgba(0, 120, 255, 0.3);
        }
        ::placeholder {
          color: var(--text-gray);
        }
      `}</style>
        </div>
    );
}