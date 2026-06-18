/**
 * soundManager - Decoupled audio controller placeholders.
 * These will print messages to the console for future implementation.
 */
export const soundManager = {
  playDrop: () => {
    console.log('%c[SoundManager] 🔊 Play Drop Sound', 'color: #3b82f6; font-weight: bold;');
  },
  playPerfect: () => {
    console.log('%c[SoundManager] ✨ Play Perfect Sound', 'color: #eab308; font-weight: bold;');
  },
  playCombo: (comboCount) => {
    console.log(
      `%c[SoundManager] 🔥 Play Combo Sound (Streak: ${comboCount})`,
      'color: #f97316; font-weight: bold; font-size: 1.1em;'
    );
  },
  playGameOver: () => {
    console.log('%c[SoundManager] 💀 Play Game Over Sound', 'color: #ef4444; font-weight: bold;');
  },
  playNewRecord: () => {
    console.log(
      '%c[SoundManager] 🏆 Play New Record Sound (Celebration!)',
      'color: #10b981; font-weight: bold; font-size: 1.2em;'
    );
  },
};
