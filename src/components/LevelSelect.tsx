import React from 'react';
import { Lock, Star } from 'lucide-react';
import { LEVELS } from '@/utils/constants';
import type { PlayerData } from '@/types';

interface LevelSelectProps {
  playerData: PlayerData;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  playerData,
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 grid-bg">
      <div className="max-w-4xl w-full">
        <h2 className="font-display text-3xl neon-text-cyan text-center mb-8">
          选择关卡
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {LEVELS.map((level) => {
            const isUnlocked = level.level <= playerData.unlockedLevel;
            const levelScore = playerData.levelScores[level.level] || 0;

            return (
              <button
                key={level.level}
                className={`
                  relative p-6 rounded-lg border-2 transition-all duration-200
                  flex flex-col items-center gap-3
                  ${isUnlocked
                    ? 'border-cyan-500/50 hover:border-cyan-400 hover:shadow-neon-cyan hover:scale-105 cursor-pointer'
                    : 'border-gray-700 opacity-60 cursor-not-allowed'
                  }
                  bg-bg-darker/70 backdrop-blur-sm
                `}
                onClick={() => isUnlocked && onSelectLevel(level.level)}
                disabled={!isUnlocked}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <Lock className="w-8 h-8 text-gray-500" />
                  </div>
                )}

                <div className={`font-display text-2xl ${isUnlocked ? 'neon-text-cyan' : 'text-gray-500'}`}>
                  {level.level}
                </div>

                <div className={`font-body text-sm ${isUnlocked ? 'text-cyan-300' : 'text-gray-600'}`}>
                  {level.name}
                </div>

                <div className="flex gap-1 text-xs">
                  <span className="text-magenta-400">{level.bpm} BPM</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-yellow-400">{level.colors} 色</span>
                </div>

                {isUnlocked && levelScore > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400 font-mono text-sm">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {levelScore.toLocaleString()}
                  </div>
                )}

                {!isUnlocked && (
                  <div className="text-xs text-gray-500 mt-2">
                    需要 {level.unlockScore.toLocaleString()} 分
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            className="neon-btn-magenta"
            onClick={onBack}
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
};
