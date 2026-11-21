import { EventsManager } from '@/components/admin/EventsManager';
import { DatabaseService } from '@/lib/data/db-service';
import { requireAdminPage } from '@/lib/security/admin-auth';

export default async function AdminEventsPage() {
  await requireAdminPage();
  const [events, wedding] = await Promise.all([
    DatabaseService.getAllEvents(),
    DatabaseService.getDefaultWedding(),
  ]);

  return <EventsManager initialEvents={events} weddingDate={wedding.wedding_date} />;
}
