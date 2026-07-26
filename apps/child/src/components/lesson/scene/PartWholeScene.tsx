"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PartWholeBar } from "./PartWholeBar";
import { PartWholeBarFallback } from "./PartWholeBarFallback";
import { hasWebGL } from "@/lib/webgl";

export function PartWholeScene({ a, b, blank }: { a: number; b: number; blank: number }) {
  const [webglSupported, setWebglSupported] = useState(false);

  // Detected post-mount only, so the server render and first client paint
  // agree (both show the 2D fallback) — no hydration mismatch.
  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<PartWholeBarFallback a={a} b={b} blank={blank} />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <PartWholeBar a={a} b={b} blank={blank} />
          </Canvas>
        </Suspense>
      ) : (
        <PartWholeBarFallback a={a} b={b} blank={blank} />
      )}
    </div>
  );
}
