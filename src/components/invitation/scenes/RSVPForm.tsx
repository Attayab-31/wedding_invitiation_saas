'use client';

import React, { useState } from 'react';
import { WeddingEvent } from '@/types/database';
import { CheckCircle2, XCircle, Heart, Users, Utensils, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface RSVPFormProps {
  token: string;
  guestName: string;
  events: Array<
    WeddingEvent & {
      guest_max_attendees?: number;
      existing_rsvp?: {
        attending: boolean;
        headcount: number;
        dietary_notes: string | null;
        message: string | null;
      } | null;
    }
  >;
}

export function RSVPForm({ token, guestName, events }: RSVPFormProps) {
  const [formData, setFormData] = useState<
    Record<
      string,
      {
        attending: boolean;
        headcount: number;
        dietaryNotes: string;
        message: string;
        status: 'idle' | 'submitting' | 'success' | 'error';
        errorMessage?: string;
      }
    >
  >(() => {
    const initial: Record<string, any> = {};
    events.forEach((evt) => {
      const existing = evt.existing_rsvp;
      initial[evt.id] = {
        attending: existing ? existing.attending : true,
        headcount: existing ? existing.headcount : Math.min(1, evt.guest_max_attendees || 1),
        dietaryNotes: existing?.dietary_notes || '',
        message: existing?.message || '',
        status: existing ? 'success' : 'idle',
      };
    });
    return initial;
  });

  const handleAttendanceChange = (eventId: string, attending: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        attending,
        status: 'idle',
      },
    }));
  };

  const handleHeadcountChange = (eventId: string, count: number, max: number) => {
    const clamped = Math.max(1, Math.min(max, count));
    setFormData((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        headcount: clamped,
        status: 'idle',
      },
    }));
  };

  const handleSubmit = async (eventId: string, maxAttendees: number) => {
    const current = formData[eventId];
    setFormData((prev) => ({
      ...prev,
      [eventId]: { ...prev[eventId], status: 'submitting', errorMessage: undefined },
    }));

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          eventId,
          attending: current.attending,
          headcount: current.attending ? current.headcount : 0,
          dietaryNotes: current.dietaryNotes,
          message: current.message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormData((prev) => ({
          ...prev,
          [eventId]: {
            ...prev[eventId],
            status: 'error',
            errorMessage: data.error || 'Failed to submit RSVP.',
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [eventId]: {
            ...prev[eventId],
            status: 'success',
          },
        }));
      }
    } catch {
      setFormData((prev) => ({
        ...prev,
        [eventId]: {
          ...prev[eventId],
          status: 'error',
          errorMessage: 'Network error. Please try again.',
        },
      }));
    }
  };

  return (
    <div id="rsvp" className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold">
          RSVP &amp; Blessings
        </span>
        <h2 className="text-3xl md:text-5xl font-royal font-bold text-burgundy-gradient mt-2">
          Will You Grace Us With Your Presence?
        </h2>
        <p className="text-sm md:text-base font-serif italic text-[#6B4E3D] mt-2 max-w-lg mx-auto">
          Please confirm your attendance for each ceremony below for{' '}
          <span className="font-bold text-[#3A0715] not-italic">{guestName}</span>.
        </p>
      </div>

      {events.map((event) => {
        const state = formData[event.id] || {
          attending: true,
          headcount: 1,
          dietaryNotes: '',
          message: '',
          status: 'idle',
        };
        const max = event.guest_max_attendees || 1;

        return (
          <div
            key={event.id}
            className="mughal-border luxury-card rounded-2xl p-7 md:p-9 shadow-xl relative"
          >
            {/* Event Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#B88E3E]/20 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8C6D3B] font-royal font-bold">
                  {event.event_type}
                </span>
                <h3 className="text-xl md:text-2xl font-royal font-bold text-[#3A0715]">
                  {event.title}
                </h3>
                <span className="text-xs text-[#6B4E3D] font-serif italic">
                  {new Date(event.event_date + 'T12:00:00Z').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  • {event.venue_name}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#580F25] bg-[#FAF7F2] px-3.5 py-1 rounded-full border border-[#B88E3E]/30 inline-flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-[#B88E3E]" />
                  Max: {max} {max === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
            </div>

            {/* Attendance Choice Buttons */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-2">
                Your Response
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAttendanceChange(event.id, true)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-royal text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                    state.attending
                      ? 'bg-gradient-to-r from-[#580F25] to-[#3A0715] border-[#DFCA94] text-white shadow-md ring-2 ring-[#B88E3E]/40'
                      : 'bg-[#FAF7F2] border-[#B88E3E]/30 text-[#6B4E3D] hover:border-[#B88E3E]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${state.attending ? 'text-[#DFCA94]' : 'text-[#6B4E3D]/50'}`}
                  />
                  <span>Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAttendanceChange(event.id, false)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-royal text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                    !state.attending
                      ? 'bg-[#3A0715] border-[#DFCA94] text-white ring-2 ring-[#B88E3E]/40'
                      : 'bg-[#FAF7F2] border-[#B88E3E]/30 text-[#6B4E3D] hover:border-[#B88E3E]'
                  }`}
                >
                  <XCircle
                    className={`w-4 h-4 ${!state.attending ? 'text-[#DFCA94]' : 'text-[#6B4E3D]/50'}`}
                  />
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* Headcount selector (only visible if attending) */}
            {state.attending && (
              <div className="mb-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
                    Number of Guests Attending
                  </label>
                  <span className="text-xs text-[#6B4E3D]">
                    (Maximum assigned: {max})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#B88E3E]/40 rounded-xl bg-[#FAF7F2] p-1">
                    <button
                      type="button"
                      disabled={state.headcount <= 1}
                      onClick={() => handleHeadcountChange(event.id, state.headcount - 1, max)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-[#580F25] hover:bg-[#F3ECE0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      –
                    </button>
                    <span className="w-14 text-center font-royal font-bold text-lg text-[#3A0715]">
                      {state.headcount}
                    </span>
                    <button
                      type="button"
                      disabled={state.headcount >= max}
                      onClick={() => handleHeadcountChange(event.id, state.headcount + 1, max)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-[#580F25] hover:bg-[#F3ECE0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#6B4E3D] font-serif italic">
                    {state.headcount === 1 ? '1 seat reserved' : `${state.headcount} seats reserved`}
                  </span>
                </div>
              </div>
            )}

            {/* Dietary or Special Requests */}
            {state.attending && (
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-1.5 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#B88E3E]" />
                  Dietary Preferences / Special Assistance (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Nut Allergy, Senior Wheelchair Access"
                  value={state.dietaryNotes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [event.id]: { ...prev[event.id], dietaryNotes: e.target.value, status: 'idle' },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/30 text-xs md:text-sm text-[#231713] placeholder-[#231713]/40 focus:outline-none focus:border-[#B88E3E] transition-colors"
                />
              </div>
            )}

            {/* Congratulatory Message / Du'a */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#B88E3E]" />
                Blessings &amp; Congratulations for the Couple (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share your prayers and heartfelt wishes..."
                value={state.message}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], message: e.target.value, status: 'idle' },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/30 text-xs md:text-sm text-[#231713] placeholder-[#231713]/40 focus:outline-none focus:border-[#B88E3E] transition-colors resize-none"
              />
            </div>

            {/* Error Notice */}
            {state.status === 'error' && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{state.errorMessage}</span>
              </div>
            )}

            {/* Success Notice */}
            {state.status === 'success' && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  {state.attending
                    ? `RSVP confirmed for ${state.headcount} ${state.headcount === 1 ? 'attendee' : 'attendees'}! We look forward to celebrating together.`
                    : 'Regrets recorded with sincere appreciation. Your prayers remain cherished.'}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={state.status === 'submitting'}
                onClick={() => handleSubmit(event.id, max)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#580F25] to-[#3A0715] text-[#FAF7F2] font-royal font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95 border border-[#DFCA94]"
              >
                {state.status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#DFCA94]" />
                    <span>Saving Response...</span>
                  </>
                ) : (
                  <span>{state.status === 'success' ? 'Update Response' : 'Confirm RSVP'}</span>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
