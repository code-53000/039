import { create } from 'zustand';
import type { Block, GameState, Particle } from '@/types';
import { LEVELS, BASE_SCORE_PER_BLOCK, COMBO_MULTIPLIER_STEP, PERFECT_MULTIPLIER, PERFECT_WINDOW_MS } from '@/utils/constants';
import { createEmptyGrid, createBlock, getRandomColor, checkValidSelection, calculateScore, calculateMultiplier, applyGravity, spawnNewRow, generateId } from '@/utils/helpers';
import { COLOR_HEX } from '@/utils/constants';
import { loadPlayerData, savePlayerData } from '@/utils/storage';

interface GameStore extends GameState {
  initGame: (level: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  selectBlock: (block: Block) => void;
  deselectBlock: (block: Block) => void;
  clearSelection: () => void;
  confirmSelection: () => { isPerfect: boolean; cleared: number } | null;
  tickBeat: () => void;
  triggerPerfectWindow: () => void;
  closePerfectWindow: () => void;
  setShowPerfect: (show: boolean) => void;
  addParticles: (particles: Particle[]) => void;
  removeParticles: (ids: string[]) => void;
  resetFallingFlags: () => void;
  selectBlockAt: (row: number, col: number) => void;
  getLevelConfig: () => typeof LEVELS[0];
}

export const useGameStore = create<GameStore>((set, get) => ({
  grid: [],
  score: 0,
  combo: 0,
  multiplier: 1,
  level: 1,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  selectedBlocks: [],
  beatCount: 0,
  isStrongBeat: false,
  perfectWindow: false,
  currentBeat: 0,
  showPerfect: false,
  particles: [],

  initGame: (level: number) => {
    const levelConfig = LEVELS.find(l => l.level === level) || LEVELS[0];
    const grid = createEmptyGrid(levelConfig.rows, levelConfig.cols);

    for (let row = levelConfig.rows - 4; row < levelConfig.rows; row++) {
      for (let col = 0; col < levelConfig.cols; col++) {
        grid[row][col] = createBlock(
          getRandomColor(levelConfig.colors),
          row,
          col
        );
      }
    }

    set({
      grid,
      score: 0,
      combo: 0,
      multiplier: 1,
      level,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      selectedBlocks: [],
      beatCount: 0,
      isStrongBeat: false,
      perfectWindow: false,
      currentBeat: 0,
      showPerfect: false,
      particles: [],
    });
  },

  startGame: () => {
    set({ isPlaying: true, isPaused: false });
  },

  pauseGame: () => {
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  endGame: () => {
    const { score, level } = get();
    const playerData = loadPlayerData();

    if (score > playerData.highScore) {
      playerData.highScore = score;
    }

    if (!playerData.levelScores[level] || score > playerData.levelScores[level]) {
      playerData.levelScores[level] = score;
    }

    const nextLevel = LEVELS.find(l => l.level === level + 1);
    if (nextLevel && score >= nextLevel.unlockScore && level >= playerData.unlockedLevel) {
      playerData.unlockedLevel = level + 1;
    }

    savePlayerData(playerData);

    set({ isPlaying: false, isGameOver: true });
  },

  selectBlock: (block: Block) => {
    const { selectedBlocks } = get();
    if (selectedBlocks.find(b => b.id === block.id)) return;

    const newGrid = get().grid.map(row => row.map(b =>
      b?.id === block.id ? { ...b, selected: true } : b
    ));

    set({
      grid: newGrid,
      selectedBlocks: [...selectedBlocks, { ...block, selected: true }],
    });
  },

  deselectBlock: (block: Block) => {
    const { selectedBlocks } = get();
    const newSelected = selectedBlocks.filter(b => b.id !== block.id);

    const newGrid = get().grid.map(row => row.map(b =>
      b?.id === block.id ? { ...b, selected: false } : b
    ));

    set({
      grid: newGrid,
      selectedBlocks: newSelected,
    });
  },

  clearSelection: () => {
    const { grid, selectedBlocks } = get();
    const newGrid = grid.map(row => row.map(b => {
      if (b && selectedBlocks.find(sb => sb.id === b.id)) {
        return { ...b, selected: false };
      }
      return b;
    }));

    set({
      grid: newGrid,
      selectedBlocks: [],
    });
  },

  selectBlockAt: (row: number, col: number) => {
    const { grid, selectedBlocks } = get();
    const block = grid[row]?.[col];
    if (!block) return;

    if (selectedBlocks.find(b => b.id === block.id)) {
      get().deselectBlock(block);
    } else {
      get().selectBlock(block);
    }
  },

  confirmSelection: () => {
    const { selectedBlocks, combo, perfectWindow, level } = get();
    if (!checkValidSelection(selectedBlocks)) {
      return null;
    }

    const newCombo = combo + 1;
    const isPerfect = perfectWindow;
    const blockCount = selectedBlocks.length;
    const points = calculateScore(
      blockCount,
      newCombo,
      isPerfect,
      COMBO_MULTIPLIER_STEP,
      PERFECT_MULTIPLIER,
      BASE_SCORE_PER_BLOCK
    );
    const newMultiplier = calculateMultiplier(newCombo, COMBO_MULTIPLIER_STEP);

    const clearedIds = new Set(selectedBlocks.map(b => b.id));
    let newGrid = get().grid.map(row =>
      row.map(b => {
        if (b && clearedIds.has(b.id)) {
          return { ...b, clearing: true };
        }
        return b;
      })
    );

    const particles: Particle[] = [];
    selectedBlocks.forEach(block => {
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        particles.push({
          id: generateId(),
          x: block.col * 44 + 22,
          y: block.row * 44 + 22,
          color: COLOR_HEX[block.color],
          tx: Math.cos(angle) * (30 + Math.random() * 20),
          ty: Math.sin(angle) * (30 + Math.random() * 20),
        });
      }
    });

    setTimeout(() => {
      const clearedGrid = get().grid.map(row =>
        row.map(b => (b && clearedIds.has(b.id)) ? null : b)
      );

      const levelConfig = LEVELS.find(l => l.level === level) || LEVELS[0];
      const gravityApplied = applyGravity(clearedGrid);
      const { grid: afterSpawn, isGameOver } = spawnNewRow(gravityApplied, levelConfig.colors);

      if (isGameOver) {
        set({ grid: afterSpawn, isGameOver: true, isPlaying: false });
        return;
      }

      set({
        grid: afterSpawn,
        combo: 0,
        multiplier: 1,
      });
    }, 300);

    set(state => ({
      grid: newGrid,
      score: state.score + points,
      combo: newCombo,
      multiplier: newMultiplier,
      selectedBlocks: [],
      particles: [...state.particles, ...particles],
      showPerfect: isPerfect,
    }));

    if (isPerfect) {
      setTimeout(() => set({ showPerfect: false }), 1000);
    }

    return { isPerfect, cleared: blockCount };
  },

  tickBeat: () => {
    const { isPlaying, isPaused, combo, beatCount, level } = get();
    if (!isPlaying || isPaused) return;

    const newBeatCount = beatCount + 1;
    const beatInMeasure = newBeatCount % 4;
    const isStrong = beatInMeasure === 1;

    if (!isStrong && combo > 0) {
      set({ combo: 0, multiplier: 1 });
    }

    set({
      beatCount: newBeatCount,
      currentBeat: beatInMeasure,
      isStrongBeat: isStrong,
    });

    if (isStrong) {
      const levelConfig = LEVELS.find(l => l.level === level) || LEVELS[0];
      const { grid } = get();
      const { grid: newGrid, isGameOver } = spawnNewRow(grid, levelConfig.colors);

      if (isGameOver) {
        set({ grid: newGrid, isGameOver: true, isPlaying: false });
        return;
      }

      set({ grid: newGrid });
    }
  },

  triggerPerfectWindow: () => {
    set({ perfectWindow: true });
    setTimeout(() => {
      set({ perfectWindow: false });
    }, PERFECT_WINDOW_MS);
  },

  closePerfectWindow: () => {
    set({ perfectWindow: false });
  },

  setShowPerfect: (show: boolean) => {
    set({ showPerfect: show });
  },

  addParticles: (particles: Particle[]) => {
    set(state => ({ particles: [...state.particles, ...particles] }));
  },

  removeParticles: (ids: string[]) => {
    const idSet = new Set(ids);
    set(state => ({
      particles: state.particles.filter(p => !idSet.has(p.id)),
    }));
  },

  resetFallingFlags: () => {
    const newGrid = get().grid.map(row =>
      row.map(b => (b ? { ...b, falling: false } : b))
    );
    set({ grid: newGrid });
  },

  getLevelConfig: () => {
    const { level } = get();
    return LEVELS.find(l => l.level === level) || LEVELS[0];
  },
}));
