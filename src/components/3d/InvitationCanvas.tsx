'use client';

import React, { useState, useEffect, Suspense, Component, ErrorInfo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Lighting } from './Lighting';
import { PetalsInstanced } from './PetalsInstanced';
import { GoldDust } from './GoldDust';
import { EnvelopeModel } from './EnvelopeModel';
import { WebGLFallback } from './WebGLFallback';
import { Sparkles } from 'lucide-react';

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
            <GoldDust count={85} />
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2">
            <button
              onClick={onOpen}
              className="pointer-events-auto flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#4A0A1C] via-[#630F28] to-[#4A0A1C] border-2 border-[#DFCA94] text-[#FAF7F2] shadow-[0_10px_30px_rgba(58,7,21,0.35)] hover:shadow-[0_12px_40px_rgba(184,142,62,0.4)] hover:scale-105 active:scale-95 transition-all text-xs md:text-sm font-royal font-bold tracking-widest uppercase cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#DFCA94] animate-pulse" />
              <span>Tap Royal Wax Seal to Open</span>
              <Sparkles className="w-4 h-4 text-[#DFCA94] animate-pulse" />
            </button>
            <p className="text-xs text-[#580F25] font-serif italic tracking-wide bg-[#FAF7F2]/90 px-3 py-0.5 rounded-full shadow-sm border border-[#B88E3E]/30">
              Click the monogram seal or button to unseal your invitation
            </p>
          </div>
        )}
      </CanvasErrorBoundary>
    </div>
  );
}
