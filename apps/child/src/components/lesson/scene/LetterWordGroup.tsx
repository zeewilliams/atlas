"use client";

import { Html } from "@react-three/drei";

interface LetterWordGroupProps {
  word: string;
  isReal: boolean;
}

/**
 * The mechanism: sound out the letters in order — if it resolves to a word
 * you know, it's real; if it doesn't, it isn't. The marker below is green
 * only when the sounded-out letters land on a real word, not a guess.
 */
export function LetterWordGroup({ word, isReal }: LetterWordGroupProps) {
  return (
    <group>
      <Html position={[0, 0.6, 0]} center>
        <div className="flex gap-2 whitespace-nowrap text-5xl font-extrabold text-white">
          {word.split("").map((letter, i) => (
            <span key={`${letter}-${i}`}>{letter}</span>
          ))}
        </div>
      </Html>
      <mesh position={[0, -0.7, -0.1]}>
        <planeGeometry args={[2.2, 0.6]} />
        <meshStandardMaterial color={isReal ? "#43a047" : "#4b5563"} />
      </mesh>
      <Html position={[0, -0.7, 0]} center>
        <span className="whitespace-nowrap text-sm font-extrabold text-white">
          {isReal ? "A real word" : "Not a real word"}
        </span>
      </Html>
    </group>
  );
}
