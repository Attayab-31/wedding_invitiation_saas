import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/data/db-service';
import { authorizeAdminApi } from '@/lib/security/admin-auth';
import { WeddingEventAdminSchema } from '@/lib/security/admin-schemas';

export async function POST(request: NextRequest) {
  const unauthorized = await authorizeAdminApi(request);
  if (unauthorized) return unauthorized;

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
    const event = await DatabaseService.createEvent(parsed.data);
    return NextResponse.json({ success: true, event }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to create wedding event.', error);
    return NextResponse.json({ success: false, error: 'Unable to create event card.' }, { status: 500 });
  }
}
