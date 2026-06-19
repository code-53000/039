import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pause, Play, Home, RotateCcw, X } from 'lucide-react';
import { GameBoard } from '@/components/GameBoard';
import { ScorePanel } from '@/components/ScorePanel';
import { BeatIndicator } from '@/components/BeatIndicator';
import { useGameLogic } from '@/hooks/useGameLogic';
import { loadPlayerData } from '@/utils/storage';

export const Game: React.FC = () => {
  const { level = '1' } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const levelNum = parseInt(level, 10);

  const {
    grid,
    score,
    combo,
    multiplier,
    level: currentLevel,
    isPlaying,
    isPaused,
    isGameOver,
    isStrongBeat,
    showPerfect,
    particles,
    bpm,
    levelConfig,
    startNewGame,
    pauseGame,
    resumeGame,
    goToMenu,
    handleBlockMouseDown,
    handleBlockMouseEnter,
    handleMouseUp,
  } = useGameLogic();

  useEffect(() => {
    startNewGame(levelNum);
  }, [levelNum, startNewGame]);

  const handleBackToMenu = useCallback(() => {
    goToMenu();
    navigate('/');
  }, [goToMenu, navigate]);

  const handleRestart = useCallback(() => {
    startNewGame(levelNum);
  }, [levelNum, startNewGame]);

  const playerData = loadPlayerData();
  const isNewHighScore = isGameOver && score > playerData.highScore;

  if (grid.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark grid-bg">
        <div className="font-mono text-2xl neon-text-cyan animate-pulse">
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-dark grid-bg relative overflow-hidden"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanline-overlay" />
      </div>

      {combo >= 5 && (
        <div className="absolute inset-0 pointer-events-none rainbow-glow opacity-30" />
      )}

      <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
        <div className="flex flex-col gap-4 w-64">
          <ScorePanel
            score={score}
            combo={combo}
            multiplier={multiplier}
            level={currentLevel}
            levelName={levelConfig.name}
          />

          <BeatIndicator
            bpm={bpm}
            isStrongBeat={isStrongBeat}
            isPlaying={isPlaying && !isPaused}
          />
        </div>

        <div className="relative">
          <button
            onClick={isPaused ? resumeGame : pauseGame}
            className="absolute -top-2 right-0 z-20 p-2 rounded-full border border-cyan-500/50 bg-bg-darker/80 backdrop-blur-sm hover:border-cyan-400 transition-all"
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-cyan-400" />
            ) : (
              <Pause className="w-5 h-5 text-cyan-400" />
            )}
          </button>

          <GameBoard
            grid={grid}
            onBlockMouseDown={handleBlockMouseDown}
            onBlockMouseEnter={handleBlockMouseEnter}
            isStrongBeat={isStrongBeat}
            particles={particles}
          />

          {showPerfect && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
              <div className="font-display text-4xl neon-text-yellow animate-float-up">
                PERFECT!
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 w-48">
          <button
            onClick={handleBackToMenu}
            className="neon-btn-cyan !py-3 !text-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            主菜单
          </button>

          <button
            onClick={handleRestart}
            className="neon-btn-magenta !py-3 !text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重新开始
          </button>

          <div className="p-4 rounded-lg border border-cyan-500/30 bg-bg-darker/50">
            <div className="font-display text-xs text-cyan-500/70 mb-2">操作说明</div>
            <div className="font-body text-xs text-gray-400 space-y-1">
              <p>🖱️ 拖拽选择方块</p>
              <p>⬆️⬇️⬅️➡️ 方向键移动</p>
              <p>␣ 空格确认消除</p>
              <p>ESC 暂停/取消</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-magenta-500/30 bg-bg-darker/50">
            <div className="font-display text-xs text-magenta-500/70 mb-2">完美时机</div>
            <div className={`font-body text-xs ${isStrongBeat ? 'text-white animate-pulse' : 'text-gray-400'}`}>
              {isStrongBeat ? '⚡ 现在！卡节拍！' : '等待强拍...'}
            </div>
          </div>
        </div>
      </div>

      {(isPaused || isGameOver) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-8 rounded-xl neon-border-cyan bg-bg-darker text-center max-w-md">
            {isGameOver ? (
              <>
                <h2 className="font-display text-3xl neon-text-magenta mb-4">
                  游戏结束
                </h2>
                {isNewHighScore && (
                  <div className="font-mono text-xl neon-text-yellow mb-4 animate-pulse">
                    🎉 新纪录！
                  </div>
                )}
                <div className="font-display text-xs text-cyan-500/70 mb-1">最终得分</div>
                <div className="font-mono text-5xl neon-text-cyan mb-6">
                  {score.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 mb-6">
                  最高连击: {combo}x | 关卡: {levelConfig.name}
                </div>
              </>
            ) : (
              <h2 className="font-display text-3xl neon-text-cyan mb-8">
                游戏暂停
              </h2>
            )}

            <div className="flex gap-4 justify-center">
              {isGameOver ? (
                <>
                  <button
                    onClick={handleRestart}
                    className="neon-btn-cyan"
                  >
                    <span className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      再来一局
                    </span>
                  </button>
                  <button
                    onClick={handleBackToMenu}
                    className="neon-btn-magenta"
                  >
                    <span className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      主菜单
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={resumeGame}
                    className="neon-btn-cyan"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      继续游戏
                    </span>
                  </button>
                  <button
                    onClick={handleBackToMenu}
                    className="neon-btn-magenta"
                  >
                    <span className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      退出游戏
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
