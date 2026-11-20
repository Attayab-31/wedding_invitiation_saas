'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ResolvedGuestExperience } from '@/types/database';
import { EventDetailCard } from './scenes/EventDetailCard';
import { ClosingBlessings } from './scenes/ClosingBlessings';

interface PinnedStoryDeckProps {
  experience: ResolvedGuestExperience;
  token: string;
}

export function PinnedStoryDeck({
  experience,
}: PinnedStoryDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);
  const isTransitioning = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const pendingTouchStep = useRef<number | null>(null);
  const goToStepRef = useRef<(targetStep: number) => void>(() => {});
  const transitionIdRef = useRef(0);
  const transitionTimeoutRef = useRef<number | null>(null);
  const wheelGestureActive = useRef(false);
  const lastWheelTime = useRef(0);

  const { guest, wedding, events } = experience;

  // Deck sequence:
  // 0: Invocation & Introduction
  // 1..events.length: Each permitted ceremony (Mehndi, Barat)
  // 1 + events.length: Countdown & Blessings
  const totalSteps = 1 + events.length + 1;

  const stepTitles = [
    'Invocation',
    ...events.map((e) => e.event_type.charAt(0).toUpperCase() + e.event_type.slice(1)),
    'Countdown',
  ];

  const finishTransition = useCallback((transitionId: number) => {
    if (transitionId !== transitionIdRef.current) return;

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    isTransitioning.current = false;
    const pendingStep = pendingTouchStep.current;
    pendingTouchStep.current = null;
    if (pendingStep !== null) {
      goToStepRef.current(pendingStep);
    }
  }, []);

  // Navigate to a specific step with luxury stationery transition
  const goToStep = useCallback(
    (targetStep: number) => {
      if (
        isTransitioning.current ||
        targetStep === activeStep ||
        targetStep < 0 ||
        targetStep >= totalSteps
      ) return;

      const currentCard = cardsRef.current[activeStep];
      const nextCard = cardsRef.current[targetStep];

      isTransitioning.current = true;
      const currentTransitionId = ++transitionIdRef.current;
      transitionTimeoutRef.current = window.setTimeout(
        () => finishTransition(currentTransitionId),
        600
      );
      activeStepRef.current = targetStep;
      const direction = targetStep > activeStep ? 1 : -1;

      if (currentCard) {
        gsap.to(currentCard, {
          opacity: 0,
          scale: 0.95,
          y: -30 * direction,
          rotateX: 4 * direction,
          duration: 0.35,
          ease: 'power2.in',
          pointerEvents: 'none',
        });
      }

      if (nextCard) {
        gsap.fromTo(
          nextCard,
          {
            opacity: 0,
            scale: 0.95,
            y: 35 * direction,
            rotateX: -5 * direction,
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            duration: 0.45,
            ease: 'power2.out',
            pointerEvents: 'auto',
            onComplete: () => {
              finishTransition(currentTransitionId);
            },
          }
        );
      } else {
        finishTransition(currentTransitionId);
      }

      setActiveStep(targetStep);
    },
    [activeStep, totalSteps, finishTransition]
  );

  useEffect(() => {
    goToStepRef.current = goToStep;
  }, [goToStep]);

  useEffect(() => () => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  const goToNext = useCallback(() => {
    if (activeStep < totalSteps - 1) {
      goToStep(activeStep + 1);
    }
  }, [activeStep, totalSteps, goToStep]);

  const goToPrev = useCallback(() => {
    if (activeStep > 0) {
      goToStep(activeStep - 1);
    }
  }, [activeStep, goToStep]);

  // Initial Card Setup
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      if (index === 0) {
        gsap.set(card, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          pointerEvents: 'auto',
          zIndex: 10,
        });
      } else {
        gsap.set(card, {
          opacity: 0,
          scale: 0.95,
          y: 40,
          rotateX: -6,
          pointerEvents: 'none',
          zIndex: 1,
        });
      }
    });
  }, []);

  // Keyboard navigation (Left / Right / Up / Down arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Wheel listener: Scrolling mouse wheel or trackpad advances/reverses cards without screen scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime.current >= 500) {
        wheelGestureActive.current = false;
      }
      lastWheelTime.current = now;

      if (Math.abs(e.deltaY) <= 25 || wheelGestureActive.current) return;

      wheelGestureActive.current = true;
      if (isTransitioning.current) return;

      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [goToNext, goToPrev]);

  // Touch Swipe Handlers for mobile & tablet screens
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target;
    if (
      e.touches.length !== 1 ||
      (target instanceof Element && target.closest('a, button, input, textarea, select'))
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || !e.changedTouches[0]) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.max(absX, absY) < 48) return;

    const direction = absY >= absX
      ? (diffY > 0 ? 1 : -1)
      : (diffX > 0 ? 1 : -1);
    const targetStep = activeStepRef.current + direction;

    if (isTransitioning.current) {
      pendingTouchStep.current =
        targetStep >= 0 && targetStep < totalSteps ? targetStep : null;
      return;
    }

    goToStep(targetStep);
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      ref={containerRef}
      id="ceremonial-deck"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      style={{ touchAction: 'none' }}
      className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EFEB] to-[#FAF7F2] flex flex-col justify-between py-3 sm:py-5 px-3 sm:px-6 select-none"
    >
      {/* Central Viewport Stage: Single Card Visible at Any Time, Strictly Sized to Fit 100% of Screen */}
      <div
        className="relative w-full max-w-3xl flex-1 min-h-0 mx-auto flex items-center justify-center my-auto overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* Card 0: Invocation & Introduction Card */}
        <div
          ref={(el) => { cardsRef.current[0] = el; }}
          className="absolute inset-x-0 mx-auto w-full stationery-card gold-corners p-5 sm:p-7 md:p-9 rounded-2xl text-center shadow-xl will-change-transform flex flex-col justify-between max-h-[80dvh] overflow-hidden"
        >
          {/* Bismillah Header */}
          <div className="shrink-0">
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-burgundy-gradient tracking-wide mb-0.5">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-semibold">
              In the name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>

          {/* Quranic Verse */}
          <blockquote className="my-2 sm:my-2.5 px-3 sm:px-4 py-2 border-y border-[#B88E3E]/30 bg-[#FAF7F2]/80 rounded-xl shrink-0">
            <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#231713] leading-snug sm:leading-relaxed">
              &ldquo;And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.&rdquo;
            </p>
            <cite className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8C6D3B] font-royal mt-1 not-italic font-bold">
              — Surah Ar-Rum [30:21]
            </cite>
          </blockquote>

          {/* Host Families */}
          <div className="my-1 sm:my-1.5 shrink-0">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-0.5">
              Together With Their Families
            </span>
            <p className="font-serif text-sm sm:text-base md:text-lg text-[#3A0715] font-semibold">
              {wedding.host_names}
            </p>
          </div>

          {/* Couple Announcement */}
          <div className="my-1.5 sm:my-2 py-2 border-y border-[#B88E3E]/20 bg-gradient-to-r from-transparent via-[#F7F2E9] to-transparent shrink-0">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#6B4E3D] font-royal mb-0.5">
              Request the pleasure of your company to celebrate the wedding of
            </p>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-royal font-bold text-burgundy-gradient">
                {wedding.bride_name}
              </h2>
              <span className="font-script-luxury text-xl sm:text-2xl md:text-3xl text-[#B88E3E]">
                &amp;
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-royal font-bold text-burgundy-gradient">
                {wedding.groom_name}
              </h2>
            </div>
          </div>

          {/* Guest Invitation */}
          <div className="pt-1 shrink-0">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8C6D3B] font-royal font-semibold">
              Cordially Invited
            </span>
            <p className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#3A0715] mt-0.5">
              {guest.display_name}
            </p>
          </div>
        </div>

        {/* Cards 1..events.length: Each Event Detail Card */}
        {events.map((event, idx) => (
          <div
            key={event.id}
            ref={(el) => { cardsRef.current[1 + idx] = el; }}
            className="absolute inset-x-0 mx-auto w-full will-change-transform"
          >
            <EventDetailCard
              event={event}
              index={idx}
            />
          </div>
        ))}

        {/* Card events.length + 1: Countdown & Closing Blessings Card */}
        <div
          ref={(el) => { cardsRef.current[1 + events.length] = el; }}
          className="absolute inset-x-0 mx-auto w-full will-change-transform"
        >
          <ClosingBlessings
            wedding={wedding}
          />
        </div>
      </div>

      {/* Bottom Editorial Progress Bar: Clean indicator */}
      <footer className="relative z-30 flex items-center justify-center text-[11px] text-[#8C6D3B] font-royal font-semibold tracking-wider pt-1 shrink-0">
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFFDF9]/95 border border-[#B88E3E]/25 shadow-xs">
          <span>{activeStep + 1} of {totalSteps}</span>
          <span className="opacity-40">•</span>
          <span className="text-[#3A0715] font-bold">{stepTitles[activeStep]}</span>
        </div>
      </footer>
    </div>
  );
}
