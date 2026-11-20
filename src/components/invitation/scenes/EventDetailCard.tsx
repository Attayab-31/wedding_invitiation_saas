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

  const formattedDate = new Date(event.event_date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Distinct Pakistani ceremony styling on luminous ivory stationery
  const themeStyles = isMehndi
    ? {
        cardBorder: 'border-[#D97706]/40',
        cardBg: 'bg-[#FFFDF9]',
        tagBg: 'bg-[#FEF3C7] border-[#F59E0B]/50 text-[#B45309]',
        headerTitle: 'MAYUN & MEHNDI RUNG',
        accentText: 'text-[#B45309]',
        dateBadge: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
        button: 'bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white',
      }
    : isBarat
    ? {
        cardBorder: 'border-[#B88E3E]/60',
        cardBg: 'bg-[#FFFDF9]',
        tagBg: 'bg-[#FDF2F4] border-[#580F25]/30 text-[#580F25]',
        headerTitle: 'THE ROYAL BARAT CEREMONY',
        accentText: 'text-burgundy-gradient',
        dateBadge: 'bg-[#FAF7F2] text-[#3A0715] border-[#B88E3E]/30',
        button: 'bg-gradient-to-r from-[#580F25] to-[#3A0715] hover:from-[#721531] hover:to-[#4A081A] text-white',
      }
    : {
        cardBorder: 'border-[#B88E3E]/40',
        cardBg: 'bg-[#FFFDF9]',
        tagBg: 'bg-[#FDFBF7] border-[#DFCA94] text-[#8C6D3B]',
        headerTitle: 'THE WALIMA RECEPTION',
        accentText: 'text-burgundy-gradient',
        dateBadge: 'bg-[#FAF7F2] text-[#6B4E3D] border-[#DFCA94]',
        button: 'bg-gradient-to-r from-[#8C6D3B] to-[#6B4E3D] hover:from-[#6B4E3D] hover:to-[#554030] text-white',
      };

  return (
    <div
      id={`event-${event.event_type}`}
      className={`relative w-full max-w-2xl mx-auto rounded-2xl p-7 md:p-10 border ${themeStyles.cardBorder} ${themeStyles.cardBg} luxury-card transition-all duration-500 hover:shadow-[0_15px_45px_rgba(58,7,21,0.12)]`}
    >
      {/* Mughal corner flourishes */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B88E3E]" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B88E3E]" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B88E3E]" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B88E3E]" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-royal font-bold uppercase tracking-widest border ${themeStyles.tagBg}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {themeStyles.headerTitle}
        </span>

        {event.guest_max_attendees && (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#580F25] bg-[#FAF7F2] px-3.5 py-1 rounded-full border border-[#B88E3E]/40 font-medium">
            <Users className="w-3.5 h-3.5 text-[#B88E3E]" />
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
        <p className="text-sm md:text-base font-serif italic text-[#6B4E3D] mb-6 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* Function Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5 border-y border-[#B88E3E]/20 my-6">
        {/* Date */}
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-semibold">
              Date
            </span>
            <span className="text-sm md:text-base text-[#231713] font-serif font-semibold">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-semibold">
              Time
            </span>
            <span className="text-sm md:text-base text-[#231713] font-serif font-semibold">
              {event.start_time} {event.end_time ? `– ${event.end_time}` : ''}
            </span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-3 md:col-span-2">
          <MapPin className="w-5 h-5 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-semibold">
              Venue
            </span>
            <span className="text-sm md:text-base text-[#3A0715] font-serif font-bold block">
              {event.venue_name}
            </span>
            <span className="text-xs text-[#6B4E3D] block mt-0.5 font-sans">
              {event.venue_address}
            </span>
          </div>
        </div>

        {/* Dress Code */}
        {event.dress_code && (
          <div className="md:col-span-2 pt-1">
            <span className="block text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-semibold mb-1">
              Dress Code Advice
            </span>
            <span className="text-xs md:text-sm text-[#3A0715] font-serif italic bg-[#FAF7F2] px-3.5 py-1.5 rounded-lg border border-[#B88E3E]/30 inline-block font-medium">
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
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-royal font-bold shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${themeStyles.button}`}
          >
            <Navigation className="w-4 h-4" />
            <span>Open Google Maps Directions</span>
          </a>
        </div>
      )}
    </div>
  );
}
