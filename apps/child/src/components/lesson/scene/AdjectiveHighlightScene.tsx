"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdjectiveHighlightGroup } from "./AdjectiveHighlightGroup";
import { AdjectiveHighlightFallback } from "./AdjectiveHighlightFallback";
import { hasWebGL } from "@/lib/webgl";

interface AdjectiveHighlightSceneProps {
  before: string;
  adjective: string;
  after: string;
  noun: string;
}

export function AdjectiveHighlightScene(props: AdjectiveHighlightSceneProps) {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<AdjectiveHighlightFallback {...props} />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <AdjectiveHighlightGroup {...props} />
          </Canvas>
        </Suspense>
      ) : (
        <AdjectiveHighlightFallback {...props} />
      )}
    </div>
  );
}
