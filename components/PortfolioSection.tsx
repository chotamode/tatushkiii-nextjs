'use client';

import { useState } from 'react';

const portfolioItems = [
  { color: '#FFCDD2', label: 'минимализм', rotation: -2.5, emoji: '✨' },
  { color: '#B3E5FC', label: 'цветы', rotation: 1.5, emoji: '🌸' },
  { color: '#FFF59D', label: 'графика', rotation: -1, emoji: '✏️' },
  { color: '#C8E6C9', label: 'надписи', rotation: 2.5, emoji: '💫' },
  { color: '#E1BEE7', label: 'животные', rotation: -1.5, emoji: '🦋' },
  { color: '#FFCCBC', label: 'абстракция', rotation: 2, emoji: '🎨' },
];

export function PortfolioSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2
          className="paint-title paint-red text-center mb-4"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', transform: 'rotate(-1deg)' }}
        >
          мои работы ✿
        </h2>

        <p className="paint-text text-center text-lg opacity-70 mb-10">
          каждая работа — уникальная история
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="polaroid cursor-pointer group"
              style={{
                transform: `rotate(${hoveredIndex === index ? 0 : item.rotation}deg)`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image placeholder with gradient */}
              <div
                className="aspect-square relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                }}
              >
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                >
                  <span className="text-4xl transform transition-transform duration-300 group-hover:scale-125">
                    {item.emoji}
                  </span>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-2 right-2 opacity-30">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      d="M10 2 L11 9 L10 9 M10 18 L9 11 L10 11 M2 10 L9 9 L9 10 M18 10 L11 11 L11 10"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Label */}
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="paint-text text-sm">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="paint-text text-lg mb-4" style={{ transform: 'rotate(0.5deg)' }}>
            хочешь увидеть больше?
          </p>
          <a
            href="https://instagram.com/tattoo_master"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block paint-box px-6 py-3 cursor-pointer hover:scale-105 transition-transform"
            style={{ transform: 'rotate(-1deg)' }}
          >
            <span className="paint-text text-lg">смотреть в инстаграм →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
