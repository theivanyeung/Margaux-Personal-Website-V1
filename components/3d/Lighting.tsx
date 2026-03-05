"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import {
  ENTRY_SCROLL_OFFSET,
  IN_WORLD_RADIUS,
  LIMINAL_RADIUS,
  WORLD_IDS,
  WORLD_SCROLL_OFFSETS,
} from "./worlds/worldConfig";

// Base densities for different phases.
// "World" is still foggy enough to hide distant worlds; liminal is thickest.
const FOG_DENSITY_WORLD = 0.14;
const FOG_DENSITY_LIMINAL = 0.22;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  const result = a.clone();
  result.lerp(b, t);
  return result;
}

function getColorForOffset(offset: number): THREE.Color {
  const voidColor = new THREE.Color("#F9F9F7");
  const waterColor = new THREE.Color("#E0F7FA");
  const natureColor = new THREE.Color("#ECFCCB");
  const cathedralColor = new THREE.Color("#1E1B4B");
  const anchorColor = new THREE.Color("#EDEDEB");

  // Breakpoints: equal scroll per world (0.2, 0.4, 0.6, 0.8, 1).
  if (offset <= 0.2) {
    return lerpColor(voidColor, waterColor, offset / 0.2);
  }
  if (offset <= 0.4) {
    return lerpColor(waterColor, natureColor, (offset - 0.2) / 0.2);
  }
  if (offset <= 0.6) {
    return lerpColor(natureColor, cathedralColor, (offset - 0.4) / 0.2);
  }
  if (offset <= 0.8) {
    return lerpColor(cathedralColor, anchorColor, (offset - 0.6) / 0.2);
  }
  return anchorColor.clone();
}

const VOID_COLOR = new THREE.Color("#F9F9F7");

export function Lighting() {
  const { scene, camera } = useThree();
  const scroll = useScroll();
  const fogRef = useRef<THREE.FogExp2 | null>(null);

  // Set background and fog immediately so we never see a blank white frame
  useLayoutEffect(() => {
    scene.background = VOID_COLOR.clone();
    scene.fog = new THREE.FogExp2(VOID_COLOR, 0.05);
  }, [scene]);

  const getDensityForOffset = (offset: number): number => {
    // Build a simple list of world offsets including the entry point.
    const offsets = [ENTRY_SCROLL_OFFSET, ...WORLD_IDS.map((id) => WORLD_SCROLL_OFFSETS[id])];

    // Find nearest world \"page\" in scroll space.
    let nearest = offsets[0];
    let min = Math.abs(offset - nearest);
    for (let i = 1; i < offsets.length; i++) {
      const d = Math.abs(offset - offsets[i]);
      if (d < min) {
        min = d;
        nearest = offsets[i];
      }
    }

    const d = Math.abs(offset - nearest);

    // When we're inside a world region, keep a medium‑high fog so the current
    // world is readable but other worlds are strongly obscured.
    if (d <= IN_WORLD_RADIUS) {
      return FOG_DENSITY_WORLD;
    }

    // Once we're well away from any world, we are in the liminal space:
    // make the fog the thickest here so you can't see other worlds at all.
    if (d >= LIMINAL_RADIUS) {
      return FOG_DENSITY_LIMINAL;
    }

    // Between \"inside world\" and \"deep liminal\", smoothly ramp up the density.
    const t =
      (d - IN_WORLD_RADIUS) / Math.max(LIMINAL_RADIUS - IN_WORLD_RADIUS, 0.0001);
    return lerp(FOG_DENSITY_WORLD, FOG_DENSITY_LIMINAL, t);
  };

  useFrame(() => {
    const raw = scroll?.offset ?? 0;
    const offset = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
    const color = getColorForOffset(offset);
    const density = getDensityForOffset(offset);
    scene.background = color;
    if (!fogRef.current) {
      fogRef.current = new THREE.FogExp2(color, density);
      scene.fog = fogRef.current;
    } else {
      fogRef.current.color.copy(color);
      fogRef.current.density = density;
    }
  });

  return null;
}
