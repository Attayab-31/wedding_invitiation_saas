'use client';

import React, { useState } from 'react';
import { WeddingEvent } from '@/types/database';
import { CheckCircle2, XCircle, Heart, Users, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

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
  // Store form state per event
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
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15A] font-royal font-semibold">
          RSVP &amp; Blessings
        </span>
        <h2 className="text-3xl md:text-4xl font-royal font-bold text-gold-gradient mt-2">
          Will You Grace Us With Your Presence?
        </h2>
        <p className="text-sm font-serif italic text-[#E6D2A0]/80 mt-2 max-w-lg mx-auto">
          Please confirm your attendance for each wedding celebration below for{' '}
          <span className="font-semibold text-[#F8F1E5] not-italic">{guestName}</span>.
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
            className="mughal-border rounded-xl bg-[#23050E]/80 backdrop-blur-md p-6 md:p-8 shadow-xl"
          >
            {/* Event Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A15A]/30 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C5A15A] font-royal font-medium">
                  {event.event_type.toUpperCase()}
                </span>
                <h3 className="text-xl md:text-2xl font-royal font-bold text-[#F8F1E5]">
                  {event.title}
                </h3>
                <span className="text-xs text-[#E6D2A0]/70 font-serif italic">
                  {new Date(event.event_date + 'T12:00:00Z').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  • {event.venue_name}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#E6D2A0]/80 bg-[#3A0715] px-3 py-1 rounded-full border border-[#C5A15A]/30 inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C5A15A]" />
                  Max: {max} {max === 1 ? 'Person' : 'People'}
                </span>
              </div>
            </div>

            {/* Attendance Choice Buttons */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-2">
                Your Response
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAttendanceChange(event.id, true)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-royal text-sm font-semibold border transition-all cursor-pointer ${
                    state.attending
                      ? 'bg-gradient-to-r from-[#3A0715] to-[#580F25] border-[#C5A15A] text-[#F8F1E5] shadow-[0_0_15px_rgba(197,161,90,0.3)] ring-1 ring-[#C5A15A]'
                      : 'bg-[#191516]/50 border-white/10 text-white/60 hover:border-[#C5A15A]/40'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${state.attending ? 'text-[#C5A15A]' : 'text-white/40'}`}
                  />
                  <span>Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAttendanceChange(event.id, false)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-royal text-sm font-semibold border transition-all cursor-pointer ${
                    !state.attending
                      ? 'bg-[#3A0715] border-[#C5A15A] text-[#F8F1E5] ring-1 ring-[#C5A15A]'
                      : 'bg-[#191516]/50 border-white/10 text-white/60 hover:border-[#C5A15A]/40'
                  }`}
                >
                  <XCircle
                    className={`w-4 h-4 ${!state.attending ? 'text-[#C5A15A]' : 'text-white/40'}`}
                  />
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* Headcount selector (only visible if attending) */}
            {state.attending && (
              <div className="mb-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#C5A15A] font-royal">
                    Number of Attendees Attending
                  </label>
                  <span className="text-xs text-[#E6D2A0]/80">
                    (Allocated maximum: {max})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#C5A15A]/50 rounded-lg bg-[#191516]/60 p-1">
                    <button
                      type="button"
                      disabled={state.headcount <= 1}
                      onClick={() => handleHeadcountChange(event.id, state.headcount - 1, max)}
                      className="w-10 h-10 rounded flex items-center justify-center text-lg font-bold text-[#E6D2A0] hover:bg-[#3A0715] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      –
                    </button>
                    <span className="w-14 text-center font-royal font-bold text-lg text-[#F8F1E5]">
                      {state.headcount}
                    </span>
                    <button
                      type="button"
                      disabled={state.headcount >= max}
                      onClick={() => handleHeadcountChange(event.id, state.headcount + 1, max)}
                      className="w-10 h-10 rounded flex items-center justify-center text-lg font-bold text-[#E6D2A0] hover:bg-[#3A0715] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#E6D2A0]/70 font-serif italic">
                    {state.headcount === 1 ? '1 seat reserved' : `${state.headcount} seats reserved`}
                  </span>
                </div>
              </div>
            )}

            {/* Dietary or Special Requests */}
            {state.attending && (
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-1.5">
                  Dietary Preferences / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Nut Allergy, Wheelchair Access"
                  value={state.dietaryNotes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [event.id]: { ...prev[event.id], dietaryNotes: e.target.value, status: 'idle' },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#191516]/70 border border-[#C5A15A]/30 text-sm text-[#F8F1E5] placeholder-[#F8F1E5]/30 focus:outline-none focus:border-[#C5A15A] transition-colors"
                />
              </div>
            )}

            {/* Congratulatory Message / Du'a */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C5A15A]" />
                Blessings &amp; Message for the Couple (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Write a message of love and congratulations..."
                value={state.message}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], message: e.target.value, status: 'idle' },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg bg-[#191516]/70 border border-[#C5A15A]/30 text-sm text-[#F8F1E5] placeholder-[#F8F1E5]/30 focus:outline-none focus:border-[#C5A15A] transition-colors resize-none"
              />
            </div>

            {/* Error Message if any */}
            {state.status === 'error' && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{state.errorMessage}</span>
              </div>
            )}

            {/* Success Status Notice */}
            {state.status === 'success' && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {state.attending
                    ? `RSVP confirmed for ${state.headcount} ${state.headcount === 1 ? 'attendee' : 'attendees'}! Thank you.`
                    : 'Regrets recorded with gratitude. Your prayers are cherished.'}
                </span>
              </div>
            )}

            {/* Submit / Update Button */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={state.status === 'submitting'}
                onClick={() => handleSubmit(event.id, max)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#580F25] to-[#3A0715] border border-[#C5A15A] text-[#E6D2A0] font-royal font-semibold text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(197,161,90,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {state.status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C5A15A]" />
                    <span>Saving RSVP...</span>
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
