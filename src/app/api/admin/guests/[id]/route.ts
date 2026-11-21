import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DatabaseService } from '@/lib/data/db-service';
import { authorizeAdminApi } from '@/lib/security/admin-auth';
import { AdminGuestInputSchema } from '@/lib/security/admin-schemas';
import { normalizePakistaniPhone } from '@/lib/security/phone';

const GuestActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('regenerate_token') }),
  z.object({ action: z.literal('revoke') }),
  z.object({ action: z.literal('mark_sent') }),
  AdminGuestInputSchema.extend({ action: z.literal('update') }),
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await authorizeAdminApi(req);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    if (!/^[\da-f-]{36}$/i.test(id)) {
      return NextResponse.json({ success: false, error: 'Guest not found.' }, { status: 404 });
    }
    const body = await req.json();
    const parsed = GuestActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid guest update.' }, { status: 400 });
    }
    const action = parsed.data.action;

    if (action === 'regenerate_token') {
      const newToken = await DatabaseService.regenerateGuestToken(id);
      return NextResponse.json({ success: true, token: newToken });
    }

    if (action === 'revoke') {
      const success = await DatabaseService.revokeGuest(id);
      return success
        ? NextResponse.json({ success })
        : NextResponse.json({ success: false, error: 'Guest not found.' }, { status: 404 });
    }

    if (action === 'mark_sent') {
      const success = await DatabaseService.markAsSent(id);
      return success
        ? NextResponse.json({ success })
        : NextResponse.json({ success: false, error: 'Guest not found.' }, { status: 404 });
    }

    if (action === 'update') {
      const phoneCheck = normalizePakistaniPhone(parsed.data.phone);
      if (!phoneCheck.isValid) {
        return NextResponse.json({ success: false, error: phoneCheck.error }, { status: 400 });
      }
      const guest = await DatabaseService.updateGuest(id, {
        displayName: parsed.data.displayName,
        phone: phoneCheck.normalized,
        allowedEventIds: parsed.data.allowedEventIds,
        maxAttendees: parsed.data.maxAttendees,
        notes: parsed.data.notes,
      });
      const { token_hash: tokenHash, ...guestWithoutTokenHash } = guest;
      void tokenHash;
      return NextResponse.json({ success: true, guest: guestWithoutTokenHash });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update admin guest.', error);
    const notFound = error instanceof Error && error.message === 'Guest not found.';
    return NextResponse.json(
      { success: false, error: notFound ? 'Guest not found.' : 'Unable to update guest.' },
      { status: notFound ? 404 : 500 }
    );
  }
}
