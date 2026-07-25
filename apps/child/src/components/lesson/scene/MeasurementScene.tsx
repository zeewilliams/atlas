"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MeasureRow } from "./MeasureRow";
import { MeasureRowFallback } from "./MeasureRowFallback";
import { hasWebGL } from "@/lib/webgl";

export function MeasurementScene({ length }: { length: number }) {
  const [webglSupported, setWebglSupported] = useState(false);

  // Detected post-mount only, so the server render and first client paint
  // agree (both show the 2D fallback) — no hydration mismatch.
  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<MeasureRowFallback length={length} />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <MeasureRow length={length} />
          </Canvas>
        </Suspense>
      ) : (
        <MeasureRowFallback length={length} />
      )}
    </div>
  );
}
