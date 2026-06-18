import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONSTANTS } from '../utils/gameConstants';
import { useLocalStorage } from './useLocalStorage';
import { soundManager } from '../utils/soundManager';

const SPEED_CURVES = {
  slow: [
    { x: 0, y: 1.2, m: 0.008 },
    { x: 30, y: 1.5, m: 0.015 },
    { x: 50, y: 2.0, m: 0.02 },
    { x: 100, y: 3.0, m: 0.015 },
    { x: 200, y: 4.5, m: 0.01 },
    { x: 300, y: 5.8, m: 0.006 },
    { x: 500, y: 6.8, m: 0.003 },
    { x: 1000, y: 8.0, m: 0.001 },
    { x: 2000, y: 8.5, m: 0.0 }
  ],
  medium: [
    { x: 0, y: 1.8, m: 0.01 },
    { x: 30, y: 2.2, m: 0.018 },
    { x: 50, y: 2.8, m: 0.022 },
    { x: 100, y: 4.0, m: 0.016 },
    { x: 200, y: 5.5, m: 0.011 },
    { x: 300, y: 6.8, m: 0.007 },
    { x: 500, y: 7.8, m: 0.004 },
    { x: 1000, y: 8.8, m: 0.0015 },
    { x: 2000, y: 9.2, m: 0.0 }
  ],
  fast: [
    { x: 0, y: 2.5, m: 0.014 },
    { x: 30, y: 3.2, m: 0.022 },
    { x: 50, y: 4.0, m: 0.028 },
    { x: 100, y: 5.5, m: 0.02 },
    { x: 200, y: 7.0, m: 0.014 },
    { x: 300, y: 8.0, m: 0.009 },
    { x: 500, y: 9.0, m: 0.005 },
    { x: 1000, y: 10.0, m: 0.002 },
    { x: 2000, y: 10.5, m: 0.0 }
  ]
};

/**
 * Calculates game speed using a mathematically smooth cubic Hermite spline.
 * This guarantees a C1-continuous difficulty curve (no sudden jumps in acceleration)
 * passing through control points corresponding to the selected speedMode.
 */
function getSpeedForScore(score, mode = 'medium') {
  const points = SPEED_CURVES[mode] || SPEED_CURVES.medium;

  if (score <= 0) return points[0].y;
  if (score >= points[points.length - 1].x) {
    return points[points.length - 1].y + (score - points[points.length - 1].x) * points[points.length - 1].m;
  }

  // Find the active segment
  let i = 0;
  while (i < points.length - 1 && score > points[i + 1].x) {
    i++;
  }

  const pA = points[i];
  const pB = points[i + 1];

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
  const [speedMode, setSpeedMode] = useLocalStorage('stackGame_speedMode', 'medium');
  const [effectsVolume, setEffectsVolume] = useLocalStorage('stackGame_effectsVolume', 1.0);
  const [musicVolume, setMusicVolume] = useLocalStorage('stackGame_musicVolume', 0.85);

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

  const [speed, setSpeed] = useState(() => getSpeedForScore(0, 'medium'));
  const [cameraY, setCameraY] = useState(0);
  const [targetCameraY, setTargetCameraY] = useState(0);

  const autopilotTimeoutRef = useRef(null);

  const [isMuted, setIsMuted] = useLocalStorage('stackGame_isMuted', false);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundManager.setMuted(next);
      return next;
    });
  }, [setIsMuted]);

  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  // Apply effectsVolume changes to soundManager immediately
  useEffect(() => {
    soundManager.setEffectsVolume(effectsVolume);
  }, [effectsVolume]);

  // Apply musicVolume changes to soundManager immediately
  useEffect(() => {
    soundManager.setMusicVolume(musicVolume);
  }, [musicVolume]);

  // Immediately update the speed when the player changes speedMode in settings
  useEffect(() => {
    const nextSpeed = getSpeedForScore(stateRef.current.score, speedMode);
    setSpeed(nextSpeed);
    stateRef.current.speed = nextSpeed;
  }, [speedMode]);

  // References for game loop state to avoid react closure stale states in requestAnimationFrame
  const stateRef = useRef({
    phase: 'START',
    blocks: [],
    movingBlock: null,
    fallingBlocks: [],
    perfectEffects: [],
    speed: getSpeedForScore(0, 'medium'),
    score: 0,
    cameraY: 0,
    targetCameraY: 0,
    isPaused: false,
    combo: 0,
  });

  // Reset the game state
  const resetGame = useCallback((nextPhase = 'PLAYING') => {
    const initialBlock = {
      x: 0,
      width: GAME_CONSTANTS.BASE_WIDTH,
      hue: GAME_CONSTANTS.HUE_START,
    };

    if (autopilotTimeoutRef.current) {
      clearTimeout(autopilotTimeoutRef.current);
      autopilotTimeoutRef.current = null;
    }

    const initialSpeed = getSpeedForScore(0, speedMode);

    setBlocks([initialBlock]);
    setScore(0);
    setSpeed(initialSpeed);
    setCameraY(0);
    setTargetCameraY(0);
    setFallingBlocks([]);
    setPerfectEffects([]);
    setCombo(0);
    setIsPaused(false);

    if (nextPhase === 'PLAYING') {
      setGamesPlayed((prev) => prev + 1);
    }

    const nextMoving = {
      x: -220,
      width: GAME_CONSTANTS.BASE_WIDTH,
      direction: 1, // 1 = right, -1 = left
      hue: GAME_CONSTANTS.HUE_START + GAME_CONSTANTS.HUE_STEP,
    };
    setMovingBlock(nextMoving);

    setPhase(nextPhase);

    // Sync ref synchronously to avoid animation frame race conditions
    stateRef.current = {
      phase: nextPhase,
      blocks: [initialBlock],
      movingBlock: nextMoving,
      fallingBlocks: [],
      perfectEffects: [],
      speed: initialSpeed,
      score: 0,
      cameraY: 0,
      targetCameraY: 0,
      isPaused: false,
      combo: 0,
    };
  }, [setGamesPlayed, speedMode]);

  // Initialize blocks on mount and cleanup timeouts
  useEffect(() => {
    resetGame('START');
    return () => {
      if (autopilotTimeoutRef.current) {
        clearTimeout(autopilotTimeoutRef.current);
      }
    };
  }, [resetGame]);

  // Handle block drop
  const dropBlock = useCallback((isAutopilot = false) => {
    const {
      phase: currentPhase,
      blocks: currentBlocks,
      movingBlock: currentMoving,
      score: currentScore,
      isPaused: currentIsPaused,
      combo: currentCombo,
      speed: currentSpeed,
      fallingBlocks: currentFalling,
      perfectEffects: currentPerfects,
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

    let nextPhase = currentPhase;
    let nextFalling = [...currentFalling];
    let nextPerfectEffects = [...currentPerfects];

    if (overlapWidth <= 0) {
      // Game Over: zero overlap
      if (isAutopilot) {
        if (autopilotTimeoutRef.current) clearTimeout(autopilotTimeoutRef.current);
        // In autopilot, restart the demo after a short delay
        autopilotTimeoutRef.current = setTimeout(() => resetGame('START'), 1500);
      } else {
        nextPhase = 'GAMEOVER';
        setPhase('GAMEOVER');
        if (currentScore > bestScore) {
          setBestScore(currentScore);
          soundManager.playNewRecord();
        } else {
          soundManager.playGameOver();
        }
      }

      // Drop the entire moving block as a falling block
      const newFallingBlock = {
        x: currentMoving.x,
        y: currentBlocks.length * GAME_CONSTANTS.BLOCK_HEIGHT,
        width: currentMoving.width,
        depth: GAME_CONSTANTS.BLOCK_DEPTH,
        hue: currentMoving.hue,
        velocityY: 0,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.06,
      };
      nextFalling.push(newFallingBlock);
      setFallingBlocks(nextFalling);
      setMovingBlock(null);

      // Sync stateRef.current synchronously!
      stateRef.current = {
        ...stateRef.current,
        phase: nextPhase,
        movingBlock: null,
        fallingBlocks: nextFalling,
      };
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
      const newPerfectEffect = {
        x: placedBlockX + placedBlockWidth / 2,
        y: (currentBlocks.length + 1) * GAME_CONSTANTS.BLOCK_HEIGHT,
        life: 0,
        maxLife: 24, // Frames (~400ms)
      };
      nextPerfectEffects.push(newPerfectEffect);
      setPerfectEffects(nextPerfectEffects);
    } else {
      if (!isAutopilot) {
        setCombo(0);
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

      const newFallingBlock = {
        x: cutX,
        y: currentBlocks.length * GAME_CONSTANTS.BLOCK_HEIGHT,
        width: cutWidth,
        depth: GAME_CONSTANTS.BLOCK_DEPTH,
        hue: currentMoving.hue,
        velocityY: 0,
        rotation: 0,
        rotationSpeed: (currentMoving.x < topBlock.x ? -1 : 1) * (0.02 + Math.random() * 0.04),
      };
      nextFalling.push(newFallingBlock);
      setFallingBlocks(nextFalling);
    }

    const placedBlock = {
      x: placedBlockX,
      width: placedBlockWidth,
      hue: currentMoving.hue,
    };

    const nextBlocks = [...currentBlocks, placedBlock];
    setBlocks(nextBlocks);

    // Update scoring and speed curves
    let nextScore = currentScore;
    let nextSpeed = currentSpeed;
    if (!isAutopilot) {
      const scoreGain = isPerfect ? 2 : 1;
      nextScore = currentScore + scoreGain;
      setScore(nextScore);

      setTotalBlocksPlaced((prev) => prev + 1);

      // Use the smooth progression difficulty curve
      nextSpeed = getSpeedForScore(nextScore, speedMode);
      setSpeed(nextSpeed);
    } else {
      // Autopilot resets automatically after 12 blocks to stay compact
      if (nextBlocks.length >= 12) {
        if (autopilotTimeoutRef.current) clearTimeout(autopilotTimeoutRef.current);
        autopilotTimeoutRef.current = setTimeout(() => resetGame('START'), 1500);
      }
    }

    // Camera targets top of the stack
    const newStackHeight = nextBlocks.length * GAME_CONSTANTS.BLOCK_HEIGHT;
    setTargetCameraY(newStackHeight);

    // Spawn the next moving block
    const nextHue = GAME_CONSTANTS.HUE_START + nextBlocks.length * GAME_CONSTANTS.HUE_STEP;
    const slideSide = Math.random() > 0.5 ? 1 : -1;
    const nextSpawnX = placedBlockX + slideSide * 240;

    const nextMoving = {
      x: nextSpawnX,
      width: placedBlockWidth,
      direction: -slideSide, // Move in opposite direction toward stack
      hue: nextHue,
    };
    setMovingBlock(nextMoving);

    // Sync stateRef.current synchronously!
    stateRef.current = {
      ...stateRef.current,
      phase: nextPhase,
      blocks: nextBlocks,
      movingBlock: nextMoving,
      fallingBlocks: nextFalling,
      perfectEffects: nextPerfectEffects,
      score: nextScore,
      speed: nextSpeed,
      targetCameraY: newStackHeight,
      combo: isAutopilot ? currentCombo : nextCombo,
    };
  }, [bestScore, setBestScore, resetGame, setHighestCombo, setTotalBlocksPlaced, speedMode]);

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
    let nextCamY = currentCamY;
    if (Math.abs(currentTargetCamY - currentCamY) > 0.1) {
      nextCamY = currentCamY + (currentTargetCamY - currentCamY) * 0.1;
      setCameraY(nextCamY);
      stateRef.current.cameraY = nextCamY;
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

      // Autopilot trigger: drop block when it crosses center
      if (currentPhase === 'START') {
        const wasLeft = currentMoving.x < topBlock.x;
        const isLeft = nextX < topBlock.x;
        if (wasLeft !== isLeft || nextX === topBlock.x) {
          // Generate a natural-looking offset (not always perfect, but guaranteed overlap)
          // 40% perfect, 60% with offset (between 4px and 12px)
          let offset = 0;
          if (Math.random() > 0.4) {
            const side = Math.random() > 0.5 ? 1 : -1;
            offset = side * (4 + Math.random() * 8);
          }

          nextX = topBlock.x + offset;

          // Safeguard: Ensure the offset does not reduce the block width below 40px,
          // so it never falls off completely in the background loop.
          const hypotheticalOverlap = currentMoving.width - Math.abs(offset);
          if (hypotheticalOverlap < 40) {
            nextX = topBlock.x;
          }

          const nextMovingSnapped = {
            ...currentMoving,
            x: nextX,
            direction: nextDirection,
          };
          setMovingBlock(nextMovingSnapped);
          stateRef.current.movingBlock = nextMovingSnapped;
          dropBlock(true);
          return;
        }
      }

      const nextMoving = {
        ...currentMoving,
        x: nextX,
        direction: nextDirection,
      };

      setMovingBlock(nextMoving);
      stateRef.current.movingBlock = nextMoving;
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
        .filter((fb) => fb.y > nextCamY - 400);

      setFallingBlocks(nextFalling);
      stateRef.current.fallingBlocks = nextFalling;
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
      stateRef.current.perfectEffects = nextPerfects;
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

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      stateRef.current.isPaused = next;
      return next;
    });
  }, []);

  const setPaused = useCallback((val) => {
    setIsPaused(val);
    stateRef.current.isPaused = val;
  }, []);

  return {
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
    effectsVolume,
    setEffectsVolume,
    musicVolume,
    setMusicVolume,
    blocks,
    movingBlock,
    fallingBlocks,
    perfectEffects,
    cameraY,
    startGame: () => resetGame('PLAYING'),
    goToMenu: () => resetGame('START'),
    dropBlock: () => dropBlock(false),
    togglePause,
    setIsPaused: setPaused,
    toggleMute,
  };
}

