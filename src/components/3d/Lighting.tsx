'use client';

import React, { Suspense } from 'react';
import { Environment } from '@react-three/drei';

export function Lighting() {
  return (
    <>
      {/* Warm Ambient Studio Fill */}
      <ambientLight intensity={0.85} color="#FFF8EC" />

      {/* Main Studio Key Light for Paper Shadows */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.1}
        color="#FFF0D8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
      />

      {/* Specular Golden Rim Light for metallic foil glints */}
      <directionalLight position={[-4, 3, -2]} intensity={1.3} color="#FFD98A" />

      {/* Warm lower bounce fill */}
      <directionalLight position={[0, -4, 2]} intensity={0.65} color="#DFCA94" />

      {/* Subtle front light for card clarity */}
      <pointLight position={[0, 0, 4]} intensity={0.75} color="#FFF8EC" distance={8} />

      {/* HDR Environment Reflections for Metallic Gold & Wax Sheen */}
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.45} />
      </Suspense>
    </>
  );
}
