import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/data/db-service';
import { normalizePakistaniPhone } from '@/lib/security/phone';

export async function GET() {
  try {
    const guests = await DatabaseService.getAllGuests();
    return NextResponse.json({ success: true, guests });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { displayName, phone, allowedEventIds, maxAttendees, notes } = body;

    if (!displayName || !displayName.trim()) {
      return NextResponse.json({ success: false, error: 'Display name is required' }, { status: 400 });
    }

    const phoneCheck = normalizePakistaniPhone(phone);
    if (!phoneCheck.isValid) {
      return NextResponse.json({ success: false, error: phoneCheck.error }, { status: 400 });
    }

    if (!allowedEventIds || !Array.isArray(allowedEventIds) || allowedEventIds.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one event must be selected' }, { status: 400 });
    }

    const { guest, token } = await DatabaseService.addGuest({
      displayName: displayName.trim(),
      phone: phoneCheck.normalized,
      allowedEventIds,
      maxAttendees: Math.max(1, Number(maxAttendees) || 1),
      notes,
    });

    return NextResponse.json({ success: true, guest, token });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
