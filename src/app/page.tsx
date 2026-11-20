import Link from 'next/link';
import { DatabaseService } from '@/lib/data/db-service';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Users } from 'lucide-react';

export default async function Home() {
  const wedding = await DatabaseService.getDefaultWedding();
  const events = await DatabaseService.getAllEvents();

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#231713] flex flex-col justify-between py-12 px-4 selection:bg-[#B88E3E] selection:text-white">
      {/* Background soft ambiance */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DFCA94]/20 via-[#FAF7F2] to-[#FAF7F2] pointer-events-none" />

      {/* Header Monogram */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#B88E3E]/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-[#B88E3E] bg-[#580F25] flex items-center justify-center shadow-md">
            <span className="font-royal text-[#FAF7F2] font-bold text-sm tracking-wider">A&amp;M</span>
          </div>
          <div>
            <span className="block font-royal font-bold text-base text-[#3A0715] tracking-wider">
              {wedding.couple_names}
            </span>
            <span className="block text-[10px] text-[#8C6D3B] tracking-widest uppercase font-semibold">
              Royal Wedding Portal
            </span>
          </div>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF7F2] border border-[#B88E3E]/50 text-xs font-royal font-bold text-[#580F25] shadow-sm transition-all hover:scale-105"
        >
          <ShieldCheck className="w-4 h-4 text-[#B88E3E]" />
          <span>Admin Dashboard</span>
        </Link>
      </header>

      {/* Hero Welcome */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto text-center py-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B88E3E]/40 bg-[#FFFDF9] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#580F25] font-royal font-bold">
            Ultra-Luxury 3D Digital Invitation
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
        </div>

        <h1 className="text-4xl md:text-6xl font-royal font-bold text-burgundy-gradient tracking-wide">
          {wedding.title}
        </h1>

        <p className="text-base md:text-lg font-serif italic text-[#6B4E3D] max-w-2xl mx-auto leading-relaxed">
          &ldquo;Every guest receives an individually encrypted, personalized invitation URL featuring real-time 3D envelope kinematics, wax seal opening ceremony, gold calligraphy, and function permissions.&rdquo;
        </p>

        {/* Demo Guest Cards */}
        <div className="pt-8 text-left">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-[#8C6D3B] font-royal font-bold block mb-1">
              Select a Demo Guest Invitation Link to Test
            </span>
            <p className="text-xs text-[#6B4E3D] font-serif italic">
              Notice: The page is locked until the guest taps the wax seal to unseal the personalized card!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Guest 1 */}
            <Link
              href="/invite/vip-bilal-ahmed-family"
              className="mughal-border luxury-card p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(58,7,21,0.12)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">Family Guest</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/30">
                    Max: 5 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Bilal Ahmed &amp; Family
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Permitted Ceremonies: <span className="text-[#580F25] font-bold">Mehndi &amp; Barat</span> (Walima restricted)
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 2 */}
            <Link
              href="/invite/guest-muhammad-ali"
              className="mughal-border luxury-card p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(58,7,21,0.12)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">Colleague Guest</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/30">
                    Max: 2 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Mr. Muhammad Ali
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Permitted Ceremonies: <span className="text-[#580F25] font-bold">Barat Only</span> (Mehndi &amp; Walima restricted)
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 3 */}
            <Link
              href="/invite/guest-chaudhry-usman"
              className="mughal-border luxury-card p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(58,7,21,0.12)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">VIP Family</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/30">
                    Max: 6 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Usman Khan &amp; Family
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Permitted Ceremonies: <span className="text-[#580F25] font-bold">All 3 (Mehndi, Barat &amp; Walima)</span>
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 4 */}
            <Link
              href="/invite/guest-sarah-jenkins"
              className="mughal-border luxury-card p-6 rounded-2xl hover:shadow-[0_15px_40px_rgba(58,7,21,0.12)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">Overseas Guest</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/30">
                    Max: 2 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Sarah Jenkins &amp; Guest
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Permitted Ceremonies: <span className="text-[#580F25] font-bold">Walima Only</span> (Mehndi &amp; Barat restricted)
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>Open 3D Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full pt-8 border-t border-[#B88E3E]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B4E3D] gap-4">
        <p>
          © 2026 {wedding.couple_names} Wedding. Crafted with Three.js, React Three Fiber &amp; GSAP.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-[#580F25] font-medium transition-colors">
            Admin Access
          </Link>
          <span>•</span>
          <Link href="/invite/vip-bilal-ahmed-family" className="hover:text-[#580F25] font-medium transition-colors">
            3D Envelope Experience
          </Link>
        </div>
      </footer>
    </main>
  );
}
