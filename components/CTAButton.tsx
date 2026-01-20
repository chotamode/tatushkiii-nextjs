'use client';

import { useEffect, useState } from 'react';

export function CTAButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight > documentHeight - 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Create sparkle effect
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left + (Math.random() - 0.5) * 40,
      y: e.clientY - rect.top + (Math.random() - 0.5) * 40,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 600);

    // Open Cal.com popup
    if (typeof window !== 'undefined') {
      const Cal = (window as any).Cal;
      if (Cal && Cal.ns && Cal.ns["обсуждение-тату-в-тг"]) {
        Cal.ns["обсуждение-тату-в-тг"]("modal", {
          calLink: "chotamode/обсуждение-тату-в-тг",
          config: { layout: "month_view" }
        });
      }
    }
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateX(-50%) translateY(${isVisible ? 0 : 20}px)`,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div className="relative">
        {/* Hand-drawn arrow and text */}
        <div
          className="absolute -top-16 left-1/2 text-center pointer-events-none"
          style={{ transform: 'translateX(-50%) rotate(-3deg)' }}
        >
          <span className="paint-text text-lg whitespace-nowrap">жми сюда!</span>
          <svg width="40" height="35" viewBox="0 0 40 35" className="mx-auto wiggle mt-1">
            <path
              d="M20 2 Q18 14 22 26 M12 20 Q20 30 20 32 Q20 30 28 20"
              stroke="#000"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-14 -top-4 float pointer-events-none" style={{ animationDelay: '0.5s' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2 L17 14 L16 14 M16 30 L15 18 L16 18 M2 16 L14 15 L14 16 M30 16 L18 17 L18 16 M6 6 L14 14 M26 26 L18 18 M26 6 L18 14 M6 26 L14 18"
              stroke="#FFF200"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="absolute -left-12 -top-1 float pointer-events-none" style={{ animationDelay: '1s' }}>
          <svg width="28" height="26" viewBox="0 0 28 26" fill="none">
            <path
              d="M14 24 C5 17 2 11 2 7 C2 3.5 5 1.5 8.5 3 C11 4.5 13 6.5 14 9 C15 6.5 17 4.5 19.5 3 C23 1.5 26 3.5 26 7 C26 11 23 17 14 24Z"
              stroke="#FF69B4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="absolute -right-8 bottom-0 float pointer-events-none" style={{ animationDelay: '1.5s' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2 L11 9 L10 9 M10 18 L9 11 L10 11 M2 10 L9 9 L9 10 M18 10 L11 11 L11 10"
              stroke="#00A2E8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="absolute -left-6 bottom-2 wiggle pointer-events-none" style={{ animationDelay: '0.8s' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="5" stroke="#22B14C" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Sparkle effects on click */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              animation: 'sparkle-float 0.6s ease-out forwards',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1 L6 5 M6 7 L6 11 M1 6 L5 6 M7 6 L11 6"
                stroke="#FFF200"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ))}

        {/* Main button */}
        <button
          onClick={handleClick}
          data-cal-link="chotamode/обсуждение-тату-в-тг"
          data-cal-namespace="обсуждение-тату-в-тг"
          data-cal-config='{"layout":"month_view"}'
          className="paint-button bg-paint-red text-white pulse-glow ripple hover-jelly"
          style={{
            fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)',
            transform: 'rotate(-2deg)',
          }}
        >
          записаться ♡
        </button>
      </div>
    </div>
  );
}
