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
    <section className="relative py-24 px-4 bg-gradient-to-t from-[#191516] via-[#24050E] to-[#191516] text-center">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Countdown Card */}
        <div className="mughal-border p-8 rounded-xl bg-[#23050E]/80 backdrop-blur-md">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15A] font-royal font-semibold block mb-4">
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
                className="p-3 md:p-4 rounded-lg bg-[#3A0715]/60 border border-[#C5A15A]/30 flex flex-col items-center"
              >
                <span className="text-2xl md:text-4xl font-royal font-bold text-gold-gradient">
                  {item.value}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-[#E6D2A0]/70 font-royal mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Warm Message */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center gap-2 text-[#C5A15A]">
            <Sparkles className="w-4 h-4" />
            <Heart className="w-5 h-5 fill-[#C5A15A]" />
            <Sparkles className="w-4 h-4" />
          </div>

          <h3 className="text-2xl md:text-3xl font-royal font-bold text-gold-gradient">
            We Await Your Gracious Presence
          </h3>

          <p className="font-serif italic text-base md:text-lg text-[#F8F1E5]/80 max-w-xl mx-auto leading-relaxed">
            &ldquo;May our gathering be blessed with laughter, love, unforgettable memories, and your warm prayers for our future together.&rdquo;
          </p>

          <p className="text-xs uppercase tracking-widest text-[#C5A15A] font-royal pt-4">
            With Warm Regards &amp; Respect,
            <span className="block text-sm text-[#F8F1E5] font-serif normal-case mt-1 font-semibold">
              The Khan &amp; Raza Families
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
