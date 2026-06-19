import { useCallback, useRef } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import {
  playMatchSound,
  playPerfectSound,
  playBeatSound,
  playGameOverSound,
  playSelectSound,
  playInvalidSound,
  resumeAudioContext,
} from '@/utils/audio';

export function useAudio() {
  const { volume, muted } = useSettingsStore();
  const actualVolume = muted ? 0 : volume;

  const playMatch = useCallback((combo: number) => {
    if (actualVolume > 0) {
      playMatchSound(combo, actualVolume);
    }
  }, [actualVolume]);

  const playPerfect = useCallback((combo: number) => {
    if (actualVolume > 0) {
      playPerfectSound(combo, actualVolume);
    }
  }, [actualVolume]);

  const playBeat = useCallback((isStrong: boolean) => {
    if (actualVolume > 0) {
      playBeatSound(isStrong, actualVolume);
    }
  }, [actualVolume]);

  const playGameOver = useCallback(() => {
    if (actualVolume > 0) {
      playGameOverSound(actualVolume);
    }
  }, [actualVolume]);

  const playSelect = useCallback(() => {
    if (actualVolume > 0) {
      playSelectSound(actualVolume);
    }
  }, [actualVolume]);

  const playInvalid = useCallback(() => {
    if (actualVolume > 0) {
      playInvalidSound(actualVolume);
    }
  }, [actualVolume]);

  const resume = useCallback(() => {
    resumeAudioContext();
  }, []);

  return {
    playMatch,
    playPerfect,
    playBeat,
    playGameOver,
    playSelect,
    playInvalid,
    resume,
  };
}
