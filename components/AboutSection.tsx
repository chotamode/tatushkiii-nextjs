'use client';

import { motion } from 'motion/react';

export default function AboutSection() {
  return (
    <section className="py-32 px-6" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-mono text-xs uppercase tracking-widest text-acid mb-6">
              About The Artist
            </p>
            <h2 className="text-stretched text-5xl md:text-7xl mb-8 text-acid">
              HI! I'M SANDU
            </h2>
            <div className="sharp-container space-y-6">
              <p className="text-serif text-base text-mercury-light">
                I'm a tattoo artist with 4 years of experience and a huge love for tattooing.
              </p>
              <p className="text-serif text-base text-zinc-500">
                I specialize in linework, ornamental designs, and black & red tones. But I'm a
                flexible artist, so don't worry, we'll make something stylish that suits you.
              </p>
              <div className="flex flex-wrap gap-4 text-mono text-xs uppercase text-zinc-500 pt-4 border-t-0.5 border-mercury">
                <span>Prague Based</span>
                <span>•</span>
                <span>4 Years Exp</span>
                <span>•</span>
                <span>300+ Clients</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="liquid-metal-border aspect-square">
              {/* Placeholder gradient for artist image */}
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(135deg, #808080 0%, #c0c0c0 50%, #e8e8e8 100%)',
                }}
              />

              {/* Decorative Sigil Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 mix-blend-screen">
                <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-acid">
                  <path
                    d="M 50 10 L 90 50 L 50 90 L 10 50 Z M 50 25 L 75 50 L 50 75 L 25 50 Z M 50 40 L 60 50 L 50 60 L 40 50 Z"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* Floating Text Accent */}
            <div className="absolute -bottom-4 -right-4 text-mono text-xs uppercase tracking-widest text-zinc-500 rotate-90 origin-bottom-right">
              Est. 2021
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Stat 1 */}
          <div className="sharp-container text-center">
            <div className="text-stretched text-4xl mb-2 text-acid">300+</div>
            <div className="text-mono text-xs uppercase text-zinc-500">Happy Clients</div>
          </div>

          {/* Stat 2 */}
          <div className="sharp-container text-center">
            <div className="text-stretched text-4xl mb-2 text-acid">4+</div>
            <div className="text-mono text-xs uppercase text-zinc-500">Years Experience</div>
          </div>

          {/* Stat 3 */}
          <div className="sharp-container text-center">
            <div className="text-stretched text-4xl mb-2 text-acid">100%</div>
            <div className="text-mono text-xs uppercase text-zinc-500">Sterile Safe</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
