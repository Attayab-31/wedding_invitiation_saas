'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function seededUnit(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function GoldDust({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededUnit(i * 3) - 0.5) * 12;
      pos[i * 3 + 1] = (seededUnit(i * 3 + 1) - 0.5) * 10;
      pos[i * 3 + 2] = (seededUnit(i * 3 + 2) - 0.5) * 6;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle floating upward
      pos[i * 3 + 1] += 0.2 * delta;
      pos[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.05 * delta;

      if (pos[i * 3 + 1] > 6) {
        pos[i * 3 + 1] = -5;
        pos[i * 3] = (Math.random() - 0.5) * 12;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#E6D2A0"
        transparent
        opacity={0.48}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
