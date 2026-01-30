'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

declare global {
  interface Window {
    Cal?: {
      ns?: {
        [key: string]: (action: string, options?: Record<string, unknown>) => void
      }
    }
  }
}

export default function CTAButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for magnetic effect
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // Magnetic pull within 50px radius
    const magneticRadius = 50;
    if (distance < magneticRadius) {
      const pullStrength = 0.3;
      mouseX.set(distanceX * pullStrength);
      mouseY.set(distanceY * pullStrength);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const openCalPopup = () => {
    if (window.Cal?.ns?.['book-session']) {
      window.Cal.ns['book-session']('openModal', {
        calLink: 'doompink/book-session',
      });
    } else {
      console.error('Cal.com booking widget not loaded');
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={openCalPopup}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cyber-button h-14 px-8 text-lg"
    >
      BOOK SESSION
    </motion.button>
  );
}
