"use client";

import type { SceneKind } from "@atlas/curriculum";
import { MakeATenScene } from "@/components/lesson/scene/MakeATenScene";
import { SubtractionScene } from "@/components/lesson/scene/SubtractionScene";
import { BaseTenScene } from "@/components/lesson/scene/BaseTenScene";
import { MeasurementScene } from "@/components/lesson/scene/MeasurementScene";
import { EqualSetsScene } from "@/components/lesson/scene/EqualSetsScene";
import { PartWholeScene } from "@/components/lesson/scene/PartWholeScene";
import { RhymePairScene } from "@/components/lesson/scene/RhymePairScene";
import { SoundMatchScene } from "@/components/lesson/scene/SoundMatchScene";
import { LetterWordScene } from "@/components/lesson/scene/LetterWordScene";
import { AdjectiveHighlightScene } from "@/components/lesson/scene/AdjectiveHighlightScene";
import { StorySettingScene } from "@/components/lesson/scene/StorySettingScene";
import { PredictionCluesScene } from "@/components/lesson/scene/PredictionCluesScene";
import { FactOpinionScene } from "@/components/lesson/scene/FactOpinionScene";

interface LessonSceneProps {
  sceneKind: SceneKind;
  visual: Record<string, number>;
  /** Word/text content for ELA scenes, which have nothing numeric to show. */
  textVisual?: Record<string, string>;
}

/** Dispatches to the right R3F scene for a lesson's sceneKind. */
export function LessonScene({ sceneKind, visual, textVisual }: LessonSceneProps) {
  const text = textVisual ?? {};
  switch (sceneKind) {
    case "ten-frame":
      return <MakeATenScene filled={visual["filled"] ?? 0} />;
    case "take-away":
      return <SubtractionScene start={visual["start"] ?? 0} removed={visual["removed"] ?? 0} />;
    case "base-ten":
      return <BaseTenScene tens={visual["tens"] ?? 0} ones={visual["ones"] ?? 0} />;
    case "measurement":
      return <MeasurementScene length={visual["length"] ?? 1} />;
    case "equal-sets":
      return <EqualSetsScene countA={visual["countA"] ?? 0} countB={visual["countB"] ?? 0} />;
    case "part-whole":
      return <PartWholeScene a={visual["a"] ?? 0} b={visual["b"] ?? 0} blank={visual["blank"] ?? 0} />;
    case "rhyme-pair":
      return (
        <RhymePairScene
          topOnset={text["topOnset"] ?? ""}
          topRime={text["topRime"] ?? ""}
          bottomOnset={text["bottomOnset"] ?? ""}
          bottomRime={text["bottomRime"] ?? ""}
        />
      );
    case "sound-match":
      return (
        <SoundMatchScene
          topWord={text["topWord"] ?? ""}
          bottomWord={text["bottomWord"] ?? ""}
          matches={text["matches"] === "true"}
        />
      );
    case "letter-word":
      return <LetterWordScene word={text["word"] ?? ""} isReal={text["isReal"] === "true"} />;
    case "adjective-highlight":
      return (
        <AdjectiveHighlightScene
          before={text["before"] ?? ""}
          adjective={text["adjective"] ?? ""}
          after={text["after"] ?? ""}
          noun={text["noun"] ?? ""}
        />
      );
    case "story-setting":
      return <StorySettingScene setting={text["setting"] ?? ""} />;
    case "prediction-clues":
      return <PredictionCluesScene clue={text["clue"] ?? ""} prediction={text["prediction"] ?? ""} />;
    case "fact-opinion":
      return <FactOpinionScene sentence={text["sentence"] ?? ""} isFact={text["isFact"] === "true"} />;
    default:
      return null;
  }
}
