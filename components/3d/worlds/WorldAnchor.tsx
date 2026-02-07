"use client";

import { Suspense } from "react";
import { Text } from "@react-three/drei";

const FONT_URL =
  "https://fonts.gstatic.com/s/inter/v18/Inter-Regular.woff2";

export function WorldAnchor() {
  return (
    <group position={[0, 0, -45]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#ffa500" />
      </mesh>
      <Suspense fallback={null}>
        <Text
          font={FONT_URL}
          fontSize={0.6}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          position={[0, 1.5, 0.1]}
          characters="THE ANCHOR"
        >
          THE ANCHOR
        </Text>
      </Suspense>
    </group>
  );
}
