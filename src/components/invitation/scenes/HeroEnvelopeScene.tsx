'use client';

import React from 'react';
import { InvitationCanvas } from '@/components/3d/InvitationCanvas';
import { ArrowRight } from 'lucide-react';

interface HeroEnvelopeSceneProps {
  isOpen: boolean;
  isDiving: boolean;
  onOpen: () => void;
  onDiveComplete: () => void;
  guestName: string;
  coupleNames: string;
  onProceed?: () => void;
}

export function HeroEnvelopeScene({
  isOpen,
  isDiving,
  onOpen,
  onDiveComplete,
  guestName,
  coupleNames,
  onProceed,
}: HeroEnvelopeSceneProps) {
  return (
    <section className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col items-center justify-between py-3 sm:py-5 px-3 sm:px-6 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F3ECE0] to-[#FAF7F2] select-none">
      {/* Background Royal Golden Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-[#B88E3E]/15 via-[#DFCA94]/25 to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* Header Monogram & Subtitle (Gracefully fades out when camera begins its cinematic dive) */}
      <div
        className={`relative z-10 text-center pt-1 shrink-0 transition-all duration-700 ease-in-out ${
          isDiving ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-1">
          Wedding Invitation
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-royal font-bold text-burgundy-gradient tracking-wide">
          {coupleNames}
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-serif italic text-[#6B4E3D] mt-0.5">
          Bespoke invitation for{' '}
          <span className="font-bold text-[#3A0715] not-italic">
            {guestName}
          </span>
        </p>
      </div>

      {/* 3D Envelope Canvas Container */}
      <div className="w-full flex-1 min-h-0 relative z-10 my-auto flex items-center justify-center overflow-hidden">
        <InvitationCanvas
          isOpen={isOpen}
          isDiving={isDiving}
          onOpen={onOpen}
          onDiveComplete={onDiveComplete}
          guestName={guestName}
          coupleNames={coupleNames}
        />
      </div>

      {/* Bottom Area (Gated by isOpen & isDiving) */}
      <div
        className={`relative z-10 text-center pb-2 sm:pb-3 shrink-0 min-h-[50px] flex items-center justify-center transition-all duration-700 ease-in-out ${
          isDiving ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        {isOpen ? (
          <div className="flex flex-col items-center gap-1.5 animate-fadeIn">
            <button
              onClick={onProceed || onOpen}
              className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#580F25] hover:bg-[#45091C] text-[#FAF7F2] font-royal font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#DFCA94]"
            >
              <span>Enter Wedding Celebrations</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DFCA94]" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
