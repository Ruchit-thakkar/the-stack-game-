import React, { useEffect } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import GameCanvas from './GameCanvas';
import StartScreen from './StartScreen';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';

/**
 * StackGame - The coordinator component.
 * Holds keyboard/pointer input handlers and displays overlays based on phase.
 */
export default function StackGame() {
  const {
    phase,
    score,
    bestScore,
    blocks,
    movingBlock,
    fallingBlocks,
    perfectEffects,
    cameraY,
    startGame,
    goToMenu,
    dropBlock,
  } = useGameEngine();

  // Desktop keyboard drop triggers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); // Prevents spacebar page scroll
        if (phase === 'PLAYING') {
          dropBlock();
        } else if (phase === 'START') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, dropBlock, startGame]);

  // Pointer interactions (handles touchstart and mousedown in 1 call, zero latency)
  const handleInteraction = (e) => {
    // Stop drop logic if interacting with buttons in Start/Gameover screens
    if (e.target.closest('button')) return;

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
        <StartScreen bestScore={bestScore} onStart={startGame} />
      )}

      {phase === 'PLAYING' && (
        <HUD score={score} bestScore={bestScore} />
      )}

      {phase === 'GAMEOVER' && (
        <GameOverScreen 
          score={score} 
          bestScore={bestScore} 
          onRestart={startGame} 
          onMainMenu={goToMenu} 
        />
      )}
    </div>
  );
}
