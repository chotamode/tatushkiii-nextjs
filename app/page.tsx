'use client'

import { useState } from 'react'
import { HandDrawnStars } from '@/components/HandDrawnStars'
import { PortfolioSection } from '@/components/PortfolioSection'
import { AboutSection } from '@/components/AboutSection'
import { CTAButton } from '@/components/CTAButton'

export default function HomePage() {
  const [showBooking, setShowBooking] = useState(false)

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Hand-drawn stars scattered around */}
      <HandDrawnStars />

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Green text on top */}
          <div className="handdrawn-text text-green mb-4">
            <span style={{
              display: 'inline-block',
              transform: 'rotate(-2deg)',
              fontSize: 'clamp(2rem, 6vw, 4rem)'
            }}>Ищем</span>
          </div>

          {/* Big red text in the middle */}
          <div className="handdrawn-text text-red mb-2">
            <span style={{
              display: 'inline-block',
              transform: 'rotate(1deg)',
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              letterSpacing: '0.05em'
            }}>Графического</span>
          </div>

          {/* Blue text under it */}
          <div className="handdrawn-text text-blue mb-12">
            <span style={{
              display: 'inline-block',
              transform: 'rotate(-1deg)',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)'
            }}>Дизайнера</span>
          </div>

          {/* Playful subtext */}
          <div className="handdrawn-subtitle text-black mt-8 mb-8">
            <span style={{
              display: 'inline-block',
              transform: 'rotate(1deg)',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)'
            }}>для твоей кожи ✨</span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Why Me Section */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="handdrawn-heading text-blue text-center mb-12" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            <span style={{ display: 'inline-block', transform: 'rotate(-1deg)' }}>
              Почему выбирают меня?
            </span>
          </h2>

          <div className="space-y-8">
            <div className="handdrawn-box p-6 border-3 border-green" style={{ transform: 'rotate(-0.5deg)' }}>
              <h3 className="handdrawn-subtitle text-green mb-3" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
                ⭐ Безопасно
              </h3>
              <p className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
                Стерильные инструменты, одноразовые иглы, медицинские перчатки
              </p>
            </div>

            <div className="handdrawn-box p-6 border-3 border-red" style={{ transform: 'rotate(0.5deg)' }}>
              <h3 className="handdrawn-subtitle text-red mb-3" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
                💜 Уникально
              </h3>
              <p className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
                Каждый эскиз рисую индивидуально под тебя
              </p>
            </div>

            <div className="handdrawn-box p-6 border-3 border-blue" style={{ transform: 'rotate(-0.3deg)' }}>
              <h3 className="handdrawn-subtitle text-blue mb-3" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
                ✨ Комфортно
              </h3>
              <p className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
                Уютная атмосфера, музыка на твой вкус, перерывы когда нужно
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 px-6 mb-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="handdrawn-heading text-green text-center mb-10" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            <span style={{ display: 'inline-block', transform: 'rotate(1deg)' }}>
              Отзывы
            </span>
          </h2>

          <div className="space-y-6">
            <div className="handdrawn-box p-5 border-2 border-black" style={{ transform: 'rotate(0.5deg)' }}>
              <p className="handdrawn-text-small mb-2" style={{ fontSize: 'clamp(0.85rem, 2.3vw, 1.1rem)' }}>
                "Это было моё первое тату! Очень боялась, но мастер успокоила, всё объяснила. Получилось именно то, что хотела! ♡"
              </p>
              <p className="handdrawn-text-small text-gray" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}>— Аня, 22</p>
            </div>

            <div className="handdrawn-box p-5 border-2 border-black" style={{ transform: 'rotate(-0.4deg)' }}>
              <p className="handdrawn-text-small mb-2" style={{ fontSize: 'clamp(0.85rem, 2.3vw, 1.1rem)' }}>
                "Уже третье тату делаю здесь. Качество, атмосфера, подход — всё на высоте!"
              </p>
              <p className="handdrawn-text-small text-gray" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}>— Марина, 28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA Button */}
      <CTAButton onClick={() => setShowBooking(!showBooking)} />

      {/* Simple booking modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowBooking(false)}>
          <div className="handdrawn-box bg-white p-8 border-4 border-black max-w-md w-full" style={{ transform: 'rotate(-1deg)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="handdrawn-heading text-red text-center mb-6" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
              <span style={{ display: 'inline-block', transform: 'rotate(1deg)' }}>
                Записаться
              </span>
            </h3>
            <div className="space-y-4">
              <div className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
                📱 Telegram: @tattoo_master
              </div>
              <div className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
                📞 WhatsApp: +7 (XXX) XXX-XX-XX
              </div>
              <div className="handdrawn-text-small" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}>
                📧 Email: tattoo@example.com
              </div>
              <div className="pt-4">
                <button
                  className="handdrawn-button w-full bg-blue text-white border-3 border-black py-3 px-6 cursor-pointer hover:bg-blue-dark transition-colors"
                  onClick={() => setShowBooking(false)}
                  style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)' }}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
