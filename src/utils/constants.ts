import type { LevelConfig } from '@/types';

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: '新手入门',
    bpm: 80,
    colors: 3,
    rows: 10,
    cols: 6,
    unlockScore: 0,
  },
  {
    level: 2,
    name: '节奏萌芽',
    bpm: 90,
    colors: 3,
    rows: 10,
    cols: 6,
    unlockScore: 1000,
  },
  {
    level: 3,
    name: '渐入佳境',
    bpm: 100,
    colors: 4,
    rows: 12,
    cols: 6,
    unlockScore: 3000,
  },
  {
    level: 4,
    name: '动感节拍',
    bpm: 110,
    colors: 4,
    rows: 12,
    cols: 7,
    unlockScore: 6000,
  },
  {
    level: 5,
    name: '霓虹狂欢',
    bpm: 120,
    colors: 5,
    rows: 14,
    cols: 7,
    unlockScore: 10000,
  },
  {
    level: 6,
    name: '极速挑战',
    bpm: 135,
    colors: 5,
    rows: 14,
    cols: 8,
    unlockScore: 15000,
  },
  {
    level: 7,
    name: '节奏大师',
    bpm: 150,
    colors: 5,
    rows: 16,
    cols: 8,
    unlockScore: 25000,
  },
  {
    level: 8,
    name: '传说难度',
    bpm: 170,
    colors: 5,
    rows: 16,
    cols: 8,
    unlockScore: 40000,
  },
];

export const PERFECT_WINDOW_MS = 150;
export const MIN_MATCH_COUNT = 3;
export const BASE_SCORE_PER_BLOCK = 10;
export const PERFECT_MULTIPLIER = 1.5;
export const COMBO_MULTIPLIER_STEP = 0.5;
export const MISS_BEAT_RESET_THRESHOLD = 2;

export const STORAGE_KEYS = {
  PLAYER_DATA: 'rhythm_blocks_player_data',
  SETTINGS: 'rhythm_blocks_settings',
};

export const COLOR_HEX: Record<string, string> = {
  cyan: '#00f0ff',
  magenta: '#ff00ff',
  yellow: '#ffff00',
  blue: '#0066ff',
  green: '#00ff66',
};

export const PENTATONIC_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
