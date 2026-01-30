'use client';

export default function FilmGrain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-[0.015]"
      style={{
        animation: 'noise-flicker 0.5s infinite',
        mixBlendMode: 'overlay',
      }}
    />
  );
}
