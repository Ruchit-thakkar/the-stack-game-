import React, { useEffect } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import GameCanvas from './GameCanvas';
import StartScreen from './StartScreen';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import PauseScreen from './PauseScreen';

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
    blocks,
    movingBlock,
    fallingBlocks,
    perfectEffects,
    cameraY,
    startGame,
    goToMenu,
    dropBlock,
    togglePause,
  } = useGameEngine();

  // Desktop keyboard drop triggers and pause toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); // Prevents spacebar page scroll
        if (phase === 'PLAYING' && !isPaused) {
          dropBlock();
        } else if (phase === 'START') {
          startGame();
        }
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (phase === 'PLAYING') {
          e.preventDefault();
          togglePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isPaused, dropBlock, startGame, togglePause]);

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
      {/* Dark premium gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black -z-20"></div>

      {/* Subtle depth matrix dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1.5px,transparent_1.5px)] bg-[size:24px_24px] opacity-70 -z-10 pointer-events-none"></div>

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
          onStart={startGame} 
        />
      )}

      {phase === 'PLAYING' && (
        <HUD 
          score={score} 
          bestScore={bestScore} 
          combo={combo}
          onPause={togglePause} 
        />
      )}

      {phase === 'GAMEOVER' && (
        <GameOverScreen 
          score={score} 
          bestScore={bestScore} 
          highestCombo={highestCombo}
          totalBlocksPlaced={totalBlocksPlaced}
          onRestart={startGame} 
          onMainMenu={goToMenu} 
        />
      )}

      {/* Pause Overlay */}
      {phase === 'PLAYING' && isPaused && (
        <PauseScreen 
          onResume={togglePause}
          onRestart={startGame}
          onMainMenu={goToMenu}
        />
      )}
    </div>
  );
}

