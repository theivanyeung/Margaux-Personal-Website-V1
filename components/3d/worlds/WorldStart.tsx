"use client";

import { Suspense } from "react";
import { Text, useScroll } from "@react-three/drei";
import { WORLD_DEBUG_COLORS, WORLD_ROTATIONS } from "./worldConfig";

const FONT_URL =
  "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

const WORLD_OFFSET = 0.2;
const IN_WORLD_RADIUS = 0.05;

export function WorldStart() {
  const scroll = useScroll();
  const raw = scroll?.offset ?? 0;
  const offset = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
  const inWorld = Math.abs(offset - WORLD_OFFSET) <= IN_WORLD_RADIUS;
  const fogEnabled = !inWorld;
  const [rx, ry, rz] = WORLD_ROTATIONS.start;

  return (
    <group position={[0, 0, 0]} rotation={[rx, ry, rz]}>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color={WORLD_DEBUG_COLORS.start} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshPhysicalMaterial
          roughness={0.2}
          transmission={1.0}
          thickness={2.0}
          ior={1.5}
          color="#ffffff"
          fog={fogEnabled}
        />
      </mesh>
      <Suspense fallback={null}>
        <Text
          font={FONT_URL}
          fontSize={0.8}
          color="#1A1A1A"
          anchorX="center"
          anchorY="middle"
          position={[0, -3.5, 0.4]}
          characters="Margaux"
        >
          Margaux
        </Text>
      </Suspense>
    </group>
  );
}
