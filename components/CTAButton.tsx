interface CTAButtonProps {
  onClick: () => void;
}

export function CTAButton({ onClick }: CTAButtonProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="relative">
        {/* Doodle arrow pointing to button */}
        <div 
          className="absolute -top-16 left-1/2 -translate-x-1/2 handdrawn-text-small text-black"
          style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            transform: 'translate(-50%, 0) rotate(-5deg)'
          }}
        >
          жми сюда! ↓
        </div>

        {/* Arrow doodle */}
        <div 
          className="absolute -top-6 left-1/2 -translate-x-1/2"
          style={{ transform: 'translate(-20%, 0) rotate(10deg)' }}
        >
          <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M30 2 Q35 15, 30 28 M30 28 L25 22 M30 28 L35 22"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Main CTA button */}
        <button
          onClick={onClick}
          className="handdrawn-button bg-red text-white border-4 border-black py-4 px-12 cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-lg"
          style={{
            fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
            transform: 'rotate(-2deg)',
            boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.3)',
          }}
        >
          ЗАПИСАТЬСЯ
        </button>

        {/* Decorative stars around button */}
        <div className="absolute -right-8 -top-2" style={{ transform: 'rotate(25deg)' }}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5 2 L13 11 L12.5 11 M12.5 23 L12 14 L12.5 14 M2 12.5 L11 12 L11 12.5 M23 12.5 L14 13 L14 12.5 M5 5 L11 11 L10.5 11.5 M20 20 L14 14 L14.5 13.5 M20 5 L14.5 11 L14 11.5 M5 20 L10.5 14 L11 13.5"
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="absolute -left-6 top-1/2 -translate-y-1/2" style={{ transform: 'translate(0, -50%) rotate(-15deg)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 2 L10.5 9 L10 9 M10 18 L9.5 11 L10 11 M2 10 L9 9.5 L9 10 M18 10 L11 10.5 L11 10 M4 4 L9 9 L8.5 9.5 M16 16 L11 11 L11.5 10.5 M16 4 L11.5 9 L11 9.5 M4 16 L8.5 11 L9 10.5"
              stroke="#87CEEB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
