export function HandDrawnStars() {
  // Create random positions for stars
  const stars = [
    { top: '5%', left: '10%', rotation: 15, size: 1 },
    { top: '15%', left: '85%', rotation: -20, size: 1.2 },
    { top: '25%', left: '5%', rotation: 10, size: 0.9 },
    { top: '35%', left: '92%', rotation: -15, size: 1.1 },
    { top: '45%', left: '8%', rotation: 25, size: 0.8 },
    { top: '55%', left: '88%', rotation: -10, size: 1 },
    { top: '65%', left: '12%', rotation: 18, size: 1.3 },
    { top: '75%', left: '90%', rotation: -25, size: 0.9 },
    { top: '12%', left: '50%', rotation: 12, size: 1 },
    { top: '40%', left: '45%', rotation: -18, size: 0.85 },
    { top: '70%', left: '55%', rotation: 22, size: 1.1 },
  ];

  return (
    <>
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            transform: `rotate(${star.rotation}deg) scale(${star.size})`,
            zIndex: 1,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hand-drawn asterisk star */}
            <path
              d="M20 2 L21 18 L20 18 M20 38 L19 22 L20 22 M2 20 L18 19 L18 20 M38 20 L22 21 L22 20 M8 8 L18 17 L17 18 M32 32 L22 23 L23 22 M32 8 L23 17 L22 18 M8 32 L17 23 L18 22"
              stroke="#4169E1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </>
  );
}
