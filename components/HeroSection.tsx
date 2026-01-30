'use client';

import { motion } from 'motion/react';

export default function HeroSection() {
  const glitchVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto w-full text-center">
        {/* Main Distorted Title */}
        <motion.h1
          className="glitch-hover mb-12"
          data-text="TATTOOS"
          initial="hidden"
          animate="visible"
          variants={glitchVariants}
          style={{
            fontSize: 'clamp(3rem, 12vw, 8rem)',
            letterSpacing: '0.15em',
          }}
        >
          TATTOOS
        </motion.h1>

        {/* Central Image with Liquid Ash Border */}
        <motion.div
          className="liquid-metal-border mx-auto mb-12 relative overflow-hidden"
          style={{
            maxWidth: '400px',
            aspectRatio: '1',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          {/* Placeholder gradient background */}
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #ccff00 100%)',
            }}
          />

          {/* Optional: Cyber sigil overlay on the image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 mix-blend-screen">
            <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 text-acid">
              <path
                d="M 50 10 L 90 50 L 50 90 L 10 50 Z M 50 30 L 70 50 L 50 70 L 30 50 Z"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
              />
            </svg>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-zinc-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.6,
          }}
        >
          Custom designs in Cybersigilism style.<br />
          Precision, safety, creativity.
        </motion.p>

        {/* CTA Button - will be enhanced with magnetic effect later */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.9,
            duration: 0.6,
          }}
        >
          <button className="cyber-button text-lg px-8 py-4">
            BOOK SESSION
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.2,
            duration: 0.8,
          }}
        >
          <div className="flex flex-col items-center gap-2 opacity-40">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-acid animate-bounce"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            <span className="text-mono text-xs uppercase tracking-widest">Scroll</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
