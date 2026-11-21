import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  MessageCircle,
  CalendarDays,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1F1014] text-[#FAF7F2] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <nav className="border-b border-[#B88E3E]/30 bg-[#2C131A]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#580F25] border-2 border-[#DFCA94] flex items-center justify-center font-royal font-bold text-xs text-[#FAF7F2] shadow-sm">
              A&amp;M
            </div>
            <div>
              <span className="font-royal font-bold text-sm tracking-wide text-[#FAF7F2] block">
                Imperial Wedding Admin
              </span>
              <span className="text-[10px] text-[#DFCA94] tracking-wider uppercase block font-semibold">
                Ahad &amp; Maryam • Dec 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B88E3E]/50 bg-[#3A0715] text-xs font-royal text-[#DFCA94] hover:bg-[#580F25] transition-colors"
            >
              <span>View Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Admin Content with Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-[#B88E3E]/20 mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-bold tracking-wider uppercase bg-[#3A0715] border border-[#B88E3E]/40 text-[#DFCA94] hover:bg-[#580F25] hover:text-[#FAF7F2] transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-[#B88E3E]" />
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/guests"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-bold tracking-wider uppercase bg-[#3A0715] border border-[#B88E3E]/40 text-[#DFCA94] hover:bg-[#580F25] hover:text-[#FAF7F2] transition-all"
          >
            <Users className="w-4 h-4 text-[#B88E3E]" />
            <span>Guest List</span>
          </Link>

          <Link
            href="/admin/import"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-bold tracking-wider uppercase bg-[#3A0715] border border-[#B88E3E]/40 text-[#DFCA94] hover:bg-[#580F25] hover:text-[#FAF7F2] transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#B88E3E]" />
            <span>CSV Importer</span>
          </Link>

          <Link
            href="/admin/whatsapp"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-bold tracking-wider uppercase bg-[#3A0715] border border-[#B88E3E]/40 text-[#DFCA94] hover:bg-[#580F25] hover:text-[#FAF7F2] transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Hub</span>
          </Link>

          <Link
            href="/admin/events"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-bold tracking-wider uppercase bg-[#3A0715] border border-[#B88E3E]/40 text-[#DFCA94] hover:bg-[#580F25] hover:text-[#FAF7F2] transition-all"
          >
            <CalendarDays className="w-4 h-4 text-[#B88E3E]" />
            <span>Events &amp; Venues</span>
          </Link>

        </div>

        {children}
      </div>
    </div>
  );
}
