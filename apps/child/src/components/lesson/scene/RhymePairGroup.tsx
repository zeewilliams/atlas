"use client";

import { Html } from "@react-three/drei";

interface RhymePairGroupProps {
  topOnset: string;
  topRime: string;
  bottomOnset: string;
  bottomRime: string;
}

/**
 * The mechanism, not a metaphor: two words rhyme when their ending chunk
 * (the rime) is the exact same letters/sound, no matter what the beginning
 * (the onset) is. Both endings render in the same gold so the match is
 * something Zee sees directly, not something he's told.
 */
export function RhymePairGroup({ topOnset, topRime, bottomOnset, bottomRime }: RhymePairGroupProps) {
  return (
    <group>
      <Html position={[0, 0.9, 0]} center>
        <div className="flex items-baseline whitespace-nowrap text-4xl font-extrabold">
          <span className="text-white">{topOnset}</span>
          <span className="text-accent">{topRime}</span>
        </div>
      </Html>
      <Html position={[0, -0.9, 0]} center>
        <div className="flex items-baseline whitespace-nowrap text-4xl font-extrabold">
          <span className="text-white">{bottomOnset}</span>
          <span className="text-accent">{bottomRime}</span>
        </div>
      </Html>
    </group>
  );
}
