"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Environment } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { CameraRig } from "./CameraRig";
import { LiminalDebris } from "./LiminalDebris";
import { WorldStart } from "./worlds/WorldStart";
import { WorldWater } from "./worlds/WorldWater";
import { WorldNature } from "./worlds/WorldNature";
import { WorldCathedral } from "./worlds/WorldCathedral";
import { WorldAnchor } from "./worlds/WorldAnchor";

export default function Scene() {
  return (
    <Canvas
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%", display: "block" }}
      camera={{ position: [0, 0, 12], fov: 50 }}
    >
      <Suspense fallback={null}>
        <Environment preset="studio" background={false} />
      </Suspense>
      <ScrollControls pages={20} damping={0.2} style={{ background: "transparent" }}>
        <Lighting />
        <CameraRig />
        <LiminalDebris />
        <WorldStart />
        <WorldWater />
        <WorldNature />
        <WorldCathedral />
        <WorldAnchor />
      </ScrollControls>
    </Canvas>
  );
}
