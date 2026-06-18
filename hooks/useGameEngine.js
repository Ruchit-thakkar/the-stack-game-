import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONSTANTS } from '../utils/gameConstants';
import { useLocalStorage } from './useLocalStorage';
import { soundManager } from '../utils/soundManager';

/**
 * Calculates game speed using a mathematically smooth cubic Hermite spline.
 * This guarantees a C1-continuous difficulty curve (no sudden jumps in acceleration)
 * passing through control points: (0, 3.0) -> (30, 3.3) -> (50, 3.8) -> (100, 4.8) -> (300, 6.2) -> (1000, 7.2).
 */
function getSpeedForScore(score) {
  const points = [
    { x: 0, y: 3.0, m: 0.005 },
    { x: 30, y: 3.3, m: 0.015 },
    { x: 50, y: 3.8, m: 0.022 },
    { x: 100, y: 4.8, m: 0.014 },
    { x: 300, y: 6.2, m: 0.0035 },
    { x: 1000, y: 7.2, m: 0.0005 }
  ];

  if (score <= 0) return points[0].y;
  if (score >= points[points.length - 1].x) {
    return points[points.length - 1].y + (score - points[points.length - 1].x) * points[points.length - 1].m;
  }

  // Find the active segment
  let i = 0;
  while (i < points.length - 1 && score > points[i+1].x) {
    i++;
  }

  const pA = points[i];
  const pB = points[i+1];
  
  const h = pB.x - pA.x;
  const t = (score - pA.x) / h;

  // Hermite basis functions
  const h00 = 2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1;
  const h10 = Math.pow(t, 3) - 2 * Math.pow(t, 2) + t;
  const h01 = -2 * Math.pow(t, 3) + 3 * Math.pow(t, 2);
  const h11 = Math.pow(t, 3) - Math.pow(t, 2);

  return h00 * pA.y + h10 * h * pA.m + h01 * pB.y + h11 * h * pB.m;
}

export function useGameEngine() {
  const [phase, setPhase] = useState('START'); // 'START' | 'PLAYING' | 'GAMEOVER'
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useLocalStorage('stackGame_bestScore', 0);
  
  // Game statistics
  const [gamesPlayed, setGamesPlayed] = useLocalStorage('stackGame_gamesPlayed', 0);
  const [highestCombo, setHighestCombo] = useLocalStorage('stackGame_highestCombo', 0);
  const [totalBlocksPlaced, setTotalBlocksPlaced] = useLocalStorage('stackGame_totalBlocksPlaced', 0);

  // Gameplay state
  const [combo, setCombo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const [blocks, setBlocks] = useState([]);
  const [movingBlock, setMovingBlock] = useState(null);
  const [fallingBlocks, setFallingBlocks] = useState([]);
  const [perfectEffects, setPerfectEffects] = useState([]);
  
  const [speed, setSpeed] = useState(GAME_CONSTANTS.INITIAL_SPEED);
  const [cameraY, setCameraY] = useState(0);
  const [targetCameraY, setTargetCameraY] = useState(0);

  // References for game loop state to avoid react closure stale states in requestAnimationFrame
  const stateRef = useRef({
    phase,
    blocks,
    movingBlock,
    fallingBlocks,
    perfectEffects,
    speed,
    score,
    cameraY,
    targetCameraY,
    isPaused,
    combo,
  });

  // Sync ref with state variables
  useEffect(() => {
    stateRef.current = {
      phase,
      blocks,
      movingBlock,
      fallingBlocks,
      perfectEffects,
      speed,
      score,
      cameraY,
      targetCameraY,
      isPaused,
      combo,
    };
  }, [phase, blocks, movingBlock, fallingBlocks, perfectEffects, speed, score, cameraY, targetCameraY, isPaused, combo]);

  // Reset the game state
  const resetGame = useCallback((nextPhase = 'PLAYING') => {
    const initialBlock = {
      x: 0,
      width: GAME_CONSTANTS.BASE_WIDTH,
      hue: GAME_CONSTANTS.HUE_START,
    };
    
    setBlocks([initialBlock]);
    setScore(0);
    setSpeed(GAME_CONSTANTS.INITIAL_SPEED);
    setCameraY(0);
    setTargetCameraY(0);
    setFallingBlocks([]);
    setPerfectEffects([]);
    setCombo(0);
    setIsPaused(false);

    if (nextPhase === 'PLAYING') {
      setGamesPlayed((prev) => prev + 1);
    }
    
    // Spawn first moving block
    // Starts from left (-220px offset) moving right
    setMovingBlock({
      x: -220,
      width: GAME_CONSTANTS.BASE_WIDTH,
      direction: 1, // 1 = right, -1 = left
      hue: GAME_CONSTANTS.HUE_START + GAME_CONSTANTS.HUE_STEP,
    });
    
    setPhase(nextPhase);
  }, [setGamesPlayed]);

  // Initialize blocks on mount
  useEffect(() => {
    resetGame('START');
  }, [resetGame]);

  // Handle block drop
  const dropBlock = useCallback((isAutopilot = false) => {
    const { 
      phase: currentPhase, 
      blocks: currentBlocks, 
      movingBlock: currentMoving, 
      score: currentScore,
      isPaused: currentIsPaused,
      combo: currentCombo
    } = stateRef.current;
    
    if (currentIsPaused && !isAutopilot) return;
    if (currentPhase !== 'PLAYING' && !isAutopilot) return;
    if (!currentMoving || currentBlocks.length === 0) return;

    const topBlock = currentBlocks[currentBlocks.length - 1];
    const diff = currentMoving.x - topBlock.x;
    const absDiff = Math.abs(diff);

    // Calculate overlap
    const overlapLeft = Math.max(currentMoving.x, topBlock.x);
    const overlapRight = Math.min(currentMoving.x + currentMoving.width, topBlock.x + topBlock.width);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 0) {
      // Game Over: zero overlap
      if (isAutopilot) {
        // In autopilot, restart the demo after a short delay
        setTimeout(() => resetGame('START'), 1500);
      } else {
        setPhase('GAMEOVER');
        if (currentScore > bestScore) {
          setBestScore(currentScore);
          soundManager.playNewRecord();
        } else {
          soundManager.playGameOver();
        }
      }

      // Drop the entire moving block as a falling block
      setFallingBlocks((prev) => [
        ...prev,
        {
          x: currentMoving.x,
          y: currentBlocks.length * GAME_CONSTANTS.BLOCK_HEIGHT,
          width: currentMoving.width,
          depth: GAME_CONSTANTS.BLOCK_DEPTH,
          hue: currentMoving.hue,
          velocityY: 0,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.06,
        },
      ]);
      setMovingBlock(null);
      return;
    }

    let placedBlockX = overlapLeft;
    let placedBlockWidth = overlapWidth;
    let isPerfect = false;
    let nextCombo = 0;

    if (absDiff <= GAME_CONSTANTS.PERFECT_THRESHOLD) {
      isPerfect = true;
      placedBlockX = topBlock.x;        // Snap perfectly to top block position
      placedBlockWidth = topBlock.width; // Retain full width of top block
      
      if (!isAutopilot) {
        nextCombo = currentCombo + 1;
        setCombo(nextCombo);
        setHighestCombo((prev) => Math.max(prev, nextCombo));
        
        // Sound management placeholder
        if (nextCombo > 1) {
          soundManager.playCombo(nextCombo);
        } else {
          soundManager.playPerfect();
        }
      }

      // Perfect placement visual effect centered on the block
      setPerfectEffects((prev) => [
        ...prev,
        {
          x: placedBlockX + placedBlockWidth / 2,
          y: (currentBlocks.length + 1) * GAME_CONSTANTS.BLOCK_HEIGHT,
          life: 0,
          maxLife: 24, // Frames (~400ms)
        },
      ]);
    } else {
      if (!isAutopilot) {
        setCombo(0);
        soundManager.playDrop();
      }

      // Create falling block from cut-off chunk (debris)
      let cutX, cutWidth;
      if (currentMoving.x < topBlock.x) {
        // Cut-off is on the left
        cutX = currentMoving.x;
        cutWidth = topBlock.x - currentMoving.x;
      } else {
        // Cut-off is on the right
        cutX = topBlock.x + topBlock.width;
        cutWidth = (currentMoving.x + currentMoving.width) - (topBlock.x + topBlock.width);
      }

      setFallingBlocks((prev) => [
        ...prev,
        {
          x: cutX,
          y: currentBlocks.length * GAME_CONSTANTS.BLOCK_HEIGHT,
          width: cutWidth,
          depth: GAME_CONSTANTS.BLOCK_DEPTH,
          hue: currentMoving.hue,
          velocityY: 0,
          rotation: 0,
          rotationSpeed: (currentMoving.x < topBlock.x ? -1 : 1) * (0.02 + Math.random() * 0.04),
        },
      ]);
    }

    const placedBlock = {
      x: placedBlockX,
      width: placedBlockWidth,
      hue: currentMoving.hue,
    };

    const nextBlocks = [...currentBlocks, placedBlock];
    setBlocks(nextBlocks);

    // Update scoring and speed curves
    if (!isAutopilot) {
      const scoreGain = isPerfect ? 2 : 1;
      const nextScore = currentScore + scoreGain;
      setScore(nextScore);

      setTotalBlocksPlaced((prev) => prev + 1);

      // Use the smooth progression difficulty curve
      const nextSpeed = getSpeedForScore(nextScore);
      setSpeed(nextSpeed);
    } else {
      // Autopilot resets automatically after 12 blocks to stay compact
      if (nextBlocks.length >= 12) {
        setTimeout(() => resetGame('START'), 1500);
      }
    }

    // Camera targets top of the stack
    const newStackHeight = nextBlocks.length * GAME_CONSTANTS.BLOCK_HEIGHT;
    setTargetCameraY(newStackHeight);

    // Spawn the next moving block
    const nextHue = GAME_CONSTANTS.HUE_START + nextBlocks.length * GAME_CONSTANTS.HUE_STEP;
    const slideSide = Math.random() > 0.5 ? 1 : -1;
    const nextSpawnX = placedBlockX + slideSide * 240;

    setMovingBlock({
      x: nextSpawnX,
      width: placedBlockWidth,
      direction: -slideSide, // Move in opposite direction toward stack
      hue: nextHue,
    });
  }, [bestScore, setBestScore, resetGame, setHighestCombo, setTotalBlocksPlaced]);

  // Main game update loop ran at 60fps
  const updateFrame = useCallback(() => {
    const {
      phase: currentPhase,
      blocks: currentBlocks,
      movingBlock: currentMoving,
      fallingBlocks: currentFalling,
      perfectEffects: currentPerfects,
      speed: currentSpeed,
      cameraY: currentCamY,
      targetCameraY: currentTargetCamY,
      isPaused: currentIsPaused,
    } = stateRef.current;

    // 1. Update camera Y interpolation (run during pause for visual smoothness)
    if (Math.abs(currentTargetCamY - currentCamY) > 0.1) {
      setCameraY(currentCamY + (currentTargetCamY - currentCamY) * 0.1);
    }

    // Halt gameplay state changes if paused
    if (currentIsPaused) return;

    // 2. Update sliding block
    if (currentMoving && (currentPhase === 'PLAYING' || currentPhase === 'START')) {
      const topBlock = currentBlocks[currentBlocks.length - 1];
      const leftBound = topBlock.x - 260;
      const rightBound = topBlock.x + 260;

      let nextX = currentMoving.x + currentSpeed * currentMoving.direction;

      // Reverse sliding direction if hit bounds
      let nextDirection = currentMoving.direction;
      if (nextX > rightBound) {
        nextX = rightBound;
        nextDirection = -1;
      } else if (nextX < leftBound) {
        nextX = leftBound;
        nextDirection = 1;
      }

      setMovingBlock({
        ...currentMoving,
        x: nextX,
        direction: nextDirection,
      });

      // Autopilot trigger: drop block when close to center
      if (currentPhase === 'START') {
        const diff = nextX - topBlock.x;
        // Check if block is passing center (absolute difference is small)
        // Add a slight variance to make autopilot look natural
        const triggerThreshold = 1.5;
        if (Math.abs(diff) < triggerThreshold) {
          dropBlock(true);
        }
      }
    }

    // 3. Update falling debris block locations
    if (currentFalling.length > 0) {
      const nextFalling = currentFalling
        .map((fb) => ({
          ...fb,
          y: fb.y - fb.velocityY,
          velocityY: fb.velocityY + GAME_CONSTANTS.GRAVITY,
          rotation: fb.rotation + fb.rotationSpeed,
        }))
        // Filter out blocks that have fallen past the screen (e.g. 500px below camera position)
        .filter((fb) => fb.y > currentCamY - 400);

      setFallingBlocks(nextFalling);
    }

    // 4. Update perfect ring effects life
    if (currentPerfects.length > 0) {
      const nextPerfects = currentPerfects
        .map((pe) => ({
          ...pe,
          life: pe.life + 1,
        }))
        .filter((pe) => pe.life < pe.maxLife);

      setPerfectEffects(nextPerfects);
    }
  }, [dropBlock]);

  // Set up requestAnimationFrame loop
  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      updateFrame();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [updateFrame]);

  return {
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
    startGame: () => resetGame('PLAYING'),
    goToMenu: () => resetGame('START'),
    dropBlock: () => dropBlock(false),
    togglePause: () => setIsPaused((prev) => !prev),
    setIsPaused,
  };
}

