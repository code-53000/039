import type { Block, BlockColor, Position } from '@/types';
import { COLORS } from '@/types';
import { MIN_MATCH_COUNT } from './constants';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getRandomColor(count: number): BlockColor {
  const available = COLORS.slice(0, count);
  return available[Math.floor(Math.random() * available.length)];
}

export function createBlock(
  color: BlockColor,
  row: number,
  col: number
): Block {
  return {
    id: generateId(),
    color,
    row,
    col,
    selected: false,
    falling: false,
    clearing: false,
  };
}

export function createEmptyGrid(rows: number, cols: number): (Block | null)[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
}

export function areAdjacent(a: Position, b: Position): boolean {
  const rowDiff = Math.abs(a.row - b.row);
  const colDiff = Math.abs(a.col - b.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function isAdjacentToAny(
  block: Position,
  blocks: Position[]
): boolean {
  return blocks.some(b => areAdjacent(block, b));
}

export function checkValidSelection(blocks: Block[]): boolean {
  if (blocks.length < MIN_MATCH_COUNT) return false;

  const firstColor = blocks[0].color;
  if (!blocks.every(b => b.color === firstColor)) return false;

  const visited = new Set<string>();
  const queue: Position[] = [{ row: blocks[0].row, col: blocks[0].col }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const neighbors = blocks.filter(b =>
      areAdjacent(current, { row: b.row, col: b.col })
    );

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (!visited.has(neighborKey)) {
        queue.push({ row: neighbor.row, col: neighbor.col });
      }
    }
  }

  return visited.size === blocks.length;
}

export function calculateScore(
  blockCount: number,
  combo: number,
  isPerfect: boolean,
  comboMultiplierStep: number,
  perfectMultiplier: number,
  baseScore: number
): number {
  const basePoints = blockCount * baseScore;
  const multiplier = 1 + (combo - 1) * comboMultiplierStep;
  const perfectBonus = isPerfect ? perfectMultiplier : 1;
  return Math.floor(basePoints * multiplier * perfectBonus);
}

export function calculateMultiplier(
  combo: number,
  comboMultiplierStep: number
): number {
  return 1 + (combo - 1) * comboMultiplierStep;
}

export function applyGravity(
  grid: (Block | null)[][]
): (Block | null)[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = createEmptyGrid(rows, cols);

  for (let col = 0; col < cols; col++) {
    let writeRow = rows - 1;
    for (let row = rows - 1; row >= 0; row--) {
      if (grid[row][col] !== null) {
        const block = grid[row][col]!;
        newGrid[writeRow][col] = {
          ...block,
          row: writeRow,
          col,
          falling: block.row !== writeRow,
        };
        writeRow--;
      }
    }
  }

  return newGrid;
}

export function spawnNewRow(
  grid: (Block | null)[][],
  colorCount: number
): { grid: (Block | null)[][]; isGameOver: boolean } {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let col = 0; col < cols; col++) {
    if (grid[0][col] !== null) {
      return { grid, isGameOver: true };
    }
  }

  const newGrid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row + 1][col]) {
        newGrid[row][col] = {
          ...grid[row + 1][col]!,
          row,
          falling: true,
        };
      }
    }
  }

  for (let col = 0; col < cols; col++) {
    newGrid[rows - 1][col] = createBlock(
      getRandomColor(colorCount),
      rows - 1,
      col
    );
  }

  return { grid: newGrid, isGameOver: false };
}

export function getLevelConfig(
  level: number,
  levels: any[]
) {
  return levels.find(l => l.level === level) || levels[0];
}
