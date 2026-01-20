'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '1',
    title: 'пишешь мне',
    description: 'расскажи о своей идее — можно картинкой, словами или даже голосовым!',
    icon: '💬',
    color: '#00A2E8',
  },
  {
    number: '2',
    title: 'обсуждаем',
    description: 'созваниваемся или переписываемся, подбираем размер, место и стиль',
    icon: '🎨',
    color: '#A349A4',
  },
  {
    number: '3',
    title: 'рисую эскиз',
    description: 'создаю уникальный дизайн специально для тебя, правки бесплатно!',
    icon: '✏️',
    color: '#22B14C',
  },
  {
    number: '4',
    title: 'делаем тату',
    description: 'в уютной студии с хорошей музыкой и вкусным чаем ♡',
    icon: '✨',
    color: '#ED1C24',
  },
];

export function ProcessSteps() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleSteps((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    stepsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2
          className="paint-title paint-blue text-center mb-12"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', transform: 'rotate(-1deg)' }}
        >
          как это работает? ✏️
        </h2>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => { stepsRef.current[index] = el; }}
              data-index={index}
              className="process-step"
              style={{
                opacity: visibleSteps.includes(index) ? 1 : 0,
                transform: visibleSteps.includes(index) ? 'translateX(0)' : 'translateX(-30px)',
                transition: `all 0.5s ease ${index * 0.15}s`,
              }}
            >
              <div
                className="process-step-number"
                style={{ borderColor: step.color, color: step.color }}
              >
                {step.number}
              </div>

              <div className="paint-box p-5" style={{ transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)` }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <h3
                      className="paint-title text-xl mb-1"
                      style={{ color: step.color }}
                    >
                      {step.title}
                    </h3>
                    <p className="paint-text text-base opacity-80">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
