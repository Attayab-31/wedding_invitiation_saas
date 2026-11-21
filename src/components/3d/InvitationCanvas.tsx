'use client';

import React, { Component, ErrorInfo, Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ResolvedGuestExperience } from '@/types/database';
import { PalaceGatesScene } from './PalaceGatesScene';

interface InvitationCanvasProps {
  isOpen: boolean;
  onOpen: () => void;
  onGateOpenComplete: () => void;
  events: ResolvedGuestExperience['events'];
  isScrollUnlocked: boolean;
  isFinaleVisible: boolean;
  scrollTargetRef: React.RefObject<HTMLElement | null>;
  progressRef: React.RefObject<number>;
}

class CanvasErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('The 3D invitation scene could not render.', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="absolute inset-0 grid place-items-center bg-[#211812] px-6 text-center font-serif text-[#F4E9D3]"
        >
          The 3D courtyard could not be displayed. Your invitation details remain available below.
        </div>
      );
    }

    return this.props.children;
  }
}

type CameraControllerProps = Pick<
  InvitationCanvasProps,
  'isOpen' | 'onGateOpenComplete' | 'isScrollUnlocked' | 'events' | 'scrollTargetRef' | 'progressRef'
>;

function CameraController({
  isOpen,
  onGateOpenComplete,
  isScrollUnlocked,
  events,
  scrollTargetRef,
  progressRef,
}: CameraControllerProps) {
  const { camera } = useThree();
  const entryTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    entryTimelineRef.current?.kill();
    if (isScrollUnlocked) return;
    if (!isOpen) {
      camera.position.set(0, 0.45, 8);
      camera.rotation.set(0, 0, 0);
      return;
    }

    const timeline = gsap.timeline({
      onComplete: onGateOpenComplete,
    });
    entryTimelineRef.current = timeline;
    timeline.to(camera.position, {
      z: 3,
      duration: 1.2,
      ease: 'power2.inOut',
    }, 2);

    return () => {
      timeline.kill();
      entryTimelineRef.current = null;
    };
  }, [camera, isOpen, isScrollUnlocked, onGateOpenComplete]);

  useEffect(() => {
    const target = scrollTargetRef.current;
    if (
      !isScrollUnlocked ||
      !(camera instanceof THREE.PerspectiveCamera) ||
      !target
    ) {
      return;
    }

    const endZ = 3 - (events.length + 3) * 6;
    const scrollStops = events.length + 3;
    const tween = gsap.fromTo(
      camera.position,
      { z: 3 },
      {
        z: endZ,
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          snap: {
            snapTo: (progress) => Math.round(progress * scrollStops) / scrollStops,
            duration: { min: 0.2, max: 0.7 },
            delay: 0.08,
            ease: 'power1.inOut',
            inertia: false,
          },
          invalidateOnRefresh: true,
          onUpdate: (trigger) => {
            progressRef.current = trigger.progress;
          },
        },
      }
    );
    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      progressRef.current = 0;
    };
  }, [camera, events.length, isScrollUnlocked, progressRef, scrollTargetRef]);

  return null;
}

export function InvitationCanvas({
  isOpen,
  onOpen,
  onGateOpenComplete,
  events,
  isScrollUnlocked,
  isFinaleVisible,
  scrollTargetRef,
  progressRef,
}: InvitationCanvasProps) {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <CanvasErrorBoundary>
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.35]}
          camera={{ position: [0, 0.45, 8], fov: 42 }}
          className="h-full w-full"
        >
          <CameraController
            isOpen={isOpen}
            onGateOpenComplete={onGateOpenComplete}
            events={events}
            isScrollUnlocked={isScrollUnlocked}
            scrollTargetRef={scrollTargetRef}
            progressRef={progressRef}
          />
          <Suspense fallback={null}>
            <PalaceGatesScene
              isOpen={isOpen}
              onEnter={onOpen}
              events={events}
              isFinaleVisible={isFinaleVisible}
              progressRef={progressRef}
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
