import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Trash2, ArrowLeft } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { DEFAULT_KEY_BINDINGS } from '@/types';
import { resetAllData } from '@/utils/storage';

interface SettingsProps {
  onBack: () => void;
  onDataReset: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onDataReset }) => {
  const { volume, muted, keyBindings, setVolume, setMuted, setKeyBinding, resetKeyBindings, resetAll: resetSettings } = useSettingsStore();
  const [recordingKey, setRecordingKey] = useState<keyof typeof keyBindings | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleKeyRecord = (key: keyof typeof keyBindings) => {
    setRecordingKey(key);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (recordingKey) {
      e.preventDefault();
      setKeyBinding(recordingKey, e.key);
      setRecordingKey(null);
    }
  };

  const handleResetAllData = () => {
    resetAllData();
    resetSettings();
    onDataReset();
    setShowResetConfirm(false);
  };

  const keyLabels: Record<keyof typeof keyBindings, string> = {
    up: '上移',
    down: '下移',
    left: '左移',
    right: '右移',
    select: '确认消除',
    pause: '暂停',
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 grid-bg"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-2xl w-full">
        <h2 className="font-display text-3xl neon-text-cyan text-center mb-8">
          游戏设置
        </h2>

        <div className="space-y-8">
          <div className="p-6 rounded-lg neon-border-cyan bg-bg-darker/50 backdrop-blur-sm">
            <h3 className="font-display text-lg neon-text-cyan mb-4">音量设置</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMuted(!muted)}
                className="p-2 rounded-lg border border-cyan-500/50 hover:border-cyan-400 transition-colors"
              >
                {muted ? (
                  <VolumeX className="w-6 h-6 text-gray-500" />
                ) : (
                  <Volume2 className="w-6 h-6 text-cyan-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="font-mono text-lg neon-text-cyan w-16 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          <div className="p-6 rounded-lg neon-border-magenta bg-bg-darker/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg neon-text-magenta">按键设置</h3>
              <button
                onClick={resetKeyBindings}
                className="flex items-center gap-2 px-3 py-1 text-sm text-magenta-400 hover:text-magenta-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置默认
              </button>
            </div>
            <div className="space-y-3">
              {(Object.keys(keyBindings) as Array<keyof typeof keyBindings>).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-body text-sm text-gray-300">{keyLabels[key]}</span>
                  <button
                    onClick={() => handleKeyRecord(key)}
                    className={`
                      px-4 py-2 rounded-lg border-2 min-w-[120px] text-center font-mono
                      transition-all duration-200
                      ${recordingKey === key
                        ? 'border-yellow-400 bg-yellow-500/20 neon-text-yellow animate-pulse'
                        : 'border-magenta-500/50 text-magenta-300 hover:border-magenta-400'
                      }
                    `}
                  >
                    {recordingKey === key ? '按任意键...' : keyBindings[key] === ' ' ? 'Space' : keyBindings[key]}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg border-2 border-red-500/50 bg-bg-darker/50 backdrop-blur-sm">
            <h3 className="font-display text-lg text-red-400 mb-4">危险区域</h3>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                重置所有数据
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-red-300">
                  确定要重置所有数据吗？这将删除所有游戏进度、最高分和设置。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleResetAllData}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    确认删除
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="neon-btn-cyan flex items-center gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
};
