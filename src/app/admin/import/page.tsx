import { DatabaseService } from '@/lib/data/db-service';
import { CSVImporter } from '@/components/admin/CSVImporter';
import { requireAdminPage } from '@/lib/security/admin-auth';

export default async function AdminImportPage() {
  await requireAdminPage();
  const events = await DatabaseService.getAllEvents();
  return <CSVImporter events={events} />;
}
