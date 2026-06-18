import React, { useEffect, useCallback } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import GameCanvas from './GameCanvas';
import StartScreen from './StartScreen';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import PauseScreen from './PauseScreen';
import SettingsModal from './SettingsModal';
import { soundManager } from '../utils/soundManager';

/**
 * StackGame - The coordinator component.
 * Holds keyboard/pointer input handlers and displays overlays based on phase.
 */
export default function StackGame() {
  const {
    phase,
    score,
    bestScore,
    gamesPlayed,
    highestCombo,
    totalBlocksPlaced,
    combo,
    isPaused,
    isMuted,
    speedMode,
    setSpeedMode,
    blocks,
    movingBlock,
    fallingBlocks,
    perfectEffects,
    cameraY,
    startGame,
    goToMenu,
    dropBlock,
    togglePause,
    toggleMute,
    setIsPaused,
  } = useGameEngine();

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  // Initialize ambient backing track and handle browser autoplay policy
  useEffect(() => {
    const initAudio = () => {
      soundManager.startAmbience();
      document.removeEventListener('click', initAudio, { capture: true });
      document.removeEventListener('touchstart', initAudio, { capture: true });
    };

    // Add interaction listeners to resume audio context as soon as user clicks anywhere
    document.addEventListener('click', initAudio, { capture: true });
    document.addEventListener('touchstart', initAudio, { capture: true });

    // Also try starting immediately in case page is already focused/unlocked
    soundManager.startAmbience();

    return () => {
      document.removeEventListener('click', initAudio, { capture: true });
      document.removeEventListener('touchstart', initAudio, { capture: true });
      soundManager.stopAmbience();
    };
  }, []);

  const handleStartGame = useCallback(() => {
    soundManager.playClick('play');
    startGame();
  }, [startGame]);

  const handleGoToMenu = useCallback(() => {
    soundManager.playClick('menu');
    goToMenu();
  }, [goToMenu]);

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      soundManager.playClick('resume');
    } else {
      soundManager.playClick('pause');
    }
    togglePause();
  }, [isPaused, togglePause]);

  const handleToggleMute = useCallback(() => {
    soundManager.playClick('menu');
    toggleMute();
  }, [toggleMute]);

  const handleOpenSettings = useCallback(() => {
    soundManager.playClick('menu');
    // Pause the game automatically when settings open during gameplay
    if (phase === 'PLAYING' && !isPaused) {
      setIsPaused(true);
    }
    setIsSettingsOpen(true);
  }, [phase, isPaused, setIsPaused]);

  const handleCloseSettings = useCallback(() => {
    soundManager.playClick('menu');
    setIsSettingsOpen(false);
  }, []);

  // Desktop keyboard drop triggers and pause toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); // Prevents spacebar page scroll
        if (phase === 'PLAYING' && !isPaused) {
          dropBlock();
        } else if (phase === 'START') {
          handleStartGame();
        }
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (isSettingsOpen) {
          handleCloseSettings();
        } else if (phase === 'PLAYING') {
          e.preventDefault();
          handleTogglePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isPaused, isSettingsOpen, dropBlock, handleStartGame, handleTogglePause, handleCloseSettings]);

  // Pointer interactions (handles touchstart and mousedown in 1 call, zero latency)
  const handleInteraction = (e) => {
    // Stop drop logic if interacting with buttons in overlays
    if (e.target.closest('button')) return;

    // Ignore clicks if the game is paused or settings open
    if (isPaused || isSettingsOpen) return;

    if (phase === 'PLAYING') {
      dropBlock();
    }
  };

  return (
    <div
      className="relative w-full h-full select-none flex flex-col justify-end overflow-hidden outline-none touch-none"
      onPointerDown={handleInteraction}
    >
      {/* Deep calm teal-stone gradients inspired by Alto's Odyssey / Monument Valley */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-950 via-[#032424] to-stone-950 -z-20"></div>

      {/* Isometric Canvas */}
      <GameCanvas
        blocks={blocks}
        movingBlock={movingBlock}
        fallingBlocks={fallingBlocks}
        perfectEffects={perfectEffects}
        cameraY={cameraY}
      />

      {/* Game States Overlays */}
      {phase === 'START' && (
        <StartScreen
          bestScore={bestScore}
          gamesPlayed={gamesPlayed}
          highestCombo={highestCombo}
          totalBlocksPlaced={totalBlocksPlaced}
          onStart={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {phase === 'PLAYING' && (
        <HUD
          score={score}
          bestScore={bestScore}
          combo={combo}
          onPause={handleTogglePause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {phase === 'GAMEOVER' && (
        <GameOverScreen
          score={score}
          bestScore={bestScore}
          highestCombo={highestCombo}
          totalBlocksPlaced={totalBlocksPlaced}
          onRestart={handleStartGame}
          onMainMenu={handleGoToMenu}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {/* Pause Overlay */}
      {phase === 'PLAYING' && isPaused && !isSettingsOpen && (
        <PauseScreen
          onResume={handleTogglePause}
          onRestart={handleStartGame}
          onMainMenu={handleGoToMenu}
        />
      )}

      {/* Settings Modal (above everything) */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={handleCloseSettings}
          speedMode={speedMode}
          onSetSpeedMode={setSpeedMode}
        />
      )}
    </div>
  );
}
