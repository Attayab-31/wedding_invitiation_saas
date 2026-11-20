'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ResolvedGuestExperience } from '@/types/database';
import { EventDetailCard } from './scenes/EventDetailCard';
import { RSVPForm } from './scenes/RSVPForm';
import { ClosingBlessings } from './scenes/ClosingBlessings';
import { Sparkles, ChevronDown, ChevronUp, Users, Heart } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PinnedStoryDeckProps {
  experience: ResolvedGuestExperience;
  token: string;
}

export function PinnedStoryDeck({ experience, token }: PinnedStoryDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckWrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const { guest, wedding, events } = experience;

  // Deck sequence:
  // 0: Introduction (Family & Couple)
  // 1..events.length: Each permitted ceremony (Mehndi, Barat, Walima)
  // events.length + 1: RSVP Form
  // events.length + 2: Countdown & Closing Blessings
  const totalSteps = 1 + events.length + 1 + 1;

  const stepLabels = [
    'Introduction',
    ...events.map((e) => e.event_type.toUpperCase()),
    'RSVP',
    'Countdown & Blessings',
  ];

  useEffect(() => {
    if (!containerRef.current || !deckWrapperRef.current) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    // Reset initial states: card 0 visible, rest hidden
    cards.forEach((card, index) => {
      if (index === 0) {
        gsap.set(card, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto', zIndex: 10 });
      } else {
        gsap.set(card, { opacity: 0, scale: 0.9, y: 60, pointerEvents: 'none', zIndex: 1 });
      }
    });

    // Create pinned master timeline
    const ctx = gsap.context(() => {
      const scrollDistance = (cards.length - 1) * 1200; // 1200px per card transition

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: deckWrapperRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          snap: {
            snapTo: (value) => {
              const step = 1 / (cards.length - 1);
              return Math.round(value / step) * step;
            },
            duration: { min: 0.25, max: 0.5 },
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const currentStep = Math.min(
              cards.length - 1,
              Math.round(self.progress * (cards.length - 1))
            );
            setActiveStep(currentStep);
          },
        },
      });

      // Chain card transitions: Card i fades/scales out while Card i+1 scales/fades in
      for (let i = 0; i < cards.length - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];

        const stepStartTime = i * 1.5;

        // Current card departs
        tl.to(
          currentCard,
          {
            opacity: 0,
            scale: 0.88,
            y: -50,
            filter: 'blur(4px)',
            pointerEvents: 'none',
            zIndex: 1,
            duration: 0.8,
            ease: 'power2.in',
          },
          stepStartTime
        );

        // Next card arrives in the exact same place
        tl.fromTo(
          nextCard,
          {
            opacity: 0,
            scale: 0.92,
            y: 50,
            filter: 'blur(4px)',
            pointerEvents: 'none',
            zIndex: 10,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            pointerEvents: 'auto',
            duration: 0.8,
            ease: 'power2.out',
          },
          stepStartTime + 0.35
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === containerRef.current) st.kill();
      });
    };
  }, [events, totalSteps]);

  // Jump to specific step
  const scrollToStep = (stepIndex: number) => {
    if (!containerRef.current) return;
    const scrollDistance = (totalSteps - 1) * 1200;
    const targetOffset = containerRef.current.offsetTop + (stepIndex / (totalSteps - 1)) * scrollDistance;
    window.scrollTo({ top: targetOffset, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      id="ceremonial-deck"
      className="relative w-full bg-gradient-to-b from-[#FAF7F2] via-[#F4EFEB] to-[#FAF7F2]"
      style={{
        // Height allows sufficient scroll distance for all steps
        height: `${totalSteps * 100}vh`,
      }}
    >
      {/* Pinned Stage Wrapper (Stays fixed in viewport while scrolling through all cards) */}
      <div
        ref={deckWrapperRef}
        className="w-full h-screen sticky top-0 flex flex-col justify-between items-center py-6 px-4 overflow-hidden"
      >
        {/* Top Royal Step Indicator Dock */}
        <div className="relative z-30 flex items-center gap-1.5 md:gap-3 px-4 py-2 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#B88E3E]/40 shadow-md">
          {stepLabels.map((label, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => scrollToStep(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-royal font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#580F25] to-[#3A0715] text-[#FAF7F2] shadow-sm border border-[#DFCA94]'
                    : 'text-[#6B4E3D] hover:text-[#3A0715] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Central Stage: All cards positioned on top of each other */}
        <div className="relative w-full max-w-3xl flex-1 flex items-center justify-center my-auto">
          {/* Card 0: Introduction Card */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto mughal-border luxury-card p-6 md:p-12 rounded-2xl text-center shadow-2xl"
          >
            <div className="mb-4">
              <p className="font-serif italic text-3xl md:text-4xl text-burgundy-gradient tracking-wide mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-semibold">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </div>

            <blockquote className="my-5 px-5 py-4 border-y-2 border-[#B88E3E]/30 bg-[#FAF7F2]/80 rounded-xl">
              <p className="font-serif italic text-sm md:text-base text-[#231713] leading-relaxed">
                &ldquo;And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.&rdquo;
              </p>
              <cite className="block text-[10px] uppercase tracking-widest text-[#8C6D3B] font-royal mt-2 not-italic font-bold">
                — Surah Ar-Rum [30:21]
              </cite>
            </blockquote>

            <div className="my-5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-bold block mb-1">
                Together With Their Families
              </span>
              <p className="font-serif text-base md:text-lg text-[#3A0715] font-semibold">
                {wedding.host_names}
              </p>
            </div>

            <div className="my-6 py-4 border-y border-[#B88E3E]/20 bg-gradient-to-r from-transparent via-[#F7F2E9] to-transparent">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B4E3D] font-royal mb-2">
                Request the pleasure of your company to celebrate the wedding of
              </p>
              <h2 className="text-2xl md:text-4xl font-royal font-bold text-burgundy-gradient">
                {wedding.bride_name}
              </h2>
              <span className="font-script-luxury text-2xl md:text-3xl text-[#B88E3E] block my-0.5">
                &amp;
              </span>
              <h2 className="text-2xl md:text-4xl font-royal font-bold text-burgundy-gradient">
                {wedding.groom_name}
              </h2>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-[#8C6D3B] font-royal font-semibold">
                Cordially Invited
              </span>
              <p className="text-xl md:text-2xl font-serif font-bold text-[#3A0715] mt-0.5">
                {guest.display_name}
              </p>
              <p className="text-xs text-[#8C6D3B] font-serif italic mt-3 flex items-center justify-center gap-1">
                <span>Scroll down to reveal wedding ceremonies</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce inline" />
              </p>
            </div>
          </div>

          {/* Cards 1..events.length: Each Event Detail Card */}
          {events.map((event, idx) => (
            <div
              key={event.id}
              ref={(el) => { cardsRef.current[1 + idx] = el; }}
              className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto"
            >
              <EventDetailCard event={event} index={idx} />
            </div>
          ))}

          {/* Card events.length + 1: RSVP Form Card */}
          <div
            ref={(el) => { cardsRef.current[1 + events.length] = el; }}
            className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto"
          >
            <RSVPForm token={token} guestName={guest.display_name} events={events} />
          </div>

          {/* Card events.length + 2: Countdown & Closing Blessings Card */}
          <div
            ref={(el) => { cardsRef.current[1 + events.length + 1] = el; }}
            className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto"
          >
            <ClosingBlessings wedding={wedding} />
          </div>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="relative z-30 text-center pb-2 flex items-center justify-center gap-3 text-xs text-[#8C6D3B] font-royal font-semibold">
          <span>Card {activeStep + 1} of {totalSteps}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span>Scroll {activeStep === totalSteps - 1 ? 'up to revisit' : 'down for next card'}</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
}
