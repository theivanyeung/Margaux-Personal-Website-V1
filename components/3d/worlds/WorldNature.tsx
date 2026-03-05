"use client";

import { Suspense } from "react";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { WORLD_DEBUG_COLORS, WORLD_ROTATIONS } from "./worldConfig";

const FONT_URL = "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

const bookMonoliths = [
  { pos: [-1.5, 0, -0.5] as const },
  { pos: [0.5, 0, 0] as const },
  { pos: [1.2, 0, -0.3] as const },
  { pos: [-0.3, 0, 0.5] as const },
];

const flutteringPages = [
  { pos: [0.3, 1, 0.2] as const, speed: 1.2, floatIntensity: 0.8, rotationIntensity: 2.0 },
  { pos: [-0.6, 0.5, -0.3] as const, speed: 1.5, floatIntensity: 1.0, rotationIntensity: 2.5 },
  { pos: [0.5, 0.8, 0.4] as const, speed: 0.9, floatIntensity: 0.9, rotationIntensity: 1.8 },
  { pos: [-0.2, 0.3, -0.5] as const, speed: 1.3, floatIntensity: 0.7, rotationIntensity: 2.2 },
  { pos: [0.6, 0.6, -0.2] as const, speed: 1.1, floatIntensity: 0.85, rotationIntensity: 1.5 },
  { pos: [-0.4, 0.9, 0.1] as const, speed: 1.4, floatIntensity: 0.95, rotationIntensity: 2.3 },
];

export function WorldNature() {
  const [rx, ry, rz] = WORLD_ROTATIONS.nature;
  return (
    <group position={[-2, 1.5, -138]} rotation={[rx, ry, rz]}>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color={WORLD_DEBUG_COLORS.nature} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {bookMonoliths.map((book, i) => (
        <mesh key={i} position={book.pos}>
          <boxGeometry args={[1.5, 4, 0.2]} />
          <meshStandardMaterial color="#E7E5E4" roughness={0.9} />
        </mesh>
      ))}
      {flutteringPages.map((page, i) => (
        <Float
          key={i}
          speed={page.speed}
          floatIntensity={page.floatIntensity}
          rotationIntensity={page.rotationIntensity}
        >
          <mesh position={page.pos}>
            <planeGeometry args={[0.4, 0.6]} />
            <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
          </mesh>
        </Float>
      ))}
      <Float speed={0.5} floatIntensity={0.3} rotationIntensity={0}>
        <Suspense fallback={null}>
          <Text
            font={FONT_URL}
            fontSize={0.5}
            color="#1A1A1A"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.5]}
            characters="The Narrative"
          >
            The Narrative
          </Text>
        </Suspense>
      </Float>
    </group>
  );
}
