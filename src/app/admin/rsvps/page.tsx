import { DatabaseService } from '@/lib/data/db-service';
import { CheckCircle2, XCircle, Heart, Download, MessageSquare, Utensils } from 'lucide-react';

export default async function AdminRSVPsPage() {
  const guests = await DatabaseService.getAllGuests();
  const events = await DatabaseService.getAllEvents();

  // Aggregate all RSVPs across guests
  const allRSVPs: Array<{
    guestName: string;
    phone: string;
    eventTitle: string;
    eventType: string;
    attending: boolean;
    headcount: number;
    dietaryNotes: string | null;
    message: string | null;
    submittedAt: string;
  }> = [];

  guests.forEach((guest) => {
    guest.rsvps?.forEach((r: any) => {
      const evt = events.find((e) => e.id === r.event_id);
      allRSVPs.push({
        guestName: guest.display_name,
        phone: guest.phone,
        eventTitle: evt?.title || 'Wedding Event',
        eventType: evt?.event_type || 'custom',
        attending: r.attending,
        headcount: r.headcount,
        dietaryNotes: r.dietary_notes,
        message: r.message,
        submittedAt: r.submitted_at || r.updated_at,
      });
    });
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-royal font-bold text-gold-gradient">
            RSVP Reporting &amp; Catering Notes
          </h1>
          <p className="text-xs text-[#E6D2A0]/80 font-serif italic mt-0.5">
            Confirmed headcounts, attendance status, dietary preferences, and warm blessings from guests
          </p>
        </div>
      </div>

      {/* RSVP Response Table */}
      <div className="overflow-x-auto rounded-xl border border-[#C5A15A]/20 bg-[#1D1215]/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#2B0610] text-[#C5A15A] font-royal uppercase tracking-wider text-[11px] border-b border-[#C5A15A]/20">
            <tr>
              <th className="py-3 px-4">Guest</th>
              <th className="py-3 px-4">Event</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-3 text-center">Headcount</th>
              <th className="py-3 px-4">Dietary Notes</th>
              <th className="py-3 px-4">Message / Blessing</th>
              <th className="py-3 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C5A15A]/10 font-sans">
            {allRSVPs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#E6D2A0]/60 font-serif italic">
                  No RSVPs submitted yet. As guests respond, their headcounts and blessings will appear here.
                </td>
              </tr>
            ) : (
              allRSVPs.map((rsvp, idx) => (
                <tr key={idx} className="hover:bg-[#250812]/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-serif font-bold text-sm text-[#F8F1E5] block">
                      {rsvp.guestName}
                    </span>
                    <span className="font-mono text-[10px] text-[#E6D2A0]/70">
                      +{rsvp.phone}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-royal font-semibold bg-[#3A0715] border border-[#C5A15A]/30 text-[#E6D2A0]">
                      {rsvp.eventType}
                    </span>
                    <span className="block text-xs text-[#F8F1E5] mt-1">{rsvp.eventTitle}</span>
                  </td>

                  <td className="py-3 px-4">
                    {rsvp.attending ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Attending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        Declined
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center font-royal font-bold text-sm text-[#F8F1E5]">
                    {rsvp.headcount}
                  </td>

                  <td className="py-3 px-4 text-xs text-[#E6D2A0]/80">
                    {rsvp.dietaryNotes ? (
                      <span className="inline-flex items-center gap-1 bg-[#191516] px-2 py-1 rounded border border-[#C5A15A]/20">
                        <Utensils className="w-3 h-3 text-[#C5A15A]" />
                        {rsvp.dietaryNotes}
                      </span>
                    ) : (
                      <span className="text-white/30 italic">None specified</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-xs text-[#F8F1E5]/90 max-w-xs">
                    {rsvp.message ? (
                      <span className="italic block line-clamp-2">&ldquo;{rsvp.message}&rdquo;</span>
                    ) : (
                      <span className="text-white/30 italic">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right text-[10px] text-[#E6D2A0]/60">
                    {new Date(rsvp.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
