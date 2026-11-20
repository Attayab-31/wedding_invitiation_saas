import { ImageResponse } from 'next/og';
import { DatabaseService } from '@/lib/data/db-service';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const experience = await DatabaseService.resolveGuestByToken(token);

  const guestName = experience?.guest.display_name || 'Honoured Guest & Family';
  const coupleNames = experience?.wedding.couple_names || 'Ahad & Maryam';
  const weddingDate = 'December 2026 • Lahore, Pakistan';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #191516 0%, #3A0715 50%, #191516 100%)',
          color: '#F8F1E5',
          fontFamily: 'serif',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Outer Mughal Ornamental Border */}
        <div
          style={{
            position: 'absolute',
            inset: '30px',
            border: '3px solid #C5A15A',
            borderRadius: '16px',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '40px',
            border: '1px solid rgba(230, 210, 160, 0.4)',
            borderRadius: '12px',
            display: 'flex',
          }}
        />

        {/* Bismillah Calligraphy text */}
        <div
          style={{
            fontSize: '28px',
            color: '#E6D2A0',
            fontStyle: 'italic',
            marginBottom: '10px',
          }}
        >
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '18px',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: '#C5A15A',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          Together With Their Families
        </div>

        {/* Couple Names */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '12px',
            textShadow: '0 4px 20px rgba(197, 161, 90, 0.4)',
          }}
        >
          {coupleNames}
        </div>

        {/* Personalized Guest Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 40px',
            backgroundColor: 'rgba(58, 7, 21, 0.7)',
            border: '1px solid #C5A15A',
            borderRadius: '8px',
            margin: '16px 0',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: '#E6D2A0',
              marginBottom: '6px',
            }}
          >
            Cordially Invited
          </div>
          <div
            style={{
              fontSize: '38px',
              fontWeight: 'bold',
              color: '#FFD700',
            }}
          >
            {guestName}
          </div>
        </div>

        {/* Date & Location */}
        <div
          style={{
            fontSize: '20px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#E6D2A0',
            marginTop: '10px',
          }}
        >
          {weddingDate}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
