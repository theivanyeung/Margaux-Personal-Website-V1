"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

// Windier liminal path: two curve points per segment (except Start–Water), stronger drift.
const SPLINE_POINTS: [number, number, number][] = [
  [0, 0, 12], // Entry
  [0, 0, 0], // World 1 - Start
  [1, 0.8, -34.5], // Curve: start → water
  [2, -1, -69], // World 2 - Water
  [-0.5, 2.8, -90], // Curve: water → nature 1
  [-2, 1.8, -117], // Curve: water → nature 2
  [-2, 1.5, -138], // World 3 - Nature
  [0.5, 3.5, -155], // Curve: nature → cathedral 1
  [0, 3.2, -181], // Curve: nature → cathedral 2
  [0, 3, -207], // World 4 - Cathedral
  [1.5, 1.5, -224], // Curve: cathedral → anchor 1
  [0.5, 0.3, -250], // Curve: cathedral → anchor 2
  [0, 0, -276], // World 5 - Anchor
];

// Spline t (arc-length param) at which we pass through each world. Re-sampled after windier path.
const SCROLL_OFFSET_TO_SPLINE_T: [number, number][] = [
  [0, 0],
  [0.2, 0.042],
  [0.4, 0.28],
  [0.6, 0.521],
  [0.8, 0.761],
  [1, 1],
];

function offsetToSplineT(offset: number): number {
  const o = Math.max(0, Math.min(1, offset));
  for (let i = 0; i < SCROLL_OFFSET_TO_SPLINE_T.length - 1; i++) {
    const [o0, t0] = SCROLL_OFFSET_TO_SPLINE_T[i];
    const [o1, t1] = SCROLL_OFFSET_TO_SPLINE_T[i + 1];
    if (o <= o1) return t0 + ((t1 - t0) * (o - o0)) / (o1 - o0);
  }
  return 1;
}

const PARALLAX_STRENGTH = 0.1;

export function CameraRig() {
  const { camera } = useThree();
  const scroll = useScroll();
  const mouseRef = useRef({ x: 0, y: 0 });
  const splineRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  if (
    !splineRef.current ||
    (splineRef.current.points as THREE.Vector3[]).length !==
      SPLINE_POINTS.length
  ) {
    splineRef.current = new THREE.CatmullRomCurve3(
      SPLINE_POINTS.map((p) => new THREE.Vector3(...p)),
    );
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame(() => {
    const spline = splineRef.current;
    if (!spline) return;

    const raw = scroll?.offset ?? 0;
    const offset = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
    const t = offsetToSplineT(offset);
    const position = spline.getPointAt(t);
    const lookAheadT = offsetToSplineT(Math.min(offset + 0.03, 1));
    const lookAtPoint = spline.getPointAt(lookAheadT);

    camera.position.copy(position);

    // Mouse parallax: scale by distance so close content (sphere) doesn't shift excessively
    const distance = camera.position.distanceTo(lookAtPoint);
    const parallaxScale = Math.min(1.5, Math.max(0.2, distance / 8));
    const parallaxX = mouseRef.current.x * PARALLAX_STRENGTH * parallaxScale;
    const parallaxY = mouseRef.current.y * PARALLAX_STRENGTH * parallaxScale;
    camera.lookAt(
      lookAtPoint.x + parallaxX,
      lookAtPoint.y + parallaxY,
      lookAtPoint.z,
    );
  });

  return null;
}

