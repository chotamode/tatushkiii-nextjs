'use client';

import { useEffect, useState, useMemo } from 'react';

// Seed-based random for consistent SSR/client rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface Doodle {
  id: number;
  top: number;
  left: number;
  rotation: number;
  type: 'star' | 'heart' | 'spiral' | 'flower' | 'sparkle' | 'dot' | 'squiggle';
  color: string;
  size: number;
  animationType: 'float' | 'wiggle' | 'none';
  animationDuration: number;
  animationDelay: number;
}

const colors = ['#ED1C24', '#FF69B4', '#00A2E8', '#22B14C', '#FFF200', '#A349A4', '#FF7F27'];
const types: Doodle['type'][] = ['star', 'heart', 'spiral', 'flower', 'sparkle', 'dot', 'squiggle'];

export function HandDrawnStars() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random doodles with seed for consistency
  const doodles = useMemo(() => {
    const result: Doodle[] = [];
    const count = 35; // More doodles for a livelier feel

    for (let i = 0; i < count; i++) {
      const seed = i * 137.5; // Golden angle for better distribution

      result.push({
        id: i,
        top: seededRandom(seed) * 100,
        left: seededRandom(seed + 1) * 100,
        rotation: (seededRandom(seed + 2) - 0.5) * 40, // -20 to +20 degrees
        type: types[Math.floor(seededRandom(seed + 3) * types.length)],
        color: colors[Math.floor(seededRandom(seed + 4) * colors.length)],
        size: 0.5 + seededRandom(seed + 5) * 1, // 0.5x to 1.5x size
        animationType: ['float', 'wiggle', 'none'][Math.floor(seededRandom(seed + 6) * 3)] as Doodle['animationType'],
        animationDuration: 3 + seededRandom(seed + 7) * 4, // 3-7 seconds
        animationDelay: seededRandom(seed + 8) * 3, // 0-3 seconds delay
      });
    }
    return result;
  }, []);

  const renderDoodle = (type: Doodle['type'], color: string, size: number) => {
    const baseSize = 24;
    const scaledSize = Math.round(baseSize * size);

    switch (type) {
      case 'star':
        return (
          <svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 L13 10 L12 10 M12 22 L11 14 L12 14 M2 12 L10 11 L10 12 M22 12 L14 13 L14 12 M5 5 L10 10 M19 19 L14 14 M19 5 L14 10 M5 19 L10 14"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'heart':
        return (
          <svg width={scaledSize} height={Math.round(scaledSize * 0.9)} viewBox="0 0 24 22" fill="none">
            <path
              d="M12 20 C4 13 1 8 1 5 C1 2.5 3.5 1 6.5 2.5 C8.5 3.5 10.5 5.5 12 7.5 C13.5 5.5 15.5 3.5 17.5 2.5 C20.5 1 23 2.5 23 5 C23 8 20 13 12 20Z"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'spiral':
        return (
          <svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12 C12 10 14 8 16 10 C18 12 17 15 14 16 C11 17 8 15 8 12 C8 9 11 6 15 7 C19 8 21 13 18 18"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'flower':
        return (
          <svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" />
            <ellipse cx="12" cy="5" rx="3" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
            <ellipse cx="12" cy="19" rx="3" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
            <ellipse cx="5" cy="12" rx="4" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
            <ellipse cx="19" cy="12" rx="4" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
          </svg>
        );
      case 'sparkle':
        return (
          <svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 L12 8 M12 16 L12 22 M2 12 L8 12 M16 12 L22 12"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'dot':
        return (
          <svg width={Math.round(scaledSize * 0.5)} height={Math.round(scaledSize * 0.5)} viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4" fill={color} opacity="0.6" />
          </svg>
        );
      case 'squiggle':
        return (
          <svg width={scaledSize * 1.5} height={scaledSize * 0.5} viewBox="0 0 36 12" fill="none">
            <path
              d="M2 6 Q8 2 14 6 Q20 10 26 6 Q32 2 34 6"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!mounted) {
    return null; // Prevent SSR mismatch
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {doodles.map((doodle) => {
        const animationClass = doodle.animationType === 'float' ? 'float' : doodle.animationType === 'wiggle' ? 'wiggle' : '';

        return (
          <div
            key={doodle.id}
            className={animationClass}
            style={{
              position: 'absolute',
              top: `${doodle.top}%`,
              left: `${doodle.left}%`,
              transform: `rotate(${doodle.rotation}deg)`,
              opacity: 0.7,
              animationDuration: `${doodle.animationDuration}s`,
              animationDelay: `${doodle.animationDelay}s`,
            }}
          >
            {renderDoodle(doodle.type, doodle.color, doodle.size)}
          </div>
        );
      })}
    </div>
  );
}
