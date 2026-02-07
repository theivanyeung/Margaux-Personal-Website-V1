"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useRef, useLayoutEffect } from "react";
import * as THREE from "three";

const FOG_NEAR = 10;
const FOG_FAR = 80;

function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  const result = a.clone();
  result.lerp(b, t);
  return result;
}

function getColorForOffset(offset: number): THREE.Color {
  const voidColor = new THREE.Color("#e0e0e0");
  const waterColor = new THREE.Color("#008b8b");
  const natureColor = new THREE.Color("#228b22");
  const cathedralColor = new THREE.Color("#2d1b4e");
  const anchorColor = new THREE.Color("#ffffff");

  if (offset <= 0.15) {
    return lerpColor(voidColor, waterColor, offset / 0.15);
  }
  if (offset <= 0.35) {
    return lerpColor(waterColor, natureColor, (offset - 0.15) / 0.2);
  }
  if (offset <= 0.6) {
    return lerpColor(natureColor, cathedralColor, (offset - 0.35) / 0.25);
  }
  if (offset <= 0.8) {
    return lerpColor(cathedralColor, anchorColor, (offset - 0.6) / 0.2);
  }
  return anchorColor.clone();
}

const VOID_COLOR = new THREE.Color("#e0e0e0");

export function Lighting() {
  const { scene } = useThree();
  const scroll = useScroll();
  const fogRef = useRef<THREE.Fog | null>(null);

  // Set background and fog immediately so we never see a blank white frame
  useLayoutEffect(() => {
    scene.background = VOID_COLOR.clone();
    scene.fog = new THREE.Fog(VOID_COLOR, FOG_NEAR, FOG_FAR);
  }, [scene]);

  useFrame(() => {
    const offset = scroll.offset;
    const color = getColorForOffset(offset);
    scene.background = color;
    if (!fogRef.current) {
      fogRef.current = new THREE.Fog(color, FOG_NEAR, FOG_FAR);
      scene.fog = fogRef.current;
    } else {
      fogRef.current.color.copy(color);
      fogRef.current.near = FOG_NEAR;
      fogRef.current.far = FOG_FAR;
    }
  });

  return null;
}
