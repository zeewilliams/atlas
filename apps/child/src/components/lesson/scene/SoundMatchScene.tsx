"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SoundMatchGroup } from "./SoundMatchGroup";
import { SoundMatchFallback } from "./SoundMatchFallback";
import { hasWebGL } from "@/lib/webgl";

interface SoundMatchSceneProps {
  topWord: string;
  bottomWord: string;
  matches: boolean;
}

export function SoundMatchScene(props: SoundMatchSceneProps) {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<SoundMatchFallback {...props} />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <SoundMatchGroup {...props} />
          </Canvas>
        </Suspense>
      ) : (
        <SoundMatchFallback {...props} />
      )}
    </div>
  );
}
