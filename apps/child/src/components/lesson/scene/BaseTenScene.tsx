"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BaseTenGroup } from "./BaseTenGroup";
import { BaseTenFallback } from "./BaseTenFallback";
import { hasWebGL } from "@/lib/webgl";

export function BaseTenScene({ tens, ones }: { tens: number; ones: number }) {
  const [webglSupported, setWebglSupported] = useState(false);

  // Detected post-mount only, so the server render and first client paint
  // agree (both show the 2D fallback) — no hydration mismatch.
  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<BaseTenFallback tens={tens} ones={ones} />}>
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <BaseTenGroup tens={tens} ones={ones} />
          </Canvas>
        </Suspense>
      ) : (
        <BaseTenFallback tens={tens} ones={ones} />
      )}
    </div>
  );
}
