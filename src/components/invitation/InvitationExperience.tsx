'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResolvedGuestExperience } from '@/types/database';
import { SmoothScrollProvider } from '@/components/animation/SmoothScrollProvider';
import { HeroEnvelopeScene } from './scenes/HeroEnvelopeScene';
import { IntroductionScene } from './scenes/IntroductionScene';
import { EventDetailCard } from './scenes/EventDetailCard';
import { RSVPForm } from './scenes/RSVPForm';
import { ClosingBlessings } from './scenes/ClosingBlessings';
import { Volume2, VolumeX, Sparkles, ChevronDown, Lock } from 'lucide-react';

interface InvitationExperienceProps {
  experience: ResolvedGuestExperience;
  token: string;
}

export function InvitationExperience({ experience, token }: InvitationExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [scrollWarning, setScrollWarning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { guest, wedding, events } = experience;

  // Strict scroll-locking before the envelope is opened
  useEffect(() => {
    if (!isUnlocked) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);

      const preventScroll = (e: WheelEvent | TouchEvent) => {
        if (!isOpen) {
          // If user tries to scroll past before opening, show hint
          setScrollWarning(true);
          setTimeout(() => setScrollWarning(false), 2500);
        }
      };

      window.addEventListener('wheel', preventScroll, { passive: true });
      window.addEventListener('touchmove', preventScroll, { passive: true });

      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, isUnlocked]);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    // Automatically prepare unlock after cinematic unsealing
    setTimeout(() => {
      // Allows user to proceed
    }, 800);

    // Initiate celebratory music playback on interaction
    if (audioRef.current && isMuted) {
      audioRef.current
        .play()
        .then(() => setIsMuted(false))
        .catch(() => {});
    }
  };

  const handleProceedToFestivities = () => {
    setIsUnlocked(true);
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      const introEl = document.getElementById('introduction');
      if (introEl) {
        introEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current
        .play()
        .then(() => setIsMuted(false))
        .catch(() => {});
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#FAF7F2] text-[#231713]">
        {/* Background Instrumental Ambiance */}
        <audio
          ref={audioRef}
          loop
          preload="none"
          src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-meditation-112191.mp3"
        />

        {/* Floating Scroll Lock Toast Notification (Shown if user tries to scroll before unsealing) */}
        {scrollWarning && !isOpen && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#580F25] text-[#FAF7F2] text-xs font-royal font-bold tracking-wider shadow-2xl border border-[#DFCA94]">
              <Lock className="w-4 h-4 text-[#DFCA94]" />
              <span>Please tap the royal wax seal to unseal your invitation</span>
            </div>
          </div>
        )}

        {/* Floating Top Bar (Active once unlocked) */}
        {isUnlocked && (
          <nav className="fixed top-4 inset-x-0 mx-auto max-w-fit z-40 px-4 py-2 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#B88E3E]/40 shadow-[0_4px_20px_rgba(58,7,21,0.12)] flex items-center gap-3 text-xs font-royal font-semibold text-[#580F25] animate-fadeIn">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#B88E3E] transition-colors cursor-pointer"
            >
              Envelope
            </button>
            <span className="text-[#B88E3E]/40">•</span>
            <button
              onClick={() => document.getElementById('introduction')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#B88E3E] transition-colors cursor-pointer"
            >
              Introduction
            </button>
            <span className="text-[#B88E3E]/40">•</span>
            <button
              onClick={() => document.getElementById('functions')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#B88E3E] transition-colors cursor-pointer"
            >
              Functions ({events.length})
            </button>
            <span className="text-[#B88E3E]/40">•</span>
            <button
              onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#B88E3E] text-[#B88E3E] transition-colors cursor-pointer font-bold"
            >
              RSVP
            </button>
          </nav>
        )}

        {/* Audio Ambient Control Button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#B88E3E]/50 text-[#580F25] text-xs font-royal font-bold tracking-wider shadow-md hover:border-[#580F25] transition-all cursor-pointer"
            title={isMuted ? 'Play celebratory melody' : 'Mute music'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-[#B88E3E]" />
                <span className="hidden sm:inline">Play Melody</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#B88E3E] animate-pulse" />
                <span className="hidden sm:inline">Playing</span>
              </>
            )}
          </button>
        </div>

        {/* Stage 1: The 3D Envelope Experience (Strictly isolated until opened) */}
        <HeroEnvelopeScene
          isOpen={isOpen}
          onOpen={handleOpenEnvelope}
          guestName={guest.display_name}
          coupleNames={wedding.couple_names}
          onProceed={handleProceedToFestivities}
        />

        {/* Stage 2: Gated Wedding Content (Rendered only after the envelope is opened & unlocked) */}
        {isOpen && (
          <div className="transition-opacity duration-1000 ease-in-out">
            {/* Scene 5: Introduction & Family Blessings */}
            <IntroductionScene
              wedding={wedding}
              guestName={guest.display_name}
            />

            {/* Scene 6-8: Authorized Wedding Functions (Mehndi, Barat, Walima) */}
            <section
              id="functions"
              className="relative py-20 px-4 bg-gradient-to-b from-[#FAF7F2] via-[#F3ECE0] to-[#FAF7F2]"
            >
              <div className="max-w-4xl mx-auto mb-14 text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B88E3E]/40 bg-[#FFFDF9] text-xs font-royal font-bold uppercase tracking-[0.25em] text-[#8C6D3B] mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
                  Ceremonial Itinerary
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
                </span>
                <h2 className="text-3xl md:text-5xl font-royal font-bold text-burgundy-gradient">
                  Wedding Functions
                </h2>
                <p className="text-sm md:text-base font-serif italic text-[#6B4E3D] mt-2 max-w-xl mx-auto">
                  You are cordially invited to celebrate the following ceremonies with our families.
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
            <section className="relative py-20 px-4 bg-gradient-to-b from-[#FAF7F2] via-[#FAF6ED] to-[#FAF7F2]">
              <RSVPForm
                token={token}
                guestName={guest.display_name}
                events={events}
              />
            </section>

            {/* Outro: Countdown & Closing Family Du'a */}
            <ClosingBlessings wedding={wedding} />
          </div>
        )}
      </main>
    </SmoothScrollProvider>
  );
}
