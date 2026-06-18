/**
 * SoundManager - Premium Web Audio API synthesizer & HTML5 Audio player.
 * Loads and plays physical MP3 files from `/audio/` with pitch-shifting playbackRate,
 * and falls back to real-time Web Audio API synthesis if file preloads fail or are blocked.
 */

let audioCtx = null;
let isMuted = false;
let masterVolume = 0.9;
let effectsVolume = 1.0;
let musicVolume = 0.85;

// Easily replaceable background audio file path
const AMBIENCE_FILE = '/audio/background.mp3';
let musicAudio = null;

const audioCache = {};

let ambienceInterval = null;
let activeAmbienceNodes = [];

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getAudioElement(name) {
  if (typeof window === 'undefined') return null;
  if (!audioCache[name]) {
    try {
      const audio = new Audio(`/audio/${name}.mp3`);
      audio.preload = 'auto';
      audioCache[name] = audio;
    } catch (e) {
      return null;
    }
  }
  return audioCache[name];
}

function playFile(name, volumeScale, playbackRate = 1.0, synthFallback = null) {
  if (isMuted) return;
  const audio = getAudioElement(name);
  if (audio) {
    try {
      audio.volume = masterVolume * effectsVolume * volumeScale;
      audio.playbackRate = playbackRate;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay restriction or error, fall back to synthesis
        if (synthFallback) synthFallback();
      });
    } catch (e) {
      if (synthFallback) synthFallback();
    }
  } else if (synthFallback) {
    synthFallback();
  }
}

// Real-time synthesizers (fallback options)
const synthesizers = {
  drop: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const currentTime = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(140, currentTime);
    osc1.frequency.exponentialRampToValueAtTime(45, currentTime + 0.06);
    gain1.gain.setValueAtTime(effectsVolume * masterVolume * 0.35, currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.06);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1600, currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1200, currentTime + 0.03);
    gain2.gain.setValueAtTime(effectsVolume * masterVolume * 0.06, currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.03);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(currentTime);
    osc2.start(currentTime);
    osc1.stop(currentTime + 0.07);
    osc2.stop(currentTime + 0.07);
  },

  perfect: (combo) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const currentTime = ctx.currentTime;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];
    const freq = scale[Math.min(combo - 1, scale.length - 1)] || 523.25;

    const playChimeNode = (f, volume, duration) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(f * 1.5, currentTime);

      gainNode.gain.setValueAtTime(volume * effectsVolume * masterVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(currentTime);
      osc.stop(currentTime + duration + 0.05);
    };

    playChimeNode(freq, 0.22, 0.5);
    playChimeNode(freq * 2, 0.1, 0.35);
    playChimeNode(freq * 3, 0.05, 0.25);

    if (combo >= 5) {
      playChimeNode(freq * 1.5, 0.08, 0.45);
      playChimeNode(freq * 1.25, 0.05, 0.4);
    }
  },

  combo: (comboCount) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const currentTime = ctx.currentTime;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];
    const f1 = scale[Math.min(comboCount - 1, scale.length - 1)] || 523.25;
    const f2 = scale[Math.min(comboCount, scale.length - 1)] || 587.33;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(f1, currentTime);
    gain1.gain.setValueAtTime(effectsVolume * masterVolume * 0.18, currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(currentTime);
    osc1.stop(currentTime + 0.4);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(f2, currentTime + 0.08);
    gain2.gain.setValueAtTime(0.0, currentTime);
    gain2.gain.setValueAtTime(effectsVolume * masterVolume * 0.12, currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08 + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(currentTime + 0.08);
    osc2.stop(currentTime + 0.08 + 0.4);
  },

  gameover: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const currentTime = ctx.currentTime;

    // Descending melancholy arpeggio (E4 -> C4 -> A3 -> E3)
    const notes = [329.63, 261.63, 220.00, 164.81];
    notes.forEach((freq, idx) => {
      const startTime = currentTime + idx * 0.12;
      const duration = 0.75;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle'; // Soft triangle wave
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.0, currentTime);
      gainNode.gain.setValueAtTime(effectsVolume * masterVolume * 0.22, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });

    // Ambient reverb noise filter decay
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, currentTime);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(effectsVolume * masterVolume * 0.04, currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 1.2);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(currentTime);
    noise.stop(currentTime + 1.25);
  },

  newrecord: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.12;
      const duration = 0.65;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 2, startTime);
      gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
      gainNode.gain.setValueAtTime(effectsVolume * masterVolume * 0.14, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  },

  click: (type) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const currentTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    if (type === 'play') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, currentTime + 0.05);
      gainNode.gain.setValueAtTime(effectsVolume * masterVolume * 0.12, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.05);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(currentTime);
      osc.stop(currentTime + 0.06);
    } else if (type === 'pause') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, currentTime);
      gainNode.gain.setValueAtTime(effectsVolume * masterVolume * 0.18, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.03);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(currentTime);
      osc.stop(currentTime + 0.04);
    } else if (type === 'resume') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, currentTime + 0.06);
      gainNode.gain.setValueAtTime(effectsVolume * masterVolume * 0.14, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.06);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(currentTime);
      osc.stop(currentTime + 0.07);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, currentTime);
      gainNode.gain.setValueAtTime(effectsVolume * masterVolume * 0.08, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.04);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(currentTime);
      osc.stop(currentTime + 0.05);
    }
  }
};

export const soundManager = {
  setMuted: (muted) => {
    isMuted = muted;
    if (musicAudio) {
      musicAudio.muted = muted;
    }
    if (muted) {
      soundManager.stopAmbience();
    } else {
      soundManager.startAmbience();
    }
  },

  setMasterVolume: (vol) => {
    masterVolume = Math.max(0, Math.min(1, vol));
    if (musicAudio) {
      musicAudio.volume = masterVolume * musicVolume;
    }
  },

  setEffectsVolume: (vol) => {
    effectsVolume = Math.max(0, Math.min(1, vol));
  },

  setMusicVolume: (vol) => {
    musicVolume = Math.max(0, Math.min(1, vol));
    if (musicAudio) {
      musicAudio.volume = masterVolume * musicVolume;
    }
    if (audioCtx) {
      activeAmbienceNodes.forEach(node => {
        try {
          node.gainNode.gain.setValueAtTime(musicVolume * masterVolume * 0.04, audioCtx.currentTime);
        } catch (e) { }
      });
    }
  },

  playDrop: () => {
    // Disabled to keep normal drops silent
  },

  playPerfect: (combo = 1) => {
    // Pitch increases with combo count
    const playbackRate = 1.0 + (combo - 1) * 0.05;
    playFile("perfect", 1.0, playbackRate, () => synthesizers.perfect(combo));
  },

  playCombo: (comboCount) => {
    playFile("combo", 1.0, 1.0, () => synthesizers.combo(comboCount));
  },

  playGameOver: () => {
    playFile("gameover", 1.0, 1.0, synthesizers.gameover);
  },

  playNewRecord: () => {
    playFile("newrecord", 1.0, 1.0, synthesizers.newrecord);
  },

  playClick: (type = 'menu') => {
    playFile("click", 1.0, 1.0, () => synthesizers.click(type));
  },

  startAmbience: () => {
    if (typeof window === 'undefined') return;
    if (isMuted) return;

    if (!musicAudio) {
      musicAudio = new Audio(AMBIENCE_FILE);
      musicAudio.loop = true;
      musicAudio.preload = 'auto';

      // Fallback if the MP3 is missing or fails to play
      musicAudio.onerror = () => {
        console.warn("Vocal/Ambient background music failed to load. Falling back to synthesized ambient chords.");
        soundManager.startSynthesizedAmbience();
      };
    }

    musicAudio.volume = masterVolume * musicVolume;
    musicAudio.muted = isMuted;

    musicAudio.play().catch(err => {
      console.warn("Autoplay blocked background music, trying synthesized ambience fallback.", err);
      soundManager.startSynthesizedAmbience();
    });
  },

  stopAmbience: () => {
    if (musicAudio) {
      try {
        musicAudio.pause();
      } catch (e) {}
    }
    soundManager.stopSynthesizedAmbience();
  },

  startSynthesizedAmbience: () => {
    const ctx = getAudioContext();
    if (!ctx || isMuted || ambienceInterval) return;

    const chords = [
      [110.00, 164.81, 220.00, 277.18, 329.63], // A2, E3, A3, C#4, E4 (A major 7)
      [92.50, 138.59, 220.00, 277.18, 329.63],  // F#2, C#3, A3, C#4, E4 (F# minor 7)
      [73.42, 146.83, 220.00, 293.66, 329.63],  // D2, D3, A3, D4, E4 (D major 9)
      [82.41, 164.81, 246.94, 293.66, 369.99]   // E2, E3, B3, D4, F#4 (E7 / Esus4)
    ];

    let chordIdx = 0;

    const playNextChord = () => {
      const now = ctx.currentTime;
      const chord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      const duration = 7.5; // Chord duration in seconds
      const attack = 2.5;   // Slow fade in
      const release = 2.5;  // Slow fade out

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Amplitude envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(musicVolume * masterVolume * 0.04, now + attack);
        gainNode.gain.setValueAtTime(musicVolume * masterVolume * 0.04, now + duration - release);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now); // Warm lowpass filter

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.1);

        activeAmbienceNodes.push({ osc, gainNode });
      });

      // Cleanup finished nodes from active array after they stop
      setTimeout(() => {
        activeAmbienceNodes = activeAmbienceNodes.filter(node => {
          return node.osc.context.currentTime < (now + duration);
        });
      }, (duration + 0.5) * 1000);
    };

    // Play first chord immediately
    playNextChord();

    // Schedule chords every 6 seconds (overlapping slightly for smooth transitions)
    ambienceInterval = setInterval(playNextChord, 6000);
  },

  stopSynthesizedAmbience: () => {
    if (ambienceInterval) {
      clearInterval(ambienceInterval);
      ambienceInterval = null;
    }
    activeAmbienceNodes.forEach(node => {
      try {
        node.osc.stop();
      } catch (e) { }
    });
    activeAmbienceNodes = [];
  }
};
