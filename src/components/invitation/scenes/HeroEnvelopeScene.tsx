'use client';

import React from 'react';
import { InvitationCanvas } from '@/components/3d/InvitationCanvas';
import { ChevronDown, Sparkles, ArrowDown } from 'lucide-react';

interface HeroEnvelopeSceneProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  coupleNames: string;
  onProceed?: () => void;
}

export function HeroEnvelopeScene({
  isOpen,
  onOpen,
  guestName,
  coupleNames,
  onProceed,
}: HeroEnvelopeSceneProps) {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between py-8 px-4 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F3ECE0] to-[#FAF7F2]">
      {/* Background Royal Golden Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#B88E3E]/15 via-[#DFCA94]/25 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Header Monogram & Subtitle */}
      <div className="relative z-10 text-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B88E3E]/40 bg-[#FFFDF9]/90 backdrop-blur-md shadow-sm mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#580F25] font-royal font-bold">
            The Royal Wedding Celebration
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
        </div>
        <h1 className="text-3xl md:text-5xl font-royal font-bold text-burgundy-gradient tracking-wide">
          {coupleNames}
        </h1>
        <p className="text-sm md:text-base font-serif italic text-[#6B4E3D] mt-1">
          A bespoke ceremonial invitation crafted for{' '}
          <span className="font-bold text-[#3A0715] not-italic underline decoration-[#B88E3E]/60 underline-offset-4">
            {guestName}
          </span>
        </p>
      </div>

      {/* 3D Envelope Canvas */}
      <div className="w-full relative z-10 my-auto">
        <InvitationCanvas
          isOpen={isOpen}
          onOpen={onOpen}
          guestName={guestName}
          coupleNames={coupleNames}
        />
      </div>

      {/* Bottom Area: Gated by isOpen */}
      <div className="relative z-10 text-center pb-4 transition-all duration-700 min-h-[72px] flex items-center justify-center">
        {isOpen ? (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <button
              onClick={onProceed}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#580F25] via-[#4A081A] to-[#3A0715] text-[#FAF7F2] font-royal font-bold text-xs md:text-sm uppercase tracking-widest shadow-[0_8px_25px_rgba(58,7,21,0.25)] hover:shadow-[0_10px_35px_rgba(184,142,62,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#DFCA94]"
            >
              <span>Explore Wedding Festivities &amp; RSVP</span>
              <ArrowDown className="w-4 h-4 text-[#DFCA94] animate-bounce" />
            </button>
            <span className="text-[11px] text-[#6B4E3D] font-serif italic">
              Scroll down to discover function schedules, venues, and submit your RSVP
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D3B] font-royal">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Invitation Sealed • Tap the Monogram to Open</span>
            <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
          </div>
        )}
      </div>
    </section>
  );
}
