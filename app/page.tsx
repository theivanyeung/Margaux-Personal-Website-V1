"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

export default function Home() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Scene />
    </div>
  );
}
