import type { PlayerData, Settings } from '@/types';
import { DEFAULT_PLAYER_DATA, DEFAULT_SETTINGS } from '@/types';
import { STORAGE_KEYS } from './constants';

export function loadPlayerData(): PlayerData {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load player data:', e);
  }
  return { ...DEFAULT_PLAYER_DATA };
}

export function savePlayerData(data: PlayerData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save player data:', e);
  }
}

export function loadSettings(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.PLAYER_DATA);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
