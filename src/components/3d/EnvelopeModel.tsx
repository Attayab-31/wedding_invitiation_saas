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
  isDiving?: boolean;
}

export function EnvelopeModel({
  isOpen,
  onOpen,
  guestName,
  coupleNames,
  isDiving,
}: EnvelopeModelProps) {
  const rootGroup = useRef<THREE.Group>(null);
  const flapPivotRef = useRef<THREE.Group | null>(null);
  const waxSealRef = useRef<THREE.Group | null>(null);
  const cardRootRef = useRef<THREE.Group | null>(null);
  const cardMeshRef = useRef<THREE.Mesh | null>(null);

  // Load the 3D GLB model
  const { scene } = useGLTF('/models/luxury_envelope.glb');

  // Clone scene so multiple mounts or re-renders don't clash
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // High-Resolution 2048x1440 Canvas Texture for the front ceremonial invitation card
  const cardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base: 600gsm Heavy Warm Ivory Cotton Paper
    ctx.fillStyle = '#F2E8D6';
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
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    ctx.strokeStyle = '#DFCA94';
    ctx.lineWidth = 3;
    ctx.strokeRect(75, 75, canvas.width - 150, canvas.height - 150);

    // Corner Arabesque Rosettes
    ctx.fillStyle = '#C5A15A';
    const cornerPositions = [
      [100, 100],
      [canvas.width - 100, 100],
      [100, canvas.height - 100],
      [canvas.width - 100, canvas.height - 100],
    ];
    cornerPositions.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bismillah Calligraphy (Deep Burgundy)
    ctx.font = 'italic 52px Georgia, serif';
    ctx.fillStyle = '#4A081A';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ', 1024, 185);

    // Invitation Header
    ctx.font = '300 30px "Times New Roman", serif';
    ctx.fillStyle = '#6B4E3D';
    ctx.letterSpacing = '6px';
    ctx.fillText('TOGETHER WITH THEIR FAMILIES', 1024, 280);

    // Couple Names (Majestic Burgundy Serif)
    ctx.font = 'bold 88px Georgia, serif';
    ctx.fillStyle = '#3A0715';
    ctx.fillText(coupleNames || 'Ahad & Maryam', 1024, 405);

    ctx.font = 'italic 36px Georgia, serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('Request the honour of your gracious presence', 1024, 505);

    // Gold Divider Line
    ctx.strokeStyle = '#C5A15A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(700, 565);
    ctx.lineTo(1348, 565);
    ctx.stroke();

    // Guest Name Title
    ctx.font = '300 28px "Times New Roman", serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('ESPECIALLY INVITED', 1024, 650);

    // Prominent Guest Personalized Name
    ctx.font = 'bold 74px Georgia, serif';
    ctx.fillStyle = '#3A0715';
    ctx.fillText(guestName || 'Honoured Guest', 1024, 755);

    // Subtle Gold Border Box around Guest Name
    ctx.strokeStyle = 'rgba(197, 161, 90, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(420, 680, 1208, 110);

    // Date & Venue Details
    ctx.font = '400 32px "Times New Roman", serif';
    ctx.fillStyle = '#6B4E3D';
    ctx.fillText('DECEMBER 2026 • LAHORE, PAKISTAN', 1024, 930);

    ctx.font = 'italic 30px Georgia, serif';
    ctx.fillStyle = '#8C6D3B';
    ctx.fillText('Awaiting the pleasure of celebrating with you', 1024, 1020);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    return texture;
  }, [guestName, coupleNames]);

  // Find nodes in cloned scene & set up the layered luxury card suite
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
        child.visible = true;
      }
      if (child.name === 'Invitation_Card') {
        cardMeshRef.current = child as THREE.Mesh;
        child.visible = true;
      }
    });

    // Apply high-res gold letterpress texture to the front invitation card
    if (cardMeshRef.current && cardTexture) {
      const cardMat = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.5,
        metalness: 0.08,
      });
      cardMeshRef.current.material = cardMat;
    }

    // Add a secondary layered function card (e.g. Mehndi / Barat insert) behind the main card
    // This gives the envelope that unmistakable rich, tiered, multi-card feel
    if (cardRootRef.current && !cardRootRef.current.getObjectByName('Secondary_Insert_Card')) {
      const insertGeo = new THREE.BoxGeometry(3.15, 2.05, 0.01);
      const insertMat = new THREE.MeshStandardMaterial({
        color: 0xDFCA94, // Champagne gold shimmer insert
        roughness: 0.35,
        metalness: 0.45,
      });
      const insertMesh = new THREE.Mesh(insertGeo, insertMat);
      insertMesh.name = 'Secondary_Insert_Card';
      insertMesh.position.set(-0.06, 0.07, -0.015);
      cardRootRef.current.add(insertMesh);
    }
  }, [clonedScene, cardTexture]);

  // Realistic Physical Kinematic Animation: Flap opens and cards settle gracefully inside the pocket
  useEffect(() => {
    if (!flapPivotRef.current) return;

    const flap = flapPivotRef.current;
    const seal = waxSealRef.current;
    const card = cardRootRef.current;

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

      // 2. Flap rotates open around top hinge (Wax seal swings open with it)
      tl.to(flap.rotation, {
        x: -Math.PI * 0.94,
        duration: 1.05,
        ease: 'power3.inOut',
      }, '>-0.08');

      // 3. The card suite does a subtle, elegant rise of 0.15 units inside the pocket,
      // remaining snugly nestled inside the envelope without ever shooting out or clipping
      if (card) {
        tl.to(card.position, {
          y: 0.18,
          z: 0.03,
          duration: 1.1,
          ease: 'power3.out',
        }, '>-0.5')
        .to(card.rotation, {
          x: -0.03,
          duration: 1.1,
          ease: 'power2.out',
        }, '<');
      }

    } else {
      // Reversible smooth closure
      const tl = gsap.timeline();

      if (card) {
        tl.to(card.position, {
          y: 0.05,
          z: 0.005,
          duration: 0.75,
          ease: 'power3.in',
        })
        .to(card.rotation, {
          x: 0,
          duration: 0.75,
        }, '<');
      }

      tl.to(flap.rotation, {
        x: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      }, '>-0.1');

      if (seal) {
        tl.to(seal.position, {
          z: 0.038,
          duration: 0.3,
          ease: 'power2.inOut',
        }, '>-0.1');
      }
    }
  }, [isOpen]);

  // Frame tick for gentle ambient floating
  useFrame((state, delta) => {
    if (!rootGroup.current) return;

    // Gentle floating bob when closed, perfectly stable when opened or diving
    const floatOffset = isOpen || isDiving ? 0 : Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
    rootGroup.current.position.y = THREE.MathUtils.damp(
      rootGroup.current.position.y,
      floatOffset,
      4,
      delta
    );
  });

  return (
    <group
      ref={rootGroup}
      scale={1.08}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
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
