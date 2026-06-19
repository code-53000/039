import { create } from 'zustand';
import type { Settings, KeyBindings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { loadSettings, saveSettings } from '@/utils/storage';

interface SettingsStore extends Settings {
  load: () => void;
  save: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setKeyBinding: (key: keyof KeyBindings, value: string) => void;
  resetKeyBindings: () => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,

  load: () => {
    const settings = loadSettings();
    set(settings);
  },

  save: () => {
    const { volume, muted, keyBindings } = get();
    saveSettings({ volume, muted, keyBindings });
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
    get().save();
  },

  setMuted: (muted: boolean) => {
    set({ muted });
    get().save();
  },

  setKeyBinding: (key: keyof KeyBindings, value: string) => {
    set(state => ({
      keyBindings: {
        ...state.keyBindings,
        [key]: value,
      },
    }));
    get().save();
  },

  resetKeyBindings: () => {
    set(state => ({
      keyBindings: { ...DEFAULT_SETTINGS.keyBindings },
    }));
    get().save();
  },

  resetAll: () => {
    set({ ...DEFAULT_SETTINGS });
    get().save();
  },
}));
