import React from 'react';
import type { Block as BlockType } from '@/types';

interface BlockProps {
  block: BlockType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  cellSize: number;
}

export const Block: React.FC<BlockProps> = ({ block, onMouseDown, onMouseEnter, cellSize }) => {
  const colorClass = `block-${block.color}`;
  const sizeStyle = {
    width: `${cellSize - 4}px`,
    height: `${cellSize - 4}px`,
  };

  return (
    <div
      className={`
        absolute rounded-md cursor-pointer transition-all duration-150
        ${colorClass}
        ${block.selected ? 'block-selected' : ''}
        ${block.falling ? 'animate-pulse' : ''}
        ${block.clearing ? 'scale-0 opacity-0 transition-all duration-300' : ''}
      `}
      style={{
        ...sizeStyle,
        left: `${block.col * cellSize + 2}px`,
        top: `${block.row * cellSize + 2}px`,
        transition: block.falling ? 'top 0.2s ease-out' : 'all 0.15s ease-out',
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(block.row, block.col);
      }}
      onMouseEnter={() => onMouseEnter(block.row, block.col)}
    />
  );
};
