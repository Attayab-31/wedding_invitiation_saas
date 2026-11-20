import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DatabaseService } from '@/lib/data/db-service';
import { InvitationExperience } from '@/components/invitation/InvitationExperience';
import { AlertCircle, PhoneCall } from 'lucide-react';

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { token } = await params;
  const experience = await DatabaseService.resolveGuestByToken(token);

  if (!experience) {
    return {
      title: 'Wedding Invitation | Ahad & Maryam',
      description: 'You are cordially invited to celebrate the wedding festivities of Ahad & Maryam.',
      robots: { index: false, follow: false },
    };
  }

  const { guest, wedding } = experience;

  return {
    title: `${wedding.couple_names} Wedding | Invited: ${guest.display_name}`,
    description: `Assalam-o-Alaikum ${guest.display_name}. You are cordially invited to celebrate the wedding ceremonies of ${wedding.couple_names}.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${wedding.couple_names} Wedding Invitation`,
      description: `Cordially Invited: ${guest.display_name}`,
      type: 'website',
    },
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const experience = await DatabaseService.resolveGuestByToken(token);

  // If token is invalid, expired, or revoked
  if (!experience) {
    return (
      <div className="min-h-screen bg-[#191516] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full mughal-border p-8 rounded-xl bg-[#23050E]/90 backdrop-blur-md shadow-2xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#3A0715] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A]">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-royal font-bold text-gold-gradient">
            Invitation Expired or Unavailable
          </h1>

          <p className="text-sm font-serif italic text-[#F8F1E5]/80 leading-relaxed">
            We were unable to locate an active invitation for this link. The link may have expired or been updated by the wedding hosts.
          </p>

          <div className="pt-4 border-t border-[#C5A15A]/20">
            <p className="text-xs text-[#E6D2A0]/70 font-royal uppercase tracking-wider mb-3">
              Need assistance?
            </p>
            <a
              href="tel:+923001234567"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3A0715] border border-[#C5A15A]/60 text-xs font-royal text-[#E6D2A0] hover:bg-[#580F25] transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#C5A15A]" />
              <span>Contact Wedding Coordination</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <InvitationExperience experience={experience} token={token} />;
}
