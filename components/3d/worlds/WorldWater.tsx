"use client";

import { Suspense } from "react";
import { Text, Float } from "@react-three/drei";
import { WORLD_DEBUG_COLORS, WORLD_ROTATIONS } from "./worldConfig";

const SERIF_FONT_URL =
  "https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2";

const bioluminescentMaterial = {
  roughness: 0.05,
  transmission: 0.9,
  color: "#A5F3FC",
  emissive: "#22D3EE",
  emissiveIntensity: 0.2,
};

const membranes = [
  { pos: [-1.5, 0.5, 0] as const, radius: 0.6, type: "sphere" as const, speed: 1.2, floatIntensity: 0.8, rotationIntensity: 0.5 },
  { pos: [1.2, -0.3, -0.5] as const, radius: 0.5, type: "icosahedron" as const, speed: 0.9, floatIntensity: 1.0, rotationIntensity: 0.3 },
  { pos: [0, 1, -0.3] as const, radius: 0.45, type: "sphere" as const, speed: 1.5, floatIntensity: 0.6, rotationIntensity: 0.4 },
  { pos: [-0.8, -0.6, 0.2] as const, radius: 0.4, type: "icosahedron" as const, speed: 1.0, floatIntensity: 0.9, rotationIntensity: 0.6 },
  { pos: [1.5, 0.2, 0.3] as const, radius: 0.55, type: "sphere" as const, speed: 0.8, floatIntensity: 0.7, rotationIntensity: 0.35 },
  { pos: [0.3, -0.8, -0.4] as const, radius: 0.35, type: "icosahedron" as const, speed: 1.3, floatIntensity: 1.1, rotationIntensity: 0.45 },
];

export function WorldWater() {
  const [rx, ry, rz] = WORLD_ROTATIONS.water;
  return (
    <group position={[2, -1, -69]} rotation={[rx, ry, rz]}>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color={WORLD_DEBUG_COLORS.water} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {membranes.map((m, i) => (
        <Float
          key={i}
          speed={m.speed}
          floatIntensity={m.floatIntensity}
          rotationIntensity={m.rotationIntensity}
        >
          <mesh position={m.pos}>
            {m.type === "sphere" ? (
              <sphereGeometry args={[m.radius, 32, 32]} />
            ) : (
              <icosahedronGeometry args={[m.radius, 0]} />
            )}
            <meshPhysicalMaterial
              roughness={bioluminescentMaterial.roughness}
              transmission={bioluminescentMaterial.transmission}
              color={bioluminescentMaterial.color}
              emissive={bioluminescentMaterial.emissive}
              emissiveIntensity={bioluminescentMaterial.emissiveIntensity}
            />
          </mesh>
        </Float>
      ))}
      <Float speed={0.5} floatIntensity={0.3} rotationIntensity={0}>
        <Suspense fallback={null}>
          <Text
            font={SERIF_FONT_URL}
            fontSize={0.5}
            color="#1A1A1A"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.5]}
            characters="The Source"
          >
            The Source
          </Text>
        </Suspense>
      </Float>
    </group>
  );
}
