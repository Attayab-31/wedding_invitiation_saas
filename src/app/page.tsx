import Link from 'next/link';
import { DatabaseService } from '@/lib/data/db-service';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default async function Home() {
  const wedding = await DatabaseService.getDefaultWedding();

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#231713] flex flex-col justify-between py-12 px-4 selection:bg-[#B88E3E] selection:text-white">
      {/* Background soft ambiance */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DFCA94]/20 via-[#FAF7F2] to-[#FAF7F2] pointer-events-none" />

      {/* Header Monogram */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#B88E3E]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#B88E3E] bg-[#580F25] flex items-center justify-center shadow-sm">
            <span className="font-royal text-[#FAF7F2] font-bold text-xs tracking-wider">A&amp;M</span>
          </div>
          <div>
            <span className="block font-royal font-bold text-base text-[#3A0715] tracking-wider">
              {wedding.couple_names}
            </span>
            <span className="block text-[10px] text-[#8C6D3B] tracking-widest uppercase font-semibold">
              December 2026 • Lahore
            </span>
          </div>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF7F2] border border-[#B88E3E]/40 text-xs font-royal font-bold text-[#580F25] shadow-sm transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span>Admin Portal</span>
        </Link>
      </header>

      {/* Hero Welcome */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto text-center py-12 space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block">
          Wedding Celebrations
        </span>

        <h1 className="text-4xl md:text-6xl font-royal font-bold text-burgundy-gradient tracking-wide">
          {wedding.title}
        </h1>

        <p className="text-base md:text-lg font-serif italic text-[#6B4E3D] max-w-2xl mx-auto leading-relaxed">
          &ldquo;With grateful hearts, the Khan and Raza families invite you to share in the joy, traditions, and blessings of our children&apos;s wedding.&rdquo;
        </p>

        {/* Demo Guest Cards */}
        <div className="pt-8 text-left">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-[#8C6D3B] font-royal font-bold block mb-1">
              Select an Invitation to View the Experience
            </span>
            <p className="text-xs text-[#6B4E3D] font-serif italic">
              Each guest receives a unique link with their personalized card and function permissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Guest 1 */}
            <Link
              href="/invite/vip-bilal-ahmed-family"
              className="stationery-card gold-corners p-6 rounded-2xl hover:shadow-[0_12px_35px_rgba(58,7,21,0.08)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">Family Guest</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/25">
                    Max: 5 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Bilal Ahmed &amp; Family
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Functions Invited: <span className="text-[#580F25] font-semibold">Mayun &amp; Mehndi, The Royal Barat</span>
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>View Personal Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 2 */}
            <Link
              href="/invite/guest-muhammad-ali"
              className="stationery-card gold-corners p-6 rounded-2xl hover:shadow-[0_12px_35px_rgba(58,7,21,0.08)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">Colleague Guest</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/25">
                    Max: 2 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Mr. Muhammad Ali
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Functions Invited: <span className="text-[#580F25] font-semibold">The Royal Barat Ceremony</span>
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>View Personal Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 3 */}
            <Link
              href="/invite/guest-chaudhry-usman"
              className="stationery-card gold-corners p-6 rounded-2xl hover:shadow-[0_12px_35px_rgba(58,7,21,0.08)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">VIP Family</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/25">
                    Max: 6 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Usman Khan &amp; Family
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Functions Invited: <span className="text-[#580F25] font-semibold">All Celebrations (Mehndi, Barat &amp; Walima)</span>
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>View Personal Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Guest 4 */}
            <Link
              href="/invite/guest-sarah-jenkins"
              className="stationery-card gold-corners p-6 rounded-2xl hover:shadow-[0_12px_35px_rgba(58,7,21,0.08)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C6D3B] font-royal font-bold mb-2">
                  <span className="uppercase tracking-wider">Overseas Guest</span>
                  <span className="bg-[#FAF7F2] text-[#580F25] px-2.5 py-0.5 rounded-full border border-[#B88E3E]/25">
                    Max: 2 Attendees
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3A0715] group-hover:text-[#B88E3E] transition-colors">
                  Sarah Jenkins &amp; Guest
                </h3>
                <p className="text-xs text-[#6B4E3D] mt-1.5">
                  Functions Invited: <span className="text-[#580F25] font-semibold">The Walima Reception</span>
                </p>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-[#8C6D3B] font-royal font-bold group-hover:translate-x-1 transition-transform">
                <span>View Personal Invitation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full pt-8 border-t border-[#B88E3E]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B4E3D] gap-4">
        <p>
          © 2026 {wedding.couple_names} Wedding.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-[#580F25] font-medium transition-colors">
            Admin Management
          </Link>
          <span>•</span>
          <Link href="/invite/vip-bilal-ahmed-family" className="hover:text-[#580F25] font-medium transition-colors">
            Interactive 3D Invitation
          </Link>
        </div>
      </footer>
    </main>
  );
}
