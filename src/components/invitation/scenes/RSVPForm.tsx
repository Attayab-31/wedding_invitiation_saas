'use client';

import React, { useState } from 'react';
import { WeddingEvent } from '@/types/database';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
  Users,
  XCircle,
} from 'lucide-react';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

interface EventFormState {
  attending: boolean;
  headcount: number;
  dietaryNotes: string;
  message: string;
  status: SubmissionStatus;
  errorMessage?: string;
}

export interface RSVPConfirmation {
  eventId: string;
  title: string;
  attending: boolean;
  headcount: number;
  dietaryNotes: string;
  message: string;
}

interface RSVPFormProps {
  token: string;
  guestName: string;
  compact?: boolean;
  events: Array<
    WeddingEvent & {
      guest_max_attendees: number;
      existing_rsvp?: {
        attending: boolean;
        headcount: number;
        dietary_notes: string | null;
        message: string | null;
      } | null;
    }
  >;
  onConfirmation?: (confirmations: RSVPConfirmation[]) => void;
}

interface RSVPApiResponse {
  success: boolean;
  error?: string;
}

function isRSVPApiResponse(value: unknown): value is RSVPApiResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof value.success === 'boolean' &&
    (!('error' in value) || typeof value.error === 'string')
  );
}

async function submitRSVP(
  token: string,
  eventId: string,
  form: EventFormState
) {
  const response = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      eventId,
      attending: form.attending,
      headcount: form.attending ? form.headcount : 0,
      dietaryNotes: form.dietaryNotes,
      message: form.message,
    }),
  });
  const payload: unknown = await response.json();

  if (!isRSVPApiResponse(payload)) {
    throw new Error('The RSVP service returned an invalid response. Please try again.');
  }
  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Unable to save your RSVP. Please try again.');
  }
}

export function RSVPForm({
  token,
  guestName,
  events,
  onConfirmation,
  compact = false,
}: RSVPFormProps) {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isAcceptingAll, setIsAcceptingAll] = useState(false);
  const [formData, setFormData] = useState<Record<string, EventFormState>>(() => {
    const initial: Record<string, EventFormState> = {};
    for (const event of events) {
      const existing = event.existing_rsvp;
      initial[event.id] = {
        attending: existing?.attending ?? true,
        headcount: existing?.headcount ?? 1,
        dietaryNotes: existing?.dietary_notes ?? '',
        message: existing?.message ?? '',
        status: existing ? 'success' : 'idle',
      };
    }
    return initial;
  });

  const activeEvent = events[activeEventIndex];
  const currentFormState = activeEvent ? formData[activeEvent.id] : undefined;
  const maxAttendees = Math.max(1, activeEvent?.guest_max_attendees ?? 1);
  const allConfirmed =
    events.length > 0 && events.every((event) => formData[event.id]?.status === 'success');

  const updateEventForm = (eventId: string, update: Partial<EventFormState>) => {
    setFormData((previous) => ({
      ...previous,
      [eventId]: {
        ...previous[eventId],
        ...update,
        status: update.status ?? 'idle',
        errorMessage: update.status === 'error' ? update.errorMessage : undefined,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeEvent || !currentFormState || currentFormState.status === 'submitting') return;

    updateEventForm(activeEvent.id, { status: 'submitting' });
    try {
      await submitRSVP(token, activeEvent.id, currentFormState);
      updateEventForm(activeEvent.id, { status: 'success' });
      onConfirmation?.([{
        eventId: activeEvent.id,
        title: activeEvent.title,
        attending: currentFormState.attending,
        headcount: currentFormState.attending ? currentFormState.headcount : 0,
        dietaryNotes: currentFormState.dietaryNotes,
        message: currentFormState.message,
      }]);
    } catch (error) {
      updateEventForm(activeEvent.id, {
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Network error. Please try again.',
      });
    }
  };

  const handleAcceptAll = async () => {
    if (isAcceptingAll || events.length === 0) return;

    setIsAcceptingAll(true);
    const confirmations: RSVPConfirmation[] = [];
    let hasFailure = false;

    for (const event of events) {
      const current = formData[event.id];
      if (!current) continue;

      const accepted = {
        ...current,
        attending: true,
        headcount: Math.max(1, Math.min(current.headcount, event.guest_max_attendees)),
      };
      updateEventForm(event.id, { ...accepted, status: 'submitting' });

      try {
        await submitRSVP(token, event.id, accepted);
        updateEventForm(event.id, { ...accepted, status: 'success' });
        confirmations.push({
          eventId: event.id,
          title: event.title,
          attending: true,
          headcount: accepted.headcount,
          dietaryNotes: accepted.dietaryNotes,
          message: accepted.message,
        });
      } catch (error) {
        hasFailure = true;
        updateEventForm(event.id, {
          ...accepted,
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Network error. Please try again.',
        });
      }
    }

    setIsAcceptingAll(false);
    if (!hasFailure && confirmations.length === events.length) {
      onConfirmation?.(confirmations);
    }
  };

  if (!activeEvent || !currentFormState) {
    return (
      <div className="stationery-card gold-corners rounded-2xl p-6 text-center">
        <h3 className="font-royal text-lg font-bold text-[#3A0715]">No event RSVP is available</h3>
        <p className="mt-2 font-serif text-sm text-[#6B4E3D]">
          Please contact the wedding hosts for assistance with your invitation.
        </p>
      </div>
    );
  }

  return (
    <form
      id="rsvp-form"
      onSubmit={handleSubmit}
      className={`stationery-card gold-corners mx-auto flex ${compact ? 'max-h-[58dvh] md:max-h-[78dvh]' : 'max-h-[78dvh]'} w-full max-w-2xl flex-col overflow-y-auto rounded-2xl p-4 text-left shadow-xl sm:p-5 md:p-6`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#B88E3E]/25 pb-2 sm:pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C6D3B] sm:text-[11px]">
            R.S.V.P.
          </span>
          <h2 className="font-royal text-lg font-bold text-burgundy-gradient sm:text-xl">
            Attendance Confirmation
          </h2>
          <p className="mt-1 font-serif text-xs text-[#6B4E3D]">
            Guest of honor: <span className="font-semibold text-[#3A0715]">{guestName}</span>
          </p>
        </div>

        {events.length > 1 && !allConfirmed && (
          <button
            type="button"
            disabled={isAcceptingAll}
            onClick={handleAcceptAll}
            className="shrink-0 rounded-full border border-[#B88E3E]/40 bg-[#FAF7F2] px-3 py-1.5 font-royal text-[10px] font-bold text-[#580F25] transition hover:bg-[#F3ECE0] disabled:opacity-50 sm:text-[11px]"
          >
            {isAcceptingAll ? 'Saving…' : 'Accept All'}
          </button>
        )}
      </div>

      {events.length > 1 && (
        <div role="tablist" aria-label="Choose a wedding event" className="flex gap-2 overflow-x-auto py-3">
          {events.map((event, index) => {
            const isActive = activeEventIndex === index;
            const isSaved = formData[event.id]?.status === 'success';
            return (
              <button
                key={event.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveEventIndex(index)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-royal text-[10px] font-semibold transition sm:text-xs ${
                  isActive
                    ? 'bg-[#580F25] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#6B4E3D] hover:bg-[#F3ECE0]'
                }`}
              >
                {event.title}
                {isSaved && <Check aria-label="Saved" className="h-3 w-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      )}

      <div className="my-1 flex items-center justify-between gap-2 border-b border-[#B88E3E]/15 py-2">
        <span className="font-serif text-sm font-bold text-[#3A0715]">{activeEvent.title}</span>
        <span className="shrink-0 rounded-full border border-[#B88E3E]/20 bg-[#FAF7F2] px-2 py-1 font-serif text-[10px] italic text-[#580F25]">
          Up to {maxAttendees} {maxAttendees === 1 ? 'guest' : 'guests'}
        </span>
      </div>

      <fieldset className="my-2">
        <legend className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6D3B]">
          Will you be attending?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={currentFormState.attending}
            onClick={() => updateEventForm(activeEvent.id, {
              attending: true,
              headcount: Math.max(1, currentFormState.headcount),
            })}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 font-royal text-[10px] font-bold transition sm:text-xs ${
              currentFormState.attending
                ? 'border-[#DFCA94] bg-[#580F25] text-white'
                : 'border-[#B88E3E]/25 bg-[#FAF7F2] text-[#6B4E3D]'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Joyfully Accept
          </button>
          <button
            type="button"
            aria-pressed={!currentFormState.attending}
            onClick={() => updateEventForm(activeEvent.id, { attending: false })}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 font-royal text-[10px] font-bold transition sm:text-xs ${
              !currentFormState.attending
                ? 'border-[#DFCA94] bg-[#3A0715] text-white'
                : 'border-[#B88E3E]/25 bg-[#FAF7F2] text-[#6B4E3D]'
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            Regretfully Decline
          </button>
        </div>
      </fieldset>

      {currentFormState.attending && (
        <div className="my-1 flex items-center justify-between rounded-xl border border-[#B88E3E]/20 bg-[#FAF7F2] p-2.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6D3B]">
            <Users className="h-3.5 w-3.5" />
            Attendees
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-[#B88E3E]/30 bg-white p-0.5">
              <button
                type="button"
                aria-label="Remove one attendee"
                disabled={currentFormState.headcount <= 1}
                onClick={() => updateEventForm(activeEvent.id, { headcount: currentFormState.headcount - 1 })}
                className="flex h-7 w-7 items-center justify-center rounded font-bold text-[#580F25] disabled:opacity-30"
              >
                −
              </button>
              <span aria-live="polite" className="w-8 text-center font-royal text-sm font-bold text-[#3A0715]">
                {currentFormState.headcount}
              </span>
              <button
                type="button"
                aria-label="Add one attendee"
                disabled={currentFormState.headcount >= maxAttendees}
                onClick={() => updateEventForm(activeEvent.id, { headcount: currentFormState.headcount + 1 })}
                className="flex h-7 w-7 items-center justify-center rounded font-bold text-[#580F25] disabled:opacity-30"
              >
                +
              </button>
            </div>
            <span className="font-serif text-xs italic text-[#6B4E3D]">of {maxAttendees}</span>
          </div>
        </div>
      )}

      <div className="my-2 grid gap-2 sm:grid-cols-2">
        {currentFormState.attending && (
          <label className="block">
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-[#8C6D3B]">
              Dietary Notes (Optional)
            </span>
            <input
              type="text"
              maxLength={500}
              value={currentFormState.dietaryNotes}
              onChange={(event) => updateEventForm(activeEvent.id, { dietaryNotes: event.target.value })}
              placeholder="Vegetarian, nut allergy…"
              className="w-full rounded-lg border border-[#B88E3E]/25 bg-[#FAF7F2] px-3 py-2 text-xs text-[#231713] placeholder:text-[#231713]/40 focus:border-[#B88E3E] focus:outline-none focus:ring-2 focus:ring-[#B88E3E]/20"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-[#8C6D3B]">
            Blessings for the Couple (Optional)
          </span>
          <input
            type="text"
            maxLength={1000}
            value={currentFormState.message}
            onChange={(event) => updateEventForm(activeEvent.id, { message: event.target.value })}
            placeholder="Prayers and warm wishes…"
            className="w-full rounded-lg border border-[#B88E3E]/25 bg-[#FAF7F2] px-3 py-2 text-xs text-[#231713] placeholder:text-[#231713]/40 focus:border-[#B88E3E] focus:outline-none focus:ring-2 focus:ring-[#B88E3E]/20"
          />
        </label>
      </div>

      {currentFormState.status === 'error' && (
        <p role="alert" className="my-1 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-[11px] text-red-800">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {currentFormState.errorMessage}
        </p>
      )}
      {currentFormState.status === 'success' && (
        <p aria-live="polite" className="my-1 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-[11px] text-emerald-800">
          <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          Your response for this celebration has been saved.
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#B88E3E]/20 pt-3">
        <span className="font-serif text-[10px] italic text-[#8C6D3B]">
          A personal invitation for {guestName}
        </span>
        <button
          type="submit"
          disabled={currentFormState.status === 'submitting' || isAcceptingAll}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFCA94] bg-[#580F25] px-4 py-2 font-royal text-[10px] font-bold uppercase tracking-wider text-[#FAF7F2] shadow-sm transition hover:bg-[#43091A] disabled:cursor-not-allowed disabled:opacity-55 sm:text-xs"
        >
          {currentFormState.status === 'submitting' ? (
            <>
              <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
              Saving…
            </>
          ) : currentFormState.status === 'success' ? (
            'Update Response'
          ) : (
            'Save RSVP'
          )}
        </button>
      </div>
    </form>
  );
}
