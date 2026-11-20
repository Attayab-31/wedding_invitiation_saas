import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DatabaseService } from '@/lib/data/db-service';
import { checkRateLimit } from '@/lib/security/rate-limiter';

const rsvpSchema = z.object({
  token: z.string().min(8, 'Invalid invitation token'),
  eventId: z.string().uuid('Invalid event identifier'),
  attending: z.boolean(),
  headcount: z.number().int().min(0).max(50),
  dietaryNotes: z.string().max(500).optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const rateCheck = checkRateLimit(`rsvp_${ip}`, 30, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // 2. Validate input
    const body = await req.json();
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid RSVP data' },
        { status: 400 }
      );
    }

    // 3. Process RSVP in data service (enforcing event permissions and max attendees server-side)
    const result = await DatabaseService.submitRSVP({
      token: parsed.data.token,
      eventId: parsed.data.eventId,
      attending: parsed.data.attending,
      headcount: parsed.data.headcount,
      dietaryNotes: parsed.data.dietaryNotes,
      message: parsed.data.message,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'RSVP updated successfully' });
  } catch (err: unknown) {
    console.error('RSVP API Error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while saving your RSVP.' },
      { status: 500 }
    );
  }
}
