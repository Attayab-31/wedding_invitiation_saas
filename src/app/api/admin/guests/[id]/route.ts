import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/data/db-service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    if (action === 'regenerate_token') {
      const newToken = await DatabaseService.regenerateGuestToken(id);
      return NextResponse.json({ success: true, token: newToken });
    }

    if (action === 'revoke') {
      const success = await DatabaseService.revokeGuest(id);
      return NextResponse.json({ success });
    }

    if (action === 'mark_sent') {
      const success = await DatabaseService.markAsSent(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
