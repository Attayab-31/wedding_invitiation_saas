'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, Component, ErrorInfo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { Lighting } from './Lighting';
import { PetalsInstanced } from './PetalsInstanced';
import { GoldDust } from './GoldDust';
import { EnvelopeModel } from './EnvelopeModel';
import { WebGLFallback } from './WebGLFallback';

interface InvitationCanvasProps {
  isOpen: boolean;
  isDiving: boolean;
  onOpen: () => void;
  onDiveComplete: () => void;
  guestName: string;
  coupleNames: string;
}

// Error boundary to capture WebGL context loss or crashes
class CanvasErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL / R3F Canvas error caught, falling back to 3D CSS:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Orchestrates the cinematic camera dive towards the nested invitation cards inside the envelope
function CameraController({
  isDiving,
  isOpen,
  onDiveComplete,
}: {
  isDiving: boolean;
  isOpen: boolean;
  onDiveComplete: () => void;
}) {
  const { camera, size } = useThree();
  const isAnimating = useRef(false);

  // Compute responsive baseline camera distance
  const getBaseZ = useCallback(() => {
    const aspect = size.width / Math.max(1, size.height);
    if (aspect < 1.25) {
      return Math.max(6.6, 2.25 / (Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360) * aspect));
    }
    return 6.6;
  }, [camera, size.width, size.height]);

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    if (isDiving) {
      isAnimating.current = true;

      // Cinematic Camera Dive:
      // Flap swings open, revealing layered cards nestled inside the pocket, then camera swoops right into the card suite
      const tl = gsap.timeline();

      tl.to(camera.position, {
        x: 0,
        y: 0.22,
        z: 2.05,
        duration: 1.35,
        ease: 'power2.inOut',
        delay: 0.65,
        onComplete: () => {
          isAnimating.current = false;
          onDiveComplete();
        },
      });

      tl.to(camera.rotation, {
        x: -0.02,
        y: 0,
        z: 0,
        duration: 1.35,
        ease: 'power2.inOut',
      }, '<');
    } else if (!isDiving && isOpen) {
      // Reversible smooth glide back out when returning from deck to envelope view
      const baseZ = getBaseZ();
      gsap.to(camera.position, {
        x: 0,
        y: 0.05,
        z: baseZ,
        duration: 1.1,
        ease: 'power2.out',
      });
      gsap.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.1,
        ease: 'power2.out',
      });
    }
  }, [isDiving, isOpen, camera, onDiveComplete, getBaseZ]);

  // Adjust camera distance when browser window resizes
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera && !isDiving && !isAnimating.current) {
      const baseZ = getBaseZ();
      camera.position.z = baseZ;
      camera.position.y = 0.05;
      camera.updateProjectionMatrix();
    }
  }, [size.width, size.height, camera, isDiving, getBaseZ]);

  return null;
}

export function InvitationCanvas({
  isOpen,
  isDiving,
  onOpen,
  onDiveComplete,
  guestName,
  coupleNames,
}: InvitationCanvasProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (webglSupported === false) {
    return (
      <WebGLFallback
        isOpen={isOpen}
        onOpen={onOpen}
        guestName={guestName}
        coupleNames={coupleNames}
        isDiving={isDiving}
        onDiveComplete={onDiveComplete}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <CanvasErrorBoundary
        fallback={
          <WebGLFallback
            isOpen={isOpen}
            onOpen={onOpen}
            guestName={guestName}
            coupleNames={coupleNames}
            isDiving={isDiving}
            onDiveComplete={onDiveComplete}
          />
        }
      >
        <Canvas
          shadows
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.05, 6.6], fov: 42 }}
          className="cursor-grab active:cursor-grabbing w-full h-full"
        >
          <CameraController
            isDiving={isDiving}
            isOpen={isOpen}
            onDiveComplete={onDiveComplete}
          />
          <Suspense fallback={null}>
            <Lighting />
            <PetalsInstanced count={42} />
            <GoldDust count={85} />
            <EnvelopeModel
              isOpen={isOpen}
              onOpen={onOpen}
              guestName={guestName}
              coupleNames={coupleNames}
              isDiving={isDiving}
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
