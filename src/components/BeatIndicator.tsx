import React from 'react';

interface BeatIndicatorProps {
  bpm: number;
  isStrongBeat: boolean;
  isPlaying: boolean;
}

export const BeatIndicator: React.FC<BeatIndicatorProps> = ({ bpm, isStrongBeat, isPlaying }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          relative w-20 h-20 rounded-full border-2 flex items-center justify-center
          transition-all duration-150
          ${isStrongBeat
            ? 'border-white shadow-neon-white scale-110'
            : 'border-cyan-500/50'
          }
          ${isPlaying ? 'animate-pulse-neon' : ''}
        `}
      >
        <div
          className={`
            absolute inset-2 rounded-full
            transition-all duration-150
            ${isStrongBeat
              ? 'bg-white/30 scale-100'
              : 'bg-cyan-500/10 scale-90'
            }
          `}
        />
        <span className="font-mono text-2xl neon-text-cyan relative z-10">
          {bpm}
        </span>
      </div>
      <span className="font-body text-xs text-cyan-500/70 tracking-widest">BPM</span>
    </div>
  );
};
