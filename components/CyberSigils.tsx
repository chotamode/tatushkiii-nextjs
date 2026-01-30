'use client';

import { useEffect, useState } from 'react';

interface Sigil {
  id: number;
  x: number;
  y: number;
  type: 'triangle' | 'cross' | 'line' | 'circle' | 'x' | 'diamond';
  size: number;
  rotation: number;
  animationDelay: number;
  animationDuration: number;
  opacity: number;
}

// Seeded random for consistent positioning
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export default function CyberSigils() {
  const [sigils, setSigils] = useState<Sigil[]>([]);

  useEffect(() => {
    // Generate 25 cyber sigils with seeded random positions
    const generatedSigils: Sigil[] = Array.from({ length: 25 }, (_, i) => {
      const seed = i * 137.508; // Golden angle for better distribution
      return {
        id: i,
        x: seededRandom(seed) * 100,
        y: seededRandom(seed + 1) * 100,
        type: (['triangle', 'cross', 'line', 'circle', 'x', 'diamond'] as const)[
          Math.floor(seededRandom(seed + 2) * 6)
        ],
        size: 15 + seededRandom(seed + 3) * 25, // 15-40px
        rotation: seededRandom(seed + 4) * 360,
        animationDelay: seededRandom(seed + 5) * 3,
        animationDuration: 4 + seededRandom(seed + 6) * 4, // 4-8s
        opacity: 0.05 + seededRandom(seed + 7) * 0.15, // 0.05-0.2
      };
    });

    setSigils(generatedSigils);
  }, []);

  const renderSigilPath = (type: Sigil['type']) => {
    switch (type) {
      case 'triangle':
        return <path d="M 20 5 L 35 35 L 5 35 Z" stroke="currentColor" fill="none" strokeWidth="1" />;
      case 'cross':
        return (
          <>
            <line x1="20" y1="5" x2="20" y2="35" stroke="currentColor" strokeWidth="1" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1" />
          </>
        );
      case 'line':
        return <line x1="10" y1="10" x2="30" y2="30" stroke="currentColor" strokeWidth="1" />;
      case 'circle':
        return <circle cx="20" cy="20" r="12" stroke="currentColor" fill="none" strokeWidth="1" />;
      case 'x':
        return (
          <>
            <line x1="10" y1="10" x2="30" y2="30" stroke="currentColor" strokeWidth="1" />
            <line x1="30" y1="10" x2="10" y2="30" stroke="currentColor" strokeWidth="1" />
          </>
        );
      case 'diamond':
        return <path d="M 20 5 L 35 20 L 20 35 L 5 20 Z" stroke="currentColor" fill="none" strokeWidth="1" />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sigils.map((sigil) => (
        <div
          key={sigil.id}
          className="absolute text-acid mix-blend-screen"
          style={{
            left: `${sigil.x}%`,
            top: `${sigil.y}%`,
            width: `${sigil.size}px`,
            height: `${sigil.size}px`,
            opacity: sigil.opacity,
            transform: `rotate(${sigil.rotation}deg)`,
            animation: `sigil-float ${sigil.animationDuration}s ease-in-out infinite`,
            animationDelay: `${sigil.animationDelay}s`,
          }}
        >
          <svg
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {renderSigilPath(sigil.type)}
          </svg>
        </div>
      ))}
    </div>
  );
}
