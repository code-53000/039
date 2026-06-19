import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAudio } from './useAudio';
import { LEVELS } from '@/utils/constants';
import { loadPlayerData } from '@/utils/storage';

export function useGameLogic() {
  const {
    isPlaying, isPaused, isGameOver, level, beatCount, isStrongBeat,
    tickBeat, triggerPerfectWindow, getLevelConfig, initGame,
    startGame, pauseGame, resumeGame, endGame,
    selectBlock, deselectBlock, clearSelection, confirmSelection,
    grid, selectedBlocks, combo, score, multiplier, showPerfect,
    particles, removeParticles, resetFallingFlags, selectBlockAt,
  } = useGameStore();

  const { keyBindings } = useSettingsStore();
  const { playMatch, playPerfect, playBeat, playGameOver, playSelect, playInvalid, resume: resumeAudio } = useAudio();

  const beatIntervalRef = useRef<number | null>(null);
  const selectedRow = useRef<number>(null);
  const selectedCol = useRef<number | null>(null);
  const isSelecting = useRef(false);

  const levelConfig = getLevelConfig();
  const bpm = levelConfig.bpm;
  const beatInterval = 60000 / bpm;

  useEffect(() => {
    if (isPlaying && !isPaused && !isGameOver) {
      beatIntervalRef.current = window.setInterval(() => {
        tickBeat();

        const newBeatCount = beatCount + 1;
        const beatInMeasure = newBeatCount % 4;
        const isStrong = beatInMeasure === 1;

        playBeat(isStrong);

        if (isStrong) {
          triggerPerfectWindow();
        }
      }, beatInterval);
    }

    return () => {
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
    };
  }, [isPlaying, isPaused, isGameOver, beatCount, beatInterval, tickBeat, triggerPerfectWindow, playBeat]);

  useEffect(() => {
    if (grid.length > 0) {
      const timer = setTimeout(() => {
        resetFallingFlags();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [grid, resetFallingFlags]);

  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        removeParticles(particles.map(p => p.id));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [particles, removeParticles]);

  useEffect(() => {
    if (isGameOver) {
      playGameOver();
    }
  }, [isGameOver, playGameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || isGameOver) return;

    if (e.key === keyBindings.pause) {
      e.preventDefault();
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
      return;
    }

    if (isPaused) return;

    if (e.key === keyBindings.select) {
      e.preventDefault();
      if (selectedBlocks.length >= 3) {
        const result = confirmSelection();
        if (result) {
          if (result.isPerfect) {
            playPerfect(combo + 1);
          } else {
            playMatch(combo + 1);
          }
          selectedRow.current = null;
          selectedCol.current = null;
        }
      } else {
        playInvalid();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      clearSelection();
      selectedRow.current = null;
      selectedCol.current = null;
      return;
    }

    if (selectedRow.current === null || selectedCol.current === null) {
      if (grid.length > 0) {
        for (let r = 0; r < grid.length; r++) {
          for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c]) {
              selectedRow.current = r;
              selectedCol.current = c;
              selectBlock(grid[r][c]!);
              playSelect();
              return;
            }
          }
        }
      }
      return;
    }

    let newRow = selectedRow.current;
    let newCol = selectedCol.current;

    if (e.key === keyBindings.up) {
      e.preventDefault();
      newRow = Math.max(0, selectedRow.current - 1);
    } else if (e.key === keyBindings.down) {
      e.preventDefault();
      newRow = Math.min(grid.length - 1, selectedRow.current + 1);
    } else if (e.key === keyBindings.left) {
      e.preventDefault();
      newCol = Math.max(0, selectedCol.current - 1);
    } else if (e.key === keyBindings.right) {
      e.preventDefault();
      newCol = Math.min(grid[0].length - 1, selectedCol.current + 1);
    }

    if (newRow !== selectedRow.current || newCol !== selectedCol.current) {
      const block = grid[newRow]?.[newCol];
      if (block) {
        const existing = selectedBlocks.find(b => b.row === newRow && b.col === newCol);
        if (existing) {
          deselectBlock(existing);
        } else {
          selectBlock(block);
          playSelect();
        }
        selectedRow.current = newRow;
        selectedCol.current = newCol;
      }
    }
  }, [isPlaying, isPaused, isGameOver, keyBindings, selectedBlocks, combo, grid, confirmSelection, selectBlock, deselectBlock, clearSelection, pauseGame, resumeGame, playMatch, playPerfect, playSelect, playInvalid]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleBlockMouseDown = useCallback((row: number, col: number) => {
    if (!isPlaying || isPaused || isGameOver) return;
    resumeAudio();
    isSelecting.current = true;
    const block = grid[row]?.[col];
    if (block) {
      clearSelection();
      selectBlock(block);
      playSelect();
      selectedRow.current = row;
      selectedCol.current = col;
    }
  }, [isPlaying, isPaused, isGameOver, grid, selectBlock, clearSelection, playSelect, resumeAudio]);

  const handleBlockMouseEnter = useCallback((row: number, col: number) => {
    if (!isSelecting.current || !isPlaying || isPaused || isGameOver) return;
    const block = grid[row]?.[col];
    if (block) {
      const existing = selectedBlocks.find(b => b.row === row && b.col === col);
      if (!existing) {
        const lastSelected = selectedBlocks[selectedBlocks.length - 1];
        if (lastSelected) {
          const rowDiff = Math.abs(lastSelected.row - row);
          const colDiff = Math.abs(lastSelected.col - col);
          const adjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
          if (adjacent && block.color === lastSelected.color) {
            selectBlock(block);
            playSelect();
            selectedRow.current = row;
            selectedCol.current = col;
          }
        }
      }
    }
  }, [isPlaying, isPaused, isGameOver, grid, selectedBlocks, selectBlock, playSelect]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting.current) return;
    isSelecting.current = false;

    if (selectedBlocks.length >= 3) {
      const result = confirmSelection();
      if (result) {
        if (result.isPerfect) {
          playPerfect(combo + 1);
        } else {
          playMatch(combo + 1);
        }
      } else {
        playInvalid();
        clearSelection();
      }
    } else if (selectedBlocks.length > 0) {
      playInvalid();
      clearSelection();
    }
    selectedRow.current = null;
    selectedCol.current = null;
  }, [selectedBlocks, combo, confirmSelection, clearSelection, playMatch, playPerfect, playInvalid]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const startNewGame = useCallback((levelNum: number) => {
    initGame(levelNum);
    setTimeout(() => {
      startGame();
      resumeAudio();
    }, 100);
  }, [initGame, startGame, resumeAudio]);

  const goToMenu = useCallback(() => {
    if (isPlaying || isGameOver) {
      endGame();
    }
  }, [isPlaying, isGameOver, endGame]);

  return {
    grid,
    selectedBlocks,
    score,
    combo,
    multiplier,
    level,
    isPlaying,
    isPaused,
    isGameOver,
    isStrongBeat,
    showPerfect,
    particles,
    levelConfig,
    bpm,
    startNewGame,
    pauseGame,
    resumeGame,
    goToMenu,
    handleBlockMouseDown,
    handleBlockMouseEnter,
    handleMouseUp,
    loadPlayerData,
  };
}
