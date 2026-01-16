export function PortfolioSection() {
  const portfolioItems = [
    { color: '#FFB6C1', label: 'Минимализм' },
    { color: '#DDA0DD', label: 'Цветы' },
    { color: '#87CEEB', label: 'Графика' },
    { color: '#F0E68C', label: 'Надписи' },
  ];

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="handdrawn-heading text-red text-center mb-12" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
          <span style={{ display: 'inline-block', transform: 'rotate(-1deg)' }}>
            Мои работы
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="handdrawn-box aspect-square border-3 border-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              style={{
                backgroundColor: item.color,
                transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
              }}
            >
              <div className="handdrawn-subtitle text-black text-center" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="handdrawn-text-small text-gray" style={{ fontSize: 'clamp(0.85rem, 2.3vw, 1.1rem)' }}>
            ↑ нажми чтобы увидеть больше ↑
          </p>
        </div>
      </div>
    </div>
  );
}
