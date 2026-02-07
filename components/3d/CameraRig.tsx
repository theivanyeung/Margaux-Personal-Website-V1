"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const SPLINE_POINTS: [number, number, number][] = [
  [0, 0, 5],      // Start
  [0, 0, 0],      // World 0
  [2, -1, -12],   // World 1 - Water
  [-2, 1, -24],   // World 2 - Nature
  [0, 3, -36],    // World 3 - Cathedral
  [0, 0, -45],    // World 4 - Anchor
];

const PARALLAX_STRENGTH = 0.2;

export function CameraRig() {
  const { camera } = useThree();
  const scroll = useScroll();
  const mouseRef = useRef({ x: 0, y: 0 });
  const splineRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  if (!splineRef.current) {
    splineRef.current = new THREE.CatmullRomCurve3(
      SPLINE_POINTS.map((p) => new THREE.Vector3(...p))
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

    const offset = scroll.offset;
    const position = spline.getPoint(offset);
    const lookAhead = Math.min(offset + 0.05, 1);
    const lookAtPoint = spline.getPoint(lookAhead);

    camera.position.copy(position);

    // Mouse parallax: offset look-at target for "looking around" feel
    const parallaxX = mouseRef.current.x * PARALLAX_STRENGTH;
    const parallaxY = mouseRef.current.y * PARALLAX_STRENGTH;
    camera.lookAt(
      lookAtPoint.x + parallaxX,
      lookAtPoint.y + parallaxY,
      lookAtPoint.z
    );
  });

  return null;
}
