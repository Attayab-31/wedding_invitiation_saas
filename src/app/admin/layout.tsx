import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  MessageCircle,
  CalendarDays,
  CheckSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#140E10] text-[#F8F1E5] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <nav className="border-b border-[#C5A15A]/20 bg-[#1D1215]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3A0715] border border-[#C5A15A] flex items-center justify-center font-royal font-bold text-xs text-[#E6D2A0]">
              A&amp;M
            </div>
            <div>
              <span className="font-royal font-bold text-sm tracking-wide text-[#F8F1E5] block">
                Imperial Wedding Admin
              </span>
              <span className="text-[10px] text-[#C5A15A] tracking-wider uppercase block">
                Ahad &amp; Maryam • Dec 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C5A15A]/40 bg-[#3A0715]/40 text-xs font-royal text-[#E6D2A0] hover:bg-[#3A0715] transition-colors"
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
        <div className="flex flex-wrap gap-2 pb-6 border-b border-[#C5A15A]/20 mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-semibold tracking-wider uppercase bg-[#3A0715]/50 border border-[#C5A15A]/40 text-[#E6D2A0] hover:bg-[#3A0715] hover:text-[#F8F1E5] transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-[#C5A15A]" />
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/guests"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-semibold tracking-wider uppercase bg-[#3A0715]/50 border border-[#C5A15A]/40 text-[#E6D2A0] hover:bg-[#3A0715] hover:text-[#F8F1E5] transition-all"
          >
            <Users className="w-4 h-4 text-[#C5A15A]" />
            <span>Guest List</span>
          </Link>

          <Link
            href="/admin/import"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-semibold tracking-wider uppercase bg-[#3A0715]/50 border border-[#C5A15A]/40 text-[#E6D2A0] hover:bg-[#3A0715] hover:text-[#F8F1E5] transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#C5A15A]" />
            <span>CSV Importer</span>
          </Link>

          <Link
            href="/admin/whatsapp"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-semibold tracking-wider uppercase bg-[#3A0715]/50 border border-[#C5A15A]/40 text-[#E6D2A0] hover:bg-[#3A0715] hover:text-[#F8F1E5] transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Hub</span>
          </Link>

          <Link
            href="/admin/events"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-semibold tracking-wider uppercase bg-[#3A0715]/50 border border-[#C5A15A]/40 text-[#E6D2A0] hover:bg-[#3A0715] hover:text-[#F8F1E5] transition-all"
          >
            <CalendarDays className="w-4 h-4 text-[#C5A15A]" />
            <span>Events &amp; Venues</span>
          </Link>

          <Link
            href="/admin/rsvps"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-royal font-semibold tracking-wider uppercase bg-[#3A0715]/50 border border-[#C5A15A]/40 text-[#E6D2A0] hover:bg-[#3A0715] hover:text-[#F8F1E5] transition-all"
          >
            <CheckSquare className="w-4 h-4 text-[#C5A15A]" />
            <span>RSVP Reports</span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
