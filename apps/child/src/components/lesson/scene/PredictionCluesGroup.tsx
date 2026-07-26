"use client";

import { Html } from "@react-three/drei";

interface PredictionCluesGroupProps {
  clue: string;
  prediction: string;
}

/**
 * The mechanism: a prediction flows down from the clues already given —
 * the arrow is the literal "this leads to that," not a decoration.
 */
export function PredictionCluesGroup({ clue, prediction }: PredictionCluesGroupProps) {
  return (
    <group>
      <Html position={[0, 1, 0]} center>
        <p className="max-w-sm text-center text-lg font-bold text-white">{clue}</p>
      </Html>
      <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.25, 0.5, 12]} />
        <meshStandardMaterial color="#f5c518" />
      </mesh>
      <Html position={[0, -1, 0]} center>
        <p className="max-w-sm text-center text-lg font-extrabold text-accent">{prediction}</p>
      </Html>
    </group>
  );
}
