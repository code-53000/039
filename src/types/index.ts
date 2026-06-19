export type BlockColor = 'cyan' | 'magenta' | 'yellow' | 'blue' | 'green';

export interface Block {
  id: string;
  color: BlockColor;
  row: number;
  col: number;
  selected: boolean;
  falling: boolean;
  clearing: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface LevelConfig {
  level: number;
  bpm: number;
  colors: number;
  rows: number;
  cols: number;
  unlockScore: number;
  name: string;
}

export interface PlayerData {
  highScore: number;
  unlockedLevel: number;
  levelScores: Record<number, number>;
}

export interface KeyBindings {
  up: string;
  down: string;
  left: string;
  right: string;
  select: string;
  pause: string;
}

export interface Settings {
  volume: number;
  muted: boolean;
  keyBindings: KeyBindings;
}

export interface GameState {
  grid: (Block | null)[][];
  score: number;
  combo: number;
  multiplier: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  selectedBlocks: Block[];
  beatCount: number;
  isStrongBeat: boolean;
  perfectWindow: boolean;
  currentBeat: number;
  showPerfect: boolean;
  particles: Particle[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
}

export const COLORS: BlockColor[] = ['cyan', 'magenta', 'yellow', 'blue', 'green'];

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  select: ' ',
  pause: 'Escape',
};

export const DEFAULT_SETTINGS: Settings = {
  volume: 0.5,
  muted: false,
  keyBindings: { ...DEFAULT_KEY_BINDINGS },
};

export const DEFAULT_PLAYER_DATA: PlayerData = {
  highScore: 0,
  unlockedLevel: 1,
  levelScores: {},
};
