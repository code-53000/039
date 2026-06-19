import React, { useMemo } from 'react';
import { Block } from './Block';
import type { Block as BlockType, Particle } from '@/types';

interface GameBoardProps {
  grid: (BlockType | null)[][];
  onBlockMouseDown: (row: number, col: number) => void;
  onBlockMouseEnter: (row: number, col: number) => void;
  isStrongBeat: boolean;
  particles: Particle[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onBlockMouseDown,
  onBlockMouseEnter,
  isStrongBeat,
  particles,
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const cellSize = 44;

  const boardWidth = cols * cellSize;
  const boardHeight = rows * cellSize;

  const allBlocks = useMemo(() => {
    const blocks: BlockType[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const block = grid[row]?.[col];
        if (block) {
          blocks.push(block);
        }
      }
    }
    return blocks;
  }, [grid, rows, cols]);

  return (
    <div className="relative">
      <div
        className={`
          relative rounded-lg p-2 bg-bg-grid border-2 transition-all duration-100
          ${isStrongBeat ? 'neon-border-white animate-flash-strong' : 'border-cyan-500/30'}
        `}
        style={{
          width: `${boardWidth + 16}px`,
          height: `${boardHeight + 16}px`,
        }}
      >
        <div
          className="relative overflow-hidden rounded"
          style={{ width: boardWidth, height: boardHeight }}
        >
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            }}
          >
            {Array.from({ length: rows * cols }).map((_, i) => (
              <div
                key={i}
                className="border border-cyan-900/20"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const row = Math.floor(i / cols);
                  const col = i % cols;
                  onBlockMouseDown(row, col);
                }}
                onMouseEnter={() => {
                  const row = Math.floor(i / cols);
                  const col = i % cols;
                  onBlockMouseEnter(row, col);
                }}
              />
            ))}
          </div>

          {allBlocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              onMouseDown={onBlockMouseDown}
              onMouseEnter={onBlockMouseEnter}
              cellSize={cellSize}
            />
          ))}

          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 6px ${particle.color}, 0 0 12px ${particle.color}`,
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {isStrongBeat && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none animate-pulse"
          style={{
            boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.3)',
          }}
        />
      )}
    </div>
  );
};
