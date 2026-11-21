'use client';

import React from 'react';
import { WeddingEvent } from '@/types/database';
import { Calendar, CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';

interface EventDetailCardProps {
  event: WeddingEvent;
}

function parseLahoreTime(date: string, time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  const [year, month, day] = date.split('-').map(Number);
  if (!match || !year || !month || !day) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (minute > 59 || hour > (meridiem ? 12 : 23)) return null;
  if (meridiem) {
    hour %= 12;
    if (meridiem === 'PM') hour += 12;
  }

  return new Date(Date.UTC(year, month - 1, day, hour - 5, minute));
}

function getCalendarUrl(event: WeddingEvent) {
  const start = parseLahoreTime(event.event_date, event.start_time);
  if (!start) return null;

  const end = event.end_time
    ? parseLahoreTime(event.event_date, event.end_time)
    : new Date(start.getTime() + 60 * 60 * 1000);
  if (!end) return null;
  if (end <= start) end.setUTCDate(end.getUTCDate() + 1);

  const formatCalendarDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const details = [event.description, event.dress_code && `Dress code: ${event.dress_code}`]
    .filter(Boolean)
    .join('\n\n');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatCalendarDate(start)}/${formatCalendarDate(end)}`,
    details,
    location: `${event.venue_name}, ${event.venue_address}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function EventDetailCard({ event }: EventDetailCardProps) {
  const isMehndi = event.event_type === 'mehndi';
  const isBarat = event.event_type === 'barat';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${event.event_date}T12:00:00Z`));
  const calendarUrl = getCalendarUrl(event);

  const headerTitle = isMehndi
    ? 'M E H N D I  R U N G'
    : isBarat
    ? 'T H E  R O Y A L  B A R A T'
    : event.event_type === 'walima'
      ? 'T H E  W A L I M A'
      : event.title.toUpperCase();

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
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl p-4 sm:p-6 md:p-8 stationery-card gold-corners shadow-xl text-left flex flex-col justify-between max-h-[78dvh] overflow-hidden">
      {/* Top Ceremony Header */}
      <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[#B88E3E]/25 shrink-0">
        <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#8C6D3B] font-royal font-bold">
          {headerTitle}
        </span>
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
      {(calendarUrl || event.google_maps_url) && (
        <div className="pt-2 flex flex-wrap justify-end gap-2 shrink-0">
          {calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#B88E3E]/45 bg-[#FAF7F2] px-4 py-2 text-xs font-royal font-bold tracking-wider text-[#580F25] transition hover:bg-[#F3ECE0]"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              <span>Add to Calendar</span>
            </a>
          )}
          {event.google_maps_url && (
            <a
              href={event.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-royal font-bold tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 ${buttonStyle}`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open Directions</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
