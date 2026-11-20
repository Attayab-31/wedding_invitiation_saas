'use client';

import React from 'react';
import { Wedding } from '@/types/database';
import { Heart, Sparkles } from 'lucide-react';

interface IntroductionSceneProps {
  wedding: Wedding;
  guestName: string;
}

export function IntroductionScene({ wedding, guestName }: IntroductionSceneProps) {
  return (
    <section
      id="introduction"
      className="relative min-h-[85vh] w-full flex items-center justify-center py-20 px-4 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFEB] to-[#FAF7F2]"
    >
      {/* Decorative Mughal Corner Flourishes */}
      <div className="max-w-3xl w-full mx-auto relative mughal-border luxury-card p-8 md:p-14 rounded-2xl text-center">
        
        {/* Bismillah Calligraphy */}
        <div className="mb-6">
          <p className="font-serif italic text-3xl md:text-4xl text-burgundy-gradient tracking-wide mb-1">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-semibold mt-1">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        {/* Quranic Verse */}
        <blockquote className="my-8 px-6 py-5 border-y-2 border-[#B88E3E]/30 bg-[#FAF7F2]/80 rounded-lg">
          <p className="font-serif italic text-base md:text-lg text-[#231713] leading-relaxed">
            &ldquo;And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.&rdquo;
          </p>
          <cite className="block text-xs uppercase tracking-widest text-[#8C6D3B] font-royal mt-2.5 not-italic font-semibold">
            — Surah Ar-Rum [30:21]
          </cite>
        </blockquote>

        {/* Host Names */}
        <div className="my-7">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-2">
            Together With Their Families
          </span>
          <p className="font-serif text-lg md:text-xl text-[#3A0715] font-semibold leading-relaxed max-w-xl mx-auto">
            {wedding.host_names}
          </p>
        </div>

        {/* Couple Title */}
        <div className="my-8 py-6 border-y border-[#B88E3E]/20 bg-gradient-to-r from-transparent via-[#F7F2E9] to-transparent">
          <p className="text-xs uppercase tracking-[0.25em] text-[#6B4E3D] font-royal mb-3">
            Request the honor of your presence and prayers to celebrate the union of
          </p>
          <h2 className="text-3xl md:text-5xl font-royal font-bold text-burgundy-gradient mb-2">
            {wedding.bride_name}
          </h2>
          <span className="font-script-luxury text-3xl md:text-4xl text-[#B88E3E] block my-1">
            &amp;
          </span>
          <h2 className="text-3xl md:text-5xl font-royal font-bold text-burgundy-gradient">
            {wedding.groom_name}
          </h2>
        </div>

        {/* Guest Personalized Callout */}
        <div className="mt-8 pt-4">
          <span className="text-xs uppercase tracking-widest text-[#8C6D3B] font-royal font-semibold">
            Cordially Invited
          </span>
          <p className="text-2xl md:text-3xl font-serif font-bold text-[#3A0715] mt-1">
            {guestName}
          </p>
          <p className="text-xs text-[#6B4E3D] font-serif italic mt-2 max-w-md mx-auto">
            Your esteemed presence and warm blessings are our greatest joy as we commence this sacred journey.
          </p>
        </div>
      </div>
    </section>
  );
}
