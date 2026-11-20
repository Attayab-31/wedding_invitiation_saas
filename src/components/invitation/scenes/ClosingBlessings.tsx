'use client';

import React, { useState, useEffect } from 'react';
import { Wedding } from '@/types/database';
import { Heart, Sparkles } from 'lucide-react';

export function ClosingBlessings({ wedding }: { wedding: Wedding }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(wedding.wedding_date + 'T19:00:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [wedding.wedding_date]);

  return (
    <section className="relative py-24 px-4 bg-gradient-to-t from-[#FAF7F2] via-[#F3ECE0] to-[#FAF7F2] text-center">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Countdown Card */}
        <div className="mughal-border luxury-card p-8 rounded-2xl shadow-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-4">
            Countdown to Celebrations
          </span>

          <div className="grid grid-cols-4 gap-3 md:gap-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 md:p-4 rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/30 shadow-inner flex flex-col items-center"
              >
                <span className="text-2xl md:text-4xl font-royal font-bold text-burgundy-gradient">
                  {item.value}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-[#8C6D3B] font-royal font-semibold mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Warm Message */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center gap-2 text-[#B88E3E]">
            <Sparkles className="w-4 h-4" />
            <Heart className="w-5 h-5 fill-[#B88E3E]" />
            <Sparkles className="w-4 h-4" />
          </div>

          <h3 className="text-2xl md:text-3xl font-royal font-bold text-burgundy-gradient">
            We Await Your Gracious Presence
          </h3>

          <p className="font-serif italic text-base md:text-lg text-[#6B4E3D] max-w-xl mx-auto leading-relaxed">
            &ldquo;May our gathering be blessed with warmth, laughter, cherished memories, and your sincere du&apos;as for our new beginning.&rdquo;
          </p>

          <p className="text-xs uppercase tracking-widest text-[#8C6D3B] font-royal pt-4 font-bold">
            With Sincere Regard &amp; Prayers,
            <span className="block text-base text-[#3A0715] font-serif normal-case mt-1 font-bold">
              The Khan &amp; Raza Families
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
