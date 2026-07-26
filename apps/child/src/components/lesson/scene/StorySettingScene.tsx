"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { StorySettingGroup } from "./StorySettingGroup";
import { StorySettingFallback } from "./StorySettingFallback";
import { hasWebGL } from "@/lib/webgl";

interface StorySettingSceneProps {
  setting: string;
}

export function StorySettingScene(props: StorySettingSceneProps) {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-night/60">
      {webglSupported ? (
        <Suspense fallback={<StorySettingFallback {...props} />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1} />
            <StorySettingGroup {...props} />
          </Canvas>
        </Suspense>
      ) : (
        <StorySettingFallback {...props} />
      )}
    </div>
  );
}
