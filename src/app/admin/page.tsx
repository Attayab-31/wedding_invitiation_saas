import Link from 'next/link';
import { DatabaseService } from '@/lib/data/db-service';
import {
  Users,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const metrics = await DatabaseService.getDashboardMetrics();
  const wedding = await DatabaseService.getDefaultWedding();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="mughal-border rounded-xl bg-gradient-to-r from-[#2B0610] via-[#3A0715] to-[#1D040A] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C5A15A] font-royal font-semibold">
            Wedding Administration
          </span>
          <h1 className="text-2xl md:text-3xl font-royal font-bold text-gold-gradient mt-1">
            {wedding.title}
          </h1>
          <p className="text-xs text-[#E6D2A0]/80 font-serif italic mt-1">
            Mughal-grade encryption • Dynamic 3D envelope kinematics • Function-level RSVP control
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/whatsapp"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-xs font-royal text-emerald-100 border border-emerald-500/40 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Launch WhatsApp Hub</span>
          </Link>
          <Link
            href="/admin/import"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#580F25] hover:bg-[#721531] text-xs font-royal text-[#E6D2A0] border border-[#C5A15A]/60 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#C5A15A]" />
            <span>Bulk CSV Import</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Guests */}
        <div className="p-4 rounded-xl bg-[#23050E]/80 border border-[#C5A15A]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#C5A15A] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-royal font-medium">Guests</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-royal font-bold text-[#F8F1E5]">
            {metrics.totalGuests}
          </span>
          <span className="text-[10px] text-[#E6D2A0]/70 mt-1">Total database records</span>
        </div>

        {/* Sent Invitations */}
        <div className="p-4 rounded-xl bg-[#23050E]/80 border border-[#C5A15A]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#C5A15A] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-royal font-medium">Sent</span>
            <Send className="w-4 h-4" />
          </div>
          <span className="text-2xl font-royal font-bold text-[#F8F1E5]">
            {metrics.sentInvitations}
          </span>
          <span className="text-[10px] text-[#E6D2A0]/70 mt-1">Links dispatched</span>
        </div>

        {/* Opened Invitations */}
        <div className="p-4 rounded-xl bg-[#23050E]/80 border border-[#C5A15A]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#C5A15A] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-royal font-medium">Opened</span>
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-2xl font-royal font-bold text-[#F8F1E5]">
            {metrics.openedInvitations}
          </span>
          <span className="text-[10px] text-[#E6D2A0]/70 mt-1">Engaged with 3D envelope</span>
        </div>

        {/* Total Responses */}
        <div className="p-4 rounded-xl bg-[#23050E]/80 border border-[#C5A15A]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#C5A15A] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-royal font-medium">Responses</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-royal font-bold text-[#F8F1E5]">
            {metrics.respondedGuests}
          </span>
          <span className="text-[10px] text-[#E6D2A0]/70 mt-1">Guests replied</span>
        </div>

        {/* Confirmed Headcount */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#1E3A20]/80 to-[#23050E]/80 border border-emerald-500/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-royal font-medium">Attending</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-royal font-bold text-emerald-300">
            {metrics.totalConfirmedAttendees}
          </span>
          <span className="text-[10px] text-emerald-200/70 mt-1">Total seats reserved</span>
        </div>

        {/* Declined */}
        <div className="p-4 rounded-xl bg-[#23050E]/80 border border-red-900/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-royal font-medium">Declined</span>
            <XCircle className="w-4 h-4" />
          </div>
          <span className="text-2xl font-royal font-bold text-red-300">
            {metrics.declinedRSVPs}
          </span>
          <span className="text-[10px] text-red-200/70 mt-1">Unable to attend</span>
        </div>
      </div>

      {/* Event Breakdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-royal font-bold text-gold-gradient">
            Function-Wise Attendance Breakdown
          </h2>
          <span className="text-xs text-[#E6D2A0]/70 font-serif italic">
            Reflects individual guest permissions and RSVP responses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.eventBreakdown.map((item) => {
            const pct = item.totalCapacity > 0 ? Math.round((item.confirmedAttendees / item.totalCapacity) * 100) : 0;
            return (
              <div
                key={item.event.id}
                className="mughal-border rounded-xl p-6 bg-[#23050E]/80 backdrop-blur-md shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#C5A15A] font-royal font-semibold">
                    {item.event.event_type.toUpperCase()}
                  </span>
                  <span className="text-xs text-[#E6D2A0]/70">
                    {new Date(item.event.event_date + 'T12:00:00Z').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-royal font-bold text-[#F8F1E5]">
                  {item.event.title}
                </h3>

                <p className="text-xs text-[#E6D2A0]/80 font-serif italic line-clamp-1">
                  {item.event.venue_name}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#E6D2A0]/80 font-medium">Confirmed Attendees</span>
                    <span className="text-[#C5A15A] font-bold">
                      {item.confirmedAttendees} / {item.totalCapacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#191516] rounded-full h-2 overflow-hidden border border-[#C5A15A]/20">
                    <div
                      className="bg-gradient-to-r from-[#C5A15A] to-[#E6D2A0] h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C5A15A]/20 text-xs">
                  <div>
                    <span className="block text-[10px] uppercase text-[#E6D2A0]/60">Invited Guests</span>
                    <span className="font-royal font-bold text-[#F8F1E5]">{item.invitedGuestCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-[#E6D2A0]/60">Declined</span>
                    <span className="font-royal font-bold text-red-300">{item.declinedCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
