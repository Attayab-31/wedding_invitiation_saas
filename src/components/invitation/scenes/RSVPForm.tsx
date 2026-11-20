'use client';

import React, { useState } from 'react';
import { WeddingEvent } from '@/types/database';
import { CheckCircle2, XCircle, Users, AlertCircle, Loader2, ChevronRight, Check } from 'lucide-react';

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
  onProceedNext?: () => void;
}

export function RSVPForm({ token, guestName, events, onProceedNext }: RSVPFormProps) {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isAcceptingAll, setIsAcceptingAll] = useState(false);

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

  const activeEvent = events[activeEventIndex] || events[0];
  const max = activeEvent?.guest_max_attendees || 1;
  const currentFormState = formData[activeEvent?.id] || {
    attending: true,
    headcount: 1,
    dietaryNotes: '',
    message: '',
    status: 'idle',
  };

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

  const handleHeadcountChange = (eventId: string, count: number, maxLimit: number) => {
    const clamped = Math.max(1, Math.min(maxLimit, count));
    setFormData((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        headcount: clamped,
        status: 'idle',
      },
    }));
  };

  const handleSubmit = async (eventId: string) => {
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

        // If there is another event, automatically suggest or switch
        if (activeEventIndex < events.length - 1) {
          setTimeout(() => {
            setActiveEventIndex((prevIdx) => Math.min(events.length - 1, prevIdx + 1));
          }, 800);
        }
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

  const handleAcceptAll = async () => {
    setIsAcceptingAll(true);
    for (const evt of events) {
      const maxLimit = evt.guest_max_attendees || 1;
      const count = formData[evt.id]?.headcount || maxLimit;
      try {
        await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            eventId: evt.id,
            attending: true,
            headcount: count,
            dietaryNotes: formData[evt.id]?.dietaryNotes || '',
            message: formData[evt.id]?.message || '',
          }),
        });
        setFormData((prev) => ({
          ...prev,
          [evt.id]: {
            ...prev[evt.id],
            attending: true,
            headcount: count,
            status: 'success',
          },
        }));
      } catch (err) {
        console.error('Accept all error for', evt.title, err);
      }
    }
    setIsAcceptingAll(false);
  };

  const allConfirmed = events.every((evt) => formData[evt.id]?.status === 'success');

  return (
    <div
      id="rsvp"
      className="w-full max-w-2xl mx-auto stationery-card gold-corners rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl text-left flex flex-col justify-between max-h-[78dvh] overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[#B88E3E]/25 shrink-0">
        <div>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold">
            R.S.V.P.
          </span>
          <h2 className="text-xl sm:text-2xl font-royal font-bold text-burgundy-gradient">
            Attendance Confirmation
          </h2>
        </div>

        {events.length > 1 && !allConfirmed && (
          <button
            type="button"
            disabled={isAcceptingAll}
            onClick={handleAcceptAll}
            className="text-[11px] font-royal font-bold text-[#580F25] hover:text-[#3A0715] bg-[#FAF7F2] hover:bg-[#F3ECE0] px-3 py-1 rounded-full border border-[#B88E3E]/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isAcceptingAll ? 'Accepting All...' : 'Joyfully Accept All'}
          </button>
        )}
      </div>

      {/* Event Segmented Tabs (For multiple ceremonies like Mehndi & Barat) */}
      {events.length > 1 && (
        <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto no-scrollbar shrink-0">
          {events.map((evt, idx) => {
            const isTabActive = activeEventIndex === idx;
            const isSaved = formData[evt.id]?.status === 'success';
            return (
              <button
                key={evt.id}
                type="button"
                onClick={() => setActiveEventIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-royal font-semibold transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-[#580F25] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#6B4E3D] hover:bg-[#F3ECE0]'
                }`}
              >
                <span>{evt.title}</span>
                {isSaved && <Check className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Event Card Body */}
      <div className="my-1 sm:my-2 flex-1 min-h-0 flex flex-col justify-between">
        {/* Event Sub-header */}
        <div className="flex items-center justify-between py-1 border-b border-[#B88E3E]/15">
          <span className="text-xs sm:text-sm font-serif font-bold text-[#3A0715]">
            {activeEvent.title}
          </span>
          <span className="text-[11px] text-[#580F25] font-serif italic bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#B88E3E]/20">
            Invited for up to {max} {max === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>

        {/* Attendance Toggle Buttons */}
        <div className="my-1.5 sm:my-2">
          <label className="block text-[10px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-1">
            Will you be attending?
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleAttendanceChange(activeEvent.id, true)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-royal text-xs font-bold border transition-all cursor-pointer ${
                currentFormState.attending
                  ? 'bg-[#580F25] border-[#DFCA94] text-white shadow-sm'
                  : 'bg-[#FAF7F2] border-[#B88E3E]/25 text-[#6B4E3D] hover:border-[#B88E3E]'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${currentFormState.attending ? 'text-[#DFCA94]' : 'text-[#6B4E3D]/50'}`}
              />
              <span>Joyfully Accept</span>
            </button>

            <button
              type="button"
              onClick={() => handleAttendanceChange(activeEvent.id, false)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-royal text-xs font-bold border transition-all cursor-pointer ${
                !currentFormState.attending
                  ? 'bg-[#3A0715] border-[#DFCA94] text-white shadow-sm'
                  : 'bg-[#FAF7F2] border-[#B88E3E]/25 text-[#6B4E3D] hover:border-[#B88E3E]'
              }`}
            >
              <XCircle
                className={`w-3.5 h-3.5 ${!currentFormState.attending ? 'text-[#DFCA94]' : 'text-[#6B4E3D]/50'}`}
              />
              <span>Regretfully Decline</span>
            </button>
          </div>
        </div>

        {/* Headcount selector (if attending) */}
        {currentFormState.attending && (
          <div className="my-1 sm:my-1.5 flex items-center justify-between bg-[#FAF7F2] p-2 rounded-xl border border-[#B88E3E]/20">
            <span className="text-[10px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold">
              Attendees
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-[#B88E3E]/30 rounded-lg bg-white p-0.5">
                <button
                  type="button"
                  disabled={currentFormState.headcount <= 1}
                  onClick={() => handleHeadcountChange(activeEvent.id, currentFormState.headcount - 1, max)}
                  className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold text-[#580F25] hover:bg-[#F3ECE0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  –
                </button>
                <span className="w-8 text-center font-royal font-bold text-sm text-[#3A0715]">
                  {currentFormState.headcount}
                </span>
                <button
                  type="button"
                  disabled={currentFormState.headcount >= max}
                  onClick={() => handleHeadcountChange(activeEvent.id, currentFormState.headcount + 1, max)}
                  className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold text-[#580F25] hover:bg-[#F3ECE0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#6B4E3D] font-serif italic">
                of max {max}
              </span>
            </div>
          </div>
        )}

        {/* Dietary & Message (Compact inputs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1">
          {currentFormState.attending && (
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-0.5">
                Dietary Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Vegetarian, Nut Allergy..."
                value={currentFormState.dietaryNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [activeEvent.id]: { ...prev[activeEvent.id], dietaryNotes: e.target.value, status: 'idle' },
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#B88E3E]/25 text-xs text-[#231713] placeholder-[#231713]/40 focus:outline-none focus:border-[#B88E3E]"
              />
            </div>
          )}

          <div className={currentFormState.attending ? '' : 'sm:col-span-2'}>
            <label className="block text-[9px] uppercase tracking-wider text-[#8C6D3B] font-royal font-bold mb-0.5">
              Blessings for Couple (Optional)
            </label>
            <input
              type="text"
              placeholder="Prayers and warm wishes..."
              value={currentFormState.message}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [activeEvent.id]: { ...prev[activeEvent.id], message: e.target.value, status: 'idle' },
                }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#B88E3E]/25 text-xs text-[#231713] placeholder-[#231713]/40 focus:outline-none focus:border-[#B88E3E]"
            />
          </div>
        </div>

        {/* Status Feedback */}
        {currentFormState.status === 'error' && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px] my-1">
            <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
            <span>{currentFormState.errorMessage}</span>
          </div>
        )}

        {currentFormState.status === 'success' && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] my-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {currentFormState.attending
                ? `RSVP confirmed for ${currentFormState.headcount} ${currentFormState.headcount === 1 ? 'attendee' : 'attendees'}. Thank you!`
                : 'Regrets recorded with gratitude. Your prayers are cherished.'}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-[#B88E3E]/20 flex items-center justify-between shrink-0">
        <span className="text-[11px] text-[#8C6D3B] font-serif italic">
          Bespoke invitation for {guestName}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentFormState.status === 'submitting'}
            onClick={() => handleSubmit(activeEvent.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#580F25] hover:bg-[#43091A] text-[#FAF7F2] font-royal font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50 border border-[#DFCA94]"
          >
            {currentFormState.status === 'submitting' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DFCA94]" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{currentFormState.status === 'success' ? 'Update Response' : 'Save RSVP'}</span>
            )}
          </button>

          {onProceedNext && (
            <button
              type="button"
              onClick={onProceedNext}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE0] text-[#580F25] font-royal font-bold text-xs border border-[#B88E3E]/30 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
