'use client';

import { useEffect, useState } from 'react';

interface BrandLoaderProps {
  fullScreen?: boolean;
  text?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 80, logo: 40, stroke: 3 },
  md: { container: 140, logo: 70, stroke: 4 },
  lg: { container: 200, logo: 100, stroke: 5 },
};

export function BrandLoader({
  fullScreen = false,
  text = 'LOADING...',
  showTagline = true,
  size = 'lg',
}: BrandLoaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const s = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Spinning ring with logo */}
      <div
        className="relative"
        style={{ width: s.container, height: s.container }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full animate-spin-sweep"
          style={{
            border: `${s.stroke}px solid transparent`,
            borderTopColor: '#ff7a00',
            borderRightColor: '#ff7a00',
            boxShadow: '0 0 12px rgba(255,122,0,0.4), inset 0 0 12px rgba(255,122,0,0.1)',
          }}
        />
        {/* Second ring for depth */}
        <div
          className="absolute inset-2 rounded-full animate-spin-sweep-reverse"
          style={{
            border: `${Math.max(1, s.stroke - 1)}px solid transparent`,
            borderBottomColor: 'rgba(255,122,0,0.3)',
            borderLeftColor: 'rgba(255,122,0,0.3)',
          }}
        />
        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            style={{ width: s.logo, height: s.logo }}
            className="drop-shadow-[0_0_8px_rgba(255,122,0,0.3)]"
          >
            {/* Navy top S curve */}
            <path
              d="M65 18 C 78 18, 85 28, 80 40 C 75 50, 55 50, 40 50 C 22 50, 15 58, 15 72"
              fill="none"
              stroke="#0b1f4d"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Wrench head */}
            <path d="M72 8 L88 8 L84 22 L76 22 Z" fill="#0b1f4d" />
            <circle cx="80" cy="14" r="7" fill="#0b1f4d" />
            {/* Orange bottom S curve */}
            <path
              d="M15 72 C 15 86, 28 92, 42 92 C 52 92, 58 88, 62 84"
              fill="none"
              stroke="#ff7a00"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Bottom ring */}
            <circle cx="68" cy="86" r="10" fill="none" stroke="#ff7a00" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-white/80 animate-pulse">
            {text}
          </p>
        </div>
      )}

      {/* Tagline */}
      {showTagline && (
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-orange-500/50" />
          <p className="text-[10px] tracking-widest text-white/40 uppercase">
            Fixing Problems, Delivering Trust
          </p>
          <div className="h-px w-6 bg-orange-500/50" />
        </div>
      )}
    </div>
  );

  if (!mounted) return null;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080c18]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {content}
    </div>
  );
}
