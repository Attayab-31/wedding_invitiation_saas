'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PetalsProps {
  count?: number;
}

export function PetalsInstanced({ count = 48 }: PetalsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate curved organic petal geometry
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.08, 0.12, 0.15, 0.28, 0.09, 0.4);
    shape.bezierCurveTo(0.04, 0.48, -0.04, 0.48, -0.09, 0.4);
    shape.bezierCurveTo(-0.15, 0.28, -0.08, 0.12, 0, 0);
    const geo = new THREE.ShapeGeometry(shape, 8);
    geo.center();
    return geo;
  }, []);

  // Pre-generate particle initial states
  const particles = useMemo(() => {
    const temp = [];
    const colors = [
      new THREE.Color('#9E1B32'), // Deep Velvet Rose
      new THREE.Color('#580F25'), // Royal Maroon
      new THREE.Color('#D97706'), // Marigold Amber
      new THREE.Color('#C5A15A'), // Antique Gold leaf
      new THREE.Color('#B91C1C'), // Festive Crimson
    ];

    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 12 + 2,
          (Math.random() - 0.5) * 8 - 1
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        ),
        speedY: 0.4 + Math.random() * 0.6,
        driftX: (Math.random() - 0.5) * 0.3,
        scale: 0.5 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Apply colors once on mount
  useMemo(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      meshRef.current!.setColorAt(i, p.color);
    });
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [particles]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      // Flutter and drift downwards
      p.position.y -= p.speedY * delta;
      p.position.x += Math.sin(state.clock.elapsedTime + i) * 0.15 * delta + p.driftX * delta;
      p.rotation.x += p.rotationSpeed.x * delta;
      p.rotation.y += p.rotationSpeed.y * delta;
      p.rotation.z += p.rotationSpeed.z * delta;

      // Wrap around when falling past bottom
      if (p.position.y < -6) {
        p.position.y = 7;
        p.position.x = (Math.random() - 0.5) * 14;
      }

      dummy.position.copy(p.position);
      dummy.rotation.copy(p.rotation);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, undefined, count]}
      receiveShadow
    >
      <meshStandardMaterial
        roughness={0.45}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
