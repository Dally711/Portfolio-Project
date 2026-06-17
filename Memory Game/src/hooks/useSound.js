import { useRef, useState } from 'react';
import { TILE_SOUND_DURATION } from '../constants/gameConfig';

function getBrowserAudioContext() {
  return window.AudioContext || window.webkitAudioContext;
}

function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef(null);

  // Creates the audio context only after the player interacts with the game.
  function getAudioContext() {
    if (!audioContextRef.current) {
      const AudioContext = getBrowserAudioContext();
      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  }

  // Plays a short generated tone when sound is enabled.
  function playTone(frequency, duration = TILE_SOUND_DURATION) {
    if (!soundEnabled) {
      return;
    }

    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Gives each tile a slightly different pitch.
  function playTileSound(tile) {
    playTone(220 + tile * 18);
  }

  return {
    soundEnabled,
    setSoundEnabled,
    playTone,
    playTileSound,
  };
}

export default useSound;
