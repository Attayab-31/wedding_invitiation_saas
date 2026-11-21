import { z } from 'zod';

function isValidDate(value: string) {
  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value;
}

function isValidTime(value: string) {
  const match = value.match(/^(\d{1,2}):([0-5]\d)(?:\s*(AM|PM))?$/i);
  if (!match) return false;
  const hour = Number(match[1]);
  return match[3] ? hour >= 1 && hour <= 12 : hour <= 23;
}

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(isValidDate);
const colorSchema = z.string().regex(/^#[\da-f]{6}$/i);
const nullableText = (maxLength: number) => z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? null : value,
  z.string().trim().max(maxLength).nullable()
);
const nullableTime = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? null : value,
  z.string().trim().max(32).refine(isValidTime).nullable()
);
const nullableMapsUrl = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? null : value,
  z.string().trim().url().max(500).refine((value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  }).nullable()
);

export const WeddingSettingsSchema = z.object({
  title: z.string().trim().min(1).max(120),
  couple_names: z.string().trim().min(1).max(100),
  bride_name: z.string().trim().min(1).max(100),
  groom_name: z.string().trim().min(1).max(100),
  host_names: z.string().trim().min(1).max(240),
  wedding_date: dateSchema,
  show_guest_max_attendees: z.boolean(),
});

export const WeddingEventAdminSchema = z.object({
  event_type: z.enum(['mehndi', 'barat', 'walima', 'custom']),
  title: z.string().trim().min(1).max(120),
  event_date: dateSchema,
  start_time: z.string().trim().max(32).refine(isValidTime),
  end_time: nullableTime,
  venue_name: z.string().trim().min(1).max(160),
  venue_address: z.string().trim().min(1).max(240),
  google_maps_url: nullableMapsUrl,
  dress_code: nullableText(240),
  description: nullableText(600),
  theme_color: colorSchema,
  is_active: z.boolean(),
});

export const AdminGuestInputSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(40),
  allowedEventIds: z.array(z.string().uuid()).min(1).max(50),
  maxAttendees: z.number().int().min(1).max(50),
  notes: z.string().trim().max(500).optional(),
});
