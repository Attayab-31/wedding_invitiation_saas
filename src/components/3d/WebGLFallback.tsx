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
    <div className="relative w-full max-w-lg mx-auto aspect-[4/3] flex items-center justify-center p-4">
      {/* Outer Envelope Wrapper */}
      <div className="relative w-full h-full bg-[#4A0A1C] rounded-2xl shadow-2xl border-2 border-[#B88E3E]/60 overflow-hidden flex flex-col items-center justify-center">
        
        {/* Interior Pocket Background with Gold Foil Rim */}
        <div className="absolute inset-3 bg-[#320612] rounded-xl shadow-inner border border-[#B88E3E]/30" />

        {/* Sliding Invitation Card */}
        <div
          className={`absolute w-[88%] h-[84%] bg-[#FFFDF9] rounded-xl shadow-2xl border-2 border-[#B88E3E] p-6 text-center transition-all duration-1000 ease-out z-10 ${
            isOpen
              ? '-translate-y-28 scale-105 shadow-[0_20px_50px_rgba(58,7,21,0.25)] ring-2 ring-[#B88E3E]'
              : 'translate-y-4 scale-95 opacity-90'
          }`}
        >
          {/* Gold Decorative Corner Brackets */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B88E3E]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B88E3E]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B88E3E]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B88E3E]" />

          <p className="text-xs text-[#580F25] font-serif italic mb-1">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#8C6D3B] font-royal font-semibold mb-2">
            Together With Their Families
          </p>
          <h3 className="text-2xl md:text-3xl font-royal font-bold text-[#3A0715] mb-1">
            {coupleNames}
          </h3>
          <p className="text-xs text-[#6B4E3D] font-serif italic mb-3">
            Request the honour of your presence to celebrate their wedding
          </p>

          {/* Guest Name in Gold Border Box */}
          <div className="my-2 py-2 px-4 border border-[#B88E3E] bg-[#FAF7F2] rounded-lg shadow-sm">
            <span className="block text-[9px] text-[#8C6D3B] uppercase tracking-widest font-royal font-medium">
              Especially Invited
            </span>
            <span className="text-lg md:text-xl font-serif font-bold text-[#3A0715]">
              {guestName}
            </span>
          </div>

          <p className="text-[10px] text-[#8C6D3B] tracking-wider uppercase mt-2 font-royal">
            December 2026 • Lahore, Pakistan
          </p>
        </div>

        {/* Envelope Lower Pocket Fold */}
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
            <span className="absolute -bottom-7 text-[10px] tracking-wider uppercase text-[#3A0715] font-royal font-bold whitespace-nowrap bg-[#FAF7F2] px-2.5 py-0.5 rounded-full shadow border border-[#B88E3E]/60">
              Tap to Unseal
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
