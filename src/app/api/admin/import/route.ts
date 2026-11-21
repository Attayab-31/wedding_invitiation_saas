import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/data/db-service';
import { normalizePakistaniPhone } from '@/lib/security/phone';
import { authorizeAdminApi } from '@/lib/security/admin-auth';

interface ImportRow {
  name: string;
  phone: string;
  allowedEvents: string[]; // event types: 'mehndi', 'barat', 'walima'
}

export async function POST(req: NextRequest) {
  const unauthorized = await authorizeAdminApi(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const { rows } = body as { rows: ImportRow[] };

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'No data provided to import' }, { status: 400 });
    }

    const events = (await DatabaseService.getAllEvents()).filter((event) => event.is_active);
    const eventMap = new Map<string, string>();
    events.forEach((e) => {
      eventMap.set(e.event_type.toLowerCase(), e.id);
    });

    const importedResults = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.name || !row.name.trim()) {
        errors.push({ row: i + 1, error: 'Missing guest display name' });
        continue;
      }

      const phoneCheck = normalizePakistaniPhone(row.phone);
      if (!phoneCheck.isValid) {
        errors.push({ row: i + 1, error: `Invalid phone: ${row.phone}` });
        continue;
      }

      const matchedEventIds: string[] = [];
      row.allowedEvents.forEach((evName) => {
        const id = eventMap.get(evName.trim().toLowerCase());
        if (id) matchedEventIds.push(id);
      });

      if (matchedEventIds.length === 0) {
        // Default to all events if none specified
        events.forEach((e) => matchedEventIds.push(e.id));
      }

      try {
        const { guest, token } = await DatabaseService.addGuest({
          displayName: row.name.trim(),
          phone: phoneCheck.normalized,
          allowedEventIds: matchedEventIds,
          notes: 'Imported via CSV batch',
        });

        importedResults.push({
          id: guest.id,
          name: guest.display_name,
          phone: guest.phone,
          token,
          allowedEvents: row.allowedEvents,
        });
      } catch {
        errors.push({ row: i + 1, error: 'Unable to import this guest row' });
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: importedResults.length,
      errorsCount: errors.length,
      errors,
      imported: importedResults,
    });
  } catch (error) {
    console.error('Failed to import admin guest CSV.', error);
    return NextResponse.json({ success: false, error: 'Unable to import guests.' }, { status: 500 });
  }
}
