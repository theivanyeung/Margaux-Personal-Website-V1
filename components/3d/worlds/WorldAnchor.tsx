"use client";

import { Suspense } from "react";
import { Text, Float } from "@react-three/drei";
import { WORLD_DEBUG_COLORS, WORLD_ROTATIONS } from "./worldConfig";

const FONT_URL = "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

export function WorldAnchor() {
  const [rx, ry, rz] = WORLD_ROTATIONS.anchor;
  return (
    <group position={[0, 0, -276]} rotation={[rx, ry, rz]}>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color={WORLD_DEBUG_COLORS.anchor} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#F5F5F3" roughness={1} />
      </mesh>
      <mesh position={[0.3, -1.45, 0]}>
        <boxGeometry args={[0.8, 0.1, 1.1]} />
        <meshStandardMaterial color="#ECECEA" roughness={0.9} />
      </mesh>
      <Float speed={0.4} floatIntensity={0.2} rotationIntensity={0}>
        <mesh position={[-0.4, -1.49, 0.2]}>
          <boxGeometry args={[0.4, 0.02, 0.25]} />
          <meshStandardMaterial
            color="#E0E0DE"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Float>
      <Suspense fallback={null}>
        <Text
          font={FONT_URL}
          fontSize={0.6}
          color="#1A1A1A"
          anchorX="center"
          anchorY="middle"
          position={[0, 1.2, 0.1]}
          characters="Connect"
        >
          Connect
        </Text>
        <Text
          font={FONT_URL}
          fontSize={0.3}
          color="#1A1A1A"
          anchorX="center"
          anchorY="middle"
          position={[-0.4, -0.5, 0.2]}
          characters="Email"
        >
          Email
        </Text>
        <Text
          font={FONT_URL}
          fontSize={0.3}
          color="#1A1A1A"
          anchorX="center"
          anchorY="middle"
          position={[0.3, -0.5, 0]}
          characters="LinkedIn"
        >
          LinkedIn
        </Text>
      </Suspense>
    </group>
  );
}
