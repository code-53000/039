import React, { useState, useEffect } from 'react';
import { Play, Grid3X3, Settings, Volume2, VolumeX } from 'lucide-react';
import { MenuButton } from '@/components/MenuButton';
import { LevelSelect } from '@/components/LevelSelect';
import { Settings as SettingsComponent } from '@/components/Settings';
import { loadPlayerData } from '@/utils/storage';
import type { PlayerData } from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAudio } from '@/hooks/useAudio';

interface MainMenuProps {
  onStartGame: (level: number) => void;
}

type MenuView = 'main' | 'levels' | 'settings';

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [view, setView] = useState<MenuView>('main');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const { muted, setMuted, load: loadSettings } = useSettingsStore();
  const { resume } = useAudio();

  useEffect(() => {
    setPlayerData(loadPlayerData());
    loadSettings();
  }, [loadSettings]);

  const refreshPlayerData = () => {
    setPlayerData(loadPlayerData());
  };

  const handleStartGame = () => {
    resume();
    const level = playerData?.unlockedLevel || 1;
    onStartGame(level);
  };

  const handleSelectLevel = (level: number) => {
    resume();
    onStartGame(level);
  };

  if (view === 'levels') {
    return playerData ? (
      <LevelSelect
        playerData={playerData}
        onSelectLevel={handleSelectLevel}
        onBack={() => setView('main')}
      />
    ) : null;
  }

  if (view === 'settings') {
    return (
      <SettingsComponent
        onBack={() => setView('main')}
        onDataReset={refreshPlayerData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 grid-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanline-overlay" />
      </div>

      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-6 right-6 p-3 rounded-lg border border-cyan-500/50 hover:border-cyan-400 transition-all z-50"
      >
        {muted ? (
          <VolumeX className="w-6 h-6 text-gray-500" />
        ) : (
          <Volume2 className="w-6 h-6 text-cyan-400" />
        )}
      </button>

      <div className="text-center mb-16 relative z-10">
        <h1 className="font-display text-5xl md:text-7xl mb-4">
          <span className="neon-text-cyan inline-block animate-pulse-neon">节</span>
          <span className="neon-text-magenta inline-block animate-pulse-neon" style={{ animationDelay: '0.1s' }}>奏</span>
          <span className="neon-text-yellow inline-block animate-pulse-neon" style={{ animationDelay: '0.2s' }}>方</span>
          <span className="neon-text-green inline-block animate-pulse-neon" style={{ animationDelay: '0.3s' }}>块</span>
          <span className="neon-text-cyan inline-block animate-pulse-neon" style={{ animationDelay: '0.4s' }}>消</span>
          <span className="neon-text-magenta inline-block animate-pulse-neon" style={{ animationDelay: '0.5s' }}>除</span>
        </h1>
        <p className="font-body text-lg text-cyan-300/70 tracking-widest">
          RHYTHM BLOCK ELIMINATOR
        </p>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <MenuButton variant="cyan" onClick={handleStartGame}>
          <span className="flex items-center gap-3">
            <Play className="w-5 h-5" />
            开始游戏
          </span>
        </MenuButton>

        <MenuButton variant="magenta" onClick={() => setView('levels')}>
          <span className="flex items-center gap-3">
            <Grid3X3 className="w-5 h-5" />
            选择关卡
          </span>
        </MenuButton>

        <MenuButton variant="cyan" onClick={() => setView('settings')}>
          <span className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            游戏设置
          </span>
        </MenuButton>
      </div>

      {playerData && (
        <div className="absolute bottom-8 right-8 text-right relative z-10">
          <div className="font-display text-xs text-cyan-500/70 mb-1">最高分</div>
          <div className="font-mono text-3xl neon-text-cyan">
            {playerData.highScore.toLocaleString()}
          </div>
          <div className="font-body text-xs text-magenta-400/70 mt-2">
            已解锁: 第 {playerData.unlockedLevel} 关
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-8 text-left text-xs text-gray-500 font-body max-w-xs relative z-10">
        <p className="mb-1">🎮 鼠标拖拽选择同色方块</p>
        <p className="mb-1">⌨️ 方向键移动，空格确认</p>
        <p>⚡ 卡强拍消除获得完美加分！</p>
      </div>
    </div>
  );
};
