'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface EnvelopeModelProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  coupleNames: string;
}

export function EnvelopeModel({
  isOpen,
  onOpen,
  guestName,
  coupleNames,
}: EnvelopeModelProps) {
  const rootGroup = useRef<THREE.Group>(null);
  const flapPivotRef = useRef<THREE.Group | null>(null);
  const waxSealRef = useRef<THREE.Group | null>(null);
  const cardRootRef = useRef<THREE.Group | null>(null);
  const cardMeshRef = useRef<THREE.Mesh | null>(null);

  // Mouse tilt target for smooth physical parallax
  const targetRotation = useRef({ x: 0, y: 0 });

  // Load the 3D GLB model
  const { scene } = useGLTF('/models/luxury_envelope.glb');

  // Clone scene so multiple mounts or re-renders don't clash
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // High-Resolution 2048x1440 Canvas Texture for Hot-Foil Letterpress Card
  const cardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base: 600gsm Heavy Warm Ivory Cotton Paper
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper grain vignette
    const radGradient = ctx.createRadialGradient(1024, 720, 200, 1024, 720, 1200);
    radGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    radGradient.addColorStop(1, 'rgba(235, 224, 205, 0.45)');
    ctx.fillStyle = radGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Double Antique Gold Foil Hairline Border
    ctx.strokeStyle = '#C5A15A';
    ctx.lineWidth = 8;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    ctx.strokeStyle = '#DFCA94';
    ctx.lineWidth = 3;
    ctx.strokeRect(84, 84, canvas.width - 168, canvas.height - 168);

    // Corner Arabesque Rosettes
    ctx.fillStyle = '#C5A15A';
    const cornerPositions = [
      [110, 110],
      [canvas.width - 110, 110],
      [110, canvas.height - 110],
      [canvas.width - 110, canvas.height - 110],
    ];
    cornerPositions.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bismillah Calligraphy (Deep Burgundy)
    ctx.font = 'italic 52px Georgia, serif';
    ctx.fillStyle = '#4A081A';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ', 1024, 210);

    // Invitation Header
    ctx.font = '300 32px "Times New Roman", serif';
    ctx.fillStyle = '#6B4E3D';
    ctx.letterSpacing = '6px';
    ctx.fillText('TOGETHER WITH THEIR FAMILIES', 1024, 320);

    // Couple Names (Majestic Burgundy Serif)
    ctx.font = 'bold 92px Georgia, serif';
    ctx.fillStyle = '#3A0715';
    ctx.fillText(coupleNames || 'Ahad & Maryam', 1024, 460);

    ctx.font = 'italic 38px Georgia, serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('Request the honour of your gracious presence', 1024, 570);

    // Gold Divider Line
    ctx.strokeStyle = '#C5A15A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(680, 640);
    ctx.lineTo(1368, 640);
    ctx.stroke();

    // Guest Name Title
    ctx.font = '300 30px "Times New Roman", serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('ESPECIALLY INVITED', 1024, 730);

    // Prominent Guest Personalized Name
    ctx.font = 'bold 78px Georgia, serif';
    ctx.fillStyle = '#3A0715';
    ctx.fillText(guestName || 'Honoured Guest', 1024, 840);

    // Subtle Gold Border Box around Guest Name
    ctx.strokeStyle = 'rgba(197, 161, 90, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(440, 760, 1168, 116);

    // Date & Venue Details
    ctx.font = '400 34px "Times New Roman", serif';
    ctx.fillStyle = '#6B4E3D';
    ctx.fillText('DECEMBER 2026 • LAHORE, PAKISTAN', 1024, 1030);

    ctx.font = 'italic 32px Georgia, serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('Awaiting the pleasure of celebrating with you', 1024, 1120);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    return texture;
  }, [guestName, coupleNames]);

  // Find nodes in cloned scene
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.name === 'Envelope_Flap_Pivot') {
        flapPivotRef.current = child as THREE.Group;
      }
      if (child.name === 'Wax_Seal') {
        waxSealRef.current = child as THREE.Group;
      }
      if (child.name === 'Invitation_Card_Root') {
        cardRootRef.current = child as THREE.Group;
      }
      if (child.name === 'Invitation_Card') {
        cardMeshRef.current = child as THREE.Mesh;
      }
    });

    // Apply high-res texture to the card
    if (cardMeshRef.current && cardTexture) {
      const cardMat = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.5,
        metalness: 0.08,
      });
      cardMeshRef.current.material = cardMat;
    }
  }, [clonedScene, cardTexture]);

  // Realistic Physical Kinematic Animation
  useEffect(() => {
    if (!flapPivotRef.current || !cardRootRef.current) return;

    const flap = flapPivotRef.current;
    const card = cardRootRef.current;
    const seal = waxSealRef.current;

    if (isOpen) {
      const tl = gsap.timeline();

      // 1. Subtle physical unsealing lift of the wax seal
      if (seal) {
        tl.to(seal.position, {
          z: 0.055,
          duration: 0.25,
          ease: 'power2.out',
        });
      }

      // 2. Flap rotates open around top hinge (Wax seal stays firmly on flap tip and swings up with it)
      tl.to(flap.rotation, {
        x: -Math.PI * 0.94,
        duration: 1.1,
        ease: 'power3.inOut',
      }, '>-0.1');

      // 3. Card slides up out of the pocket and tilts toward the viewer
      tl.to(card.position, {
        y: 1.7,
        z: 0.35,
        duration: 1.25,
        ease: 'power3.out',
      }, '>-0.45')
      .to(card.rotation, {
        x: -0.06,
        duration: 1.25,
        ease: 'power2.out',
      }, '<');

    } else {
      // Reversible smooth closure
      const tl = gsap.timeline();

      tl.to(card.position, {
        y: 0.05,
        z: 0.005,
        duration: 0.85,
        ease: 'power3.in',
      })
      .to(card.rotation, {
        x: 0,
        duration: 0.85,
      }, '<');

      tl.to(flap.rotation, {
        x: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      }, '>-0.15');

      if (seal) {
        tl.to(seal.position, {
          z: 0.038,
          duration: 0.3,
          ease: 'power2.inOut',
        }, '>-0.1');
      }
    }
  }, [isOpen]);

  // Pointer hover parallax
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      targetRotation.current = {
        x: -y * 0.1,
        y: x * 0.16,
      };
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Frame tick for gentle ambient floating & smooth mouse tilt
  useFrame((state, delta) => {
    if (!rootGroup.current) return;

    // Gentle floating bob
    const floatOffset = Math.sin(state.clock.elapsedTime * 1.4) * 0.05;
    rootGroup.current.position.y = floatOffset;

    // Smooth dampening to pointer tilt
    rootGroup.current.rotation.x = THREE.MathUtils.damp(
      rootGroup.current.rotation.x,
      targetRotation.current.x,
      4,
      delta
    );
    rootGroup.current.rotation.y = THREE.MathUtils.damp(
      rootGroup.current.rotation.y,
      targetRotation.current.y,
      4,
      delta
    );
  });

  return (
    <group
      ref={rootGroup}
      onClick={(e) => {
        e.stopPropagation();
        if (!isOpen) onOpen();
      }}
      onPointerOver={() => {
        if (!isOpen) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the GLB model
useGLTF.preload('/models/luxury_envelope.glb');
