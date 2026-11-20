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
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-1.5">
          Wedding Invitation
        </span>
        <h1 className="text-3xl md:text-5xl font-royal font-bold text-burgundy-gradient tracking-wide">
          {coupleNames}
        </h1>
        <p className="text-sm md:text-base font-serif italic text-[#6B4E3D] mt-1">
          Bespoke invitation for{' '}
          <span className="font-bold text-[#3A0715] not-italic">
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
      <div className="relative z-10 text-center pb-4 transition-all duration-700 min-h-[64px] flex items-center justify-center">
        {isOpen ? (
          <div className="flex flex-col items-center gap-1.5 animate-fadeIn">
            <button
              onClick={onProceed}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#580F25] hover:bg-[#45091C] text-[#FAF7F2] font-royal font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#DFCA94]"
            >
              <span>View Wedding Functions &amp; RSVP</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#DFCA94]" />
            </button>
          </div>
        ) : (
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8C6D3B] font-royal font-medium">
            Touch the Royal Seal to Unseal
          </div>
        )}
      </div>
    </section>
  );
}
