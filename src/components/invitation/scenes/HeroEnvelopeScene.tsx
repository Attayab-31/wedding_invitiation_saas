'use client';

import React from 'react';
import { InvitationCanvas } from '@/components/3d/InvitationCanvas';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeroEnvelopeSceneProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  coupleNames: string;
}

export function HeroEnvelopeScene({
  isOpen,
  onOpen,
  guestName,
  coupleNames,
}: HeroEnvelopeSceneProps) {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 overflow-hidden bg-gradient-to-b from-[#191516] via-[#2A0610] to-[#191516]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A15A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Monogram & Subtitle */}
      <div className="relative z-10 text-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A15A]/30 bg-[#3A0715]/40 backdrop-blur-md mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A15A]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#E6D2A0] font-royal font-medium">
            Royal Wedding Invitation
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C5A15A]" />
        </div>
        <h1 className="text-3xl md:text-5xl font-royal font-bold text-gold-gradient tracking-wide">
          {coupleNames}
        </h1>
        <p className="text-sm md:text-base font-serif italic text-[#E6D2A0]/80 mt-1">
          A bespoke digital invitation crafted for{' '}
          <span className="font-semibold text-[#F8F1E5] not-italic underline decoration-[#C5A15A]/60 underline-offset-4">
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

      {/* Footer Scroll Prompt */}
      <div className="relative z-10 text-center pb-4 transition-opacity duration-700">
        <p className="text-xs uppercase tracking-widest text-[#C5A15A]/80 font-royal mb-2">
          {isOpen ? 'Scroll Down for Wedding Functions & RSVP' : 'Open the Envelope to Continue'}
        </p>
        <div className="animate-bounce inline-block text-[#C5A15A]">
          <ChevronDown className="w-5 h-5 mx-auto" />
        </div>
      </div>
    </section>
  );
}
