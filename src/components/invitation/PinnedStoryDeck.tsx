'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ResolvedGuestExperience } from '@/types/database';
import { EventDetailCard } from './scenes/EventDetailCard';
import { RSVPForm } from './scenes/RSVPForm';
import { ClosingBlessings } from './scenes/ClosingBlessings';
import { ChevronDown } from 'lucide-react';

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
  // 0: Invocation & Family Introduction
  // 1..events.length: Each permitted ceremony (Mehndi, Barat, Walima)
  // events.length + 1: RSVP Form
  // events.length + 2: Countdown & Blessings
  const totalSteps = 1 + events.length + 1 + 1;

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const stepTitles = [
    'Invocation',
    ...events.map((e) => e.event_type.charAt(0).toUpperCase() + e.event_type.slice(1)),
    'RSVP',
    'Countdown',
  ];

  useEffect(() => {
    if (!containerRef.current || !deckWrapperRef.current) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    // Initialize 3D perspective on cards: Card 0 visible flat, rest prepared below
    cards.forEach((card, index) => {
      if (index === 0) {
        gsap.set(card, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          transformPerspective: 1200,
          pointerEvents: 'auto',
          zIndex: 10,
        });
      } else {
        gsap.set(card, {
          opacity: 0,
          scale: 0.95,
          y: 70,
          rotateX: -8,
          transformPerspective: 1200,
          pointerEvents: 'none',
          zIndex: 1,
        });
      }
    });

    const ctx = gsap.context(() => {
      // 1200px scroll depth per card transition for fluid, tactile response
      const scrollDistance = (cards.length - 1) * 1200;

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

      // Realistic physical card lift & settle animation chain
      for (let i = 0; i < cards.length - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];

        const stepStartTime = i * 1.5;

        // Departing card: lifts up and tilts away on perspective like lifting stationery paper
        tl.to(
          currentCard,
          {
            opacity: 0,
            scale: 0.92,
            y: -75,
            rotateX: 10,
            pointerEvents: 'none',
            zIndex: 1,
            duration: 0.8,
            ease: 'power2.in',
          },
          stepStartTime
        );

        // Arriving card: glides up into place, un-tilts, and settles flat
        tl.fromTo(
          nextCard,
          {
            opacity: 0,
            scale: 0.95,
            y: 75,
            rotateX: -10,
            pointerEvents: 'none',
            zIndex: 10,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
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
        height: `${totalSteps * 100}vh`,
      }}
    >
      {/* Pinned Stage Wrapper (Stays fixed in viewport while scrolling through all cards) */}
      <div
        ref={deckWrapperRef}
        className="w-full h-screen sticky top-0 flex flex-col justify-between items-center py-6 px-4 overflow-hidden"
      >
        {/* Editorial Top Chapter Indicator */}
        <div className="relative z-30 flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#B88E3E]/30 shadow-sm text-xs font-royal">
          {stepTitles.map((title, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => scrollToStep(idx)}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#580F25] text-[#FAF7F2] shadow-sm'
                    : 'text-[#6B4E3D] hover:text-[#3A0715] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="opacity-60 mr-1 text-[10px]">{romanNumerals[idx]}.</span>
                <span>{title}</span>
              </button>
            );
          })}
        </div>

        {/* Central Stage: Cards stacked on top of each other in 3D perspective */}
        <div
          className="relative w-full max-w-3xl flex-1 flex items-center justify-center my-auto"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {/* Card 0: Invocation & Introduction Card */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto stationery-card gold-corners p-8 md:p-12 rounded-2xl text-center shadow-xl will-change-transform"
          >
            <div className="mb-4">
              <p className="font-serif italic text-3xl md:text-4xl text-burgundy-gradient tracking-wide mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D3B] font-royal font-semibold">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </div>

            <blockquote className="my-5 px-6 py-4 border-y border-[#B88E3E]/30 bg-[#FAF7F2]/80 rounded-xl">
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
            </div>
          </div>

          {/* Cards 1..events.length: Each Event Detail Card */}
          {events.map((event, idx) => (
            <div
              key={event.id}
              ref={(el) => { cardsRef.current[1 + idx] = el; }}
              className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto will-change-transform"
            >
              <EventDetailCard event={event} index={idx} />
            </div>
          ))}

          {/* Card events.length + 1: RSVP Form Card */}
          <div
            ref={(el) => { cardsRef.current[1 + events.length] = el; }}
            className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto will-change-transform"
          >
            <RSVPForm token={token} guestName={guest.display_name} events={events} />
          </div>

          {/* Card events.length + 2: Countdown & Closing Blessings Card */}
          <div
            ref={(el) => { cardsRef.current[1 + events.length + 1] = el; }}
            className="absolute inset-x-0 mx-auto w-full max-h-[82vh] overflow-y-auto will-change-transform"
          >
            <ClosingBlessings wedding={wedding} />
          </div>
        </div>

        {/* Bottom Editorial Scroll Cue */}
        <div className="relative z-30 text-center pb-2 flex items-center justify-center gap-2 text-[11px] text-[#8C6D3B] font-royal font-semibold tracking-wider">
          <span>{activeStep + 1} of {totalSteps}</span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1">
            <span>Scroll {activeStep === totalSteps - 1 ? 'up to revisit' : 'down for next chapter'}</span>
            <ChevronDown className="w-3.5 h-3.5 inline" />
          </span>
        </div>
      </div>
    </div>
  );
}
