'use client';

import React from 'react';
import { Wedding } from '@/types/database';

interface IntroductionSceneProps {
  wedding: Wedding;
  guestName: string;
}

export function IntroductionScene({ wedding, guestName }: IntroductionSceneProps) {
  return (
    <section className="relative min-h-[85vh] w-full flex items-center justify-center py-20 px-4 bg-gradient-to-b from-[#191516] via-[#2A0610] to-[#191516]">
      {/* Decorative Mughal Corner Flourishes */}
      <div className="max-w-3xl w-full mx-auto relative mughal-border p-8 md:p-14 bg-[#23050E]/80 backdrop-blur-md rounded-lg shadow-2xl text-center">
        
        {/* Bismillah Calligraphy */}
        <div className="mb-6">
          <p className="font-serif italic text-2xl md:text-3xl text-gold-gradient tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs uppercase tracking-widest text-[#C5A15A]/70 font-royal mt-1">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        {/* Quranic Verse */}
        <blockquote className="my-8 px-4 py-3 border-y border-[#C5A15A]/30 bg-[#3A0715]/40">
          <p className="font-serif italic text-base md:text-lg text-[#F8F1E5] leading-relaxed">
            &ldquo;And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.&rdquo;
          </p>
          <cite className="block text-xs uppercase tracking-widest text-[#E6D2A0] font-royal mt-2 not-italic">
            — Surah Ar-Rum [30:21]
          </cite>
        </blockquote>

        {/* Host Names */}
        <div className="my-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C5A15A] font-royal mb-2">
            Together With Their Families
          </p>
          <p className="font-serif text-lg md:text-xl text-[#F8F1E5] font-medium leading-relaxed max-w-xl mx-auto">
            {wedding.host_names}
          </p>
        </div>

        {/* Couple Title */}
        <div className="my-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#E6D2A0]/80 font-royal mb-3">
            Request the honor of your presence to celebrate the union of
          </p>
          <h2 className="text-3xl md:text-5xl font-royal font-bold text-gold-gradient mb-2">
            {wedding.bride_name}
          </h2>
          <span className="font-script-luxury text-3xl md:text-4xl text-[#E6D2A0] block my-1">
            &amp;
          </span>
          <h2 className="text-3xl md:text-5xl font-royal font-bold text-gold-gradient">
            {wedding.groom_name}
          </h2>
        </div>

        {/* Guest Personalized Callout */}
        <div className="mt-8 pt-6 border-t border-[#C5A15A]/30">
          <p className="text-xs uppercase tracking-widest text-[#C5A15A] font-royal">
            Cordially Invited
          </p>
          <p className="text-xl md:text-2xl font-serif font-bold text-[#F8F1E5] mt-1">
            {guestName}
          </p>
          <p className="text-xs text-[#E6D2A0]/80 font-serif italic mt-2">
            Your esteemed presence and prayers are our greatest blessings as we begin this new journey.
          </p>
        </div>
      </div>
    </section>
  );
}
