"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { FactOpinionGroup } from "./FactOpinionGroup";
import { FactOpinionFallback } from "./FactOpinionFallback";
import { hasWebGL } from "@/lib/webgl";

interface FactOpinionSceneProps {
  sentence: string;
  isFact: boolean;
}

export function FactOpinionScene(props: FactOpinionSceneProps) {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<FactOpinionFallback {...props} />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <FactOpinionGroup {...props} />
          </Canvas>
        </Suspense>
      ) : (
        <FactOpinionFallback {...props} />
      )}
    </div>
  );
}
