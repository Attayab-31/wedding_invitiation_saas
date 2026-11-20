'use client';

import React, { useEffect } from 'react';

interface WebGLFallbackProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  coupleNames: string;
  isDiving?: boolean;
  onDiveComplete?: () => void;
}

export function WebGLFallback({
  isOpen,
  onOpen,
  guestName,
  coupleNames,
  onDiveComplete,
}: WebGLFallbackProps) {
  useEffect(() => {
    if (isOpen && onDiveComplete) {
      const timer = setTimeout(() => {
        onDiveComplete();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onDiveComplete]);

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/3] flex items-center justify-center p-4">
      {/* Outer Envelope Wrapper */}
      <div
        onClick={onOpen}
        className="relative w-full h-full bg-[#4A0A1C] rounded-2xl shadow-2xl border-2 border-[#B88E3E]/60 overflow-hidden flex flex-col items-center justify-center cursor-pointer"
      >
        {/* Interior Pocket Background with Champagne Gold Foil Lining */}
        <div className="absolute inset-3 bg-gradient-to-tr from-[#320612] via-[#DFCA94]/30 to-[#B88E3E]/40 rounded-xl shadow-inner border border-[#B88E3E]/50" />

        {/* Layer 1: Secondary Gold-Edged Function Card (Nestled inside pocket) */}
        <div
          className={`absolute w-[86%] h-[72%] bg-gradient-to-br from-[#DFCA94] to-[#B88E3E] rounded-xl shadow-md border border-[#C5A15A] p-4 text-center transition-all duration-700 ease-out z-10 -rotate-1 ${
            isOpen ? '-translate-y-6' : 'translate-y-2 opacity-90'
          }`}
        />

        {/* Layer 2: Main Ivory Invitation Card (Nestled inside pocket, peeking out) */}
        <div
          className={`absolute w-[86%] h-[72%] bg-[#FFFDF9] rounded-xl shadow-xl border-2 border-[#B88E3E] p-4 text-center transition-all duration-700 ease-out z-10 ${
            isOpen ? '-translate-y-4' : 'translate-y-4 opacity-90'
          }`}
        >
          {/* Gold Decorative Corner Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#B88E3E]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#B88E3E]" />

          <p className="text-[10px] text-[#580F25] font-serif italic mb-0.5">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-[8px] tracking-[0.25em] uppercase text-[#8C6D3B] font-royal font-semibold mb-1">
            Together With Their Families
          </p>
          <h3 className="text-lg md:text-xl font-royal font-bold text-[#3A0715] mb-0.5">
            {coupleNames}
          </h3>
          <p className="text-[9px] text-[#6B4E3D] font-serif italic">
            Request the honour of your gracious presence
          </p>
        </div>

        {/* Envelope Lower Pocket Fold (Covers lower half of cards so they sit inside pocket) */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#3A0715] via-[#4A0A1C] to-[#580F25] border-t border-[#B88E3E]/40 z-20 shadow-lg pointer-events-none" />

        {/* Articulated Flap */}
        <div
          className={`absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#580F25] to-[#3A0715] border-b-2 border-[#B88E3E]/60 origin-top transition-transform duration-1000 ease-in-out z-30 ${
            isOpen ? '-rotate-180 pointer-events-none' : 'rotate-0'
          }`}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
        />

        {/* Wax Seal */}
        {!isOpen && (
          <button
            onClick={onOpen}
            className="absolute top-[42%] z-40 w-16 h-16 rounded-full bg-gradient-to-br from-[#7A1532] via-[#580F25] to-[#3A0715] border-2 border-[#DFCA94] shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center transform transition-all hover:scale-110 active:scale-95 cursor-pointer group"
            title="Tap to unseal royal invitation"
          >
            <div className="w-12 h-12 rounded-full border border-[#DFCA94]/60 flex items-center justify-center bg-[#4A0A1C]/80">
              <span className="text-[#DFCA94] font-royal font-bold text-xs tracking-wider group-hover:scale-110 transition-transform">
                A &amp; M
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
