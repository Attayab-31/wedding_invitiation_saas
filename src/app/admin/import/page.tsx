import { DatabaseService } from '@/lib/data/db-service';
import { CSVImporter } from '@/components/admin/CSVImporter';

export default async function AdminImportPage() {
  const events = await DatabaseService.getAllEvents();
  return <CSVImporter events={events} />;
}
