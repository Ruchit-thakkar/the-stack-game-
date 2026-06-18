import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONSTANTS } from '../utils/gameConstants';
import { useLocalStorage } from './useLocalStorage';

export function useGameEngine() {
  const [phase, setPhase] = useState('START'); // 'START' | 'PLAYING' | 'GAMEOVER'
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useLocalStorage('stackGame_bestScore', 0);
  
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
    };
  }, [phase, blocks, movingBlock, fallingBlocks, perfectEffects, speed, score, cameraY, targetCameraY]);

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
    
    // Spawn first moving block
    // Starts from left (-220px offset) moving right
    setMovingBlock({
      x: -220,
      width: GAME_CONSTANTS.BASE_WIDTH,
      direction: 1, // 1 = right, -1 = left
      hue: GAME_CONSTANTS.HUE_START + GAME_CONSTANTS.HUE_STEP,
    });
    
    setPhase(nextPhase);
  }, []);

  // Initialize blocks on mount
  useEffect(() => {
    resetGame('START');
  }, [resetGame]);

  // Handle block drop
  const dropBlock = useCallback((isAutopilot = false) => {
    const { phase: currentPhase, blocks: currentBlocks, movingBlock: currentMoving, speed: currentSpeed, score: currentScore } = stateRef.current;
    
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

    if (absDiff <= GAME_CONSTANTS.PERFECT_THRESHOLD) {
      isPerfect = true;
      placedBlockX = topBlock.x;        // Snap perfectly to top block position
      placedBlockWidth = topBlock.width; // Retain full width of top block
      
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

      const nextSpeed = Math.min(
        GAME_CONSTANTS.INITIAL_SPEED + Math.floor(nextScore / GAME_CONSTANTS.SPEED_INCREASE_INTERVAL) * GAME_CONSTANTS.SPEED_INCREASE_DELTA * 10,
        GAME_CONSTANTS.MAX_SPEED
      );
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
  }, [bestScore, setBestScore, resetGame]);

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
    } = stateRef.current;

    // 1. Update camera Y interpolation
    if (Math.abs(currentTargetCamY - currentCamY) > 0.1) {
      setCameraY(currentCamY + (currentTargetCamY - currentCamY) * 0.1);
    }

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
    blocks,
    movingBlock,
    fallingBlocks,
    perfectEffects,
    cameraY,
    startGame: () => resetGame('PLAYING'),
    goToMenu: () => resetGame('START'),
    dropBlock: () => dropBlock(false),
  };
}
