import { PENTATONIC_SCALE } from './constants';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function playTone(
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine'
): void {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function playMatchSound(combo: number, volume: number): void {
  const scaleIndex = Math.min(combo - 1, PENTATONIC_SCALE.length - 1);
  const baseFreq = PENTATONIC_SCALE[scaleIndex];
  const octaveShift = Math.floor((combo - 1) / PENTATONIC_SCALE.length);
  const frequency = baseFreq * Math.pow(2, octaveShift);

  playTone(frequency, 0.2, volume * 0.5, 'triangle');

  setTimeout(() => {
    playTone(frequency * 1.5, 0.15, volume * 0.3, 'sine');
  }, 50);
}

export function playPerfectSound(combo: number, volume: number): void {
  const scaleIndex = Math.min(combo - 1, PENTATONIC_SCALE.length - 1);
  const baseFreq = PENTATONIC_SCALE[scaleIndex];
  const octaveShift = Math.floor((combo - 1) / PENTATONIC_SCALE.length);
  const rootFreq = baseFreq * Math.pow(2, octaveShift);

  [rootFreq, rootFreq * 1.25, rootFreq * 1.5].forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.3, volume * 0.4, 'triangle');
    }, i * 60);
  });
}

export function playBeatSound(isStrong: boolean, volume: number): void {
  const ctx = getAudioContext();
  const frequency = isStrong ? 80 : 120;
  const duration = isStrong ? 0.15 : 0.08;
  const vol = isStrong ? volume * 0.6 : volume * 0.3;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(vol, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function playGameOverSound(volume: number): void {
  const freqs = [440, 349.23, 293.66, 220];
  freqs.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.4, volume * 0.4, 'sawtooth');
    }, i * 150);
  });
}

export function playSelectSound(volume: number): void {
  playTone(880, 0.05, volume * 0.2, 'sine');
}

export function playInvalidSound(volume: number): void {
  playTone(150, 0.15, volume * 0.3, 'square');
}

export function resumeAudioContext(): void {
  getAudioContext();
}
