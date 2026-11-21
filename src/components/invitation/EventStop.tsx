'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Clock3, MapPin, Sparkles, X } from 'lucide-react';
import { ResolvedGuestExperience } from '@/types/database';
import { AudioControl } from './AudioControl';
import { EventDetailCard } from './scenes/EventDetailCard';

type InvitationEvent = ResolvedGuestExperience['events'][number];

interface EventStopProps {
  event: InvitationEvent;
  index: number;
  onModalVisibilityChange: (isOpen: boolean) => void;
  isAudioMuted: boolean;
  audioUnavailable: boolean;
  onToggleAudio: () => void;
}

const eventAccents: Record<string, { border: string; label: string; halo: string }> = {
  mehndi: {
    border: 'border-[#E8B342]/60',
    label: 'text-[#F3C46D]',
    halo: 'from-[#D97706]/35',
  },
  barat: {
    border: 'border-[#C5A15A]/60',
    label: 'text-[#E8C68B]',
    halo: 'from-[#8F1D35]/40',
  },
  walima: {
    border: 'border-[#E7D7AC]/70',
    label: 'text-[#F3E9D1]',
    halo: 'from-[#7185AE]/35',
  },
  custom: {
    border: 'border-[#D6B775]/60',
    label: 'text-[#E4D2B0]',
    halo: 'from-[#75638B]/35',
  },
};

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

export function EventStop({
  event,
  index,
  onModalVisibilityChange,
  isAudioMuted,
  audioUnavailable,
  onToggleAudio,
}: EventStopProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const accent = eventAccents[event.event_type] ?? eventAccents.custom;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDialogOpen && !dialog.open) {
      dialog.showModal();
      onModalVisibilityChange(true);
    } else if (!isDialogOpen && dialog.open) {
      dialog.close();
      onModalVisibilityChange(false);
    }
  }, [isDialogOpen, onModalVisibilityChange]);

  const closeDialog = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setIsDialogOpen(false);
    onModalVisibilityChange(false);
  };

  return (
    <section
      data-scroll-stage
      aria-labelledby={`event-stop-title-${index}`}
      className="pointer-events-auto relative flex min-h-[100dvh] items-center justify-center px-4 py-16"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.halo} via-transparent to-[#080C16]/65`}
      />
      <div className={`relative z-10 w-full max-w-xl rounded-[1.75rem] border ${accent.border} bg-[#1D1716]/65 p-5 text-center text-[#F8F1E5] shadow-[0_30px_90px_rgba(0,0,0,.58)] ring-1 ring-white/5 backdrop-blur-md sm:p-8`}>
        <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${accent.border} bg-[#251A17]/85 shadow-[0_0_30px_rgba(211,174,103,.18)]`}>
          <Sparkles aria-hidden="true" className={`h-5 w-5 ${accent.label}`} />
        </div>
        <p className={`font-royal text-[10px] font-semibold uppercase tracking-[0.3em] ${accent.label}`}>
          Celebration {String(index + 1).padStart(2, '0')}
        </p>
        <h2
          id={`event-stop-title-${index}`}
          className="mt-2 font-royal text-2xl font-bold text-[#F6E9CC] sm:text-3xl md:text-4xl"
        >
          {event.title}
        </h2>
        {event.description && (
          <p className="mx-auto mt-3 max-w-xl font-serif text-sm italic leading-relaxed text-[#E4D9C6]/85 sm:text-base">
            {event.description}
          </p>
        )}

        <div className="mx-auto mt-6 grid max-w-lg gap-3 border-y border-[#D8B66D]/25 py-4 text-left sm:grid-cols-2">
          <p className="flex items-start gap-2 font-serif text-sm text-[#F0E7D8]">
            <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B66D]" />
            <span>
              <span className="block font-royal text-[9px] uppercase tracking-widest text-[#D8B66D]">Date</span>
              {formatEventDate(event.event_date)}
            </span>
          </p>
          <p className="flex items-start gap-2 font-serif text-sm text-[#F0E7D8]">
            <Clock3 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B66D]" />
            <span>
              <span className="block font-royal text-[9px] uppercase tracking-widest text-[#D8B66D]">Time</span>
              {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
            </span>
          </p>
          <p className="flex items-start gap-2 font-serif text-sm text-[#F0E7D8] sm:col-span-2">
            <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B66D]" />
            <span>
              <span className="block font-royal text-[9px] uppercase tracking-widest text-[#D8B66D]">Venue</span>
              {event.venue_name}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="mt-5 inline-flex items-center justify-center rounded-full border border-[#E1C47E]/75 bg-[#D4AD61] px-5 py-3 font-royal text-[10px] font-bold uppercase tracking-[0.16em] text-[#28180F] shadow-[0_8px_24px_rgba(0,0,0,.25)] transition hover:bg-[#F0D28B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4D887] sm:text-xs"
        >
          View Venue &amp; Dress Code
        </button>
      </div>

      <dialog
        ref={dialogRef}
        data-scroll-content
        aria-labelledby={`event-dialog-title-${index}`}
        onClose={() => {
          setIsDialogOpen(false);
          onModalVisibilityChange(false);
        }}
        onCancel={(eventCancel) => {
          eventCancel.preventDefault();
          closeDialog();
        }}
        onKeyDown={(keyboardEvent) => {
          if (keyboardEvent.key === 'Escape') {
            keyboardEvent.preventDefault();
            closeDialog();
          }
        }}
        onClick={(eventClick) => {
          if (eventClick.target === dialogRef.current) closeDialog();
        }}
        className="m-auto max-h-[92dvh] w-[min(94vw,48rem)] max-w-none overflow-y-auto rounded-3xl border border-[#D8B66D]/50 bg-[#160F0D]/95 p-3 text-[#231713] shadow-2xl backdrop:bg-[#0D0A08]/80 backdrop:backdrop-blur-sm sm:p-5"
      >
        <AudioControl
          isMuted={isAudioMuted}
          unavailable={audioUnavailable}
          onToggle={onToggleAudio}
        />
        <div className="mb-3 flex items-center justify-between gap-3 text-[#F8F1E5]">
          <div>
            <p className="font-royal text-[9px] uppercase tracking-[0.24em] text-[#D8B66D]">
              Your celebration details
            </p>
            <h3 id={`event-dialog-title-${index}`} className="mt-1 font-royal text-lg font-bold sm:text-xl">
              {event.title}
            </h3>
          </div>
          <button
            type="button"
            autoFocus
            onClick={closeDialog}
            aria-label="Close event details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8B66D]/40 text-[#F8F1E5] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4D887]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <EventDetailCard event={event} />
      </dialog>
    </section>
  );
}
