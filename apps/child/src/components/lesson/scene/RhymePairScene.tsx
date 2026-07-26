"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { RhymePairGroup } from "./RhymePairGroup";
import { RhymePairFallback } from "./RhymePairFallback";
import { hasWebGL } from "@/lib/webgl";

interface RhymePairSceneProps {
  topOnset: string;
  topRime: string;
  bottomOnset: string;
  bottomRime: string;
}

export function RhymePairScene(props: RhymePairSceneProps) {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<RhymePairFallback {...props} />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <RhymePairGroup {...props} />
          </Canvas>
        </Suspense>
      ) : (
        <RhymePairFallback {...props} />
      )}
    </div>
  );
}
