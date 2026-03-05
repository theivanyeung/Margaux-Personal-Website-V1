"use client";

import { Suspense } from "react";
import { Text, Float } from "@react-three/drei";
import { WORLD_DEBUG_COLORS, WORLD_ROTATIONS } from "./worldConfig";

const FONT_URL = "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

const organPipes = [
  { pos: [-2, 0, -2] as const },
  { pos: [-2, 0, 0] as const },
  { pos: [-2, 0, 2] as const },
  { pos: [2, 0, -2] as const },
  { pos: [2, 0, 0] as const },
  { pos: [2, 0, 2] as const },
  { pos: [-1.5, 0, -1] as const },
  { pos: [1.5, 0, 1] as const },
];

const soulOrbs = [
  { pos: [-0.5, 0, 0] as const },
  { pos: [0.5, 0.5, 0] as const },
  { pos: [0, -0.3, 0.5] as const },
];

export function WorldCathedral() {
  const [rx, ry, rz] = WORLD_ROTATIONS.cathedral;
  return (
    <group position={[0, 3, -207]} rotation={[rx, ry, rz]}>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color={WORLD_DEBUG_COLORS.cathedral} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {organPipes.map((pipe, i) => (
        <mesh key={i} position={pipe.pos}>
          <cylinderGeometry args={[0.3, 0.3, 12, 32]} />
          <meshStandardMaterial
            color="#312E81"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      {soulOrbs.map((orb, i) => (
        <Float key={i} speed={0.8} floatIntensity={0.5} rotationIntensity={0.3}>
          <mesh position={orb.pos}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial
              color="#FCD34D"
              emissive="#F59E0B"
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      ))}
      <Float speed={0.4} floatIntensity={0.2} rotationIntensity={0}>
        <Suspense fallback={null}>
          <Text
            font={FONT_URL}
            fontSize={0.45}
            color="#FCD34D"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.3]}
            characters="Resonance"
          >
            Resonance
          </Text>
        </Suspense>
      </Float>
    </group>
  );
}
