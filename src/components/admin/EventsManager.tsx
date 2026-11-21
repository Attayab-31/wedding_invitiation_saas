'use client';

import { FormEvent, useState } from 'react';
import { Archive, CalendarDays, Clock3, MapPin, Pencil, Plus, Save, X } from 'lucide-react';
import { EventType, WeddingEvent } from '@/types/database';

type EventDraft = {
  event_type: EventType;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  venue_address: string;
  google_maps_url: string;
  dress_code: string;
  description: string;
  theme_color: string;
  is_active: boolean;
};

const EMPTY_DRAFT: EventDraft = {
  event_type: 'custom',
  title: '',
  event_date: '',
  start_time: '07:00 PM',
  end_time: '',
  venue_name: '',
  venue_address: '',
  google_maps_url: '',
  dress_code: '',
  description: '',
  theme_color: '#C5A15A',
  is_active: true,
};

function toDraft(event: WeddingEvent): EventDraft {
  return {
    event_type: event.event_type,
    title: event.title,
    event_date: event.event_date,
    start_time: event.start_time,
    end_time: event.end_time ?? '',
    venue_name: event.venue_name,
    venue_address: event.venue_address,
    google_maps_url: event.google_maps_url ?? '',
    dress_code: event.dress_code ?? '',
    description: event.description ?? '',
    theme_color: event.theme_color ?? '#C5A15A',
    is_active: event.is_active,
  };
}

function toPayload(draft: EventDraft) {
  return {
    ...draft,
    end_time: draft.end_time.trim() || null,
    google_maps_url: draft.google_maps_url.trim() || null,
    dress_code: draft.dress_code.trim() || null,
    description: draft.description.trim() || null,
  };
}

export function EventsManager({
  initialEvents,
  weddingDate,
}: {
  initialEvents: WeddingEvent[];
  weddingDate: string;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EventDraft>(EMPTY_DRAFT);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function startCreate() {
    setIsEditorOpen(true);
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT, event_date: weddingDate });
    setError('');
    setStatus('');
  }

  function startEdit(event: WeddingEvent) {
    setIsEditorOpen(true);
    setEditingId(event.id);
    setDraft(toDraft(event));
    setError('');
    setStatus('');
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditingId(null);
    setError('');
  }

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setStatus('');
    setIsSaving(true);

    try {
      const response = await fetch(
        editingId ? `/api/admin/events/${editingId}` : '/api/admin/events',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify(toPayload(draft)),
        }
      );
      const result = await response.json() as { event?: WeddingEvent; error?: string };
      const savedEvent = result.event;
      if (!response.ok || !savedEvent) {
        setError(result.error || 'Unable to save event details.');
        return;
      }

      setEvents((current) => editingId
        ? current.map((item) => item.id === editingId ? savedEvent : item)
        : [...current, savedEvent].sort((a, b) =>
            `${a.event_date} ${a.start_time}`.localeCompare(`${b.event_date} ${b.start_time}`)
          ));
      setIsEditorOpen(false);
      setEditingId(null);
      setStatus(editingId ? 'Event updated.' : 'Event created.');
    } catch {
      setError('Unable to reach the event service. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleArchive(event: WeddingEvent) {
    setError('');
    setStatus('');
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(toPayload({ ...toDraft(event), is_active: !event.is_active })),
      });
      const result = await response.json() as { event?: WeddingEvent; error?: string };
      if (!response.ok || !result.event) {
        setError(result.error || 'Unable to change event visibility.');
        return;
      }
      const savedEvent = result.event;
      if (!savedEvent) {
        setError('The event update did not return saved details.');
        return;
      }
      setEvents((current) => current.map((item) => item.id === event.id ? savedEvent : item));
      setStatus(event.is_active ? 'Event archived and hidden from invitees.' : 'Event restored.');
    } catch {
      setError('Unable to reach the event service. Please try again.');
    }
  }

  function updateDraft<Key extends keyof EventDraft>(key: Key, value: EventDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-royal text-2xl font-bold text-gold-gradient">Events &amp; Venues</h1>
          <p className="mt-1 text-xs text-[#E6D2A0]/75">
            Edit the event cards guests see: schedules, venue details, maps, dress codes, and descriptions.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C5A15A] bg-[#3A0715] px-4 py-2.5 font-royal text-xs font-semibold uppercase tracking-wider text-[#E6D2A0] transition hover:bg-[#580F25]"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add event card
        </button>
      </header>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {status && <p role="status" className="text-sm text-emerald-300">{status}</p>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.id}
            className={`mughal-border flex flex-col justify-between rounded-xl bg-[#23050E]/80 p-5 ${
              event.is_active ? '' : 'opacity-65'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-[#C5A15A]/35 bg-[#3A0715] px-3 py-1 font-royal text-[10px] uppercase tracking-widest text-[#C5A15A]">
                  {event.event_type}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                  event.is_active ? 'text-emerald-300' : 'text-[#E6D2A0]/55'
                }`}>
                  {event.is_active ? 'Visible to guests' : 'Archived'}
                </span>
              </div>

              <div>
                <h2 className="font-royal text-lg font-bold text-[#F8F1E5]">{event.title}</h2>
                <p className="mt-1 flex items-center gap-2 text-xs text-[#E6D2A0]/80">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-[#C5A15A]" />
                  {event.event_date}
                  <Clock3 aria-hidden="true" className="ml-1 h-3.5 w-3.5 text-[#C5A15A]" />
                  {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
                </p>
              </div>

              <div className="flex items-start gap-2 border-t border-[#C5A15A]/20 pt-3 text-xs text-[#E6D2A0]/85">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A15A]" />
                <span>
                  <span className="block font-semibold text-[#F8F1E5]">{event.venue_name}</span>
                  {event.venue_address}
                </span>
              </div>
              {event.dress_code && (
                <p className="text-xs italic text-[#E6D2A0]/75">
                  Dress code: {event.dress_code}
                </p>
              )}
            </div>

            <div className="mt-5 flex gap-2 border-t border-[#C5A15A]/20 pt-4">
              <button
                type="button"
                onClick={() => startEdit(event)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#C5A15A]/40 px-3 py-2 text-xs text-[#E6D2A0] hover:bg-[#3A0715]"
              >
                <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                Edit details
              </button>
              <button
                type="button"
                onClick={() => void toggleArchive(event)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C5A15A]/25 px-3 py-2 text-xs text-[#E6D2A0]/75 hover:bg-[#3A0715]"
              >
                <Archive aria-hidden="true" className="h-3.5 w-3.5" />
                {event.is_active ? 'Archive' : 'Restore'}
              </button>
            </div>
          </article>
        ))}
        {events.length === 0 && (
          <p className="rounded-xl border border-[#C5A15A]/20 bg-[#23050E]/60 p-6 text-sm text-[#E6D2A0]/70">
            No event cards yet. Add the first event to begin building the invitation.
          </p>
        )}
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6">
          <form
            onSubmit={saveEvent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-editor-title"
            className="mughal-border my-auto w-full max-w-3xl space-y-5 rounded-2xl bg-[#20050D] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#C5A15A]/20 pb-4">
              <div>
                <h2 id="event-editor-title" className="font-royal text-xl font-bold text-gold-gradient">
                  {editingId ? 'Edit event card' : 'Create event card'}
                </h2>
                <p className="mt-1 text-xs text-[#E6D2A0]/70">
                  Changes are saved to the invitation data used by guests.
                </p>
              </div>
              <button type="button" onClick={closeEditor} aria-label="Close event editor" className="rounded p-1 text-[#E6D2A0]/70 hover:bg-white/10">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Event type</span>
                <select
                  value={draft.event_type}
                  onChange={(change) => updateDraft('event_type', change.target.value as EventType)}
                  className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]"
                >
                  <option value="mehndi">Mehndi / Mayun</option>
                  <option value="barat">Barat</option>
                  <option value="walima">Walima</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Card title</span>
                <input required maxLength={120} value={draft.title} onChange={(change) => updateDraft('title', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
              </label>
              <label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Date</span>
                <input type="date" required value={draft.event_date} onChange={(change) => updateDraft('event_date', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Start time</span>
                  <input required maxLength={32} placeholder="07:30 PM" value={draft.start_time} onChange={(change) => updateDraft('start_time', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">End time</span>
                  <input maxLength={32} placeholder="11:30 PM" value={draft.end_time} onChange={(change) => updateDraft('end_time', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
                </label>
              </div>
              <label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Venue name</span>
                <input required maxLength={160} value={draft.venue_name} onChange={(change) => updateDraft('venue_name', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
              </label>
              <label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Venue address</span>
                <input required maxLength={240} value={draft.venue_address} onChange={(change) => updateDraft('venue_address', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Google Maps link (optional)</span>
                <input type="url" maxLength={500} value={draft.google_maps_url} onChange={(change) => updateDraft('google_maps_url', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Dress code (optional)</span>
                <input maxLength={240} value={draft.dress_code} onChange={(change) => updateDraft('dress_code', change.target.value)} className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">Card description (optional)</span>
                <textarea rows={3} maxLength={600} value={draft.description} onChange={(change) => updateDraft('description', change.target.value)} className="w-full resize-y rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5]" />
              </label>
              <label className="flex items-center gap-2 text-xs text-[#E6D2A0] sm:col-span-2">
                <input type="checkbox" checked={draft.is_active} onChange={(change) => updateDraft('is_active', change.target.checked)} className="h-4 w-4 accent-[#C5A15A]" />
                Show this event card to invited guests
              </label>
              <label className="flex items-center gap-3 text-xs text-[#E6D2A0] sm:col-span-2">
                <input type="color" value={draft.theme_color} onChange={(change) => updateDraft('theme_color', change.target.value)} className="h-9 w-12 cursor-pointer rounded border border-[#C5A15A]/40 bg-transparent p-1" />
                <span>
                  <span className="block font-semibold text-[#F8F1E5]">Event accent color</span>
                  <span className="block text-[11px] text-[#E6D2A0]/65">Used for the event card and its 3D arch accents.</span>
                </span>
              </label>
            </div>

            {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            <div className="flex justify-end gap-2 border-t border-[#C5A15A]/20 pt-4">
              <button type="button" onClick={closeEditor} className="rounded-lg border border-white/20 px-4 py-2 text-xs text-[#E6D2A0]/80 hover:bg-white/10">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg border border-[#C5A15A] bg-gradient-to-r from-[#580F25] to-[#3A0715] px-4 py-2 font-royal text-xs font-semibold text-[#E6D2A0] disabled:opacity-60">
                <Save aria-hidden="true" className="h-3.5 w-3.5" />
                {isSaving ? 'Saving…' : 'Save event'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
