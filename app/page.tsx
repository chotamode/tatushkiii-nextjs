'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation, type Locale } from '../hooks/useTranslation'
import BookingForm from '@/components/BookingForm'

declare global {
  interface Window {
    Cal?: {
      ns?: {
        [key: string]: (action: string, options?: Record<string, unknown>) => void
      }
    }
  }
}

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const { t, locale, changeLocale } = useTranslation()
  const heroTitleRef = useRef<HTMLHeadingElement>(null)

  // Auto-fit hero title to fill its container width
  const fitHeroTitle = useCallback(() => {
    const el = heroTitleRef.current
    if (!el || !el.parentElement) return
    const containerWidth = el.parentElement.clientWidth
    const maxSize = 500 // px max — will be clamped by binary search
    const minSize = 30  // px min
    // Binary search for the largest font-size that fits
    let lo = minSize, hi = maxSize
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2)
      el.style.fontSize = `${mid}px`
      if (el.scrollWidth > containerWidth) {
        hi = mid
      } else {
        lo = mid
      }
    }
    el.style.fontSize = `${lo}px`
    el.classList.add('sized')
  }, [])

  useEffect(() => {
    fitHeroTitle()
    window.addEventListener('resize', fitHeroTitle)
    return () => window.removeEventListener('resize', fitHeroTitle)
  }, [fitHeroTitle, locale])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openCalPopup = () => {
    if (window.Cal?.ns?.['book-session']) {
      window.Cal.ns['book-session']('openModal', {
        calLink: 'doompink/book-session',
      })
    }
  }

  return (
    <div className="antialiased overflow-x-hidden selection:bg-black selection:text-white">
      {/* Grain Texture Overlay */}
      <div className="grain-overlay"></div>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-40 transition-all duration-500 mix-blend-difference text-white ${
          scrolled ? 'py-4 backdrop-blur-sm' : 'py-8'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="/" className="font-display font-bold text-xl tracking-tighter z-50 relative uppercase group">
            <span className="inline-block group-hover:rotate-180 transition-transform duration-500">†</span> SANDU
            <span className="block font-mono text-[8px] tracking-[0.3em] opacity-70 normal-case mt-1">doomp.ink</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-12 items-center font-mono text-[10px] uppercase tracking-[0.2em]">
            <a href="#portfolio" className="hover:line-through decoration-1 underline-offset-4 transition-all">{t.nav.portfolio}</a>
            <a href="#about" className="hover:line-through decoration-1 underline-offset-4 transition-all">{t.nav.artist}</a>
            <a href="#process" className="hover:line-through decoration-1 underline-offset-4 transition-all">{t.nav.process}</a>

            {/* Language Switcher */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => changeLocale('en')}
                className={`px-2 py-1 transition-all ${locale === 'en' ? 'underline' : 'opacity-50 hover:opacity-100'}`}
              >
                EN
              </button>
              <span className="opacity-30">/</span>
              <button
                onClick={() => changeLocale('cs')}
                className={`px-2 py-1 transition-all ${locale === 'cs' ? 'underline' : 'opacity-50 hover:opacity-100'}`}
              >
                CS
              </button>
              <span className="opacity-30">/</span>
              <button
                onClick={() => changeLocale('ru')}
                className={`px-2 py-1 transition-all ${locale === 'ru' ? 'underline' : 'opacity-50 hover:opacity-100'}`}
              >
                RU
              </button>
            </div>

            <button
              onClick={openCalPopup}
              className="border border-white/50 px-4 py-1 hover:bg-white hover:text-black transition-colors duration-300"
            >
              <span className="mr-2">★</span>{t.nav.book}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden z-50 relative focus:outline-none font-mono text-2xl"
          >
            <span>{mobileMenu ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black text-white z-30 flex flex-col justify-center items-center gap-12 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenu ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="absolute top-10 w-full text-center opacity-30 sigil-text text-xl">
          ⫘⫘⫘⫘⫘⫘
        </div>
        <a onClick={() => setMobileMenu(false)} href="#portfolio" className="font-display text-5xl hover:opacity-50 transition-opacity">{t.nav.portfolio}</a>
        <a onClick={() => setMobileMenu(false)} href="#about" className="font-display text-5xl hover:opacity-50 transition-opacity">{t.nav.artist}</a>
        <a onClick={() => setMobileMenu(false)} href="#process" className="font-display text-5xl hover:opacity-50 transition-opacity">{t.nav.process}</a>

        {/* Mobile Language Switcher */}
        <div className="flex gap-4 items-center font-mono text-sm uppercase tracking-widest">
          <button
            onClick={() => changeLocale('en')}
            className={`px-3 py-2 transition-all ${locale === 'en' ? 'bg-white text-black' : 'border border-white hover:bg-white hover:text-black'}`}
          >
            EN
          </button>
          <button
            onClick={() => changeLocale('cs')}
            className={`px-3 py-2 transition-all ${locale === 'cs' ? 'bg-white text-black' : 'border border-white hover:bg-white hover:text-black'}`}
          >
            CS
          </button>
          <button
            onClick={() => changeLocale('ru')}
            className={`px-3 py-2 transition-all ${locale === 'ru' ? 'bg-white text-black' : 'border border-white hover:bg-white hover:text-black'}`}
          >
            RU
          </button>
        </div>

        <button
          onClick={() => { setMobileMenu(false); openCalPopup(); }}
          className="font-mono text-xl border border-white px-8 py-3 mt-4"
        >
          [ {t.nav.book.toUpperCase()} ]
        </button>
        <div className="absolute bottom-10 w-full text-center opacity-30 sigil-text text-xl">
          ⫘⫘⫘⫘⫘⫘
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">

        {/* Background Unicode Chaos */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
          <div className="whitespace-nowrap text-[20vw] font-mono leading-none sigil-text animate-pulse">
            ⫘⫘⫘⫘⫘
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-[10%] sigil-text text-6xl opacity-[0.08] animate-float">◬</div>
        <div className="absolute bottom-1/4 right-[15%] sigil-text text-5xl opacity-[0.06] animate-float" style={{ animationDelay: '2s' }}>⬡</div>
        <div className="absolute top-1/3 right-[20%] font-mono text-xs opacity-[0.05] rotate-90">EST.2021</div>
        <div className="absolute bottom-1/3 left-[15%] font-mono text-xs opacity-[0.05] -rotate-90">PRAGUE</div>

        <div className="relative z-10 text-center w-full max-w-7xl mx-auto">

          {/* Top Deco */}
          <div className="flex justify-between items-center w-full mb-12 opacity-50 font-mono text-[10px] uppercase tracking-widest hidden md:flex">
            <span className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-black"></span>
              {t.hero.location}
            </span>
            <span className="sigil-text text-lg">☠︎︎</span>
            <span className="flex items-center gap-2">
              {t.hero.tagline}
              <span className="w-8 h-[1px] bg-black"></span>
            </span>
          </div>

          <div className="relative w-full md:w-[50vw] mx-auto">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.5em] text-gray-400 whitespace-nowrap">
              ⁺‧₊˚ ཐི⋆♱⋆ཋྀ ˚₊‧⁺
            </span>
            {/* Glitch lines */}
            <div className="absolute -left-4 top-1/4 w-1 h-12 bg-black opacity-10"></div>
            <div className="absolute -right-4 bottom-1/4 w-1 h-16 bg-black opacity-10"></div>

            <h1
              ref={heroTitleRef}
              className="hero-title font-display font-black leading-[0.75] tracking-tight mix-blend-darken select-none text-black relative text-center"
            >
              {t.hero.title}
              {/* Accent marks */}
              <span className="absolute -top-6 right-0 text-[2vw] opacity-30 sigil-text">✦</span>
              <span className="absolute -bottom-4 left-0 text-[2vw] opacity-30 sigil-text">✧</span>
            </h1>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.5em] text-gray-400 whitespace-nowrap sigil-text">
              ⫘⫘⫘⫘⫘
            </span>
          </div>

          <div className="mt-24 flex flex-col items-center">
            <p className="max-w-md text-center font-mono text-xs md:text-sm leading-relaxed mb-8 relative">
              <span className="absolute -left-12 top-0 text-gray-300 hidden md:block">✱</span>
              {t.hero.subtitle1}<br/>
              <span className="opacity-50">{t.hero.subtitle2}</span>
              <span className="absolute -right-12 bottom-0 text-gray-300 hidden md:block">✱</span>
            </p>

            <button
              onClick={openCalPopup}
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-transparent hover:bg-black hover:text-white transition-colors duration-500 border-x border-black"
            >
              <span className="sigil-text">༺</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em]">{t.hero.cta}</span>
              <span className="sigil-text">༻</span>
              {/* Hover corner accents */}
              <span className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-black opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-black opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Infinite Marquee Separator */}
      <div className="w-full bg-black text-white py-3 overflow-hidden border-y border-white/20">
        <div className="flex">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
          </div>
          <div className="flex whitespace-nowrap animate-marquee" aria-hidden="true">
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
            <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
              {t.marquee.avantGarde} <span className="sigil-text text-lg">⛧</span> {t.marquee.abstract} <span className="sigil-text text-lg">⫘</span> {t.marquee.cybersigilism} <span className="sigil-text text-lg">⫘</span> {t.marquee.geometry} <span className="sigil-text text-lg">★</span>
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 px-4 relative">
        {/* Geometric Background Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 border border-black/5 rotate-45 hidden lg:block"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 border border-black/5 hidden lg:block"></div>

        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-24 text-center relative">
            <div className="sigil-text text-2xl mb-4 opacity-50">✮⃝⛧</div>
            <h2 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 relative">
              {t.portfolio.title}
              {/* Decorative lines */}
              <span className="absolute -left-16 top-1/2 w-8 h-[1px] bg-black/20 hidden lg:block"></span>
              <span className="absolute -right-16 top-1/2 w-8 h-[1px] bg-black/20 hidden lg:block"></span>
            </h2>
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-60 flex items-center gap-4">
              <span className="w-2 h-2 border border-black/30 rotate-45"></span>
              {t.portfolio.subtitle}
              <span className="w-2 h-2 border border-black/30 rotate-45"></span>
            </div>
          </div>

          {/* Categories Minimal */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-20 font-mono text-[10px] uppercase tracking-widest">
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              {t.portfolio.categories.ornamental}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              {t.portfolio.categories.lineWork}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              {t.portfolio.categories.abstract}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              {t.portfolio.categories.whipShading}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              {t.portfolio.categories.freehand}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Grid (Deconstructed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">

            {/* Item 1 */}
            <div className="group cursor-pointer relative" onClick={() => setLightboxImage('/images/spine-tattoo.webp')}>
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-black/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-black/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <img
                  src="/images/spine-tattoo.webp"
                  alt="Spine Tattoo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg className="w-full h-full p-12" viewBox="0 0 100 100">
                    <path d="M50,10 Q90,50 50,90 Q10,50 50,10" fill="none" stroke="black" strokeWidth="0.3"/>
                    <path d="M50,20 L50,80 M20,50 L80,50" stroke="black" strokeWidth="0.1"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-multiply"></div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                  <div className="bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest rotate-90 md:rotate-0">
                    {t.portfolio.view} <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-black pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">{t.portfolio.items.spine}</span>
                <span className="font-mono text-[10px] opacity-50">001</span>
                {/* Small accent */}
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-black rounded-full opacity-20"></span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="group cursor-pointer relative md:translate-y-12" onClick={() => setLightboxImage('/images/arm-tattoo.webp')}>
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-black/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-black/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <img
                  src="/images/arm-tattoo.webp"
                  alt="Arm Tattoo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg className="w-full h-full p-12" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="black" strokeWidth="0.3"/>
                    <path d="M10,10 L90,90 M90,10 L10,90" stroke="black" strokeWidth="0.1"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                  <div className="bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest">
                    {t.portfolio.view} <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-black pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">{t.portfolio.items.arm}</span>
                <span className="font-mono text-[10px] opacity-50">002</span>
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-black rounded-full opacity-20"></span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="group cursor-pointer relative" onClick={() => setLightboxImage('/images/back-tattoo.webp')}>
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-black/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-black/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <img
                  src="/images/back-tattoo.webp"
                  alt="Back Tattoo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg className="w-full h-full p-12" viewBox="0 0 100 100">
                    <rect x="25" y="25" width="50" height="50" fill="none" stroke="black" strokeWidth="0.3" transform="rotate(45 50 50)"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                  <div className="bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest">
                    {t.portfolio.view} <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-black pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">{t.portfolio.items.back}</span>
                <span className="font-mono text-[10px] opacity-50">003</span>
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-black rounded-full opacity-20"></span>
              </div>
            </div>

          </div>

          {/* More Link */}
          <div className="mt-32 text-center relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] h-24 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
            <a href="https://www.instagram.com/doompink" target="_blank" rel="noopener noreferrer" className="group inline-flex flex-col items-center gap-2 relative">
              <span className="sigil-text text-2xl animate-bounce">⫘</span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] border-b border-transparent group-hover:border-black transition-all pb-1">
                {t.portfolio.fullArchive}
              </span>
              {/* Decorative dots */}
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-1 h-1 bg-black rounded-full"></span>
                <span className="w-1 h-1 bg-black rounded-full"></span>
                <span className="w-1 h-1 bg-black rounded-full"></span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-black text-white py-32 px-4 relative overflow-hidden">

        {/* Background Glyphs */}
        <div className="absolute top-10 left-10 sigil-text text-4xl text-white/10 select-none">⫘</div>
        <div className="absolute bottom-10 right-10 sigil-text text-4xl text-white/10 select-none">⫘</div>

        <div className="container mx-auto relative z-10 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-16 items-start">

            {/* Text Content */}
            <div className="flex-1">
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
                <span className="sigil-text">⚔</span> {t.about.title}
              </div>
              <h2 className="font-display text-5xl md:text-8xl font-bold mb-12 leading-none">
                {t.about.heading.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </h2>
              <div className="space-y-8 font-mono text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-lg">
                <p className="first-letter:text-4xl first-letter:font-display first-letter:mr-2 first-letter:float-left">
                  {t.about.paragraph1}
                </p>
                <p>
                  {t.about.paragraph2}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-white/10">
                  <span>{t.about.stats.base}</span>
                  <span>•</span>
                  <span>{t.about.stats.exp}</span>
                  <span>•</span>
                  <span>{t.about.stats.clients}</span>
                </div>
              </div>
            </div>

            {/* Image / Visual */}
            <div className="flex-1 w-full relative pt-12">
              <div className="aspect-[4/5] w-full border border-white/20 p-2 relative">
                {/* Decorative corners using text */}
                <div className="absolute -top-3 -left-3 text-white text-2xl sigil-text">⌜</div>
                <div className="absolute -top-3 -right-3 text-white text-2xl sigil-text">⌝</div>
                <div className="absolute -bottom-3 -left-3 text-white text-2xl sigil-text">⌞</div>
                <div className="absolute -bottom-3 -right-3 text-white text-2xl sigil-text">⌟</div>

                <div className="w-full h-full bg-neutral-900 relative overflow-hidden grayscale contrast-150">
                  <img src="/images/sandu.jpg" alt="Sandu - Tattoo Artist" className="object-cover w-full h-full"/>
                </div>

                {/* Floating Text */}
                <div className="absolute -right-8 bottom-10 rotate-90 origin-bottom-right text-xs font-mono tracking-widest text-gray-500 whitespace-nowrap">
                  {t.about.established} <span className="mx-2">//</span> {t.about.brand}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section (FAQ) */}
      <section id="process" className="py-32 px-4 bg-paper">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 mb-24 opacity-50">
            <span className="sigil-text">⫘⫘⫘</span>
            <h2 className="font-mono text-sm uppercase tracking-[0.5em]">{t.faq.title}</h2>
            <span className="sigil-text">⫘⫘⫘</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* FAQ 1 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q1.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q1.answer}
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q2.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q2.answer}
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q3.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q3.answer}
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q4.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q4.answer}
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500 md:col-span-2">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q5.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q5.answer}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Raw Text) */}
      <section className="py-32 px-4 overflow-hidden bg-black text-white relative">
        {/* Floating Glyphs Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 sigil-text text-6xl animate-float">♰</div>
          <div className="absolute bottom-1/3 right-1/4 sigil-text text-6xl animate-float" style={{ animationDelay: '1s' }}>♱</div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center md:text-left">
            {/* 1 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50">❝</div>
              <p className="font-display text-xl md:text-2xl leading-tight">
                {t.testimonials.t1.text}
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — {t.testimonials.t1.author} <span className="mx-2">/</span> {t.testimonials.t1.work}
              </div>
            </div>

            {/* 2 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50">❝</div>
              <p className="font-display text-xl md:text-2xl leading-tight text-gray-300">
                {t.testimonials.t2.text}
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — {t.testimonials.t2.author} <span className="mx-2">/</span> {t.testimonials.t2.work}
              </div>
            </div>

            {/* 3 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50">❝</div>
              <p className="font-display text-xl md:text-2xl leading-tight">
                {t.testimonials.t3.text}
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — {t.testimonials.t3.author} <span className="mx-2">/</span> {t.testimonials.t3.work}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-24 px-4 relative flex items-center bg-white text-black">
        <div className="container mx-auto max-w-4xl">

          <div className="text-center mb-16">
            <div className="sigil-text text-2xl mb-4">⫘</div>
            <h2 className="font-display text-5xl md:text-9xl font-bold uppercase tracking-tight leading-none pr-2">
              {t.contact.title}<br/><span className="text-transparent bg-clip-text bg-gradient-to-t from-black to-gray-400 italic">{t.contact.titleAccent}</span>
            </h2>
          </div>

          <BookingForm t={t} locale={locale} />

          <div className="mt-24 flex flex-col items-center gap-4 text-center">
            <div className="sigil-text text-xl animate-pulse">☠︎︎</div>
            <div className="font-mono text-xs uppercase tracking-widest">
              <a href="https://www.instagram.com/doompink" target="_blank" rel="noopener noreferrer" className="hover:line-through px-2">{t.contact.social.instagram}</a>
              <span className="opacity-30">/</span>
              <a href="https://t.me/doompink" target="_blank" rel="noopener noreferrer" className="hover:line-through px-2">{t.contact.social.telegram}</a>
            </div>
            <div className="font-mono text-xs text-gray-400 mt-2">
              <a href="tel:+420774685187" className="hover:line-through">+420 774 685 187</a>
              <span className="mx-2">•</span>
              <a href="mailto:doompynooo@gmail.com" className="hover:line-through">doompynooo@gmail.com</a>
            </div>
            <div className="font-mono text-xs text-gray-400 mt-1">
              {t.contact.address}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10 group"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative">
              <span className="text-5xl font-thin leading-none block group-hover:rotate-90 transition-transform duration-300">×</span>
              <span className="absolute -bottom-6 right-0 font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {t.portfolio.close}
              </span>
            </div>
          </button>

          {/* Image Container */}
          <div
            className="relative h-[90vh] w-auto mx-4 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Tattoo Detail"
              className="h-full w-auto max-w-[90vw] object-contain mx-auto"
            />

            {/* Decorative corners */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/30"></div>
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-white/30"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-white/30"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/30"></div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-white/50 uppercase tracking-widest">
            {t.portfolio.clickToClose}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white text-black py-12 border-t border-black">
        <div className="container mx-auto px-4 text-center overflow-hidden">
          {/* Complex Unicode Signature */}
          <div className="mb-8 font-mono text-sm tracking-[1em] opacity-80 whitespace-nowrap overflow-hidden">
            <a href="/" className="hover:opacity-60 transition-opacity">doomp.ink</a>
          </div>

          <div className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase text-gray-500 tracking-widest">
            <span>{t.footer.copyright}</span>
            <span className="sigil-text text-lg">⫘</span>
            <span>{t.footer.tagline}</span>
          </div>

          <div className="mt-8 opacity-20 sigil-text text-xs tracking-[2em]">
            ⫘⫘⫘⫘⫘
          </div>
        </div>
      </footer>
    </div>
  )
}
