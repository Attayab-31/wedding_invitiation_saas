'use client';

import React, { useState, useEffect } from 'react';
import { Wedding } from '@/types/database';
import { Heart, RotateCcw } from 'lucide-react';

interface ClosingBlessingsProps {
  wedding: Wedding;
  onRevisitEnvelope?: () => void;
}

export function ClosingBlessings({ wedding, onRevisitEnvelope }: ClosingBlessingsProps) {
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
    <div className="w-full max-w-2xl mx-auto stationery-card gold-corners p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl text-center flex flex-col justify-between max-h-[78dvh] overflow-hidden">
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
              className="p-2 sm:p-3 rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/25 flex flex-col items-center"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-royal font-bold text-burgundy-gradient">
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
      <div className="my-2 sm:my-3 shrink-0">
        <div className="inline-flex items-center justify-center text-[#B88E3E] mb-1">
          <Heart className="w-4 h-4 fill-[#B88E3E]" />
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-royal font-bold text-burgundy-gradient">
          We Await Your Gracious Presence
        </h3>

        <p className="font-serif italic text-xs sm:text-sm text-[#6B4E3D] max-w-md mx-auto mt-1 leading-relaxed">
          &ldquo;May our gathering be blessed with warmth, joyful memories, and your sincere prayers for our life ahead.&rdquo;
        </p>
      </div>

      {/* Family Signature & Revisit Envelope Button */}
      <div className="pt-2 border-t border-[#B88E3E]/20 shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-[#8C6D3B] font-royal font-bold">
          With Warmest Regards,
          <span className="block text-sm sm:text-base text-[#3A0715] font-serif normal-case mt-0.5 font-bold">
            {wedding.host_names}
          </span>
        </p>

        {onRevisitEnvelope && (
          <div className="mt-3">
            <button
              onClick={onRevisitEnvelope}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#B88E3E]/40 text-[#580F25] text-xs font-royal font-bold hover:bg-[#F3ECE0] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revisit 3D Envelope</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
