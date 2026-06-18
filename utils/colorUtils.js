/**
 * Generates shaded colors for the three visible faces of an isometric block.
 * @param {number} hue - The current hue angle (0 - 360)
 * @returns {object} Colors for top, left, and right faces
 */
export function getBlockColors(hue) {
  const h = hue % 360;
  return {
    top: `hsl(${h}, 85%, 55%)`,
    left: `hsl(${h}, 80%, 42%)`,  // 15% darker for depth shading
    right: `hsl(${h}, 75%, 28%)`, // ~30% darker for side shading
    glow: `hsla(${h}, 85%, 55%, 0.4)`,
  };
}
