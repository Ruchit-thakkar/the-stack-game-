/**
 * Generates shaded colors for the three visible faces of an isometric block.
 * @param {number} hue - The current hue angle (0 - 360)
 * @returns {object} Colors for top, left, and right faces
 */
export function getBlockColors(hue) {
  // If it's the base block (initial hue = 180)
  if (hue === 180) {
    return {
      top: 'hsl(34, 24%, 86%)',   // Warm ivory/stone top
      left: 'hsl(34, 20%, 74%)',  // Left face
      right: 'hsl(34, 16%, 62%)', // Right face
      glow: 'rgba(255, 255, 255, 0.05)',
    };
  }

  // Constrain hue to the sage-mint-teal-cyan range (130 to 210)
  const baseHue = 130;
  const range = 80;
  const h = baseHue + (((hue - 180) % range + range) % range);

  return {
    top: `hsl(${h}, 36%, 58%)`,   // Matte pastel top
    left: `hsl(${h}, 32%, 46%)`,  // Left face
    right: `hsl(${h}, 28%, 34%)`, // Right face
    glow: `hsla(${h}, 36%, 58%, 0.1)`,
  };
}
