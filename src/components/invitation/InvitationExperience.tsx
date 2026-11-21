'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, Heart } from 'lucide-react';
import { ResolvedGuestExperience } from '@/types/database';
import { InvitationCanvas } from '@/components/3d/InvitationCanvas';
import { SmoothScrollProvider, useSmoothScroll } from '@/components/animation/SmoothScrollProvider';
import { AudioControl } from './AudioControl';
import { EventStop } from './EventStop';
import { ClosingBlessings } from './scenes/ClosingBlessings';
import { IntroductionScene } from './scenes/IntroductionScene';

interface InvitationExperienceProps {
  experience: ResolvedGuestExperience;
}

function getMonogram(coupleNames: string) {
  return coupleNames
    .split('&')
    .map((name) => name.trim().charAt(0))
    .filter(Boolean)
    .join('&');
}

function InvitationJourney({ experience }: InvitationExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [isFinaleVisible, setIsFinaleVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const gateOpenTimerRef = useRef<number | null>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLElement>(null);
  const sceneProgressRef = useRef(0);
  const { scrollTo, setLocked } = useSmoothScroll();
  const { guest, wedding, events } = experience;

  const unlockScroll = useCallback(() => {
    if (gateOpenTimerRef.current !== null) {
      window.clearTimeout(gateOpenTimerRef.current);
      gateOpenTimerRef.current = null;
    }
    setIsScrollUnlocked(true);
    setLocked(false);
  }, [setLocked]);

  const handleEnter = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    gateOpenTimerRef.current = window.setTimeout(unlockScroll, 3400);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.48;
      audio.muted = false;
      setIsAudioMuted(false);
      void audio.play().catch(() => {
        audio.muted = true;
        setIsAudioMuted(true);
        setAudioUnavailable(true);
      });
    }
  }, [isOpen, unlockScroll]);

  useEffect(() => () => {
    if (gateOpenTimerRef.current !== null) {
      window.clearTimeout(gateOpenTimerRef.current);
    }
  }, []);

  useEffect(() => {
    const finale = finaleRef.current;
    if (!finale) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFinaleVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(finale);
    return () => observer.disconnect();
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    setAudioUnavailable(false);
    if (!audio) return;

    audio.muted = nextMuted;
    if (!nextMuted) {
      void audio.play().catch(() => {
        audio.muted = true;
        setIsAudioMuted(true);
        setAudioUnavailable(true);
      });
    }
  }, [isAudioMuted]);

  return (
    <main className="relative min-h-screen w-full bg-[#100D10] text-[#F8F1E5]">
      <audio
        ref={audioRef}
        loop
        preload="none"
        muted={isAudioMuted}
        playsInline
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-meditation-112191.mp3"
        onError={() => {
          setAudioUnavailable(true);
          setIsAudioMuted(true);
        }}
      />

      <div ref={journeyRef} className="relative">
        <div className="sticky top-0 z-0 h-dvh w-full overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(198,151,78,.2),transparent_50%),linear-gradient(180deg,#121018_0%,#281D20_54%,#15100D_100%)]"
          />
          <InvitationCanvas
            isOpen={isOpen}
            onOpen={handleEnter}
            onGateOpenComplete={unlockScroll}
            coupleMonogram={getMonogram(wedding.couple_names)}
            events={events}
            guestName={guest.display_name}
            isScrollUnlocked={isScrollUnlocked}
            isFinaleVisible={isFinaleVisible}
            scrollTargetRef={journeyRef}
            progressRef={sceneProgressRef}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,7,.16),transparent_38%,rgba(10,8,7,.24))]"
          />
        </div>

        <div className="pointer-events-none relative z-10 -mt-[100dvh]">
          <section
            id="entrance"
            data-scroll-stage
            aria-labelledby="entrance-heading"
            className="relative flex min-h-dvh flex-col items-center px-5 pb-[10dvh] pt-[clamp(7.5rem,16vh,10rem)] text-center"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#100D10]/10 via-transparent to-[#100D10]/40" />
            <div className="pointer-events-auto absolute bottom-[8%] flex flex-col items-center">
              <h1 id="entrance-heading" className="sr-only">
                The wedding of {wedding.couple_names}
              </h1>
              <p className="sr-only">
                {getMonogram(wedding.couple_names)}. Warmly welcoming {guest.display_name}.
              </p>
              {!isOpen ? (
                <button
                  type="button"
                  onClick={handleEnter}
                  className="group rounded-full border border-[#E5C879]/75 bg-[#2D1C12]/88 px-7 py-3.5 font-royal text-[10px] font-bold uppercase tracking-[0.24em] text-[#F4D887] shadow-[0_0_32px_rgba(227,177,73,.3)] transition hover:bg-[#492D17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4D887] sm:text-xs"
                >
                  <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#F4D887] shadow-[0_0_12px_#F4D887]" />
                  Tap to Enter
                </button>
              ) : (
                <div className="flex items-center gap-2 font-royal text-[9px] uppercase tracking-[0.22em] text-[#F3D990]/80">
                  <Heart aria-hidden="true" className="h-3 w-3 fill-current" />
                  {isScrollUnlocked ? 'Your courtyard awaits' : 'The gates are opening'}
                </div>
              )}
              {isScrollUnlocked && (
                <div className="mt-5 flex items-center gap-2 font-royal text-[9px] uppercase tracking-[0.2em] text-[#F8E8C4]/75">
                  Continue the walk
                  <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 animate-bounce" />
                </div>
              )}
            </div>
          </section>

          <section
            id="introduction"
            data-scroll-stage
            aria-labelledby="introduction-heading"
            className="invitation-intro-stage relative flex min-h-dvh items-center justify-center px-4 py-16"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#0B0B12]/45 via-[#201512]/25 to-[#151018]/65" />
            <div className="relative w-full max-w-4xl pointer-events-auto">
              <p className="mb-4 text-center font-royal text-[9px] font-semibold uppercase tracking-[0.32em] text-[#E6C77E]">
                With blessings from both families
              </p>
              <h2 id="introduction-heading" className="sr-only">A blessing and a welcome from the families</h2>
              <IntroductionScene wedding={wedding} guestName={guest.display_name} />
            </div>
          </section>

          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              <section
                data-scroll-stage
                aria-labelledby={`event-walk-title-${index}`}
                className="pointer-events-none relative flex min-h-dvh items-end justify-center px-4 pb-[8dvh]"
              >
                <h2 id={`event-walk-title-${index}`} className="sr-only">
                  Courtyard walk toward {event.title}
                </h2>
                <div
                  aria-hidden="true"
                  className="flex items-center gap-2 font-royal text-[9px] uppercase tracking-[0.2em] text-[#F8E8C4]/75"
                >
                  Continue the walk
                  <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                </div>
              </section>
              <EventStop
                event={event}
                index={index}
                onModalVisibilityChange={setLocked}
                isAudioMuted={isAudioMuted}
                audioUnavailable={audioUnavailable}
                onToggleAudio={toggleAudio}
              />
            </React.Fragment>
          ))}

          <section
            id="celebration"
            data-scroll-stage
            aria-labelledby="celebration-heading"
            className="relative flex min-h-dvh items-center justify-center px-3 py-12 sm:px-5 sm:py-14"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#0B0D16]/55 via-[#151521]/55 to-[#0B0D16]/75" />
            <div className="relative w-full max-w-4xl pointer-events-auto">
              <div className="mb-3 text-center sm:mb-5">
                <p className="font-royal text-[9px] font-semibold uppercase tracking-[0.3em] text-[#E4C77D]">
                  Until We Celebrate
                </p>
                <h2 id="celebration-heading" className="mt-1 font-royal text-xl font-bold text-[#F7EAD1] sm:text-2xl">
                  The Celebration Awaits
                </h2>
              </div>
              <ClosingBlessings wedding={wedding} />
            </div>
          </section>

          <section
            id="lantern-finale"
            ref={finaleRef}
            data-scroll-stage
            aria-labelledby="finale-heading"
            className="relative flex min-h-dvh items-center justify-center px-4 py-16 text-center"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#090E1B]/50 via-[#10172A]/50 to-[#080C16]/75" />
            <div className="relative w-full max-w-3xl pointer-events-auto">
              <p className="font-royal text-[9px] font-semibold uppercase tracking-[0.32em] text-[#E7D7AC]">
                A wish carried to the night sky
              </p>
              <h2 id="finale-heading" className="mt-2 font-script-luxury text-4xl text-[#F7E4B7] sm:text-5xl">
                Your lantern awaits
              </h2>
              <p className="mx-auto mt-2 max-w-xl font-serif text-sm italic text-[#EEE6D7]/80">
                May its warm light carry our gratitude into the Lahore night.
              </p>

              <button
                type="button"
                onClick={() => scrollTo(0)}
                className="mx-auto mt-5 block rounded-full border border-[#D8B66D]/45 bg-[#15131B]/75 px-5 py-2.5 font-royal text-[9px] font-bold uppercase tracking-[0.18em] text-[#F3E4C5] transition hover:bg-[#302439]"
              >
                Walk Through Again
              </button>
            </div>
          </section>
        </div>
      </div>

      <AudioControl
        isMuted={isAudioMuted}
        unavailable={audioUnavailable}
        onToggle={toggleAudio}
      />
    </main>
  );
}

export function InvitationExperience({ experience }: InvitationExperienceProps) {
  return (
    <SmoothScrollProvider>
      <InvitationJourney experience={experience} />
    </SmoothScrollProvider>
  );
}
