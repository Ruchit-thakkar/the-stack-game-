import React, { useEffect, useCallback } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import GameCanvas from './GameCanvas';
import StartScreen from './StartScreen';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import PauseScreen from './PauseScreen';
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
  } = useGameEngine();

  // Initialize ambient backing track
  useEffect(() => {
    soundManager.startAmbience();
    return () => {
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

  // Desktop keyboard drop triggers and pause toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); // Prevents spacebar page scroll
        if (phase === 'PLAYING' && !isPaused) {
          dropBlock();
        } else if (phase === 'START') {
          handleStartGame();
        }
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (phase === 'PLAYING') {
          e.preventDefault();
          handleTogglePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isPaused, dropBlock, handleStartGame, handleTogglePause]);

  // Pointer interactions (handles touchstart and mousedown in 1 call, zero latency)
  const handleInteraction = (e) => {
    // Stop drop logic if interacting with buttons in overlays
    if (e.target.closest('button')) return;
    
    // Ignore clicks if the game is paused
    if (isPaused) return;

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
        />
      )}

      {/* Pause Overlay */}
      {phase === 'PLAYING' && isPaused && (
        <PauseScreen 
          onResume={handleTogglePause}
          onRestart={handleStartGame}
          onMainMenu={handleGoToMenu}
        />
      )}
    </div>
  );
}
