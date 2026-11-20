'use client';

import React, { useState, useEffect } from 'react';
import { Wedding } from '@/types/database';
import { Heart } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto space-y-8 text-center">
      {/* Countdown Card */}
      <div className="stationery-card gold-corners p-8 rounded-2xl shadow-xl">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-4">
          Celebration Countdown
        </span>

        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 md:p-4 rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/25 flex flex-col items-center"
            >
              <span className="text-2xl md:text-4xl font-royal font-bold text-burgundy-gradient">
                {item.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#8C6D3B] font-royal font-semibold mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sincere Family Blessing */}
      <div className="space-y-3 pt-2">
        <div className="inline-flex items-center justify-center text-[#B88E3E]">
          <Heart className="w-4 h-4 fill-[#B88E3E]" />
        </div>

        <h3 className="text-2xl md:text-3xl font-royal font-bold text-burgundy-gradient">
          We Await Your Gracious Presence
        </h3>

        <p className="font-serif italic text-sm md:text-base text-[#6B4E3D] max-w-lg mx-auto leading-relaxed">
          &ldquo;May our gathering be blessed with warmth, joyful memories, and your sincere prayers for our life ahead.&rdquo;
        </p>

        <p className="text-xs uppercase tracking-widest text-[#8C6D3B] font-royal pt-2 font-bold">
          With Warmest Regards,
          <span className="block text-base text-[#3A0715] font-serif normal-case mt-0.5 font-bold">
            The Khan &amp; Raza Families
          </span>
        </p>
      </div>
    </div>
  );
}
