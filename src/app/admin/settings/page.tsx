import { WeddingSettingsManager } from '@/components/admin/WeddingSettingsManager';
import { DatabaseService } from '@/lib/data/db-service';
import { requireAdminPage } from '@/lib/security/admin-auth';

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const wedding = await DatabaseService.getDefaultWedding();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-royal text-2xl font-bold text-gold-gradient">Invitation Settings</h1>
        <p className="mt-1 text-xs text-[#E6D2A0]/75">
          Update the couple and family wording, main date, and per-guest card display.
        </p>
      </header>
      <WeddingSettingsManager wedding={wedding} />
    </div>
  );
}
