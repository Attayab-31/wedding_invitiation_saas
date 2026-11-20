'use client';

import React from 'react';
import { CheckCircle2, TicketCheck, Users } from 'lucide-react';
import { RSVPConfirmation } from './scenes/RSVPForm';

interface ConfirmedVipPassProps {
  guestName: string;
  coupleNames: string;
  confirmations: RSVPConfirmation[];
}

export function ConfirmedVipPass({
  guestName,
  coupleNames,
  confirmations,
}: ConfirmedVipPassProps) {
  return (
    <article
      aria-labelledby="vip-pass-title"
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-[#E3C778]/75 bg-[#FCF6E8] text-[#2B2018] shadow-[0_35px_100px_rgba(0,0,0,.5)]"
    >
      <div aria-hidden="true" className="absolute inset-2 rounded-[1.35rem] border border-dashed border-[#B88E3E]/55" />
      <div className="relative border-b border-dashed border-[#B88E3E]/40 px-6 pb-5 pt-7 text-center sm:px-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#B88E3E]/50 bg-[#F3E6C7] text-[#7D5822]">
          <TicketCheck aria-hidden="true" className="h-6 w-6" />
        </div>
        <p className="font-royal text-[9px] font-bold uppercase tracking-[0.3em] text-[#8C6D3B]">
          Personally Prepared For
        </p>
        <h2 id="vip-pass-title" className="mt-1 font-serif text-2xl font-bold text-[#3A0715] sm:text-3xl">
          {guestName}
        </h2>
        <p className="mt-1 font-script-luxury text-2xl text-[#A77C36]">{coupleNames}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1F6247] px-3 py-1 font-royal text-[9px] font-bold uppercase tracking-[0.16em] text-white">
          <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
          Response Confirmed
        </span>
      </div>

      <div className="relative space-y-3 px-6 py-5 sm:px-8">
        {confirmations.map((confirmation) => (
          <div
            key={confirmation.eventId}
            className="flex items-start justify-between gap-4 border-b border-[#B88E3E]/20 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <h3 className="font-royal text-xs font-bold text-[#3A0715] sm:text-sm">
                {confirmation.title}
              </h3>
              <p className="mt-1 font-serif text-xs text-[#6B4E3D]">
                {confirmation.attending ? 'Joyfully attending' : 'Regrets received with gratitude'}
              </p>
              {confirmation.dietaryNotes && (
                <p className="mt-1 font-serif text-[10px] italic text-[#6B4E3D]">
                  Dietary note: {confirmation.dietaryNotes}
                </p>
              )}
            </div>
            {confirmation.attending && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F3E6C7] px-2.5 py-1 font-royal text-[10px] font-bold text-[#6C4B20]">
                <Users aria-hidden="true" className="h-3 w-3" />
                {confirmation.headcount}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center justify-between border-t border-[#B88E3E]/30 bg-[#F3E6C7]/65 px-6 py-3 font-royal text-[9px] uppercase tracking-[0.18em] text-[#8C6D3B] sm:px-8">
        <span>Royal Courtyard Celebration</span>
        <span>With gratitude</span>
      </div>
    </article>
  );
}
