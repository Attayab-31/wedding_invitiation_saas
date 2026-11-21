import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/data/db-service';
import { authorizeAdminApi } from '@/lib/security/admin-auth';
import { WeddingSettingsSchema } from '@/lib/security/admin-schemas';

export async function PATCH(request: NextRequest) {
  const unauthorized = await authorizeAdminApi(request);
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid settings payload.' }, { status: 400 });
  }

  const settings = WeddingSettingsSchema.safeParse(body);
  if (!settings.success) {
    return NextResponse.json({ success: false, error: 'Check the invitation settings and try again.' }, { status: 400 });
  }

  try {
    const wedding = await DatabaseService.updateWedding(settings.data);
    return NextResponse.json({ success: true, wedding }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to update wedding settings.', error);
    return NextResponse.json({ success: false, error: 'Unable to save invitation settings.' }, { status: 500 });
  }
}
