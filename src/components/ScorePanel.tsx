import React from 'react';

interface ScorePanelProps {
  score: number;
  combo: number;
  multiplier: number;
  level: number;
  levelName: string;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, combo, multiplier, level, levelName }) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg neon-border-cyan bg-bg-darker/50 backdrop-blur-sm">
      <div className="text-center">
        <div className="font-display text-xs text-cyan-500/70 mb-1">SCORE</div>
        <div className="font-mono text-4xl neon-text-cyan">
          {score.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="font-display text-xs text-magenta-500/70 mb-1">COMBO</div>
          <div
            className={`
              font-mono text-3xl transition-all duration-200
              ${combo >= 5 ? 'neon-text-magenta scale-110' : 'text-fuchsia-400'}
              ${combo >= 10 ? 'rainbow-glow' : ''}
            `}
          >
            {combo}x
          </div>
        </div>

        <div className="text-center">
          <div className="font-display text-xs text-yellow-500/70 mb-1">MULTI</div>
          <div className={`font-mono text-3xl transition-all duration-200 ${multiplier > 1 ? 'neon-text-yellow' : 'text-yellow-400'}`}>
            {multiplier.toFixed(1)}x
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-500/30 pt-4 text-center">
        <div className="font-display text-xs text-green-500/70 mb-1">LEVEL</div>
        <div className="font-mono text-2xl neon-text-green">
          {level} - {levelName}
        </div>
      </div>
    </div>
  );
};
