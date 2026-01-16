export function AboutSection() {
  return (
    <div className="py-12 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="handdrawn-box p-8 border-3 border-black mb-8" style={{ transform: 'rotate(-0.5deg)' }}>
          <h2 className="handdrawn-heading text-green mb-6 text-center" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <span style={{ display: 'inline-block', transform: 'rotate(1deg)' }}>
              Привет! ✌️
            </span>
          </h2>
          
          <div className="space-y-4">
            <p className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
              Я Катя, тату-мастер с 5-летним стажем
            </p>
            
            <p className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
              Специализируюсь на женских тату — минимализм, флористика, графика
            </p>
            
            <p className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
              Работаю в чистой студии в центре Москвы
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="handdrawn-box p-6 border-2 border-green text-center" style={{ transform: 'rotate(1deg)' }}>
            <div className="handdrawn-heading text-green mb-2" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
              500+
            </div>
            <div className="handdrawn-text-small" style={{ fontSize: 'clamp(0.85rem, 2.3vw, 1.1rem)' }}>
              довольных<br/>клиентов
            </div>
          </div>

          <div className="handdrawn-box p-6 border-2 border-red text-center" style={{ transform: 'rotate(-1deg)' }}>
            <div className="handdrawn-heading text-red mb-2" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
              5 лет
            </div>
            <div className="handdrawn-text-small" style={{ fontSize: 'clamp(0.85rem, 2.3vw, 1.1rem)' }}>
              опыта<br/>в тату
            </div>
          </div>

          <div className="handdrawn-box p-6 border-2 border-blue text-center" style={{ transform: 'rotate(0.5deg)' }}>
            <div className="handdrawn-heading text-blue mb-2" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
              100%
            </div>
            <div className="handdrawn-text-small" style={{ fontSize: 'clamp(0.85rem, 2.3vw, 1.1rem)' }}>
              стерильность<br/>и безопасность
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
