'use client';

import React, { useState, useEffect } from 'react';
import { Wedding } from '@/types/database';
import { Heart } from 'lucide-react';

export function ClosingBlessings({
  wedding,
  compact = false,
}: {
  wedding: Wedding;
  compact?: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(`${wedding.wedding_date}T19:00:00+05:00`).getTime();

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
    <div className={`w-full max-w-2xl mx-auto stationery-card gold-corners ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-6 md:p-8'} rounded-2xl shadow-xl text-center flex flex-col justify-between ${compact ? 'max-h-[30dvh]' : 'max-h-[78dvh]'} overflow-hidden`}>
      {/* Celebration Countdown */}
      <div className="shrink-0">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-2 sm:mb-3">
          Celebration Countdown
        </span>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/25 flex flex-col items-center ${compact ? 'px-1.5 py-1' : 'p-2 sm:p-3'}`}
            >
              <span className={`${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl md:text-3xl'} font-royal font-bold text-burgundy-gradient`}>
                {item.value}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#8C6D3B] font-royal font-semibold mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sincere Family Blessing */}
      <div className={`${compact ? 'my-1' : 'my-2 sm:my-3'} shrink-0`}>
        <div className="inline-flex items-center justify-center text-[#B88E3E] mb-1">
          <Heart className="w-4 h-4 fill-[#B88E3E]" />
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-royal font-bold text-burgundy-gradient">
          We Await Your Gracious Presence
        </h3>

        {!compact && (
          <p className="font-serif italic text-xs sm:text-sm text-[#6B4E3D] max-w-md mx-auto mt-1 leading-relaxed">
            &ldquo;May our gathering be blessed with warmth, joyful memories, and your sincere prayers for our life ahead.&rdquo;
          </p>
        )}
      </div>

      {/* Family Signature */}
      <div className={`${compact ? 'pt-1' : 'pt-2'} border-t border-[#B88E3E]/20 shrink-0`}>
        <p className="text-[10px] uppercase tracking-widest text-[#8C6D3B] font-royal font-bold">
          With Warmest Regards,
          <span className="block text-sm sm:text-base text-[#3A0715] font-serif normal-case mt-0.5 font-bold">
            {wedding.host_names}
          </span>
        </p>
      </div>
    </div>
  );
}
