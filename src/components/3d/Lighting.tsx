'use client';

import React from 'react';

export function Lighting() {
  return (
    <>
      {/* Warm Ambient Fill */}
      <ambientLight intensity={1.2} color="#FFF8EE" />

      {/* Main Studio Key Light with soft shadows */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.2}
        color="#FFEBD2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0005}
      />

      {/* Golden Rim Light for metallic specular glints */}
      <directionalLight position={[-4, 3, -2]} intensity={2.5} color="#FFD700" />

      {/* Soft warm uplight */}
      <directionalLight position={[0, -4, 2]} intensity={0.8} color="#C5A15A" />

      {/* Front soft light for crisp card visibility */}
      <pointLight position={[0, 0, 4]} intensity={1.0} color="#FFFFFF" distance={8} />
    </>
  );
}
