"use client";

import { Html } from "@react-three/drei";

interface FactOpinionGroupProps {
  sentence: string;
  isFact: boolean;
}

/**
 * The mechanism: a fact can be checked and proven true or false; an
 * opinion is what someone thinks or feels and can't be proven the same
 * way. The colored label states the test result, not a decoration.
 */
export function FactOpinionGroup({ sentence, isFact }: FactOpinionGroupProps) {
  const color = isFact ? "#43a047" : "#7c4dff";
  const label = isFact ? "Fact — can be checked" : "Opinion — what someone thinks";

  return (
    <group>
      <Html position={[0, 0.5, 0]} center>
        <p className="max-w-sm text-center text-xl font-bold text-white">{sentence}</p>
      </Html>
      <mesh position={[0, -0.9, -0.1]}>
        <planeGeometry args={[3.6, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, -0.9, 0]} center>
        <span className="whitespace-nowrap text-sm font-extrabold text-white">{label}</span>
      </Html>
    </group>
  );
}
