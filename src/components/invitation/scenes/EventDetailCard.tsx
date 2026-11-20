'use client';

import React from 'react';
import { WeddingEvent } from '@/types/database';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';

interface EventDetailCardProps {
  event: WeddingEvent & { guest_max_attendees?: number };
  index: number;
}

export function EventDetailCard({ event }: EventDetailCardProps) {
  const isMehndi = event.event_type === 'mehndi';
  const isBarat = event.event_type === 'barat';

  const formattedDate = new Date(event.event_date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const headerTitle = isMehndi
    ? 'M E H N D I  R U N G'
    : isBarat
    ? 'T H E  R O Y A L  B A R A T'
    : 'T H E  W A L I M A';

  const accentColor = isMehndi
    ? 'text-[#B45309]'
    : isBarat
    ? 'text-burgundy-gradient'
    : 'text-burgundy-gradient';

  const buttonStyle = isMehndi
    ? 'bg-[#B45309] hover:bg-[#92400E] text-white'
    : isBarat
    ? 'bg-[#580F25] hover:bg-[#43091A] text-white'
    : 'bg-[#6B4E3D] hover:bg-[#523B2D] text-white';

  return (
    <div
      id={`event-${event.event_type}`}
      className="relative w-full max-w-2xl mx-auto rounded-2xl p-4 sm:p-6 md:p-8 stationery-card gold-corners shadow-xl text-left flex flex-col justify-between max-h-[78dvh] overflow-hidden"
    >
      {/* Top Ceremony Header */}
      <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[#B88E3E]/25 shrink-0">
        <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#8C6D3B] font-royal font-bold">
          {headerTitle}
        </span>

        {event.guest_max_attendees && (
          <span className="text-xs text-[#580F25] font-serif italic bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/25">
            Invited for up to {event.guest_max_attendees} {event.guest_max_attendees === 1 ? 'Guest' : 'Guests'}
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div className="my-1.5 sm:my-2 shrink-0">
        <h3 className={`text-xl sm:text-2xl md:text-3xl font-royal font-bold ${accentColor} mb-1`}>
          {event.title}
        </h3>
        {event.description && (
          <p className="text-xs sm:text-sm font-serif italic text-[#6B4E3D] line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      {/* Function Details Grid: Scaled to fit gracefully */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 py-2 sm:py-3 border-y border-[#B88E3E]/20 my-1 sm:my-2 flex-1 min-h-0">
        {/* Date */}
        <div className="flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
              Date
            </span>
            <span className="text-xs sm:text-sm text-[#231713] font-serif font-semibold">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
              Time
            </span>
            <span className="text-xs sm:text-sm text-[#231713] font-serif font-semibold">
              {event.start_time} {event.end_time ? `– ${event.end_time}` : ''}
            </span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-2.5 sm:col-span-2">
          <MapPin className="w-4 h-4 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
              Venue
            </span>
            <span className="text-xs sm:text-sm text-[#3A0715] font-serif font-bold block">
              {event.venue_name}
            </span>
            <span className="text-[11px] sm:text-xs text-[#6B4E3D] block">
              {event.venue_address}
            </span>
          </div>
        </div>

        {/* Dress Code */}
        {event.dress_code && (
          <div className="sm:col-span-2 pt-0.5">
            <span className="block text-[9px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-0.5">
              Dress Code
            </span>
            <span className="text-[11px] sm:text-xs text-[#3A0715] font-serif italic bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#B88E3E]/20 inline-block">
              {event.dress_code}
            </span>
          </div>
        )}
      </div>

      {/* Action Row */}
      {event.google_maps_url && (
        <div className="pt-2 flex justify-end shrink-0">
          <a
            href={event.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-royal font-bold tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 ${buttonStyle}`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Directions</span>
          </a>
        </div>
      )}
    </div>
  );
}
