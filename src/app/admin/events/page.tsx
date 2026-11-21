import { DatabaseService } from '@/lib/data/db-service';
import { Clock, MapPin, Navigation, Sparkles } from 'lucide-react';

export default async function AdminEventsPage() {
  const events = await DatabaseService.getAllEvents();
  const metrics = await DatabaseService.getDashboardMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-royal font-bold text-gold-gradient">
          Wedding Functions &amp; Venue Management
        </h1>
        <p className="text-xs text-[#E6D2A0]/80 font-serif italic mt-0.5">
          Configure ceremony dates, venues, dress codes, Google Maps links, and guest permissions
        </p>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const breakdown = metrics.eventBreakdown.find((b) => b.event.id === event.id);

          return (
            <div
              key={event.id}
              className="mughal-border rounded-xl p-6 bg-[#23050E]/80 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#C5A15A] font-royal font-semibold bg-[#3A0715] px-3 py-1 rounded-full border border-[#C5A15A]/30">
                    {event.event_type}
                  </span>
                  <span className="text-xs text-[#E6D2A0]/80">
                    {new Date(event.event_date + 'T12:00:00Z').toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h2 className="text-xl font-royal font-bold text-[#F8F1E5]">
                  {event.title}
                </h2>

                {event.description && (
                  <p className="text-xs font-serif italic text-[#E6D2A0]/70 leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2.5 pt-3 border-t border-[#C5A15A]/20 text-xs text-[#F8F1E5]/90">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#C5A15A] shrink-0 mt-0.5" />
                    <span>
                      {event.start_time} {event.end_time ? `– ${event.end_time}` : ''}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A15A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">{event.venue_name}</span>
                      <span className="text-[10px] text-[#E6D2A0]/70 block">{event.venue_address}</span>
                    </div>
                  </div>

                  {event.dress_code && (
                    <div className="flex items-start gap-2 pt-1">
                      <Sparkles className="w-4 h-4 text-[#C5A15A] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-[#C5A15A] uppercase block">Dress Code</span>
                        <span className="text-xs italic">{event.dress_code}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Invitation access */}
              <div className="pt-4 border-t border-[#C5A15A]/20">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#E6D2A0]/80">Guests invited:</span>
                  <span className="text-[#C5A15A] font-bold">
                    {breakdown?.invitedGuestCount || 0}
                  </span>
                </div>

                {event.google_maps_url && (
                  <a
                    href={event.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#3A0715] hover:bg-[#580F25] border border-[#C5A15A]/40 text-xs font-royal text-[#E6D2A0] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Venue on Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
