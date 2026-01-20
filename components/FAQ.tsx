'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'больно ли делать тату? 😰',
    answer: 'зависит от места! но я работаю аккуратно и всегда делаю перерывы. многие клиенты говорят, что ожидали хуже ♡',
  },
  {
    question: 'сколько стоит тату?',
    answer: 'минималки от 3000₽, цена зависит от размера и сложности. напиши мне с идеей — посчитаю бесплатно!',
  },
  {
    question: 'как ухаживать после сеанса?',
    answer: 'дам подробную инструкцию и буду на связи! коротко: заживляющий крем, не мочить 3 дня, не чесать ✨',
  },
  {
    question: 'можно ли прийти со своим эскизом?',
    answer: 'конечно! принеси референс, и мы адаптируем его или нарисую что-то похожее в моём стиле',
  },
  {
    question: 'а если я передумаю в последний момент?',
    answer: 'ничего страшного! перенесём на другой день. главное — предупреди заранее 🙏',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2
          className="paint-title paint-orange text-center mb-10"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', transform: 'rotate(1deg)' }}
        >
          частые вопросы 🤔
        </h2>

        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item"
              style={{ transform: `rotate(${index % 2 === 0 ? -0.3 : 0.3}deg)` }}
            >
              <div
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span
                  className="paint-title text-2xl transition-transform duration-300"
                  style={{
                    transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                    color: openIndex === index ? '#ED1C24' : '#000',
                  }}
                >
                  +
                </span>
              </div>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p className="text-base opacity-80">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="paint-text text-lg" style={{ transform: 'rotate(-0.5deg)' }}>
            остались вопросы? <span className="marker-highlight-pink">напиши мне!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
