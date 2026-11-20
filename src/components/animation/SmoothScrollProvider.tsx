'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollContextValue {
  setLocked: (locked: boolean) => void;
  scrollTo: (target: number | HTMLElement) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used inside SmoothScrollProvider.');
  }
  return context;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isLocked, setIsLocked] = useState(true);

  const setLocked = useCallback((locked: boolean) => {
    setIsLocked(locked);
  }, []);

  const scrollTo = useCallback((target: number | HTMLElement) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.65 });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.05,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);

    lenisRef.current = lenis;
    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', updateScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = isLocked ? 'hidden' : '';
    body.style.overflow = isLocked ? 'hidden' : '';

    if (isLocked) lenisRef.current?.stop();
    else lenisRef.current?.start();

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isLocked]);

  return (
    <SmoothScrollContext.Provider value={{ setLocked, scrollTo }}>
      <div className="smooth-scroll-wrapper min-h-full w-full">{children}</div>
    </SmoothScrollContext.Provider>
  );
}
