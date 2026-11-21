'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Lenis, { type VirtualScrollData } from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollContextValue {
  setLocked: (locked: boolean) => void;
  scrollTo: (target: number | HTMLElement) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

gsap.registerPlugin(ScrollTrigger);

function canScrollWithinContent(target: EventTarget | null, direction: number) {
  const content = target instanceof Element
    ? target.closest<HTMLElement>('[data-scroll-content]')
    : null;
  if (!content || content.scrollHeight <= content.clientHeight) return false;

  return direction > 0
    ? content.scrollTop + content.clientHeight < content.scrollHeight - 1
    : content.scrollTop > 0;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (
    target.isContentEditable ||
    target.closest('button, a, input, textarea, select, [role="textbox"], [data-scroll-content]') !== null
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used inside SmoothScrollProvider.');
  }
  return context;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isInitialLockRef = useRef(true);
  const isLockedRef = useRef(true);
  const isNavigatingRef = useRef(false);
  const wheelDistanceRef = useRef(0);
  const wheelResetTimerRef = useRef<number | null>(null);
  const keyGestureActiveRef = useRef(false);
  const touchNavigationRef = useRef(false);
  const touchDirectionRef = useRef(0);
  const touchDistanceRef = useRef(0);
  const [isLocked, setIsLocked] = useState(true);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const navigateStage = useCallback((direction: number) => {
    if (isLockedRef.current || isNavigatingRef.current || direction === 0) return;

    const stages = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-stage]'));
    if (stages.length < 2) return;

    let currentIndex = 0;
    stages.forEach((stage, index) => {
      if (stage.getBoundingClientRect().top <= 1) currentIndex = index;
    });

    const target = stages[currentIndex + Math.sign(direction)];
    if (!target) return;

    isNavigatingRef.current = true;
    const finishNavigation = () => {
      isNavigatingRef.current = false;
    };
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.15,
        lock: true,
        onComplete: finishNavigation,
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
      window.setTimeout(finishNavigation, 1300);
    }
  }, []);

  const setLocked = useCallback((locked: boolean) => {
    isLockedRef.current = locked;
    if (locked) {
      isNavigatingRef.current = false;
      touchNavigationRef.current = false;
      wheelDistanceRef.current = 0;
      if (wheelResetTimerRef.current !== null) {
        window.clearTimeout(wheelResetTimerRef.current);
        wheelResetTimerRef.current = null;
      }
    }
    setIsLocked(locked);
  }, []);

  const scrollTo = useCallback((target: number | HTMLElement) => {
    isNavigatingRef.current = true;
    const finishNavigation = () => {
      isNavigatingRef.current = false;
    };
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.3,
        lock: true,
        onComplete: finishNavigation,
      });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
      window.setTimeout(finishNavigation, 1450);
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(finishNavigation, 1450);
    }
  }, []);

  useEffect(() => {
    const virtualScroll = ({ event, deltaY }: VirtualScrollData) => {
      if (event.type === 'wheel') {
        const wheelEvent = event as WheelEvent;
        if (wheelEvent.ctrlKey || deltaY === 0) return true;
        if (canScrollWithinContent(wheelEvent.target, deltaY)) {
          wheelDistanceRef.current = 0;
          if (wheelResetTimerRef.current !== null) {
            window.clearTimeout(wheelResetTimerRef.current);
            wheelResetTimerRef.current = null;
          }
          return true;
        }

        if (wheelEvent.cancelable) wheelEvent.preventDefault();
        if (isLockedRef.current || isNavigatingRef.current) {
          wheelDistanceRef.current = 0;
          if (wheelResetTimerRef.current !== null) {
            window.clearTimeout(wheelResetTimerRef.current);
            wheelResetTimerRef.current = null;
          }
          return false;
        }
        wheelDistanceRef.current += deltaY;

        if (wheelResetTimerRef.current !== null) {
          window.clearTimeout(wheelResetTimerRef.current);
        }
        wheelResetTimerRef.current = window.setTimeout(() => {
          const direction = Math.sign(wheelDistanceRef.current);
          wheelDistanceRef.current = 0;
          wheelResetTimerRef.current = null;
          navigateStage(direction);
        }, 360);
        return false;
      }

      if (event.type === 'touchstart') {
        touchNavigationRef.current = false;
        touchDirectionRef.current = 0;
        touchDistanceRef.current = 0;
        return true;
      }

      if (event.type === 'touchmove') {
        const touchEvent = event as TouchEvent;
        if (
          touchEvent.touches.length > 1 ||
          deltaY === 0 ||
          canScrollWithinContent(touchEvent.target, deltaY)
        ) {
          return true;
        }

        if (touchEvent.cancelable) touchEvent.preventDefault();
        if (isLockedRef.current || isNavigatingRef.current) return false;
        touchNavigationRef.current = true;
        touchDistanceRef.current += deltaY;
        touchDirectionRef.current = Math.sign(touchDistanceRef.current);
        return false;
      }

      if (event.type === 'touchend' && touchNavigationRef.current) {
        if (event.cancelable) event.preventDefault();
        if (Math.abs(touchDistanceRef.current) >= 40) {
          navigateStage(touchDirectionRef.current);
        }
        touchNavigationRef.current = false;
        touchDirectionRef.current = 0;
        touchDistanceRef.current = 0;
        return false;
      }

      return true;
    };

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.05,
      prevent: (node) => node.hasAttribute('data-scroll-content'),
      virtualScroll,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    const onKeyDown = (event: KeyboardEvent) => {
      if (isLockedRef.current || isInteractiveTarget(event.target)) return;

      let direction = 0;
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === 'End') direction = 1;
      if (event.key === 'ArrowUp' || event.key === 'PageUp' || event.key === 'Home') direction = -1;
      if (event.key === ' ' && !event.shiftKey) direction = 1;
      if (event.key === ' ' && event.shiftKey) direction = -1;
      if (direction === 0) return;

      event.preventDefault();
      if (!keyGestureActiveRef.current) {
        keyGestureActiveRef.current = true;
        navigateStage(direction);
      }
    };
    const onKeyUp = () => {
      keyGestureActiveRef.current = false;
    };

    lenisRef.current = lenis;
    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', updateScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (wheelResetTimerRef.current !== null) {
        window.clearTimeout(wheelResetTimerRef.current);
      }
    };
  }, [navigateStage]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (isLocked && isInitialLockRef.current) {
      isInitialLockRef.current = false;
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true });
    }

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
