'use client';

import React, { useState } from 'react';
import { WeddingEvent } from '@/types/database';
import { CheckCircle2, XCircle, Heart, Users, Utensils, AlertCircle, Loader2 } from 'lucide-react';

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
    <div id="rsvp" className="w-full max-w-2xl mx-auto space-y-6 text-left">
      <div className="text-center mb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold">
          R.S.V.P.
        </span>
        <h2 className="text-3xl md:text-4xl font-royal font-bold text-burgundy-gradient mt-1">
          Attendance Confirmation
        </h2>
        <p className="text-sm font-serif italic text-[#6B4E3D] mt-1.5">
          Kindly confirm your presence for{' '}
          <span className="font-bold text-[#3A0715] not-italic">{guestName}</span>
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
            className="stationery-card gold-corners rounded-2xl p-7 md:p-9 shadow-lg relative"
          >
            {/* Event Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#B88E3E]/20 pb-4 mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8C6D3B] font-royal font-bold">
                  {event.event_type}
                </span>
                <h3 className="text-xl font-royal font-bold text-[#3A0715]">
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

              <span className="text-xs text-[#580F25] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#B88E3E]/30 font-medium">
                Up to {max} {max === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>

            {/* Attendance Choice Buttons */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-2">
                Will you be attending?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAttendanceChange(event.id, true)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-royal text-xs font-bold border transition-all cursor-pointer ${
                    state.attending
                      ? 'bg-[#580F25] border-[#DFCA94] text-white shadow-sm'
                      : 'bg-[#FAF7F2] border-[#B88E3E]/25 text-[#6B4E3D] hover:border-[#B88E3E]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${state.attending ? 'text-[#DFCA94]' : 'text-[#6B4E3D]/50'}`}
                  />
                  <span>Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAttendanceChange(event.id, false)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-royal text-xs font-bold border transition-all cursor-pointer ${
                    !state.attending
                      ? 'bg-[#3A0715] border-[#DFCA94] text-white shadow-sm'
                      : 'bg-[#FAF7F2] border-[#B88E3E]/25 text-[#6B4E3D] hover:border-[#B88E3E]'
                  }`}
                >
                  <XCircle
                    className={`w-3.5 h-3.5 ${!state.attending ? 'text-[#DFCA94]' : 'text-[#6B4E3D]/50'}`}
                  />
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* Headcount selector */}
            {state.attending && (
              <div className="mb-5 animate-fadeIn">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
                    Number of Attendees
                  </label>
                  <span className="text-xs text-[#6B4E3D]">
                    Allocated Limit: {max}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#B88E3E]/30 rounded-xl bg-[#FAF7F2] p-1">
                    <button
                      type="button"
                      disabled={state.headcount <= 1}
                      onClick={() => handleHeadcountChange(event.id, state.headcount - 1, max)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold text-[#580F25] hover:bg-[#F3ECE0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      –
                    </button>
                    <span className="w-10 text-center font-royal font-bold text-base text-[#3A0715]">
                      {state.headcount}
                    </span>
                    <button
                      type="button"
                      disabled={state.headcount >= max}
                      onClick={() => handleHeadcountChange(event.id, state.headcount + 1, max)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold text-[#580F25] hover:bg-[#F3ECE0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
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

            {/* Dietary */}
            {state.attending && (
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-1">
                  Dietary Preferences / Special Assistance (Optional)
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
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/25 text-xs text-[#231713] placeholder-[#231713]/40 focus:outline-none focus:border-[#B88E3E]"
                />
              </div>
            )}

            {/* Congratulatory Message */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-1">
                Blessings &amp; Message for the Couple (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share your prayers and heartfelt congratulations..."
                value={state.message}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], message: e.target.value, status: 'idle' },
                  }))
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#B88E3E]/25 text-xs text-[#231713] placeholder-[#231713]/40 focus:outline-none focus:border-[#B88E3E] resize-none"
              />
            </div>

            {/* Error */}
            {state.status === 'error' && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{state.errorMessage}</span>
              </div>
            )}

            {/* Success */}
            {state.status === 'success' && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {state.attending
                    ? `RSVP confirmed for ${state.headcount} ${state.headcount === 1 ? 'attendee' : 'attendees'}. Thank you!`
                    : 'Regrets recorded with gratitude. Your prayers are cherished.'}
                </span>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={state.status === 'submitting'}
                onClick={() => handleSubmit(event.id, max)}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#580F25] hover:bg-[#43091A] text-[#FAF7F2] font-royal font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50 border border-[#DFCA94]"
              >
                {state.status === 'submitting' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DFCA94]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{state.status === 'success' ? 'Update Response' : 'Submit RSVP'}</span>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
