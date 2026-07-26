"use client";

import { Html } from "@react-three/drei";

interface SoundMatchGroupProps {
  topWord: string;
  bottomWord: string;
  matches: boolean;
}

/**
 * The mechanism: same beginning sound means the first letter(s) of both
 * words match — highlighted in gold when true. Everything after the first
 * letter is irrelevant to this judgment, so it stays plain white.
 */
export function SoundMatchGroup({ topWord, bottomWord, matches }: SoundMatchGroupProps) {
  const onsetClass = matches ? "text-accent" : "text-white/40";

  return (
    <group>
      <Html position={[0, 0.9, 0]} center>
        <div className="whitespace-nowrap text-4xl font-extrabold">
          <span className={onsetClass}>{topWord.slice(0, 1)}</span>
          <span className="text-white">{topWord.slice(1)}</span>
        </div>
      </Html>
      <Html position={[0, -0.9, 0]} center>
        <div className="whitespace-nowrap text-4xl font-extrabold">
          <span className={onsetClass}>{bottomWord.slice(0, 1)}</span>
          <span className="text-white">{bottomWord.slice(1)}</span>
        </div>
      </Html>
    </group>
  );
}
