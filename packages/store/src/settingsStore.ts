import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AtlasSettings {
  challengeMode: boolean;
  voiceEnabled: boolean;
  soundEffectsEnabled: boolean;
  frenchTrackEnabled: boolean;
  setChallengeMode: (value: boolean) => void;
  setVoiceEnabled: (value: boolean) => void;
  setSoundEffectsEnabled: (value: boolean) => void;
  setFrenchTrackEnabled: (value: boolean) => void;
}

/** Persisted under localStorage key "atlas_settings" per ATLAS_MASTER_SKILL.md. */
export const useSettingsStore = create<AtlasSettings>()(
  persist(
    (set) => ({
      challengeMode: false,
      voiceEnabled: true,
      soundEffectsEnabled: true,
      frenchTrackEnabled: false,
      setChallengeMode: (value) => set({ challengeMode: value }),
      setVoiceEnabled: (value) => set({ voiceEnabled: value }),
      setSoundEffectsEnabled: (value) => set({ soundEffectsEnabled: value }),
      setFrenchTrackEnabled: (value) => set({ frenchTrackEnabled: value }),
    }),
    { name: "atlas_settings" }
  )
);
