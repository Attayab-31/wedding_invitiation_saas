'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ResolvedGuestExperience } from '@/types/database';
import { GoldDust } from './GoldDust';

type InvitationEvent = ResolvedGuestExperience['events'][number];

interface PalaceGatesSceneProps {
  isOpen: boolean;
  onEnter: () => void;
  events: InvitationEvent[];
  isRsvpConfirmed: boolean;
  progressRef: React.RefObject<number>;
}

interface EventPalette {
  stone: string;
  accent: string;
  light: string;
  flower: string;
}

const EVENT_PALETTES: Record<string, EventPalette> = {
  mehndi: { stone: '#C77B2E', accent: '#E8B342', light: '#FFB64D', flower: '#E78818' },
  barat: { stone: '#762637', accent: '#C6A15A', light: '#F06B48', flower: '#B3263D' },
  walima: { stone: '#CFC2A8', accent: '#E7D7AC', light: '#D8E4FF', flower: '#F4ECDD' },
  custom: { stone: '#75638B', accent: '#D6B775', light: '#CAB8FF', flower: '#9B7BC0' },
};

const courtyardColumns = Array.from({ length: 10 }, (_, index) => {
  const z = -7 - index * 6;
  return [-1, 1].map((side) => ({ x: side * 3.8, z, side }));
}).flat();

function FlickeringLantern({
  position,
  scale = 1,
  color = '#FFB64D',
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.8 + Math.sin(clock.elapsedTime * 4.5 + position[0]) * 0.16;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.18, 0.34, 8]} />
        <meshStandardMaterial color="#A66D25" metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.2, 0.2]} color={color} intensity={1.8} distance={5} />
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.38, 8]} />
        <meshStandardMaterial color="#8F642E" metalness={0.8} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.68, 0]} castShadow>
        <torusGeometry args={[0.18, 0.025, 8, 24]} />
        <meshStandardMaterial color="#C5A15A" metalness={0.82} roughness={0.24} />
      </mesh>
    </group>
  );
}

function PalaceDoor({ hinge, isOpen, onEnter }: {
  hinge: -1 | 1;
  isOpen: boolean;
  onEnter: () => void;
}) {
  const doorRef = useRef<THREE.Group>(null);
  const centerX = -hinge * 1.05;

  useEffect(() => {
    if (!doorRef.current) return;
    const tween = gsap.to(doorRef.current.rotation, {
      y: isOpen ? -hinge * Math.PI * 0.58 : 0,
      duration: 2,
      ease: 'power2.inOut',
    });

    return () => {
      tween.kill();
    };
  }, [hinge, isOpen]);

  return (
    <group ref={doorRef} position={[hinge * 2.1, 0, 0.1]}>
      <mesh position={[centerX, 1.86, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 3.72, 0.2]} />
        <meshStandardMaterial color="#492319" roughness={0.72} metalness={0.08} />
      </mesh>
      <mesh position={[centerX, 1.86, 0.115]} castShadow>
        <boxGeometry args={[1.84, 3.48, 0.055]} />
        <meshStandardMaterial color="#5B2B1B" roughness={0.65} metalness={0.06} />
      </mesh>

      {[0.38, 1.86, 3.34].map((y) => (
        <group key={y}>
          <mesh position={[centerX, y, 0.16]}>
            <boxGeometry args={[1.55, y === 1.86 ? 1.12 : 1.18, 0.045]} />
            <meshStandardMaterial color="#3D1A13" roughness={0.68} metalness={0.08} />
          </mesh>
          <mesh position={[centerX, y, 0.19]}>
            <boxGeometry args={[1.35, y === 1.86 ? 0.92 : 0.98, 0.035]} />
            <meshStandardMaterial color="#6B3A20" roughness={0.6} metalness={0.12} />
          </mesh>
          <mesh position={[centerX, y, 0.22]}>
            <dodecahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color="#C5A15A" metalness={0.84} roughness={0.25} />
          </mesh>
          <mesh position={[centerX, y, 0.32]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#F1D58B" metalness={0.78} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {[0.3, 1.86, 3.42].map((y) => (
        <mesh key={y} position={[0, y, 0.23]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.13]} />
          <meshStandardMaterial color="#A77C38" metalness={0.78} roughness={0.3} />
        </mesh>
      ))}

      <mesh position={[centerX, 1.86, 0.2]}>
        <boxGeometry args={[0.055, 3.3, 0.045]} />
        <meshStandardMaterial color="#C5A15A" metalness={0.78} roughness={0.3} />
      </mesh>
      {[0.18, 3.54].map((y) => (
        <mesh key={y} position={[centerX, y, 0.2]}>
          <boxGeometry args={[1.4, 0.055, 0.045]} />
          <meshStandardMaterial color="#C5A15A" metalness={0.78} roughness={0.3} />
        </mesh>
      ))}

      <mesh
        position={[centerX - hinge * 0.82, 1.92, 0.28]}
        onClick={(event) => {
          event.stopPropagation();
          onEnter();
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <torusGeometry args={[0.2, 0.035, 10, 28]} />
        <meshStandardMaterial
          color="#E5BC68"
          emissive="#D18D2D"
          emissiveIntensity={0.45}
          metalness={0.88}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[centerX - hinge * 0.82, 1.92, 0.285]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshStandardMaterial color="#F6D987" metalness={0.82} roughness={0.2} />
      </mesh>
      <pointLight position={[centerX - hinge * 0.82, 1.92, 0.5]} color="#EAB552" intensity={0.7} distance={2.4} />
    </group>
  );
}

function EventArch({ event, index }: { event: InvitationEvent; index: number }) {
  const palette = EVENT_PALETTES[event.event_type] ?? EVENT_PALETTES.custom;
  const archCurve = useMemo(() => {
    const points = Array.from({ length: 25 }, (_, pointIndex) => {
      const angle = Math.PI - (Math.PI * pointIndex) / 24;
      return new THREE.Vector3(2.15 * Math.cos(angle), 3.55 + 1.05 * Math.sin(angle), 0);
    });
    return new THREE.CatmullRomCurve3(points);
  }, []);
  const archZ = -13 - index * 6;

  return (
    <group position={[0, 0, archZ]}>
      <mesh position={[-2.15, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.38, 3.2, 12]} />
        <meshStandardMaterial color={palette.stone} roughness={0.76} />
      </mesh>
      <mesh position={[2.15, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.38, 3.2, 12]} />
        <meshStandardMaterial color={palette.stone} roughness={0.76} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.8, 0.16, 0.9]} />
        <meshStandardMaterial color={palette.accent} metalness={0.5} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <tubeGeometry args={[archCurve, 64, 0.2, 10, false]} />
        <meshStandardMaterial
          color={palette.accent}
          emissive={palette.light}
          emissiveIntensity={0.12}
          metalness={0.56}
          roughness={0.34}
        />
      </mesh>
      {[-1.45, -0.75, 0, 0.75, 1.45].map((x, flowerIndex) => (
        <mesh
          key={x}
          position={[x, 3.55 + 1.05 * Math.sqrt(Math.max(0, 1 - (x * x) / (2.15 * 2.15))), 0.11]}
          rotation={[0, 0, flowerIndex % 2 ? 0.3 : -0.3]}
        >
          <dodecahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            color={palette.flower}
            emissive={palette.flower}
            emissiveIntensity={0.08}
            roughness={0.7}
          />
        </mesh>
      ))}
      <FlickeringLantern position={[-2.5, 2.65, 0.18]} scale={0.62} color={palette.light} />
      <FlickeringLantern position={[2.5, 2.65, 0.18]} scale={0.62} color={palette.light} />
      <pointLight position={[0, 3.3, 1.2]} color={palette.light} intensity={1.3} distance={9} />
    </group>
  );
}

function SkyLantern({
  active,
  position,
  startTimeRef,
}: {
  active: boolean;
  position: [number, number, number];
  startTimeRef: React.RefObject<number | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !active) return;
    if (startTimeRef.current === null) startTimeRef.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - startTimeRef.current;
    groupRef.current.position.y = position[1] + Math.min(elapsed * 0.12, 1.1);
    groupRef.current.rotation.z = Math.sin(elapsed * 0.65) * 0.045;
    groupRef.current.rotation.y = Math.sin(elapsed * 0.3) * 0.12;
    if (flameRef.current) {
      flameRef.current.intensity = 1.3 + Math.sin(elapsed * 8) * 0.22;
    }
  });

  return (
    <group ref={groupRef} position={position} visible={active}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.29, 0.94, 6, 1, true]} />
        <meshStandardMaterial
          color="#F2B84A"
          emissive="#E9852C"
          emissiveIntensity={0.68}
          side={THREE.DoubleSide}
          transparent
          opacity={0.78}
          roughness={0.68}
        />
      </mesh>
      <mesh position={[0, 0.47, 0]}>
        <torusGeometry args={[0.39, 0.025, 6, 18]} />
        <meshStandardMaterial color="#D8B66D" metalness={0.86} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.47, 0]}>
        <torusGeometry args={[0.29, 0.025, 6, 18]} />
        <meshStandardMaterial color="#D8B66D" metalness={0.86} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.34, 0]}>
        <sphereGeometry args={[0.11, 10, 8]} />
        <meshBasicMaterial color="#FFF2AE" />
      </mesh>
      <pointLight ref={flameRef} position={[0, -0.18, 0]} color="#FFB746" intensity={1.3} distance={8} />
    </group>
  );
}

function FireworkBurst({
  active,
  position,
  startTimeRef,
  delay,
}: {
  active: boolean;
  position: [number, number, number];
  startTimeRef: React.RefObject<number | null>;
  delay: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const startedAt = startTimeRef.current;
    if (!active || startedAt === null) {
      groupRef.current.visible = false;
      return;
    }
    const cycle = (clock.elapsedTime - startedAt - delay + 12) % 4;
    const visible = cycle < 1.25;
    groupRef.current.visible = visible;
    if (visible) {
      const expansion = Math.sin((cycle / 1.25) * Math.PI);
      groupRef.current.scale.setScalar(0.35 + expansion * 0.72);
    }
  });

  return (
    <group ref={groupRef} position={position} visible={false}>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 12;
        const radius = 0.85;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color={index % 3 === 0 ? '#FFF0BA' : '#D8B66D'} />
          </mesh>
        );
      })}
      <pointLight color="#E9C67B" intensity={1} distance={5} />
    </group>
  );
}

function LanternFinale({
  active,
  events,
}: {
  active: boolean;
  events: InvitationEvent[];
}) {
  const startTimeRef = useRef<number | null>(null);
  const finaleZ = 3 - (events.length + 3) * 6;

  useEffect(() => {
    if (!active) startTimeRef.current = null;
  }, [active]);

  return (
    <>
      <SkyLantern
        active={active}
        position={[0, 0.3, finaleZ - 4]}
        startTimeRef={startTimeRef}
      />
      <FireworkBurst
        active={active}
        position={[-2.5, 2.6, finaleZ - 11]}
        startTimeRef={startTimeRef}
        delay={0.2}
      />
      <FireworkBurst
        active={active}
        position={[2.4, 3.3, finaleZ - 14]}
        startTimeRef={startTimeRef}
        delay={1.5}
      />
      <FireworkBurst
        active={active}
        position={[0.2, 4.2, finaleZ - 17]}
        startTimeRef={startTimeRef}
        delay={2.7}
      />
    </>
  );
}

export function PalaceGatesScene({
  isOpen,
  onEnter,
  events,
  isRsvpConfirmed,
  progressRef,
}: PalaceGatesSceneProps) {
  const { size, scene } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const sceneScale = Math.min(
    1,
    (2 * 8 * Math.tan((42 * Math.PI) / 360) * aspect) / 5.4
  );
  const pathLength = 54 + events.length * 8;
  const ambientColor = useMemo(() => new THREE.Color('#FFE7C2'), []);
  const targetColor = useMemo(() => new THREE.Color(), []);
  const backgroundColor = useMemo(() => new THREE.Color('#201711'), []);
  const targetBackground = useMemo(() => new THREE.Color(), []);
  const fogRef = useRef<THREE.Fog>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const archCurve = useMemo(() => {
    const points = Array.from({ length: 25 }, (_, index) => {
      const angle = Math.PI - (Math.PI * index) / 24;
      return new THREE.Vector3(2.1 * Math.cos(angle), 3.75 + 1.05 * Math.sin(angle), 0);
    });
    return new THREE.CatmullRomCurve3(points);
  }, []);
  const innerArchCurve = useMemo(() => {
    const points = Array.from({ length: 25 }, (_, index) => {
      const angle = Math.PI - (Math.PI * index) / 24;
      return new THREE.Vector3(1.86 * Math.cos(angle), 3.75 + 0.86 * Math.sin(angle), 0.08);
    });
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((_, delta) => {
    const progress = progressRef.current;
    const palette = progress < 0.32
      ? { background: '#201711', fog: '#332315', light: '#FFE7C2', intensity: 1.9 }
      : progress < 0.72
        ? { background: '#261821', fog: '#39222A', light: '#F2C895', intensity: 1.5 }
        : { background: '#111827', fog: '#1C2638', light: '#BACBE8', intensity: 1.15 };

    targetBackground.set(palette.background);
    backgroundColor.lerp(targetBackground, Math.min(1, delta * 0.7));
    if (scene.background instanceof THREE.Color) scene.background.copy(backgroundColor);

    targetColor.set(palette.fog);
    if (fogRef.current) fogRef.current.color.lerp(targetColor, Math.min(1, delta * 0.7));
    if (directionalLightRef.current) {
      directionalLightRef.current.color.lerp(
        targetColor.set(palette.light),
        Math.min(1, delta * 0.7)
      );
      directionalLightRef.current.intensity = palette.intensity;
    }
  });

  return (
    <>
      <color attach="background" args={['#201711']} />
      <fog ref={fogRef} attach="fog" args={['#332315', 18, 62]} />
      <ambientLight ref={(light) => {
        if (light) light.color.copy(ambientColor);
      }} intensity={0.72} />
      <directionalLight
        ref={directionalLightRef}
        position={[4, 7, 5]}
        intensity={1.9}
        color="#FFE8BE"
        castShadow
      />
      <hemisphereLight args={['#F8DFAE', '#3A2619', 0.8]} />

      <group scale={[sceneScale, 0.68, 1]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.72, -pathLength / 2]}
          receiveShadow
        >
          <planeGeometry args={[60, pathLength]} />
          <meshStandardMaterial color="#74614A" roughness={0.82} />
        </mesh>
        <mesh position={[0, -2.62, -pathLength / 2]} receiveShadow>
          <boxGeometry args={[4.8, 0.08, pathLength]} />
          <meshStandardMaterial color="#A38B67" roughness={0.58} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 3.85, -2.57, -pathLength / 2]} receiveShadow>
              <boxGeometry args={[1.6, 0.12, pathLength * 0.94]} />
              <meshPhysicalMaterial
                color="#7C9C9C"
                roughness={0.14}
                metalness={0.55}
                clearcoat={0.85}
                clearcoatRoughness={0.12}
                transparent
                opacity={0.74}
              />
            </mesh>
            <mesh position={[side * 3.85, -2.66, -pathLength / 2]} receiveShadow>
              <boxGeometry args={[1.82, 0.1, pathLength * 0.96]} />
              <meshStandardMaterial color="#504637" roughness={0.76} />
            </mesh>
          </group>
        ))}

        {courtyardColumns
          .filter(({ z }) => z > -pathLength)
          .map(({ x, z, side }) => (
            <group key={`${x}-${z}`} position={[x, 0, z]}>
              <mesh position={[0, -0.35, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.31, 4.7, 12]} />
                <meshStandardMaterial color="#A98D65" roughness={0.82} />
              </mesh>
              <mesh position={[0, 2.08, 0]} castShadow>
                <boxGeometry args={[0.64, 0.22, 0.68]} />
                <meshStandardMaterial color="#C5A15A" metalness={0.42} roughness={0.48} />
              </mesh>
              <mesh position={[0, -2.72, 0]} castShadow>
                <cylinderGeometry args={[0.42, 0.45, 0.16, 12]} />
                <meshStandardMaterial color="#876C4C" roughness={0.76} />
              </mesh>
              <FlickeringLantern
                position={[side * -0.42, -2.35, 0.2]}
                scale={0.48}
                color="#E9B85F"
              />
            </group>
          ))}

        <group>
          <mesh position={[-2.1, 1.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.56, 3.8, 0.72]} />
            <meshStandardMaterial color="#B79A70" roughness={0.84} />
          </mesh>
          <mesh position={[2.1, 1.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.56, 3.8, 0.72]} />
            <meshStandardMaterial color="#B79A70" roughness={0.84} />
          </mesh>
          <mesh position={[-2.1, 3.8, 0]} castShadow>
            <boxGeometry args={[0.78, 0.28, 0.92]} />
            <meshStandardMaterial color="#C7A77B" roughness={0.78} />
          </mesh>
          <mesh position={[2.1, 3.8, 0]} castShadow>
            <boxGeometry args={[0.78, 0.28, 0.92]} />
            <meshStandardMaterial color="#C7A77B" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0, -0.08]} castShadow>
            <tubeGeometry args={[archCurve, 64, 0.24, 12, false]} />
            <meshStandardMaterial color="#B79A70" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <tubeGeometry args={[innerArchCurve, 64, 0.045, 8, false]} />
            <meshStandardMaterial color="#D8B66D" metalness={0.58} roughness={0.34} />
          </mesh>
        </group>

        <PalaceDoor hinge={1} isOpen={isOpen} onEnter={onEnter} />
        <PalaceDoor hinge={-1} isOpen={isOpen} onEnter={onEnter} />
        <FlickeringLantern position={[-2.72, 2.72, 0.2]} />
        <FlickeringLantern position={[2.72, 2.72, 0.2]} />

        <group position={[0, 1.25, -7]}>
          <mesh castShadow>
            <boxGeometry args={[4.7, 4.2, 0.22]} />
            <meshStandardMaterial color="#6C4A2B" roughness={0.56} metalness={0.16} />
          </mesh>
          <mesh position={[0, 0, 0.13]}>
            <boxGeometry args={[4.45, 3.96, 0.06]} />
            <meshPhysicalMaterial
              color="#E9DAB5"
              transparent
              opacity={0.86}
              roughness={0.42}
              clearcoat={0.45}
            />
          </mesh>
          <mesh position={[0, 0, 0.17]}>
            <boxGeometry args={[4.22, 3.73, 0.035]} />
            <meshStandardMaterial color="#C5A15A" metalness={0.75} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[4.1, 3.61, 0.035]} />
            <meshStandardMaterial color="#EDE3CB" roughness={0.5} />
          </mesh>
        </group>

        {events.map((event, index) => (
          <EventArch key={event.id} event={event} index={index} />
        ))}

        <group position={[0, 0, -12 - events.length * 6]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 2.25, 2.1, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.3, 4.2, 12]} />
              <meshStandardMaterial color="#AA8D62" roughness={0.72} />
            </mesh>
          ))}
          <mesh position={[0, 4.15, 0]} castShadow>
            <boxGeometry args={[5.2, 0.3, 0.85]} />
            <meshStandardMaterial color="#C5A15A" metalness={0.48} roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.55, -0.4]}>
            <sphereGeometry args={[0.58, 12, 8]} />
            <meshStandardMaterial color="#D8B66D" metalness={0.62} roughness={0.28} />
          </mesh>
          <FlickeringLantern position={[-2.25, 3.15, 0.35]} scale={0.74} color="#E9D6A4" />
          <FlickeringLantern position={[2.25, 3.15, 0.35]} scale={0.74} color="#E9D6A4" />
        </group>

        <PetalBurst isOpen={isOpen} />
        <LanternFinale active={isRsvpConfirmed} events={events} />
      </group>

      <GoldDust count={72} />
    </>
  );
}

function PetalBurst({ isOpen }: { isOpen: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const startTimeRef = useRef<number | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.24);
    shape.bezierCurveTo(-0.2, -0.03, -0.12, 0.23, 0, 0.3);
    shape.bezierCurveTo(0.12, 0.23, 0.2, -0.03, 0, -0.24);
    const geometry = new THREE.ShapeGeometry(shape, 8);
    geometry.center();
    return geometry;
  }, []);
  const particles = useMemo(() => {
    const colors = ['#B3263D', '#D97706', '#C5A15A', '#8F1D35'];
    return Array.from({ length: 28 }, (_, index) => {
      const seed = index * 6;
      const random = (offset: number) => {
        const value = Math.sin((seed + offset) * 127.1 + 311.7) * 43758.5453;
        return value - Math.floor(value);
      };
      return {
        position: new THREE.Vector3((random(0) - 0.5) * 2.8, 1.2 + random(1) * 2.2, 0.25),
        velocity: new THREE.Vector3((random(2) - 0.5) * 2.4, 0.4 + random(3) * 1.8, 2 + random(4) * 2.5),
        rotation: random(5) * Math.PI,
        scale: 0.16 + random(6) * 0.16,
        color: new THREE.Color(colors[index % colors.length]),
      };
    });
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    particles.forEach((particle, index) => mesh.setColorAt(index, particle.color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!isOpen) startTimeRef.current = null;
    else if (startTimeRef.current === null) startTimeRef.current = clock.elapsedTime;

    const elapsed = startTimeRef.current === null
      ? -1
      : clock.elapsedTime - startTimeRef.current;

    particles.forEach((particle, index) => {
      const visible = elapsed >= 0 && elapsed < 2.8;
      const time = Math.max(0, elapsed);
      dummy.position.set(
        particle.position.x + particle.velocity.x * time,
        particle.position.y + particle.velocity.y * time - 0.35 * time * time,
        particle.position.z + particle.velocity.z * time
      );
      dummy.rotation.set(time * 1.8, time * 0.7, particle.rotation + time * (index % 2 ? 2 : -2));
      dummy.scale.setScalar(visible ? particle.scale * Math.min(1, (2.8 - elapsed) * 2) : 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, undefined, particles.length]}
      frustumCulled={false}
    >
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        transparent
        opacity={0.94}
        roughness={0.62}
      />
    </instancedMesh>
  );
}
