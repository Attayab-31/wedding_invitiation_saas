import { DatabaseService } from '@/lib/data/db-service';
import { GuestManager } from '@/components/admin/GuestManager';

export default async function AdminGuestsPage() {
  const guests = await DatabaseService.getAllGuests();
  const events = await DatabaseService.getAllEvents();

  return <GuestManager initialGuests={guests} events={events} />;
}
