'use client';

import { useEffect, useState, useCallback } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

const colors = ['#FF69B4', '#FFF200', '#00A2E8', '#22B14C', '#A349A4', '#FF7F27'];

export function SparkleTrail() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // Konami code easter egg to enable sparkle trail
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setIsEnabled(true);
          setShowMessage(true);
          konamiIndex = 0;
          setTimeout(() => setShowMessage(false), 2000);
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isEnabled) return;

    const newSparkle: Sparkle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
    };

    setSparkles((prev) => [...prev.slice(-15), newSparkle]);
  }, [isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isEnabled, handleMouseMove]);

  // Clean up old sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((prev) => prev.slice(-10));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Konami activation message */}
      {showMessage && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] scale-in"
          style={{
            background: '#FFF200',
            color: '#000',
            padding: '20px 40px',
            fontFamily: "'Caveat', cursive",
            fontSize: '2rem',
            border: '4px solid #000',
          }}
        >
          Режим искорок активирован!
        </div>
      )}

      {/* Sparkle trail */}
      {isEnabled && (
        <div className="sparkle-container">
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                left: sparkle.x,
                top: sparkle.y,
              }}
            >
              <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1 L8 6 M8 10 L8 15 M1 8 L6 8 M10 8 L15 8"
                  stroke={sparkle.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
