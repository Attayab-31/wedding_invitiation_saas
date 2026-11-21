import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/data/db-service';
import { authorizeAdminApi } from '@/lib/security/admin-auth';
import { WeddingEventAdminSchema } from '@/lib/security/admin-schemas';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await authorizeAdminApi(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!/^[\da-f-]{36}$/i.test(id)) {
    return NextResponse.json({ success: false, error: 'Event not found.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid event payload.' }, { status: 400 });
  }

  const parsed = WeddingEventAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Check the event details and try again.' }, { status: 400 });
  }

  try {
    const event = await DatabaseService.updateEvent(id, parsed.data);
    return NextResponse.json({ success: true, event }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to update wedding event.', error);
    const message = error instanceof Error ? error.message : '';
    const status = message === 'Wedding event not found.' ? 404 : 500;
    return NextResponse.json(
      { success: false, error: status === 404 ? 'Event not found.' : 'Unable to save event card.' },
      { status }
    );
  }
}
