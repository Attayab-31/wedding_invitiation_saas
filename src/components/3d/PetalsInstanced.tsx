'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PetalsProps {
  count?: number;
}

function seededUnit(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
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
      new THREE.Color('#C5A15A'), // Antique Gold leaf
      new THREE.Color('#B76E79'), // Muted rose
    ];

    for (let i = 0; i < count; i++) {
      const seed = i * 16;
      temp.push({
        position: new THREE.Vector3(
          (seededUnit(seed) - 0.5) * 14,
          (seededUnit(seed + 1) - 0.5) * 12 + 2,
          (seededUnit(seed + 2) - 0.5) * 8 - 1
        ),
        rotation: new THREE.Euler(
          seededUnit(seed + 3) * Math.PI * 2,
          seededUnit(seed + 4) * Math.PI * 2,
          seededUnit(seed + 5) * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (seededUnit(seed + 6) - 0.5) * 1.5,
          (seededUnit(seed + 7) - 0.5) * 1.5,
          (seededUnit(seed + 8) - 0.5) * 1.5
        ),
        speedY: 0.2 + seededUnit(seed + 9) * 0.3,
        driftX: (seededUnit(seed + 10) - 0.5) * 0.3,
        scale: 0.28 + seededUnit(seed + 11) * 0.3,
        color: colors[Math.floor(seededUnit(seed + 12) * colors.length)],
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    particles.forEach((p, i) => {
      mesh.setColorAt(i, p.color);
    });
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
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
