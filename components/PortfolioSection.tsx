'use client';

import { motion } from 'motion/react';

// Placeholder gradients for portfolio items
const placeholderGradients = [
  'linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #ccff00 100%)',
  'linear-gradient(45deg, #050505 0%, #c0c0c0 50%, #e8e8e8 100%)',
  'linear-gradient(225deg, #ccff00 0%, #808080 50%, #050505 100%)',
  'linear-gradient(315deg, #e8e8e8 0%, #c0c0c0 50%, #808080 100%)',
  'linear-gradient(180deg, #808080 0%, #ccff00 50%, #c0c0c0 100%)',
  'linear-gradient(90deg, #050505 0%, #808080 50%, #ccff00 100%)',
  'linear-gradient(270deg, #c0c0c0 0%, #050505 50%, #e8e8e8 100%)',
  'linear-gradient(60deg, #ccff00 0%, #c0c0c0 50%, #808080 100%)',
];

// Cyber sigil SVG paths
const sigilPaths = [
  'M 50 10 L 90 50 L 50 90 L 10 50 Z M 50 30 L 70 50 L 50 70 L 30 50 Z', // Diamond
  'M 20 50 L 80 50 M 50 20 L 50 80', // Cross
  'M 50 10 L 90 90 L 10 90 Z', // Triangle
  'M 10 10 L 90 10 L 90 90 L 10 90 Z M 30 30 L 70 70 M 70 30 L 30 70', // Square with X
  'M 50 20 L 70 35 L 65 60 L 50 80 L 35 60 L 30 35 Z', // Pentagon
  'M 20 50 L 40 20 L 60 20 L 80 50 L 60 80 L 40 80 Z', // Hexagon
  'M 50 10 L 60 40 L 90 40 L 65 60 L 75 90 L 50 70 L 25 90 L 35 60 L 10 40 L 40 40 Z', // Star
  'M 50 10 Q 90 50 50 90 Q 10 50 50 10', // Curved Diamond
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function PortfolioSection() {
  return (
    <section className="py-32 px-6" id="portfolio">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-stretched text-5xl md:text-7xl mb-4 text-acid">
            PORTFOLIO
          </h2>
          <p className="text-mono text-xs uppercase tracking-widest text-zinc-500">
            Selected Works
          </p>
        </motion.div>

        {/* Asymmetric Grid */}
        <motion.div
          className="portfolio-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {placeholderGradients.map((gradient, index) => (
            <motion.div
              key={index}
              className="portfolio-item"
              variants={itemVariants}
              whileHover={{
                filter: 'grayscale(0%) contrast(1.1)',
                scale: 1.02,
              }}
            >
              {/* Gradient Background */}
              <div
                className="w-full h-full"
                style={{ background: gradient }}
              />

              {/* Cyber Sigil Overlay */}
              <div className="sigil-overlay">
                <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 text-acid">
                  <path
                    d={sigilPaths[index]}
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action Link */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <a
            href="https://www.instagram.com/doompink"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mono text-sm uppercase tracking-wider text-mercury hover:text-acid transition-colors inline-flex items-center gap-2"
          >
            View Full Gallery
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
