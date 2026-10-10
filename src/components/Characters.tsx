import React from 'react';

// Flat, refined vector illustration style for the characters

export const Aarav = ({ expression = 'neutral', className = "w-16 h-16" }: { expression?: 'neutral' | 'thinking' | 'happy' | 'surprised', className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#F1F5F9" />
    <circle cx="50" cy="50" r="48" stroke="#E2E8F0" strokeWidth="4" />
    {/* Hair */}
    <path d="M25 45 C 25 15, 75 15, 75 45" fill="#1E293B" />
    <path d="M20 40 Q 30 20 50 20 Q 70 20 80 40 Q 50 15 20 40" fill="#0F172A" />
    {/* Face */}
    <path d="M30 45 C 30 80, 70 80, 70 45 Z" fill="#FDBA74" />
    {/* Eyes */}
    {expression === 'happy' ? (
      <>
        <path d="M40 52 Q 43 49 46 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M54 52 Q 57 49 60 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ) : expression === 'surprised' ? (
      <>
        <circle cx="43" cy="50" r="3" fill="#1E293B" />
        <circle cx="57" cy="50" r="3" fill="#1E293B" />
        <path d="M40 44 Q 43 41 46 44" stroke="#1E293B" strokeWidth="1.5" fill="none"/>
        <path d="M54 44 Q 57 41 60 44" stroke="#1E293B" strokeWidth="1.5" fill="none"/>
      </>
    ) : (
      <>
        <circle cx="43" cy="52" r="2.5" fill="#1E293B" />
        <circle cx="57" cy="52" r="2.5" fill="#1E293B" />
      </>
    )}
    {/* Mouth */}
    {expression === 'happy' ? (
      <path d="M42 65 Q 50 72 58 65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    ) : expression === 'surprised' ? (
      <circle cx="50" cy="65" r="4" fill="#1E293B" />
    ) : expression === 'thinking' ? (
      <path d="M45 66 L 55 64" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    ) : (
      <path d="M45 65 Q 50 67 55 65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    )}
    {/* Shirt */}
    <path d="M25 100 C 25 80, 75 80, 75 100" fill="#3B82F6" />
  </svg>
);

export const Meera = ({ expression = 'neutral', className = "w-16 h-16" }: { expression?: 'neutral' | 'thinking' | 'happy' | 'surprised', className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#F8FAFC" />
    <circle cx="50" cy="50" r="48" stroke="#E2E8F0" strokeWidth="4" />
    {/* Hair */}
    <path d="M20 55 C 10 20, 90 20, 80 55 C 80 75, 75 90, 65 100 L 35 100 C 25 90, 20 75, 20 55 Z" fill="#475569" />
    {/* Face */}
    <path d="M32 45 C 32 75, 68 75, 68 45 Z" fill="#FCD34D" />
    {/* Eyes */}
    {expression === 'happy' ? (
      <>
        <path d="M40 52 Q 43 49 46 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M54 52 Q 57 49 60 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="43" cy="52" r="2.5" fill="#1E293B" />
        <circle cx="57" cy="52" r="2.5" fill="#1E293B" />
        <path d="M39 47 Q 43 45 47 48" stroke="#1E293B" strokeWidth="1.5" fill="none"/>
        <path d="M53 48 Q 57 45 61 47" stroke="#1E293B" strokeWidth="1.5" fill="none"/>
      </>
    )}
    {/* Glasses */}
    <rect x="36" y="47" width="14" height="10" rx="2" stroke="#6D28D9" strokeWidth="2" fill="none" />
    <rect x="50" y="47" width="14" height="10" rx="2" stroke="#6D28D9" strokeWidth="2" fill="none" />
    <path d="M50 52 L 50 52" stroke="#6D28D9" strokeWidth="2" />
    
    {/* Mouth */}
    {expression === 'happy' ? (
      <path d="M43 65 Q 50 70 57 65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    ) : (
      <path d="M45 65 Q 50 67 55 65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    )}
    {/* Blazer */}
    <path d="M25 100 C 25 80, 75 80, 75 100" fill="#6D28D9" />
    <path d="M40 100 L 50 85 L 60 100" fill="#F8FAFC" />
  </svg>
);
