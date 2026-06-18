export const GAME_CONSTANTS = {
  BASE_WIDTH: 200,          // Initial block width in px (isometric X axis)
  BLOCK_DEPTH: 200,         // Static block depth in px (isometric Z axis)
  BLOCK_HEIGHT: 32,         // Block height in px (isometric Y axis)
  INITIAL_SPEED: 1.0,       // Sliding speed (px per frame)
  MAX_SPEED: 9,             // Max sliding speed (px per frame)
  PERFECT_THRESHOLD: 2,     // Deviation threshold in px for PERFECT drop
  HUE_START: 180,           // Base HSL hue angle (180 is cyan)
  HUE_STEP: 12,             // Hue rotation increment per block
  GRAVITY: 0.8,             // Gravity acceleration for falling debris
  SPEED_INCREASE_INTERVAL: 5, // Speed increases every N blocks
  SPEED_INCREASE_DELTA: 0.3,  // Delta speed increase per N blocks
};
