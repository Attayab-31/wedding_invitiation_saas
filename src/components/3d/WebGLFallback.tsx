'use client';

import React from 'react';

interface WebGLFallbackProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  coupleNames: string;
}

export function WebGLFallback({
  isOpen,
  onOpen,
  guestName,
  coupleNames,
}: WebGLFallbackProps) {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3] flex items-center justify-center p-4">
      {/* Outer Envelope Wrapper */}
      <div className="relative w-full h-full bg-[#3A0715] rounded-xl shadow-2xl border border-[#C5A15A]/40 overflow-hidden flex flex-col items-center justify-center">
        
        {/* Interior Pocket Background */}
        <div className="absolute inset-2 bg-[#2D0510] rounded-lg shadow-inner" />

        {/* Sliding Invitation Card */}
        <div
          className={`absolute w-[88%] h-[82%] bg-[#F8F1E5] rounded-lg shadow-xl border-2 border-[#C5A15A] p-6 text-center transition-all duration-1000 ease-out z-10 ${
            isOpen
              ? '-translate-y-24 scale-105 shadow-2xl ring-2 ring-[#C5A15A]/50'
              : 'translate-y-4 scale-95 opacity-80'
          }`}
        >
          {/* Gold Decorative Corner Brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#C5A15A]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C5A15A]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C5A15A]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#C5A15A]" />

          <p className="text-xs text-[#580F25] font-serif italic mb-1">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-[10px] tracking-widest uppercase text-[#8C6D3B] font-royal font-semibold mb-2">
            Together With Their Families
          </p>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-[#3A0715] mb-1">
            {coupleNames}
          </h3>
          <p className="text-xs text-[#6B4F35] font-serif italic mb-3">
            Request the honour of your presence
          </p>

          {/* Guest Name in Gold Border Box */}
          <div className="my-2 py-1.5 px-3 border border-[#C5A15A]/60 bg-[#EFE4D2]/40 rounded">
            <span className="block text-[10px] text-[#8C6D3B] uppercase tracking-wider">Cordially Invited</span>
            <span className="text-base md:text-lg font-serif font-bold text-[#3A0715]">
              {guestName}
            </span>
          </div>

          <p className="text-[10px] text-[#8C6D3B] tracking-wider uppercase mt-2">
            December 2026 • Lahore, Pakistan
          </p>
        </div>

        {/* Envelope Lower Pocket Fold */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#3A0715] to-[#45091a] border-t border-[#C5A15A]/30 z-20 shadow-lg pointer-events-none" />

        {/* Articulated Flap */}
        <div
          className={`absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#4A0A1C] to-[#3A0715] border-b-2 border-[#C5A15A]/40 origin-top transition-transform duration-1000 ease-in-out z-30 ${
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
            className="absolute top-[42%] z-40 w-16 h-16 rounded-full bg-[#580F25] border-2 border-[#C5A15A] shadow-2xl flex flex-col items-center justify-center transform transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
            title="Tap to open the royal invitation"
          >
            <div className="w-12 h-12 rounded-full border border-[#C5A15A]/50 flex items-center justify-center bg-[#4A081C]">
              <span className="text-[#E6D2A0] font-royal font-bold text-xs group-hover:scale-110 transition-transform">
                A & M
              </span>
            </div>
            <span className="absolute -bottom-6 text-[10px] tracking-wider uppercase text-[#E6D2A0] font-sans font-medium whitespace-nowrap bg-[#191516]/80 px-2 py-0.5 rounded border border-[#C5A15A]/40">
              Tap to Open
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
