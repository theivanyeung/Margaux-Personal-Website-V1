"use client";

import { Suspense } from "react";
import { Text } from "@react-three/drei";

const FONT_URL =
  "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

export function WorldNature() {
  return (
    <group position={[-2, 1, -24]}>
      <mesh position={[-0.5, 0, 0]}>
        <coneGeometry args={[0.8, 2, 32]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0.5, 0.2, 0.3]}>
        <coneGeometry args={[0.5, 1.2, 32]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0, -0.3, -0.3]}>
        <coneGeometry args={[0.4, 1, 32]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <Suspense fallback={null}>
        <Text
          font={FONT_URL}
          fontSize={0.5}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          position={[0, -2.5, 0]}
          characters="THE FOREST"
        >
          THE FOREST
        </Text>
      </Suspense>
    </group>
  );
}
