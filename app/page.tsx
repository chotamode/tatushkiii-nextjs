'use client'

import { useState, useEffect } from 'react'

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
            <a href="#portfolio" className="hover:line-through decoration-1 underline-offset-4 transition-all">Portfolio</a>
            <a href="#about" className="hover:line-through decoration-1 underline-offset-4 transition-all">Artist</a>
            <a href="#process" className="hover:line-through decoration-1 underline-offset-4 transition-all">Process</a>
            <button
              onClick={openCalPopup}
              className="border border-white/50 px-4 py-1 hover:bg-white hover:text-black transition-colors duration-300"
            >
              <span className="mr-2">★</span>Book
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
        <a onClick={() => setMobileMenu(false)} href="#portfolio" className="font-display text-5xl hover:opacity-50 transition-opacity">Portfolio</a>
        <a onClick={() => setMobileMenu(false)} href="#about" className="font-display text-5xl hover:opacity-50 transition-opacity">Artist</a>
        <a onClick={() => setMobileMenu(false)} href="#process" className="font-display text-5xl hover:opacity-50 transition-opacity">Process</a>
        <button
          onClick={() => { setMobileMenu(false); openCalPopup(); }}
          className="font-mono text-xl border border-white px-8 py-3 mt-4"
        >
          [ BOOK SESSION ]
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
              Prague // 2025
            </span>
            <span className="sigil-text text-lg">☠︎︎</span>
            <span className="flex items-center gap-2">
              Ornamental.Art
              <span className="w-8 h-[1px] bg-black"></span>
            </span>
          </div>

          <div className="relative inline-block">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.5em] text-gray-400 whitespace-nowrap">
              ⁺‧₊˚ ཐི⋆♱⋆ཋྀ ˚₊‧⁺
            </span>
            {/* Glitch lines */}
            <div className="absolute -left-4 top-1/4 w-1 h-12 bg-black opacity-10"></div>
            <div className="absolute -right-4 bottom-1/4 w-1 h-16 bg-black opacity-10"></div>

            <h1 className="font-display font-black text-[18vw] md:text-[14vw] leading-[0.7] tracking-tighter mix-blend-darken select-none text-black relative">
              TAT<br/>TOOS
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
              CUSTOM DESIGNS. RAW AESTHETICS.<br/>
              <span className="opacity-50">PRECISE. STERILE. ETHEREAL.</span>
              <span className="absolute -right-12 bottom-0 text-gray-300 hidden md:block">✱</span>
            </p>

            <button
              onClick={openCalPopup}
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-transparent hover:bg-black hover:text-white transition-colors duration-500 border-x border-black"
            >
              <span className="sigil-text">༺</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em]">Book Session</span>
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
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
            Avant-Garde <span className="sigil-text text-lg">⛧</span> Abstract <span className="sigil-text text-lg">⫘</span> Cybersigilism <span className="sigil-text text-lg">⫘</span> Geometry <span className="sigil-text text-lg">★</span>
          </span>
          <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
            Avant-Garde <span className="sigil-text text-lg">⛧</span> Abstract <span className="sigil-text text-lg">⫘</span> Cybersigilism <span className="sigil-text text-lg">⫘</span> Geometry <span className="sigil-text text-lg">★</span>
          </span>
          <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
            Avant-Garde <span className="sigil-text text-lg">⛧</span> Abstract <span className="sigil-text text-lg">⫘</span> Cybersigilism <span className="sigil-text text-lg">⫘</span> Geometry <span className="sigil-text text-lg">★</span>
          </span>
          <span className="mx-4 font-mono text-xs tracking-widest uppercase flex items-center gap-4">
            Avant-Garde <span className="sigil-text text-lg">⛧</span> Abstract <span className="sigil-text text-lg">⫘</span> Cybersigilism <span className="sigil-text text-lg">⫘</span> Geometry <span className="sigil-text text-lg">★</span>
          </span>
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
              Selected Works
              {/* Decorative lines */}
              <span className="absolute -left-16 top-1/2 w-8 h-[1px] bg-black/20 hidden lg:block"></span>
              <span className="absolute -right-16 top-1/2 w-8 h-[1px] bg-black/20 hidden lg:block"></span>
            </h2>
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-60 flex items-center gap-4">
              <span className="w-2 h-2 border border-black/30 rotate-45"></span>
              Curves That Hold <span className="mx-2">/</span> Ink That Bleeds
              <span className="w-2 h-2 border border-black/30 rotate-45"></span>
            </div>
          </div>

          {/* Categories Minimal */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-20 font-mono text-[10px] uppercase tracking-widest">
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              [Ornamental]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              [Line Work]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              [Abstract]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              [Whip Shading]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="hover:line-through decoration-1 text-gray-400 hover:text-black transition-colors relative group">
              [Freehand]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Grid (Deconstructed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">

            {/* Item 1 */}
            <div className="group cursor-pointer relative">
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-black/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-black/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <img
                  src="https://images.unsplash.com/photo-1639545622950-72bd485b0706?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjB0YXR0b28lMjBzcGluZXxlbnwxfHx8fDE3NjkwMjY4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
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
                    View <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-black pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">Spine</span>
                <span className="font-mono text-[10px] opacity-50">001</span>
                {/* Small accent */}
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-black rounded-full opacity-20"></span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="group cursor-pointer relative md:translate-y-12">
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-black/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-black/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <img
                  src="https://images.unsplash.com/photo-1759346771288-ac905d1b1abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJtJTIwdGF0dG9vfGVufDF8fHx8MTc2OTAyNjg3NXww&ixlib=rb-4.1.0&q=80&w=1080"
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
                    View <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-black pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">Arm</span>
                <span className="font-mono text-[10px] opacity-50">002</span>
                <span className="absolute -top-2 left-1/2 w-1 h-1 bg-black rounded-full opacity-20"></span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="group cursor-pointer relative">
              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-black/10 z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-black/10 z-10"></div>

              <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
                <img
                  src="https://images.unsplash.com/photo-1612991977455-7bf9e67d899c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrJTIwdGF0dG9vJTIwZ2VvbWV0cmljfGVufDF8fHx8MTc2OTAyNjg3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
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
                    View <span className="sigil-text ml-2">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start border-t border-black pt-2 relative">
                <span className="font-display font-bold text-xl uppercase">Back</span>
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
                Full Archive
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
                <span className="sigil-text">⚔</span> About The Artist
              </div>
              <h2 className="font-display text-5xl md:text-8xl font-bold mb-12 leading-none">
                HI! I&apos;M<br/>SANDU
              </h2>
              <div className="space-y-8 font-mono text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-lg">
                <p className="first-letter:text-4xl first-letter:font-display first-letter:mr-2 first-letter:float-left">
                  I&apos;m a tattoo artist with 4 years of experience and a huge love for tattooing.
                </p>
                <p>
                  I specialize in linework, ornamental designs, and black & red tones. But I&apos;m a flexible artist, so don&apos;t worry, we&apos;ll make something stylish that suits you.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-white/10">
                  <span>PRAGUE BASE</span>
                  <span>•</span>
                  <span>4 YEARS EXP</span>
                  <span>•</span>
                  <span>300+ CLIENTS</span>
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
                  <img src="https://images.unsplash.com/photo-1751891030605-e7dbf7692a39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXR0b28lMjBhcnRpc3QlMjB3b21hbiUyMHN0dWRpb3xlbnwxfHx8fDE3NjkwMjc3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Sandu - Tattoo Artist" className="object-cover w-full h-full"/>
                </div>

                {/* Floating Text */}
                <div className="absolute -right-8 bottom-10 rotate-90 origin-bottom-right text-xs font-mono tracking-widest text-gray-500 whitespace-nowrap">
                  EST. 2021 <span className="mx-2">//</span> SANDU INK
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
            <h2 className="font-mono text-sm uppercase tracking-[0.5em]">FAQ</h2>
            <span className="sigil-text">⫘⫘⫘</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* FAQ 1 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">Does it hurt to get a tattoo?</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                It depends on the placement! But I work gently and always take breaks. Many clients say it was much easier than they expected. Don&apos;t worry, I also have numbing cream if needed.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">How much does a tattoo cost?</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                Prices start from 2,000 CZK and depend on the size and complexity. Message me with your idea and I&apos;ll calculate the price for free!
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">How do I take care of it after the session?</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                I&apos;ll give you detailed aftercare instructions and stay in touch. In short: after the session I apply a healing film for free, you&apos;ll need to remove it after 3–5 days (I&apos;ll tell you exactly when). After that, just use the cream and don&apos;t scratch it!
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">Can I come with my own design?</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                Of course! Bring a reference and we&apos;ll adapt it, or I can draw something similar in my style.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="group relative pt-6 border-t border-black/20 hover:border-black transition-colors duration-500 md:col-span-2">
              <h3 className="font-display text-xl uppercase mb-4 group-hover:italic transition-all">What if I change my mind at the last minute?</h3>
              <p className="font-mono text-xs leading-relaxed text-gray-500">
                No worries! We can reschedule, just please let me know at least 12 hours in advance.
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
                I was scared, but Sandu calmed me down. The result exceeded expectations.
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — Anya <span className="mx-2">/</span> Spine Piece
              </div>
            </div>

            {/* 2 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50">❝</div>
              <p className="font-display text-xl md:text-2xl leading-tight text-gray-300">
                Quality, atmosphere, professionalism - everything at the highest level.
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — Marina <span className="mx-2">/</span> Sleeve
              </div>
            </div>

            {/* 3 */}
            <div className="flex flex-col gap-4">
              <div className="sigil-text text-2xl opacity-50">❝</div>
              <p className="font-display text-xl md:text-2xl leading-tight">
                Jewelry-level precision. Healing went perfectly. Found my artist.
              </p>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-auto">
                — Dasha <span className="mx-2">/</span> Minimalist
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
            <h2 className="font-display text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-none">
              Book<br/><span className="text-transparent bg-clip-text bg-gradient-to-t from-black to-gray-400 italic">Now</span>
            </h2>
          </div>

          <form className="space-y-0 border-t border-black">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="group border-b border-black border-r-0 md:border-r relative">
                <label className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">Name</label>
                <input type="text" className="w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 focus:bg-gray-50 transition-colors" placeholder="YOUR NAME"/>
              </div>
              <div className="group border-b border-black relative">
                <label className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">Contact</label>
                <input type="email" className="w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 focus:bg-gray-50 transition-colors" placeholder="EMAIL / IG"/>
              </div>
            </div>

            <div className="relative border-b border-black">
              <label className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">Concept</label>
              <textarea className="w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 resize-none h-48 focus:bg-gray-50 transition-colors" placeholder="DESCRIBE YOUR IDEA..."></textarea>
            </div>

            <button type="submit" className="w-full bg-black text-white py-8 font-mono text-sm uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-b hover:border-black transition-all flex justify-between px-8 group">
              <span>Send Request</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </form>

          <div className="mt-24 flex flex-col items-center gap-4 text-center">
            <div className="sigil-text text-xl animate-pulse">☠︎︎</div>
            <div className="font-mono text-xs uppercase tracking-widest">
              <a href="https://www.instagram.com/doompink" target="_blank" rel="noopener noreferrer" className="hover:line-through px-2">Instagram</a>
              <span className="opacity-30">/</span>
              <a href="https://t.me/doompink" target="_blank" rel="noopener noreferrer" className="hover:line-through px-2">Telegram</a>
            </div>
            <div className="font-mono text-xs text-gray-400 mt-2">
              <a href="tel:+420774685187" className="hover:line-through">+420 774 685 187</a>
              <span className="mx-2">•</span>
              <a href="mailto:doompynooo@gmail.com" className="hover:line-through">doompynooo@gmail.com</a>
            </div>
            <div className="font-mono text-xs text-gray-400 mt-1">
              Korunni 859/18, Praha, 120 00
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-12 border-t border-black">
        <div className="container mx-auto px-4 text-center overflow-hidden">
          {/* Complex Unicode Signature */}
          <div className="mb-8 font-mono text-sm tracking-[1em] opacity-80 whitespace-nowrap overflow-hidden">
            <a href="/" className="hover:opacity-60 transition-opacity">doomp.ink</a>
          </div>

          <div className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase text-gray-500 tracking-widest">
            <span>&copy; 2025 Sandu Ink. Prague.</span>
            <span className="sigil-text text-lg">⫘</span>
            <span>Designed for the bold.</span>
          </div>

          <div className="mt-8 opacity-20 sigil-text text-xs tracking-[2em]">
            ⫘⫘⫘⫘⫘
          </div>
        </div>
      </footer>
    </div>
  )
}
