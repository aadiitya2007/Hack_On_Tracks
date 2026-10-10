'use client';
import { useEffect, useState } from 'react';

// Alizo-style soft gradient background
export default function MarketBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg">
      {/* Top Left Massive Soft Blur */}
      <div 
        className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] rounded-full opacity-40 mix-blend-multiply"
        style={{ 
          background: 'radial-gradient(circle, rgba(109, 40, 217, 0.2) 0%, rgba(109, 40, 217, 0) 70%)',
          filter: 'blur(100px)'
        }}
      ></div>

      {/* Bottom Right Soft Blur */}
      <div 
        className="absolute top-[40%] -right-[20%] w-[60%] h-[80%] rounded-full opacity-30 mix-blend-multiply"
        style={{ 
          background: 'radial-gradient(circle, rgba(109, 40, 217, 0.15) 0%, rgba(109, 40, 217, 0) 70%)',
          filter: 'blur(120px)'
        }}
      ></div>
      
      {/* Abstract dotted mesh pattern overlay (very faint) */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{ 
          backgroundImage: 'radial-gradient(#6D28D9 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>
    </div>
  );
}
