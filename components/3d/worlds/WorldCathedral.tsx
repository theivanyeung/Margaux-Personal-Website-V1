"use client";

import { Suspense } from "react";
import { Text } from "@react-three/drei";

const FONT_URL =
  "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

export function WorldCathedral() {
  return (
    <group position={[0, 3, -36]}>
      <mesh position={[-1.5, 0, 0]}>
        <cylinderGeometry args={[1, 1, 6, 32]} />
        <meshBasicMaterial color="#800080" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 6, 32]} />
        <meshBasicMaterial color="#800080" />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <cylinderGeometry args={[1, 1, 6, 32]} />
        <meshBasicMaterial color="#800080" />
      </mesh>
      <Suspense fallback={null}>
        <Text
          font={FONT_URL}
          fontSize={0.45}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          position={[0, -4.5, 0]}
          characters="THE CATHEDRAL"
        >
          THE CATHEDRAL
        </Text>
      </Suspense>
    </group>
  );
}
