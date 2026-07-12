'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useTranslation, type Locale } from '@/hooks/useTranslation'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import BookingModal from '@/components/BookingModal'
import PortfolioGallery from '@/components/PortfolioGallery'
import type { LightboxImage, PortfolioItem, SiteContent } from '@/lib/content'

type HomeClientProps = {
  /** Portfolio per locale, fetched on the server. Empty arrays → built-in grid. */
  portfolioByLocale: Record<Locale, PortfolioItem[]>
  /** Editable CMS texts per locale. null → built-in locale copy (non-breaking). */
  siteContentByLocale: Record<Locale, SiteContent | null>
}

declare global {
  interface Window {
    Cal?: {
      ns?: {
        [key: string]: (action: string, options?: Record<string, unknown>) => void
      }
    }
  }
}

export default function HomeClient({ portfolioByLocale, siteContentByLocale }: HomeClientProps) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Carries width/height alongside the URL so the lightbox can use next/image
  // (which needs real dimensions to size the placeholder correctly) instead
  // of a plain <img>.
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const { t, locale, changeLocale } = useTranslation()

  // Portfolio from the CMS for the active locale. When empty (no CMS items yet),
  // the section below falls back to the original built-in grid — so the live
  // site looks identical until the artist adds work in the CMS.
  const cmsPortfolio = portfolioByLocale[locale] ?? []

  // Editable texts from the CMS for the active locale. Every field falls back to
  // the built-in locale string, so the site is unchanged when the CMS is not
  // configured/unreachable (`sc` is null) or a field is blank.
  const sc = siteContentByLocale[locale] ?? null
  const heroTitle = sc?.hero.title || t.hero.title
  const heroSubtitle = sc?.hero.subtitle?.trim() || null
  const ctaLabel = sc?.cta.label || t.hero.cta
  const aboutHeading = sc?.about.heading || t.about.heading
  const aboutParagraphs =
    sc?.about.body?.trim() ? sc.about.body.split(/\n{2,}/).filter(Boolean) : null
  const contactEmail = sc?.contacts.email || 'doompynooo@gmail.com'
  const contactPhone = sc?.contacts.whatsapp || '+420 774 685 187'
  const contactPhoneHref = `tel:${contactPhone.replace(/[^+\d]/g, '')}`
  const socialUrl = (platform: string, fallback: string) =>
    sc?.socials.find((s) => s.platform === platform)?.url || fallback
  const instagramUrl = socialUrl('instagram', 'https://www.instagram.com/doompink')
  const telegramUrl = socialUrl('telegram', 'https://t.me/doompink')
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

    // Syne (the display font) loads async over the network; the very first
    // fit runs against the fallback font's metrics. Refit once Syne is
    // actually ready so the title doesn't overflow after the font swaps in.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) fitHeroTitle()
    })

    return () => {
      cancelled = true
      window.removeEventListener('resize', fitHeroTitle)
    }
  }, [fitHeroTitle, locale])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ad/deep link: /?book=1 or /#book (and the /book redirect) opens the
  // booking form right away, no scrolling or hunting for the button.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('book') || window.location.hash === '#book') {
      setBookingOpen(true)
    }
  }, [])

  const openBookingForm = () => {
    setBookingOpen(true)
  }

  const closeLightbox = () => setLightboxImage(null)
  const lightboxRef = useFocusTrap<HTMLDivElement>(lightboxImage !== null, closeLightbox)

  // Portfolio cards open the lightbox on click; these make the same action
  // reachable from the keyboard (Enter/Space) since the cards are <div>s,
  // not <button>s, for the freeform corner-accent styling.
  const openLightbox = (image: LightboxImage) => setLightboxImage(image)
  const lightboxKeyHandler = (image: LightboxImage) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openLightbox(image)
    }
  }

  return (
    <div className="antialiased overflow-x-hidden selection:bg-ink selection:text-white">
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
              onClick={openBookingForm}
              className="relative group border border-white px-5 py-1.5 hover:bg-white hover:text-ink transition-colors duration-300 font-mono text-sm tracking-widest uppercase overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="sigil-text animate-pulse">★</span>
                {t.nav.book}
              </span>
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
        className={`fixed inset-0 bg-ink text-white z-30 flex flex-col justify-center items-center gap-12 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
            className={`px-3 py-2 transition-all ${locale === 'en' ? 'bg-white text-ink' : 'border border-white hover:bg-white hover:text-ink'}`}
          >
            EN
          </button>
          <button
            onClick={() => changeLocale('cs')}
            className={`px-3 py-2 transition-all ${locale === 'cs' ? 'bg-white text-ink' : 'border border-white hover:bg-white hover:text-ink'}`}
          >
            CS
          </button>
          <button
            onClick={() => changeLocale('ru')}
            className={`px-3 py-2 transition-all ${locale === 'ru' ? 'bg-white text-ink' : 'border border-white hover:bg-white hover:text-ink'}`}
          >
            RU
          </button>
        </div>

        <button
          onClick={() => { setMobileMenu(false); openBookingForm() }}
          className="group relative font-mono text-xl border border-white px-10 py-4 mt-4 hover:bg-white hover:text-ink transition-colors duration-300 tracking-widest uppercase"
        >
          <span className="sigil-text mr-2 opacity-60">★</span>
          {t.nav.book.toUpperCase()}
          <span className="sigil-text ml-2 opacity-60">★</span>
        </button>
        <div className="absolute bottom-10 w-full text-center opacity-30 sigil-text text-xl">
          ⫘⫘⫘⫘⫘⫘
        </div>
      </div>

      <main>
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
        <div className="absolute top-1/3 right-[20%] font-mono text-xs opacity-[0.05] rotate-90" aria-hidden="true">EST.2021</div>
        <div className="absolute bottom-1/3 left-[15%] font-mono text-xs opacity-[0.05] -rotate-90" aria-hidden="true">PRAGUE</div>

        <div className="relative z-10 text-center w-full max-w-7xl mx-auto">

          {/* Top Deco — text at text-ink/70 (≈4.7:1 on the paper background)
              instead of the old opacity-50 (≈3.66:1, failed WCAG AA); the
              divider lines and skull are pure decoration and keep their own
              lighter opacity since that exemption doesn't apply to them. */}
          <div className="flex justify-between items-center w-full mb-12 font-mono text-[10px] uppercase tracking-widest hidden md:flex">
            <span className="flex items-center gap-2 text-ink/70">
              <span className="w-8 h-[1px] bg-ink opacity-50"></span>
              {t.hero.location}
            </span>
            <span className="sigil-text text-lg opacity-50" aria-hidden="true">☠︎︎</span>
            <span className="flex items-center gap-2 text-ink/70">
              {t.hero.tagline}
              <span className="w-8 h-[1px] bg-ink opacity-50"></span>
            </span>
          </div>

          <div className="relative w-full md:w-[50vw] mx-auto overflow-visible">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.5em] text-gray-400 whitespace-nowrap">
              ⁺‧₊˚ ཐི⋆♱⋆ཋྀ ˚₊‧⁺
            </span>
            {/* Glitch lines */}
            <div className="absolute -left-4 top-1/4 w-1 h-12 bg-ink opacity-10"></div>
            <div className="absolute -right-4 bottom-1/4 w-1 h-16 bg-ink opacity-10"></div>

            <h1
              ref={heroTitleRef}
              className="hero-title font-display font-extrabold leading-[0.75] tracking-tight mix-blend-darken select-none text-ink relative text-center"
            >
              {heroTitle}
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
              {heroSubtitle ? (
                heroSubtitle
              ) : (
                <>
                  {t.hero.subtitle1}<br/>
                  <span className="opacity-50">{t.hero.subtitle2}</span>
                </>
              )}
              <span className="absolute -right-12 bottom-0 text-gray-300 hidden md:block">✱</span>
            </p>

            <button
              onClick={openBookingForm}
              className="group relative inline-flex items-center gap-5 px-10 py-5 bg-ink text-white hover:bg-white hover:text-ink transition-colors duration-500 border border-ink"
            >
              <span className="sigil-text opacity-70">༺</span>
              <span className="font-mono text-sm uppercase tracking-[0.3em]">{ctaLabel}</span>
              <span className="sigil-text opacity-70">༻</span>
              {/* Corner accents always visible */}
              <span className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-ink transition-all duration-300 group-hover:w-7 group-hover:h-7"></span>
              <span className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-ink transition-all duration-300 group-hover:w-7 group-hover:h-7"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Infinite Marquee Separator */}
      <div className="w-full bg-ink text-white py-3 overflow-hidden border-y border-white/20">
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
        <div className="absolute top-20 right-10 w-32 h-32 border border-ink/5 rotate-45 hidden lg:block"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 border border-ink/5 hidden lg:block"></div>

        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-24 text-center relative">
            <div className="sigil-text text-2xl mb-4 opacity-50">✮⃝⛧</div>
            <h2 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 relative">
              {t.portfolio.title}
              {/* Decorative lines */}
              <span className="absolute -left-16 top-1/2 w-8 h-[1px] bg-ink/20 hidden lg:block"></span>
              <span className="absolute -right-16 top-1/2 w-8 h-[1px] bg-ink/20 hidden lg:block"></span>
            </h2>
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-60 flex items-center gap-4">
              <span className="w-2 h-2 border border-ink/30 rotate-45"></span>
              {t.portfolio.subtitle}
              <span className="w-2 h-2 border border-ink/30 rotate-45"></span>
            </div>
          </div>

          {/* Categories Minimal */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-20 font-mono text-[10px] uppercase tracking-widest">
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-ink transition-colors relative group">
              {t.portfolio.categories.ornamental}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ink group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-ink transition-colors relative group">
              {t.portfolio.categories.lineWork}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ink group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-ink transition-colors relative group">
              {t.portfolio.categories.abstract}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ink group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-ink transition-colors relative group">
              {t.portfolio.categories.whipShading}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ink group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-ink transition-colors relative group">
              {t.portfolio.categories.freehand}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ink group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Grid (Deconstructed) — CMS items when available, else the built-in grid */}
          {cmsPortfolio.length > 0 ? (
            <PortfolioGallery items={cmsPortfolio} viewLabel={t.portfolio.view} onOpen={setLightboxImage} />
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">

            {/* Item 1 */}
            <div
              className="group cursor-pointer relative"
              role="button"
              tabIndex={0}
              aria-label={`${t.portfolio.view} ${t.portfolio.items.spine}`}
              onClick={() => openLightbox({ url: '/images/spine-tattoo.webp', width: 1440, height: 1800 })}
              onKeyDown={lightboxKeyHandler({ url: '/images/spine-tattoo.webp', width: 1440, height: 1800 })}
            >
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-ink/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-ink/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <Image
                  src="/images/spine-tattoo.webp"
                  alt="Spine Tattoo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
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
                  <div className="bg-ink text-white px-4 py-2 font-mono text-xs uppercase tracking-widest rotate-90 md:rotate-0">
                    {t.portfolio.view} <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-ink pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">{t.portfolio.items.spine}</span>
                <span className="font-mono text-[10px] text-ink/70">001</span>
                {/* Small accent */}
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-ink rounded-full opacity-20"></span>
              </div>
            </div>

            {/* Item 2 */}
            <div
              className="group cursor-pointer relative md:translate-y-12"
              role="button"
              tabIndex={0}
              aria-label={`${t.portfolio.view} ${t.portfolio.items.arm}`}
              onClick={() => openLightbox({ url: '/images/arm-tattoo.webp', width: 1440, height: 1800 })}
              onKeyDown={lightboxKeyHandler({ url: '/images/arm-tattoo.webp', width: 1440, height: 1800 })}
            >
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-ink/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-ink/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <Image
                  src="/images/arm-tattoo.webp"
                  alt="Arm Tattoo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg className="w-full h-full p-12" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="black" strokeWidth="0.3"/>
                    <path d="M10,10 L90,90 M90,10 L10,90" stroke="black" strokeWidth="0.1"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                  <div className="bg-ink text-white px-4 py-2 font-mono text-xs uppercase tracking-widest">
                    {t.portfolio.view} <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-ink pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">{t.portfolio.items.arm}</span>
                <span className="font-mono text-[10px] text-ink/70">002</span>
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-ink rounded-full opacity-20"></span>
              </div>
            </div>

            {/* Item 3 */}
            <div
              className="group cursor-pointer relative"
              role="button"
              tabIndex={0}
              aria-label={`${t.portfolio.view} ${t.portfolio.items.back}`}
              onClick={() => openLightbox({ url: '/images/back-tattoo.webp', width: 721, height: 909 })}
              onKeyDown={lightboxKeyHandler({ url: '/images/back-tattoo.webp', width: 721, height: 909 })}
            >
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-ink/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-ink/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <Image
                  src="/images/back-tattoo.webp"
                  alt="Back Tattoo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg className="w-full h-full p-12" viewBox="0 0 100 100">
                    <rect x="25" y="25" width="50" height="50" fill="none" stroke="black" strokeWidth="0.3" transform="rotate(45 50 50)"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                  <div className="bg-ink text-white px-4 py-2 font-mono text-xs uppercase tracking-widest">
                    {t.portfolio.view} <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-ink pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">{t.portfolio.items.back}</span>
                <span className="font-mono text-[10px] text-ink/70">003</span>
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-ink rounded-full opacity-20"></span>
              </div>
            </div>

          </div>
          )}

          {/* More Link */}
          <div className="mt-32 text-center relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] h-24 bg-gradient-to-b from-transparent via-ink/20 to-transparent"></div>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex flex-col items-center gap-2 relative">
              <span className="sigil-text text-2xl animate-bounce">⫘</span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] border-b border-transparent group-hover:border-ink transition-all pb-1">
                {t.portfolio.fullArchive}
              </span>
              {/* Decorative dots */}
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-1 h-1 bg-ink rounded-full"></span>
                <span className="w-1 h-1 bg-ink rounded-full"></span>
                <span className="w-1 h-1 bg-ink rounded-full"></span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-ink text-white py-32 px-4 relative overflow-hidden">

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
                {aboutHeading.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </h2>
              <div className="space-y-8 font-mono text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-lg">
                {(aboutParagraphs ?? [t.about.paragraph1, t.about.paragraph2]).map((para, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'first-letter:text-4xl first-letter:font-display first-letter:mr-2 first-letter:float-left'
                        : undefined
                    }
                  >
                    {para}
                  </p>
                ))}
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
                  <Image
                    src="/images/sandu.jpg"
                    alt="Sandu - Tattoo Artist"
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className="object-cover"
                  />
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
          <div className="flex items-center justify-center gap-4 mb-24">
            <span className="sigil-text opacity-50" aria-hidden="true">⫘⫘⫘</span>
            <h2 className="font-mono text-sm uppercase tracking-[0.5em] text-ink/70">{t.faq.title}</h2>
            <span className="sigil-text opacity-50" aria-hidden="true">⫘⫘⫘</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* FAQ 1 */}
            <div className="group relative pt-6 border-t border-ink/20 hover:border-ink transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q1.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q1.answer}
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="group relative pt-6 border-t border-ink/20 hover:border-ink transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q2.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q2.answer}
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="group relative pt-6 border-t border-ink/20 hover:border-ink transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q3.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q3.answer}
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="group relative pt-6 border-t border-ink/20 hover:border-ink transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q4.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q4.answer}
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="group relative pt-6 border-t border-ink/20 hover:border-ink transition-colors duration-500 md:col-span-2">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">{t.faq.q5.question}</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                {t.faq.q5.answer}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Raw Text) */}
      <section className="py-32 px-4 overflow-hidden bg-ink text-white relative">
        {/* Floating Glyphs Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 sigil-text text-6xl animate-float">♰</div>
          <div className="absolute bottom-1/3 right-1/4 sigil-text text-6xl animate-float" style={{ animationDelay: '1s' }}>♱</div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center md:text-left">
            {/* 1 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50" aria-hidden="true">❝</div>
              <p className="font-display text-xl md:text-2xl leading-tight">
                {t.testimonials.t1.text}
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — {t.testimonials.t1.author} <span className="mx-2">/</span> {t.testimonials.t1.work}
              </div>
            </div>

            {/* 2 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50" aria-hidden="true">❝</div>
              <p className="font-display text-xl md:text-2xl leading-tight text-gray-300">
                {t.testimonials.t2.text}
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — {t.testimonials.t2.author} <span className="mx-2">/</span> {t.testimonials.t2.work}
              </div>
            </div>

            {/* 3 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50" aria-hidden="true">❝</div>
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
      <section id="contact" className="min-h-screen py-24 px-4 relative flex items-center bg-white text-ink">
        <div className="container mx-auto max-w-4xl">

          <div className="text-center mb-16">
            <div className="sigil-text text-2xl mb-4">⫘</div>
            <h2 className="font-display text-5xl md:text-9xl font-bold uppercase tracking-tight leading-none overflow-visible">
              {t.contact.title}<br/><span className="text-transparent bg-clip-text bg-gradient-to-t from-ink to-gray-400 italic pr-4">{t.contact.titleAccent}</span>
            </h2>
          </div>

          {/* Booking CTA */}
          <div className="flex flex-col items-center gap-10 py-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-gray-400 flex items-center gap-4">
              <span className="w-12 h-px bg-gray-300"></span>
              {t.contact.available ?? 'available for booking'}
              <span className="w-12 h-px bg-gray-300"></span>
            </div>

            <button
              onClick={openBookingForm}
              className="group relative w-full max-w-2xl"
            >
              <div className="relative border-2 border-ink px-12 py-10 text-center overflow-hidden bg-white hover:bg-ink hover:text-white transition-colors duration-500">
                {/* Expanding corners */}
                <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-ink group-hover:border-white transition-colors duration-500 group-hover:w-10 group-hover:h-10 transition-all duration-300"></span>
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-ink group-hover:border-white transition-colors duration-500 group-hover:w-10 group-hover:h-10 transition-all duration-300"></span>

                <div className="sigil-text text-3xl opacity-30 mb-4 group-hover:opacity-60 transition-opacity" aria-hidden="true">☠︎︎</div>
                <div className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none mb-4">
                  {t.nav.bookNow}
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                  <span className="opacity-50 group-hover:opacity-80 transition-opacity" aria-hidden="true">↗</span>
                  <span className="text-ink/70 group-hover:text-white transition-colors">{t.contact.formLink ?? 'open booking form'}</span>
                  <span className="opacity-50 group-hover:opacity-80 transition-opacity" aria-hidden="true">↗</span>
                </div>
              </div>
            </button>

            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400 sigil-text animate-pulse">
              ⫘⫘⫘
            </div>
          </div>

          <div className="mt-24 flex flex-col items-center gap-4 text-center">
            <div className="sigil-text text-xl animate-pulse">☠︎︎</div>
            <div className="font-mono text-xs uppercase tracking-widest">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:line-through px-2">{t.contact.social.instagram}</a>
              <span className="opacity-30">/</span>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:line-through px-2">{t.contact.social.telegram}</a>
            </div>
            <div className="font-mono text-xs text-gray-400 mt-2">
              <a href={contactPhoneHref} className="hover:line-through">{contactPhone}</a>
              <span className="mx-2">•</span>
              <a href={`mailto:${contactEmail}`} className="hover:line-through">{contactEmail}</a>
            </div>
            <div className="font-mono text-xs text-gray-400 mt-1">
              {t.contact.address}
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Booking Modal */}
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.portfolio.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-sm animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10 group"
            onClick={closeLightbox}
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
            <Image
              src={lightboxImage.url}
              alt="Tattoo Detail"
              width={lightboxImage.width}
              height={lightboxImage.height}
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
      <footer className="bg-white text-ink py-12 border-t border-ink">
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

          <a
            href="https://iteros.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gray-500 transition-colors hover:text-ink"
          >
            Site by <span className="text-ink">iteros.dev</span>
            <span aria-hidden="true">↗</span>
          </a>

          <div className="mt-8 opacity-20 sigil-text text-xs tracking-[2em]" aria-hidden="true">
            ⫘⫘⫘⫘⫘
          </div>
        </div>
      </footer>
    </div>
  )
}
