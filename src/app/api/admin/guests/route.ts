import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/data/db-service';
import { normalizePakistaniPhone } from '@/lib/security/phone';
import { authorizeAdminApi } from '@/lib/security/admin-auth';
import { AdminGuestInputSchema } from '@/lib/security/admin-schemas';

export async function GET(request: NextRequest) {
  const unauthorized = await authorizeAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const guests = await DatabaseService.getAllGuests();
    return NextResponse.json({ success: true, guests });
  } catch (error) {
    console.error('Failed to load admin guest list.', error);
    return NextResponse.json({ success: false, error: 'Unable to load guests.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await authorizeAdminApi(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const parsed = AdminGuestInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Check the guest details and try again.' }, { status: 400 });
    }
    const { displayName, phone, allowedEventIds, notes, maxAttendees } = parsed.data;

    const phoneCheck = normalizePakistaniPhone(phone);
    if (!phoneCheck.isValid) {
      return NextResponse.json({ success: false, error: phoneCheck.error }, { status: 400 });
    }

    const { guest, token } = await DatabaseService.addGuest({
      displayName,
      phone: phoneCheck.normalized,
      allowedEventIds,
      notes,
      maxAttendees,
    });

    const { token_hash: tokenHash, ...guestWithoutTokenHash } = guest;
    void tokenHash;
    return NextResponse.json({ success: true, guest: guestWithoutTokenHash, token });
  } catch (error) {
    console.error('Failed to add admin guest.', error);
    return NextResponse.json({ success: false, error: 'Unable to add guest.' }, { status: 500 });
  }
}
