'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ReactNode, MouseEvent, useEffect, useState } from 'react';

export function FloatingCard({ children, delay = 0, duration = 4, yOffset = 15, className = '' }: { children: ReactNode, delay?: number, duration?: number, yOffset?: number, className?: string }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (prefersReducedMotion) return;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);

    const rX = ((y / height) - 0.5) * -15; // max rotation 15deg
    const rY = ((x / width) - 0.5) * 15;
    
    rotateX.set(rX);
    rotateY.set(rY);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={
        prefersReducedMotion 
        ? {} 
        : { y: [0, -yOffset, 0] }
      }
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
      className={`relative rounded-2xl bg-card/50 border border-border backdrop-blur-md shadow-2xl overflow-hidden ${className}`}
    >
      {/* Subtle hover glow following cursor */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                250px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.06),
                transparent 80%
              )
            `,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
