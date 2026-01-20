'use client'

import { HandDrawnStars } from '@/components/HandDrawnStars'
import { PortfolioSection } from '@/components/PortfolioSection'
import { AboutSection } from '@/components/AboutSection'
import { ProcessSteps } from '@/components/ProcessSteps'
import { FAQ } from '@/components/FAQ'
import { ContactSection } from '@/components/ContactSection'
import { CTAButton } from '@/components/CTAButton'
import { SparkleTrail } from '@/components/SparkleTrail'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Easter egg: Konami code sparkle trail */}
      <SparkleTrail />

      {/* Random doodles scattered throughout */}
      <HandDrawnStars />

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main title with hover effects */}
          <div className="mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
            <span
              className="paint-title paint-pink inline-block hover-jelly cursor-default"
              style={{
                fontSize: 'clamp(3.5rem, 14vw, 8rem)',
                transform: 'rotate(-2deg)',
                textShadow: '4px 4px 0 rgba(255, 105, 180, 0.15)',
              }}
            >
              тату
            </span>
          </div>

          <div className="mb-5 fade-up" style={{ animationDelay: '0.25s' }}>
            <span
              className="paint-title paint-blue inline-block crayon-underline hover-expand cursor-default"
              style={{
                fontSize: 'clamp(2.2rem, 9vw, 5.5rem)',
                transform: 'rotate(1deg)',
              }}
            >
              с любовью
            </span>
          </div>

          <div className="mb-10 fade-up" style={{ animationDelay: '0.4s' }}>
            <span
              className="paint-title paint-green inline-block hover-wiggle cursor-default"
              style={{
                fontSize: 'clamp(1.6rem, 5.5vw, 3.2rem)',
                transform: 'rotate(-1deg)',
              }}
            >
              ♡ и заботой ♡
            </span>
          </div>

          {/* Subtext with marker highlight */}
          <p
            className="paint-text text-xl md:text-2xl mb-10 fade-up"
            style={{ transform: 'rotate(0.5deg)', animationDelay: '0.55s' }}
          >
            <span className="marker-highlight hover-pop inline-block cursor-default">уникальные эскизы</span> для твоей кожи
          </p>

          {/* Scroll indicator */}
          <div className="fade-up bounce-soft" style={{ animationDelay: '0.7s' }}>
            <svg width="50" height="70" viewBox="0 0 50 70" className="mx-auto opacity-60 hover-glow cursor-pointer">
              <path
                d="M25 8 Q23 30 27 50 M17 42 Q25 55 25 58 Q25 55 33 42"
                stroke="#000"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <p className="paint-text text-sm opacity-50 mt-2">листай вниз</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* About Section */}
      <AboutSection />

      {/* Divider */}
      <div className="section-divider" />

      {/* Process Steps */}
      <ProcessSteps />

      {/* Divider */}
      <div className="section-divider" />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Divider */}
      <div className="section-divider" />

      {/* Why Me Section - Sticky Notes */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="paint-title paint-purple text-center mb-12 hover-wiggle cursor-default"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', transform: 'rotate(-1deg)' }}
          >
            почему я? ✨
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sticky note 1 */}
            <div className="sticky-yellow p-6 cursor-pointer hover-float" style={{ transform: 'rotate(-3deg)' }}>
              <div className="text-3xl mb-3 hover-pop inline-block">⭐</div>
              <h3 className="paint-title text-xl mb-2 hover-underline-draw">безопасно</h3>
              <p className="paint-text text-sm opacity-80">
                стерильные инструменты, одноразовые иглы, сертификаты
              </p>
            </div>

            {/* Sticky note 2 */}
            <div className="sticky-pink p-6 cursor-pointer hover-float" style={{ transform: 'rotate(2deg)' }}>
              <div className="text-3xl mb-3 hover-pop inline-block">💜</div>
              <h3 className="paint-title text-xl mb-2 hover-underline-draw">уникально</h3>
              <p className="paint-text text-sm opacity-80">
                каждый эскиз рисую специально для тебя с нуля
              </p>
            </div>

            {/* Sticky note 3 */}
            <div className="sticky-blue p-6 cursor-pointer hover-float" style={{ transform: 'rotate(-1.5deg)' }}>
              <div className="text-3xl mb-3 hover-pop inline-block">✨</div>
              <h3 className="paint-title text-xl mb-2 hover-underline-draw">комфортно</h3>
              <p className="paint-text text-sm opacity-80">
                уютная атмосфера, вкусный чай, музыка на твой вкус
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* Testimonials */}
      <div className="py-14 px-6">
        <div className="max-w-2xl mx-auto">
          <h2
            className="paint-title paint-green text-center mb-10 hover-shake cursor-default"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', transform: 'rotate(1deg)' }}
          >
            отзывы ♡
          </h2>

          <div className="space-y-6">
            {/* Review 1 */}
            <div className="notebook-paper cursor-default" style={{ transform: 'rotate(-0.5deg)' }}>
              <p className="paint-text text-lg mb-3">
                "это было моё первое тату! очень боялась, но Катя успокоила, всё объяснила. получилось именно то, что хотела! теперь хочу ещё ♡"
              </p>
              <p className="paint-text paint-pink font-bold hover-expand inline-block">— Аня ✿</p>
            </div>

            {/* Review 2 */}
            <div className="notebook-paper cursor-default" style={{ transform: 'rotate(0.3deg)' }}>
              <p className="paint-text text-lg mb-3">
                "уже третье тату делаю здесь. качество, атмосфера, подход — всё на высоте. рекомендую всем друзьям!"
              </p>
              <p className="paint-text paint-blue font-bold hover-expand inline-block">— Марина ✿</p>
            </div>

            {/* Review 3 */}
            <div className="notebook-paper cursor-default" style={{ transform: 'rotate(-0.3deg)' }}>
              <p className="paint-text text-lg mb-3">
                "долго искала мастера для минималистичной тату. нашла идеального! работа ювелирная, заживление прошло отлично"
              </p>
              <p className="paint-text paint-purple font-bold hover-expand inline-block">— Даша ✿</p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* FAQ */}
      <FAQ />

      {/* Divider */}
      <div className="section-divider" />

      {/* Contact */}
      <ContactSection />

      {/* Secret easter egg text */}
      <div className="text-center py-8 opacity-30">
        <p className="paint-text text-xs secret-text" title="Попробуй код Konami!">
          ↑↑↓↓←→←→BA
        </p>
      </div>

      {/* Sticky CTA Button */}
      <CTAButton />
    </div>
  )
}
