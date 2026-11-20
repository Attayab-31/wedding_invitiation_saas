'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResolvedGuestExperience } from '@/types/database';
import { SmoothScrollProvider } from '@/components/animation/SmoothScrollProvider';
import { HeroEnvelopeScene } from './scenes/HeroEnvelopeScene';
import { PinnedStoryDeck } from './PinnedStoryDeck';
import { Volume2, VolumeX, Lock } from 'lucide-react';

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

      const preventScroll = () => {
        if (!isOpen) {
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
      const deckEl = document.getElementById('ceremonial-deck');
      if (deckEl) {
        deckEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
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

        {/* Stage 2: Step-by-Step Scroll Pinned Deck Experience */}
        {isOpen && (
          <PinnedStoryDeck
            experience={experience}
            token={token}
          />
        )}
      </main>
    </SmoothScrollProvider>
  );
}
