import { DatabaseService } from '@/lib/data/db-service';
import { GuestManager } from '@/components/admin/GuestManager';
import { requireAdminPage } from '@/lib/security/admin-auth';

export default async function AdminGuestsPage() {
  await requireAdminPage();
  const guests = await DatabaseService.getAllGuests();
  const events = await DatabaseService.getAllEvents();

  return <GuestManager initialGuests={guests} events={events} />;
}
