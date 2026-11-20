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

  // Mouse tilt target
  const targetRotation = useRef({ x: 0, y: 0 });

  // Load the 3D GLB model
  const { scene } = useGLTF('/models/luxury_envelope.glb');

  // Clone scene so multiple instances or re-mounts don't clash
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Create High-Res Canvas Texture for the Personalized Card
  const cardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background Warm Ivory
    ctx.fillStyle = '#F8F1E5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper noise / vignette
    const gradient = ctx.createRadialGradient(512, 360, 100, 512, 360, 600);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(217, 198, 165, 0.35)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Double Gold Foil Border
    ctx.strokeStyle = '#C5A15A';
    ctx.lineWidth = 6;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

    // Decorative Corner Motifs
    ctx.fillStyle = '#C5A15A';
    const corners = [
      [56, 56],
      [canvas.width - 56, 56],
      [56, canvas.height - 56],
      [canvas.width - 56, canvas.height - 56],
    ];
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bismillah / Header Calligraphy
    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillStyle = '#580F25';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ', 512, 105);

    // Family invitation lead
    ctx.font = '300 18px "Times New Roman", serif';
    ctx.fillStyle = '#6B4F35';
    ctx.letterSpacing = '4px';
    ctx.fillText('TOGETHER WITH THEIR FAMILIES', 512, 165);

    // Couple Names
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillStyle = '#3A0715';
    ctx.fillText(coupleNames || 'Ahad & Maryam', 512, 235);

    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('Request the honour of your presence to celebrate their wedding', 512, 290);

    // Decorative gold separator line
    ctx.strokeStyle = '#C5A15A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(340, 325);
    ctx.lineTo(684, 325);
    ctx.stroke();

    // Prominent Guest Personalized Name
    ctx.font = 'italic 300 22px Georgia, serif';
    ctx.fillStyle = '#580F25';
    ctx.fillText('Especially Invited', 512, 375);

    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillStyle = '#3A0715';
    ctx.fillText(guestName || 'Honoured Guest', 512, 435);

    // Gold accent frame around guest name
    ctx.strokeStyle = 'rgba(197, 161, 90, 0.6)';
    ctx.strokeRect(220, 395, 584, 58);

    // Date & Venue prompt
    ctx.font = '400 18px "Times New Roman", serif';
    ctx.fillStyle = '#554133';
    ctx.fillText('DECEMBER 2026 • LAHORE, PAKISTAN', 512, 535);

    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('Scroll down for function details & RSVP', 512, 580);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
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

    // Apply custom personalized texture to the card
    if (cardMeshRef.current && cardTexture) {
      const cardMat = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.45,
        metalness: 0.1,
      });
      cardMeshRef.current.material = cardMat;
    }
  }, [clonedScene, cardTexture]);

  // GSAP Animation when isOpen toggles
  useEffect(() => {
    if (!flapPivotRef.current || !cardRootRef.current) return;

    const flap = flapPivotRef.current;
    const card = cardRootRef.current;
    const seal = waxSealRef.current;

    if (isOpen) {
      const tl = gsap.timeline();

      // 1. Wax Seal Pop & Fade
      if (seal) {
        tl.to(seal.scale, {
          x: 1.15,
          y: 1.15,
          z: 1.15,
          duration: 0.25,
          ease: 'power2.out',
        }).to(seal.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.35,
          ease: 'power2.in',
        }, '>-0.05');
      }

      // 2. Flap rotates open around X axis
      tl.to(flap.rotation, {
        x: -Math.PI * 0.96,
        duration: 1.1,
        ease: 'power3.inOut',
      }, '>-0.2');

      // 3. Card slides up & tilts forward for prominent readability
      tl.to(card.position, {
        y: 1.65,
        z: 0.32,
        duration: 1.3,
        ease: 'power3.out',
      }, '>-0.5')
      .to(card.rotation, {
        x: -0.08,
        duration: 1.3,
        ease: 'power2.out',
      }, '<');

    } else {
      // Reversible closure
      const tl = gsap.timeline();

      tl.to(card.position, {
        y: 0.05,
        z: 0.005,
        duration: 0.9,
        ease: 'power3.in',
      })
      .to(card.rotation, {
        x: 0,
        duration: 0.9,
      }, '<');

      tl.to(flap.rotation, {
        x: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      }, '>-0.1');

      if (seal) {
        tl.to(seal.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        });
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
        x: -y * 0.12,
        y: x * 0.18,
      };
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Frame tick for gentle ambient floating & smooth mouse tilt
  useFrame((state, delta) => {
    if (!rootGroup.current) return;

    // Gentle floating bob
    const floatOffset = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    rootGroup.current.position.y = floatOffset;

    // Smooth lerp to mouse tilt
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
