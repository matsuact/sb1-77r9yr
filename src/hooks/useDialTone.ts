import { useCallback, useRef } from 'react';

const useDialTone = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((frequency1: number, frequency2: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const context = audioContextRef.current;
    const oscillator1 = context.createOscillator();
    const oscillator2 = context.createOscillator();
    const gainNode = context.createGain();

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(frequency1, context.currentTime);
    oscillator2.frequency.setValueAtTime(frequency2, context.currentTime);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0.5, context.currentTime);

    oscillator1.start();
    oscillator2.start();

    setTimeout(() => {
      oscillator1.stop();
      oscillator2.stop();
    }, 150);
  }, []);

  const playDialTone = useCallback((digit: string) => {
    const tones: { [key: string]: [number, number] } = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };

    if (digit in tones) {
      playTone(...tones[digit]);
    }
  }, [playTone]);

  return playDialTone;
};

export default useDialTone;