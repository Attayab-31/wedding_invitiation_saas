'use client';

import React, { useState, useEffect, Suspense, Component, ErrorInfo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Lighting } from './Lighting';
import { PetalsInstanced } from './PetalsInstanced';
import { GoldDust } from './GoldDust';
import { EnvelopeModel } from './EnvelopeModel';
import { WebGLFallback } from './WebGLFallback';
import { Sparkles, Loader } from 'lucide-react';

interface InvitationCanvasProps {
  isOpen: boolean;
  onOpen: () => void;
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

export function InvitationCanvas({
  isOpen,
  onOpen,
  guestName,
  coupleNames,
}: InvitationCanvasProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Detect WebGL capability safely in browser
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // During SSR or before test
  if (webglSupported === false) {
    return (
      <WebGLFallback
        isOpen={isOpen}
        onOpen={onOpen}
        guestName={guestName}
        coupleNames={coupleNames}
      />
    );
  }

  return (
    <div className="relative w-full h-[520px] md:h-[620px] max-w-4xl mx-auto flex items-center justify-center">
      <CanvasErrorBoundary
        fallback={
          <WebGLFallback
            isOpen={isOpen}
            onOpen={onOpen}
            guestName={guestName}
            coupleNames={coupleNames}
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
          camera={{ position: [0, 0, 5.8], fov: 42 }}
          className="cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <Lighting />
            <PetalsInstanced count={42} />
            <GoldDust count={90} />
            <EnvelopeModel
              isOpen={isOpen}
              onOpen={onOpen}
              guestName={guestName}
              coupleNames={coupleNames}
            />
          </Suspense>
        </Canvas>

        {/* Seal Interaction Call-To-Action Overlay */}
        {!isOpen && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2">
            <button
              onClick={onOpen}
              className="pointer-events-auto flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#3A0715] via-[#580F25] to-[#3A0715] border border-[#C5A15A] text-[#E6D2A0] shadow-[0_0_20px_rgba(197,161,90,0.35)] hover:shadow-[0_0_30px_rgba(197,161,90,0.6)] hover:scale-105 active:scale-95 transition-all text-sm font-royal tracking-widest uppercase cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C5A15A] animate-pulse" />
              <span>Tap to Open Invitation</span>
              <Sparkles className="w-4 h-4 text-[#C5A15A] animate-pulse" />
            </button>
            <p className="text-xs text-[#E6D2A0]/70 font-serif italic tracking-wide">
              Click the royal wax seal or button to unseal
            </p>
          </div>
        )}
      </CanvasErrorBoundary>
    </div>
  );
}
