"use client";

import { Html } from "@react-three/drei";

interface AdjectiveHighlightGroupProps {
  before: string;
  adjective: string;
  after: string;
  noun: string;
}

/**
 * The mechanism: an adjective is the specific word that changes how you
 * picture the noun — it's highlighted in place, in the sentence it came
 * from, rather than shown as an isolated flashcard.
 */
export function AdjectiveHighlightGroup({ before, adjective, after, noun }: AdjectiveHighlightGroupProps) {
  return (
    <group>
      <Html position={[0, 0.5, 0]} center style={{ width: "420px" }}>
        <p className="text-center text-2xl font-bold text-white">
          {before}
          <span className="text-accent">{adjective}</span>
          {after}
        </p>
      </Html>
      <Html position={[0, -0.9, 0]} center>
        <span className="whitespace-nowrap rounded-pill bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
          describes: {noun}
        </span>
      </Html>
    </group>
  );
}
