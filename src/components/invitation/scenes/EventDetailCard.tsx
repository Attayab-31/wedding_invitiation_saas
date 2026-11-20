'use client';

import React from 'react';
import { WeddingEvent } from '@/types/database';
import { Calendar, Clock, MapPin, Sparkles, Navigation, Users } from 'lucide-react';

interface EventDetailCardProps {
  event: WeddingEvent & { guest_max_attendees?: number };
  index: number;
}

export function EventDetailCard({ event, index }: EventDetailCardProps) {
  const isMehndi = event.event_type === 'mehndi';
  const isBarat = event.event_type === 'barat';
  const isWalima = event.event_type === 'walima';

  // Format event date nicely
  const formattedDate = new Date(event.event_date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Distinct luxury styling per Pakistani wedding event type
  const themeStyles = isMehndi
    ? {
        border: 'border-[#D97706]/50',
        bg: 'bg-gradient-to-b from-[#2B1704]/90 via-[#1C1004]/90 to-[#191516]/95',
        accentText: 'text-[#F59E0B]',
        tagBg: 'bg-[#D97706]/20 border-[#D97706]/40 text-[#FBBF24]',
        button: 'bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E]',
        badgeTitle: 'MAYUN & MEHNDI RUNG',
      }
    : isBarat
    ? {
        border: 'border-[#C5A15A]/60',
        bg: 'bg-gradient-to-b from-[#3A0715]/90 via-[#25040D]/90 to-[#191516]/95',
        accentText: 'text-gold-gradient',
        tagBg: 'bg-[#580F25]/40 border-[#C5A15A]/40 text-[#E6D2A0]',
        button: 'bg-gradient-to-r from-[#580F25] to-[#3A0715] border border-[#C5A15A] hover:bg-[#580F25]',
        badgeTitle: 'THE ROYAL BARAT CEREMONY',
      }
    : {
        border: 'border-[#E6D2A0]/50',
        bg: 'bg-gradient-to-b from-[#221B18]/90 via-[#171413]/90 to-[#191516]/95',
        accentText: 'text-gold-light',
        tagBg: 'bg-[#C5A15A]/15 border-[#E6D2A0]/30 text-[#E6D2A0]',
        button: 'bg-gradient-to-r from-[#C5A15A] to-[#8C6D3B] hover:from-[#8C6D3B] hover:to-[#6B4F35]',
        badgeTitle: 'THE WALIMA RECEPTION',
      };

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto rounded-xl p-6 md:p-10 border ${themeStyles.border} ${themeStyles.bg} backdrop-blur-md shadow-2xl transition-all duration-500 hover:shadow-[0_0_35px_rgba(197,161,90,0.2)]`}
    >
      {/* Decorative corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5A15A]" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C5A15A]" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C5A15A]" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5A15A]" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-royal font-semibold uppercase tracking-widest border ${themeStyles.tagBg}`}
        >
          <Sparkles className="w-3 h-3" />
          {themeStyles.badgeTitle}
        </span>

        {event.guest_max_attendees && (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#E6D2A0] bg-[#191516]/80 px-3 py-1 rounded-full border border-[#C5A15A]/30">
            <Users className="w-3.5 h-3.5 text-[#C5A15A]" />
            Invited for up to {event.guest_max_attendees} {event.guest_max_attendees === 1 ? 'Guest' : 'Guests'}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`text-2xl md:text-4xl font-royal font-bold ${themeStyles.accentText} mb-3`}>
        {event.title}
      </h3>

      {/* Description */}
      {event.description && (
        <p className="text-sm md:text-base font-serif italic text-[#F8F1E5]/80 mb-6 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* Function Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-[#C5A15A]/20 my-6">
        {/* Date */}
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#C5A15A] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#C5A15A]/80 font-royal">
              Date
            </span>
            <span className="text-sm md:text-base text-[#F8F1E5] font-serif font-medium">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#C5A15A] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#C5A15A]/80 font-royal">
              Time
            </span>
            <span className="text-sm md:text-base text-[#F8F1E5] font-serif font-medium">
              {event.start_time} {event.end_time ? `– ${event.end_time}` : ''}
            </span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-3 md:col-span-2">
          <MapPin className="w-5 h-5 text-[#C5A15A] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#C5A15A]/80 font-royal">
              Venue
            </span>
            <span className="text-sm md:text-base text-[#F8F1E5] font-serif font-medium block">
              {event.venue_name}
            </span>
            <span className="text-xs text-[#E6D2A0]/70 block mt-0.5">
              {event.venue_address}
            </span>
          </div>
        </div>

        {/* Dress Code */}
        {event.dress_code && (
          <div className="md:col-span-2 pt-2">
            <span className="block text-[11px] uppercase tracking-wider text-[#C5A15A]/80 font-royal mb-1">
              Dress Code
            </span>
            <span className="text-xs md:text-sm text-[#F8F1E5] font-serif italic bg-[#191516]/60 px-3 py-1.5 rounded border border-[#C5A15A]/20 inline-block">
              {event.dress_code}
            </span>
          </div>
        )}
      </div>

      {/* Action: Google Maps Button */}
      {event.google_maps_url && (
        <div className="pt-2 flex justify-end">
          <a
            href={event.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-royal font-semibold text-[#F8F1E5] shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 ${themeStyles.button}`}
          >
            <Navigation className="w-4 h-4 text-[#E6D2A0]" />
            <span>Get Venue Directions</span>
          </a>
        </div>
      )}
    </div>
  );
}
