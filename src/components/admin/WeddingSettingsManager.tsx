'use client';

import { FormEvent, useState } from 'react';
import { Check, Save } from 'lucide-react';
import { Wedding } from '@/types/database';

type WeddingSettings = Pick<
  Wedding,
  | 'title'
  | 'couple_names'
  | 'bride_name'
  | 'groom_name'
  | 'host_names'
  | 'wedding_date'
  | 'show_guest_max_attendees'
>;

const textFields: Array<{
  key: Exclude<keyof WeddingSettings, 'show_guest_max_attendees' | 'wedding_date'>;
  label: string;
  maxLength: number;
}> = [
  { key: 'title', label: 'Invitation title', maxLength: 120 },
  { key: 'couple_names', label: 'Couple display names', maxLength: 100 },
  { key: 'bride_name', label: 'Bride name', maxLength: 100 },
  { key: 'groom_name', label: 'Groom name', maxLength: 100 },
  { key: 'host_names', label: 'Hosts / family names', maxLength: 240 },
];

export function WeddingSettingsManager({ wedding }: { wedding: Wedding }) {
  const [values, setValues] = useState<WeddingSettings>({
    title: wedding.title,
    couple_names: wedding.couple_names,
    bride_name: wedding.bride_name,
    groom_name: wedding.groom_name,
    host_names: wedding.host_names,
    wedding_date: wedding.wedding_date,
    show_guest_max_attendees: wedding.show_guest_max_attendees,
  });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaved(false);
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/wedding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(values),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error || 'Unable to save invitation settings.');
        return;
      }
      setSaved(true);
    } catch {
      setError('Unable to reach the settings service. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="mughal-border rounded-xl bg-[#23050E]/80 p-5 sm:p-7">
        <div className="mb-5">
          <h2 className="font-royal text-lg font-bold text-[#F8F1E5]">Invitation wording</h2>
          <p className="mt-1 text-xs text-[#E6D2A0]/70">
            These values appear on the welcome plaque, event journey, and closing message.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {textFields.map(({ key, label, maxLength }) => (
            <label key={key} className={key === 'host_names' ? 'sm:col-span-2' : ''}>
              <span className="mb-1 block font-royal text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">
                {label}
              </span>
              <input
                type="text"
                required
                maxLength={maxLength}
                value={values[key]}
                onChange={(change) => setValues((current) => ({
                  ...current,
                  [key]: change.target.value,
                }))}
                className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5] focus:border-[#C5A15A] focus:outline-none"
              />
            </label>
          ))}

          <label>
            <span className="mb-1 block font-royal text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">
              Main wedding date
            </span>
            <input
              type="date"
              required
              value={values.wedding_date}
              onChange={(change) => setValues((current) => ({
                ...current,
                wedding_date: change.target.value,
              }))}
              className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3 py-2.5 text-sm text-[#F8F1E5] focus:border-[#C5A15A] focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section className="mughal-border rounded-xl bg-[#23050E]/80 p-5 sm:p-7">
        <h2 className="font-royal text-lg font-bold text-[#F8F1E5]">Guest card details</h2>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-[#C5A15A]/25 bg-[#191516]/60 p-4">
          <input
            type="checkbox"
            checked={values.show_guest_max_attendees}
            onChange={(change) => setValues((current) => ({
              ...current,
              show_guest_max_attendees: change.target.checked,
            }))}
            className="mt-0.5 h-4 w-4 accent-[#C5A15A]"
          />
          <span>
            <span className="block font-royal text-xs font-semibold text-[#F8F1E5]">
              Show maximum invited guests on event cards
            </span>
            <span className="mt-1 block text-xs text-[#E6D2A0]/70">
              When enabled, each guest sees only their own per-event invitation limit. It is hidden by default.
            </span>
          </span>
        </label>
      </section>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {saved && (
        <p role="status" className="inline-flex items-center gap-2 text-sm text-emerald-300">
          <Check aria-hidden="true" className="h-4 w-4" />
          Invitation settings saved.
        </p>
      )}
      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-lg border border-[#C5A15A] bg-gradient-to-r from-[#580F25] to-[#3A0715] px-5 py-3 font-royal text-xs font-semibold uppercase tracking-wider text-[#E6D2A0] transition hover:brightness-125 disabled:opacity-60"
      >
        <Save aria-hidden="true" className="h-4 w-4" />
        {isSaving ? 'Saving…' : 'Save invitation settings'}
      </button>
    </form>
  );
}
