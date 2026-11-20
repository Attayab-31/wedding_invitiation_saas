'use client';

import React from 'react';
import { WeddingEvent } from '@/types/database';
import { Calendar, Clock, MapPin, Navigation, Users } from 'lucide-react';

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
      className="relative w-full max-w-2xl mx-auto rounded-2xl p-8 md:p-11 stationery-card gold-corners shadow-xl text-left"
    >
      {/* Top Ceremony Header Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#B88E3E]/25">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#8C6D3B] font-royal font-bold">
          {headerTitle}
        </span>

        {event.guest_max_attendees && (
          <span className="text-xs text-[#580F25] font-serif italic">
            Invited for up to {event.guest_max_attendees} {event.guest_max_attendees === 1 ? 'Guest' : 'Guests'}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`text-2xl md:text-4xl font-royal font-bold ${accentColor} mb-2.5`}>
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
          <Calendar className="w-4 h-4 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
              Date
            </span>
            <span className="text-sm md:text-base text-[#231713] font-serif font-semibold">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
              Time
            </span>
            <span className="text-sm md:text-base text-[#231713] font-serif font-semibold">
              {event.start_time} {event.end_time ? `– ${event.end_time}` : ''}
            </span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-3 md:col-span-2">
          <MapPin className="w-4 h-4 text-[#B88E3E] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
              Venue
            </span>
            <span className="text-sm md:text-base text-[#3A0715] font-serif font-bold block">
              {event.venue_name}
            </span>
            <span className="text-xs text-[#6B4E3D] block mt-0.5">
              {event.venue_address}
            </span>
          </div>
        </div>

        {/* Dress Code */}
        {event.dress_code && (
          <div className="md:col-span-2 pt-1">
            <span className="block text-[10px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-1">
              Dress Code
            </span>
            <span className="text-xs md:text-sm text-[#3A0715] font-serif italic bg-[#FAF7F2] px-3.5 py-1.5 rounded-lg border border-[#B88E3E]/20 inline-block">
              {event.dress_code}
            </span>
          </div>
        )}
      </div>

      {/* Action: Google Maps Button */}
      {event.google_maps_url && (
        <div className="pt-1 flex justify-end">
          <a
            href={event.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-royal font-bold tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 ${buttonStyle}`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Directions</span>
          </a>
        </div>
      )}
    </div>
  );
}
