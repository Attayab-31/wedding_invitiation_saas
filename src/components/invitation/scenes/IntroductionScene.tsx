'use client';

import React from 'react';
import { Wedding } from '@/types/database';
import { Sparkles } from 'lucide-react';

interface IntroductionSceneProps {
  wedding: Wedding;
  guestName: string;
}

export function IntroductionScene({ wedding, guestName }: IntroductionSceneProps) {
  return (
    <div className="invitation-intro-card relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-[#E1C47E]/75 bg-[#F9F4E8]/90 p-5 text-center shadow-[0_35px_90px_rgba(12,7,4,.45)] backdrop-blur-xl sm:p-8 md:p-11">
      <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[1.3rem] border border-[#B88E3E]/45" />
      <div aria-hidden="true" className="gold-light-sweep pointer-events-none absolute inset-2 overflow-hidden rounded-[1.3rem]" />

      <div className="relative">
        <div className="invitation-intro-blessing mb-4 sm:mb-5">
          <Sparkles aria-hidden="true" className="invitation-intro-sparkle mx-auto mb-2 h-4 w-4 text-[#B88E3E]" />
          <p className="font-serif italic text-2xl tracking-wide text-burgundy-gradient sm:text-3xl md:text-4xl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8C6D3B] sm:text-[10px] sm:tracking-[0.25em]">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        <blockquote className="invitation-intro-verse my-4 rounded-lg border-y border-[#B88E3E]/35 bg-[#FFFDF9]/70 px-4 py-3 sm:my-5 sm:px-6 sm:py-4">
          <p className="font-serif text-xs italic leading-relaxed text-[#231713] sm:text-sm md:text-base">
            &ldquo;And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.&rdquo;
          </p>
          <cite className="mt-2 block text-[9px] font-semibold uppercase tracking-widest text-[#8C6D3B] not-italic sm:text-[10px]">
            — Surah Ar-Rum [30:21]
          </cite>
        </blockquote>

        <div className="invitation-intro-hosts my-4 sm:my-5">
          <span className="invitation-intro-host-label mb-1 block text-[9px] font-bold uppercase tracking-[0.22em] text-[#8C6D3B] sm:text-[10px]">
            Together With Their Families
          </span>
          <p className="mx-auto max-w-xl font-serif text-sm font-semibold leading-relaxed text-[#3A0715] sm:text-base">
            {wedding.host_names}
          </p>
        </div>

        <div className="invitation-intro-couple my-4 border-y border-[#B88E3E]/25 bg-gradient-to-r from-transparent via-[#EDE3CB]/75 to-transparent py-4 sm:my-5 sm:py-5">
          <p className="invitation-intro-couple-request mb-2 text-[9px] uppercase tracking-[0.16em] text-[#6B4E3D] sm:text-[10px] sm:tracking-[0.2em]">
            Request the honor of your presence and prayers to celebrate the union of
          </p>
          <h2 className="font-royal text-2xl font-bold text-burgundy-gradient sm:text-3xl md:text-4xl">
            {wedding.bride_name}
          </h2>
          <span className="invitation-intro-couple-separator my-0.5 block font-script-luxury text-3xl text-[#B88E3E] sm:text-4xl">
            &amp;
          </span>
          <h2 className="font-royal text-2xl font-bold text-burgundy-gradient sm:text-3xl md:text-4xl">
            {wedding.groom_name}
          </h2>
          <p className="invitation-intro-date mt-3 font-royal text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B4E3D]">
            {new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC',
            }).format(new Date(`${wedding.wedding_date}T12:00:00Z`))}
          </p>
        </div>

        <div className="invitation-intro-guest pt-1">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8C6D3B] sm:text-[10px]">
            Cordially Invited
          </span>
          <p className="invitation-intro-guest-name mt-0.5 font-serif text-lg font-bold text-[#3A0715] sm:text-xl">
            {guestName}
          </p>
          <p className="invitation-intro-guest-note mx-auto mt-1 max-w-md font-serif text-[11px] italic text-[#6B4E3D] sm:text-xs">
            Your esteemed presence and warm blessings are our greatest joy as we commence this sacred journey.
          </p>
        </div>
      </div>
    </div>
  );
}
