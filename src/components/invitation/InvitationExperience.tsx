'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResolvedGuestExperience } from '@/types/database';
import { SmoothScrollProvider } from '@/components/animation/SmoothScrollProvider';
import { HeroEnvelopeScene } from './scenes/HeroEnvelopeScene';
import { PinnedStoryDeck } from './PinnedStoryDeck';

interface InvitationExperienceProps {
  experience: ResolvedGuestExperience;
  token: string;
}

export function InvitationExperience({ experience, token }: InvitationExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDiving, setIsDiving] = useState(false);
  const [currentView, setCurrentView] = useState<'envelope' | 'deck'>('envelope');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { guest, wedding } = experience;

  // Strict zero-scroll guarantee on the entire document & viewport
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    };
  }, []);

  // Auto-play celebratory ambiance melody
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.55;
        audioRef.current.play().catch(() => {});
      }
    };

    // Attempt direct browser autoplay
    playAudio();

    // Fallback on first user touch/click if browser autoplay policy requires user interaction
    const onUserInteraction = () => {
      playAudio();
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('pointerdown', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true });
    window.addEventListener('pointerdown', onUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('pointerdown', onUserInteraction);
    };
  }, []);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    setIsDiving(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.55;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleDiveComplete = () => {
    // Seamlessly transition into the ceremonial deck at the Invocation Card
    setCurrentView('deck');
  };

  return (
    <SmoothScrollProvider>
      <main className="relative h-[100dvh] max-h-[100dvh] w-screen overflow-hidden bg-[#FAF7F2] text-[#231713] select-none">
        {/* Background Celebratory Ambiance Audio */}
        <audio
          ref={audioRef}
          loop
          preload="auto"
          src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-meditation-112191.mp3"
        />

        {/* Stage 1: The 3D Envelope Experience with Cinematic Camera Dive */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out ${
            currentView === 'envelope' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <HeroEnvelopeScene
            isOpen={isOpen}
            isDiving={isDiving}
            onOpen={handleOpenEnvelope}
            onDiveComplete={handleDiveComplete}
            guestName={guest.display_name}
            coupleNames={wedding.couple_names}
            onProceed={handleOpenEnvelope}
          />
        </div>

        {/* Stage 2: Ceremonial Story Deck starting at Invocation Card (Card 0) */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
            currentView === 'deck' ? 'opacity-100 pointer-events-auto z-20 scale-100' : 'opacity-0 pointer-events-none z-0 scale-95'
          }`}
        >
          <PinnedStoryDeck
            experience={experience}
            token={token}
          />
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
