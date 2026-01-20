export function AboutSection() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Speech bubble intro */}
        <div className="speech-bubble mb-12" style={{ transform: 'rotate(-0.5deg)' }}>
          <h2
            className="paint-title paint-green mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}
          >
            привет! ✌️
          </h2>

          <div className="space-y-3">
            <p className="paint-text text-lg">
              я Катя, тату-мастер с 5-летним стажем
            </p>
            <p className="paint-text text-lg">
              специализируюсь на женских тату — <span className="marker-highlight">минимализм</span>, флористика, графика
            </p>
            <p className="paint-text text-lg">
              работаю в чистой студии в центре Москвы ♡
            </p>
          </div>
        </div>

        {/* Stats as sticker circles */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Sticker 1 */}
          <div
            className="sticker border-paint-green"
            style={{ transform: 'rotate(-5deg)', borderColor: '#22B14C' }}
          >
            <div className="text-center">
              <div className="paint-title paint-green text-2xl">500+</div>
              <div className="paint-text text-xs">клиентов</div>
            </div>
          </div>

          {/* Sticker 2 */}
          <div
            className="sticker"
            style={{ transform: 'rotate(3deg)', borderColor: '#ED1C24' }}
          >
            <div className="text-center">
              <div className="paint-title paint-red text-2xl">5 лет</div>
              <div className="paint-text text-xs">опыта</div>
            </div>
          </div>

          {/* Sticker 3 */}
          <div
            className="sticker"
            style={{ transform: 'rotate(-2deg)', borderColor: '#00A2E8' }}
          >
            <div className="text-center">
              <div className="paint-title paint-blue text-2xl">100%</div>
              <div className="paint-text text-xs">стерильно</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
