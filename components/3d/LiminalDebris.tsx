"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import {
  BETWEEN_WORLD_SEGMENTS,
  IN_WORLD_RADIUS,
  LIMINAL_RADIUS,
  WORLD_IDS,
  WORLD_SCROLL_OFFSETS,
} from "./worlds/worldConfig";

const SHARD_COUNT = 400;
const LIMINAL_EMPTY_EDGE = 0.15; // first and last 15% of each between-world segment = no debris
const LIMINAL_DEBRIS_START = LIMINAL_EMPTY_EDGE;
const LIMINAL_DEBRIS_END = 1 - LIMINAL_EMPTY_EDGE;
const DUST_COUNT = 2000;
const Z_MIN = -300;
const Z_MAX = 12;
const SPREAD_RADIUS = 10;
const PARALLAX_STRENGTH = 0.05;

export function LiminalDebris() {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const shardMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pointsMatRef = useRef<THREE.PointsMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const { scene, camera } = useThree();
  const scroll = useScroll();

  const shardPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < SHARD_COUNT; i++) {
      const z = Z_MAX + (Z_MIN - Z_MAX) * (i / (SHARD_COUNT - 1 || 1));
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * SPREAD_RADIUS;
      positions.push([Math.cos(angle) * r, Math.sin(angle) * r, z]);
    }
    return positions;
  }, []);

  const dustBasePositions = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      const z = Z_MAX + (Z_MIN - Z_MAX) * Math.random();
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * SPREAD_RADIUS;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  const dustPositions = useMemo(
    () => new Float32Array(dustBasePositions),
    [dustBasePositions]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const raw = scroll?.offset ?? 0;
    const offset = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
    const minDistToWorld = Math.min(
      ...WORLD_IDS.map((id) => Math.abs(offset - WORLD_SCROLL_OFFSETS[id]))
    );
    const inWorld = minDistToWorld <= IN_WORLD_RADIUS;

    // 15% empty / 70% stuff / 15% empty within each between-world segment
    let segmentGate = 0;
    for (const segment of BETWEEN_WORLD_SEGMENTS) {
      if (offset >= segment.start && offset <= segment.end) {
        const u = (offset - segment.start) / (segment.end - segment.start);
        if (u > LIMINAL_DEBRIS_START && u < LIMINAL_DEBRIS_END) {
          segmentGate = 1;
        }
        break;
      }
    }

    const visibility = inWorld ? 0 : segmentGate;

    const parallaxScale = Math.min(1.5, Math.max(0.2, Math.abs(camera.position.z) / 12));
    const mx = mouseRef.current.x * PARALLAX_STRENGTH * parallaxScale;
    const my = mouseRef.current.y * PARALLAX_STRENGTH * parallaxScale;

    if (instancedRef.current) {
      for (let i = 0; i < SHARD_COUNT; i++) {
        const [x, y, z] = shardPositions[i];
        tempObject.position.set(
          x - mx,
          y - my,
          z
        );
        tempObject.rotation.y = (time + i) * 0.002;
        tempObject.rotation.x = Math.sin(time + i * 0.01) * 0.1;
        tempObject.updateMatrix();
        instancedRef.current.setMatrixAt(i, tempObject.matrix);
      }
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }

    if (pointsRef.current?.geometry?.attributes?.position) {
      const pos = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      const base = dustBasePositions;
      for (let i = 0; i < DUST_COUNT; i++) {
        const i3 = i * 3;
        pos[i3] =
          base[i3] + Math.sin(time + base[i3] * 0.5) * 0.015 - mx;
        pos[i3 + 1] =
          base[i3 + 1] + Math.sin(time * 1.1 + base[i3 + 1]) * 0.015 - my;
        pos[i3 + 2] =
          base[i3 + 2] + Math.sin(time * 0.9 + base[i3 + 2] * 0.3) * 0.02;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (pointsMatRef.current) {
      pointsMatRef.current.opacity = 0.6 * visibility;
    }
    if (shardMatRef.current) {
      shardMatRef.current.opacity = visibility;
      shardMatRef.current.transparent = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={instancedRef} args={[undefined, undefined, SHARD_COUNT]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial
          ref={shardMatRef}
          roughness={0.3}
          color="#FF10F0"
          emissive="#FF10F0"
          emissiveIntensity={0.4}
          side={THREE.FrontSide}
          transparent
          opacity={1}
        />
      </instancedMesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMatRef}
          size={0.06}
          transparent
          opacity={0.6}
          color="#FF10F0"
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
