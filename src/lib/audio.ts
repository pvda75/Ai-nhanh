// Simple Web Audio API sound generator
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(frequency: number, type: OscillatorType, duration: number, vol: number = 0.1) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

export const playCorrectSound = () => {
  playTone(600, 'sine', 0.1);
  setTimeout(() => playTone(800, 'sine', 0.2), 100);
};

export const playIncorrectSound = () => {
  playTone(300, 'sawtooth', 0.3);
  setTimeout(() => playTone(200, 'sawtooth', 0.4), 150);
};

export const playFinishSound = () => {
  playTone(400, 'square', 0.1);
  setTimeout(() => playTone(500, 'square', 0.1), 100);
  setTimeout(() => playTone(600, 'square', 0.2), 200);
  setTimeout(() => playTone(800, 'square', 0.4), 300);
};
