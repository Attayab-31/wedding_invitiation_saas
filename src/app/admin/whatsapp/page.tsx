import { DatabaseService } from '@/lib/data/db-service';
import { WhatsAppHub } from '@/components/admin/WhatsAppHub';
import { requireAdminPage } from '@/lib/security/admin-auth';

export default async function AdminWhatsAppPage() {
  await requireAdminPage();
  const guests = await DatabaseService.getAllGuests();
  const wedding = await DatabaseService.getDefaultWedding();
  const events = await DatabaseService.getAllEvents();

  return <WhatsAppHub initialGuests={guests} wedding={wedding} events={events} />;
}
