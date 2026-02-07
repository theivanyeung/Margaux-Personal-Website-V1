"use client";

import { Suspense } from "react";
import { Text } from "@react-three/drei";

const FONT_URL =
  "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

export function WorldWater() {
  return (
    <group position={[2, -1, -12]}>
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#0000ff" />
      </mesh>
      <mesh position={[1, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial color="#0000ff" />
      </mesh>
      <mesh position={[0, -0.5, -0.5]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshBasicMaterial color="#0000ff" />
      </mesh>
      <Suspense fallback={null}>
        <Text
          font={FONT_URL}
          fontSize={0.5}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          position={[0, -2, 0]}
          characters="THE LAB"
        >
          THE LAB
        </Text>
      </Suspense>
    </group>
  );
}
