'use client';

import React, { useState, useRef } from 'react';
import { ResolvedGuestExperience } from '@/types/database';
import { SmoothScrollProvider } from '@/components/animation/SmoothScrollProvider';
import { HeroEnvelopeScene } from './scenes/HeroEnvelopeScene';
import { IntroductionScene } from './scenes/IntroductionScene';
import { EventDetailCard } from './scenes/EventDetailCard';
import { RSVPForm } from './scenes/RSVPForm';
import { ClosingBlessings } from './scenes/ClosingBlessings';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface InvitationExperienceProps {
  experience: ResolvedGuestExperience;
  token: string;
}

export function InvitationExperience({ experience, token }: InvitationExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { guest, wedding, events } = experience;

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    // Optionally initiate music playback on first interaction
    if (audioRef.current && isMuted) {
      audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#191516] text-[#F8F1E5]">
        {/* Background Royalty Audio (Traditional soft instrumental ambiance) */}
        <audio
          ref={audioRef}
          loop
          preload="none"
          src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-meditation-112191.mp3"
        />

        {/* Floating Audio Ambient Control */}
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#3A0715]/80 backdrop-blur-md border border-[#C5A15A]/40 text-[#E6D2A0] text-xs font-royal uppercase tracking-wider shadow-lg hover:border-[#C5A15A] transition-all cursor-pointer"
            title={isMuted ? 'Play celebratory melody' : 'Mute music'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-[#C5A15A]" />
                <span className="hidden sm:inline">Play Melody</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#C5A15A] animate-pulse" />
                <span className="hidden sm:inline">Playing</span>
              </>
            )}
          </button>
        </div>

        {/* Scene 1-4: 3D Envelope & Hero */}
        <HeroEnvelopeScene
          isOpen={isOpen}
          onOpen={handleOpenEnvelope}
          guestName={guest.display_name}
          coupleNames={wedding.couple_names}
        />

        {/* Scene 5: Introduction & Family Blessings */}
        <IntroductionScene
          wedding={wedding}
          guestName={guest.display_name}
        />

        {/* Scene 6-8: Authorized Wedding Functions (Mehndi, Barat, Walima) */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-[#191516] via-[#2A0610] to-[#191516]">
          <div className="max-w-4xl mx-auto mb-14 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A15A]/30 bg-[#3A0715]/40 text-xs font-royal font-semibold uppercase tracking-[0.25em] text-[#C5A15A] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Celebration Itinerary
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-3xl md:text-5xl font-royal font-bold text-gold-gradient">
              Wedding Functions
            </h2>
            <p className="text-sm md:text-base font-serif italic text-[#E6D2A0]/80 mt-2 max-w-xl mx-auto">
              You are cordially invited to celebrate the following auspicious ceremonies with our families.
            </p>
          </div>

          <div className="space-y-12">
            {events.map((event, idx) => (
              <EventDetailCard
                key={event.id}
                event={event}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Scene 9: RSVP Section */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-[#191516] via-[#24050E] to-[#191516]">
          <RSVPForm
            token={token}
            guestName={guest.display_name}
            events={events}
          />
        </section>

        {/* Outro: Countdown & Closing Family Blessings */}
        <ClosingBlessings wedding={wedding} />
      </main>
    </SmoothScrollProvider>
  );
}
