"use client";

import { Suspense } from "react";
import { Text } from "@react-three/drei";

const FONT_URL =
  "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

export function WorldStart() {
  return (
    <group position={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <Suspense fallback={null}>
        <Text
          font={FONT_URL}
          fontSize={0.8}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          position={[0, -2.5, 0]}
          characters="MARGAUX"
        >
          MARGAUX
        </Text>
      </Suspense>
    </group>
  );
}
