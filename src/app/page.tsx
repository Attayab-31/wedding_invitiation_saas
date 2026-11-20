import Link from 'next/link';
import { DatabaseService } from '@/lib/data/db-service';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Users } from 'lucide-react';

export default async function Home() {
  const wedding = await DatabaseService.getDefaultWedding();
  const events = await DatabaseService.getAllEvents();

  return (
    <main className="min-h-screen bg-[#191516] text-[#F8F1E5] flex flex-col justify-between py-12 px-4 selection:bg-[#C5A15A] selection:text-[#3A0715]">
      {/* Background radial ambiance */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A0715]/40 via-[#191516] to-[#191516] pointer-events-none" />

      {/* Header Monogram */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#C5A15A]/20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border border-[#C5A15A] bg-[#3A0715] flex items-center justify-center">
            <span className="font-royal text-[#E6D2A0] font-bold text-sm">A&M</span>
          </div>
          <div>
            <span className="block font-royal font-bold text-sm text-[#F8F1E5] tracking-wider">
              {wedding.couple_names}
            </span>
            <span className="block text-[10px] text-[#C5A15A] tracking-widest uppercase">
              Royal Wedding Portal
            </span>
          </div>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3A0715]/60 hover:bg-[#580F25] border border-[#C5A15A]/40 text-xs font-royal text-[#E6D2A0] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A15A]" />
          <span>Admin Dashboard</span>
        </Link>
      </header>

      {/* Hero Welcome */}
      <div className="relative z-10 max-w-3xl mx-auto w-full my-auto text-center py-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A15A]/40 bg-[#3A0715]/40 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A15A]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#E6D2A0] font-royal font-medium">
            Ultra-Luxury Digital Invitation
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C5A15A]" />
        </div>

        <h1 className="text-4xl md:text-6xl font-royal font-bold text-gold-gradient tracking-wide">
          {wedding.title}
        </h1>

        <p className="text-base md:text-lg font-serif italic text-[#E6D2A0]/85 max-w-xl mx-auto leading-relaxed">
          &ldquo;Each guest receives an individually encrypted invitation URL featuring real-time 3D envelope kinematics, personalized gold foil calligraphy, and function permissions.&rdquo;
        </p>

        {/* Demo Guest Cards - For instantaneous testing */}
        <div className="pt-8 text-left">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-[#C5A15A] font-royal block mb-1">
              Select a Demo Guest Invitation Link to Test
            </span>
            <p className="text-xs text-[#E6D2A0]/60 font-serif italic">
              Notice how each guest gets custom name rendering and filtered event access!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guest 1 */}
            <Link
              href="/invite/vip-bilal-ahmed-family"
              className="mughal-border p-5 rounded-xl bg-[#23050E]/80 hover:bg-[#3A0715] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#C5A15A] font-royal mb-2">
                  <span className="uppercase tracking-wider">Family Guest</span>
                  <span className="bg-[#3A0715] px-2 py-0.5 rounded border border-[#C5A15A]/30">
                    Max: 5 Attendees
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#F8F1E5] group-hover:text-gold-gradient">
                  Bilal Ahmed &amp; Family
                </h3>
                <p className="text-xs text-[#E6D2A0]/70 mt-1">
                  Permitted Events: <span className="text-[#C5A15A] font-semibold">Mehndi &amp; Barat</span> (Walima restricted)
                </p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs text-[#C5A15A] font-royal group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 2 */}
            <Link
              href="/invite/guest-muhammad-ali"
              className="mughal-border p-5 rounded-xl bg-[#23050E]/80 hover:bg-[#3A0715] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#C5A15A] font-royal mb-2">
                  <span className="uppercase tracking-wider">Individual Guest</span>
                  <span className="bg-[#3A0715] px-2 py-0.5 rounded border border-[#C5A15A]/30">
                    Max: 2 Attendees
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#F8F1E5] group-hover:text-gold-gradient">
                  Mr. Muhammad Ali
                </h3>
                <p className="text-xs text-[#E6D2A0]/70 mt-1">
                  Permitted Events: <span className="text-[#C5A15A] font-semibold">Barat only</span> (Mehndi &amp; Walima restricted)
                </p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs text-[#C5A15A] font-royal group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 3 */}
            <Link
              href="/invite/guest-chaudhry-usman"
              className="mughal-border p-5 rounded-xl bg-[#23050E]/80 hover:bg-[#3A0715] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#C5A15A] font-royal mb-2">
                  <span className="uppercase tracking-wider">VIP Family</span>
                  <span className="bg-[#3A0715] px-2 py-0.5 rounded border border-[#C5A15A]/30">
                    Max: 6 Attendees
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#F8F1E5] group-hover:text-gold-gradient">
                  Usman Khan &amp; Family
                </h3>
                <p className="text-xs text-[#E6D2A0]/70 mt-1">
                  Permitted Events: <span className="text-[#C5A15A] font-semibold">All 3 (Mehndi, Barat &amp; Walima)</span>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs text-[#C5A15A] font-royal group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 4 */}
            <Link
              href="/invite/guest-sarah-jenkins"
              className="mughal-border p-5 rounded-xl bg-[#23050E]/80 hover:bg-[#3A0715] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#C5A15A] font-royal mb-2">
                  <span className="uppercase tracking-wider">Overseas Colleague</span>
                  <span className="bg-[#3A0715] px-2 py-0.5 rounded border border-[#C5A15A]/30">
                    Max: 2 Attendees
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#F8F1E5] group-hover:text-gold-gradient">
                  Sarah Jenkins &amp; Guest
                </h3>
                <p className="text-xs text-[#E6D2A0]/70 mt-1">
                  Permitted Events: <span className="text-[#C5A15A] font-semibold">Walima only</span> (Mehndi &amp; Barat restricted)
                </p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs text-[#C5A15A] font-royal group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C5A15A]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E6D2A0]/60 gap-4">
        <p>
          © 2026 {wedding.couple_names} Wedding. Powered by Three.js &amp; Next.js App Router.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-[#C5A15A] transition-colors">
            Admin Access
          </Link>
          <span>•</span>
          <Link href="/invite/vip-bilal-ahmed-family" className="hover:text-[#C5A15A] transition-colors">
            Live 3D Envelope
          </Link>
        </div>
      </footer>
    </main>
  );
}
