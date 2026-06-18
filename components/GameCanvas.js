import React, { useRef, useEffect } from 'react';
import { GAME_CONSTANTS } from '../utils/gameConstants';
import { getBlockColors } from '../utils/colorUtils';

/**
 * GameCanvas - Renders the 3D isometric stack scene.
 * Uses vanilla canvas with requestAnimationFrame.
 */
export default function GameCanvas({ blocks, movingBlock, fallingBlocks, perfectEffects, cameraY }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Ensure style sizes match layout
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // 1. Clear viewport
      ctx.clearRect(0, 0, width, height);

      // Center horizontally, lower third vertically
      const centerX = width / 2;
      const centerY = height * 0.70;

      const theta = Math.PI / 6; // 30 degrees isometric angle
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      // Coordinate projection function (3D -> 2D)
      const project = (x, y, z) => {
        return {
          x: centerX + (x - z) * cosTheta,
          y: centerY - y + (x + z) * sinTheta + cameraY,
        };
      };

      // 2. Render radial floor shadow beneath base block (ground level)
      const baseW = GAME_CONSTANTS.BASE_WIDTH;
      const baseD = GAME_CONSTANTS.BLOCK_DEPTH;
      const shadowCenter = project(baseW / 2, 0, baseD / 2);

      ctx.save();
      const shadowGrad = ctx.createRadialGradient(
        shadowCenter.x, shadowCenter.y, 5,
        shadowCenter.x, shadowCenter.y, baseW * 0.85
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(
        shadowCenter.x, shadowCenter.y,
        baseW * 0.85 * cosTheta,
        baseW * 0.85 * sinTheta,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // 3. Modular block rendering function
      const renderBlock = (lx, ly, lz, w, h, d, hue, cx, cy) => {
        const projectLocal = (x, y, z) => {
          return {
            x: cx + (x - z) * cosTheta,
            y: cy - y + (x + z) * sinTheta,
          };
        };

        // Top face vertices
        const t1 = projectLocal(lx, ly + h, lz);
        const t2 = projectLocal(lx + w, ly + h, lz);
        const t3 = projectLocal(lx + w, ly + h, lz + d);
        const t4 = projectLocal(lx, ly + h, lz + d);

        // Front-Left face vertices
        const l1 = projectLocal(lx, ly + h, lz + d);
        const l2 = projectLocal(lx + w, ly + h, lz + d);
        const l3 = projectLocal(lx + w, ly, lz + d);
        const l4 = projectLocal(lx, ly, lz + d);

        // Front-Right face vertices
        const r1 = projectLocal(lx + w, ly + h, lz);
        const r2 = projectLocal(lx + w, ly + h, lz + d);
        const r3 = projectLocal(lx + w, ly, lz + d);
        const r4 = projectLocal(lx + w, ly, lz);

        const colors = getBlockColors(hue);

        // Left Face
        ctx.fillStyle = colors.left;
        ctx.beginPath();
        ctx.moveTo(l1.x, l1.y);
        ctx.lineTo(l2.x, l2.y);
        ctx.lineTo(l3.x, l3.y);
        ctx.lineTo(l4.x, l4.y);
        ctx.closePath();
        ctx.fill();

        // Right Face
        ctx.fillStyle = colors.right;
        ctx.beginPath();
        ctx.moveTo(r1.x, r1.y);
        ctx.lineTo(r2.x, r2.y);
        ctx.lineTo(r3.x, r3.y);
        ctx.lineTo(r4.x, r4.y);
        ctx.closePath();
        ctx.fill();

        // Top Face
        ctx.fillStyle = colors.top;
        ctx.beginPath();
        ctx.moveTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.lineTo(t4.x, t4.y);
        ctx.closePath();
        ctx.fill();
      };

      // 4. Render stacked blocks
      blocks.forEach((block, idx) => {
        const y = idx * GAME_CONSTANTS.BLOCK_HEIGHT;
        renderBlock(block.x, y, 0, block.width, GAME_CONSTANTS.BLOCK_HEIGHT, GAME_CONSTANTS.BLOCK_DEPTH, block.hue, centerX, centerY + cameraY);
      });

      // 5. Render active sliding block
      if (movingBlock) {
        const y = blocks.length * GAME_CONSTANTS.BLOCK_HEIGHT;
        renderBlock(movingBlock.x, y, 0, movingBlock.width, GAME_CONSTANTS.BLOCK_HEIGHT, GAME_CONSTANTS.BLOCK_DEPTH, movingBlock.hue, centerX, centerY + cameraY);
      }

      // 6. Render falling debris blocks (with 2D spin/tumble)
      fallingBlocks.forEach((fb) => {
        const halfW = fb.width / 2;
        const halfD = fb.depth / 2;
        const halfH = GAME_CONSTANTS.BLOCK_HEIGHT / 2;

        const cx_3d = fb.x + halfW;
        const cy_3d = fb.y + halfH;
        const cz_3d = halfD;

        const screenCenter = project(cx_3d, cy_3d, cz_3d);

        ctx.save();
        ctx.translate(screenCenter.x, screenCenter.y);
        if (fb.rotation) {
          ctx.rotate(fb.rotation);
        }
        renderBlock(-halfW, -halfH, -halfD, fb.width, GAME_CONSTANTS.BLOCK_HEIGHT, fb.depth, fb.hue, 0, 0);
        ctx.restore();
      });

      // 7. Render perfect visual ring expanding and floating text
      perfectEffects.forEach((pe) => {
        const ringCenter = project(pe.x, pe.y, GAME_CONSTANTS.BLOCK_DEPTH / 2);
        const progress = pe.life / pe.maxLife;
        const opacity = Math.sin(progress * Math.PI);
        const scale = 1 + progress * 2.2;

        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 18;

        ctx.beginPath();
        ctx.ellipse(
          ringCenter.x, ringCenter.y,
          GAME_CONSTANTS.BASE_WIDTH * 0.7 * cosTheta * scale,
          GAME_CONSTANTS.BASE_WIDTH * 0.7 * sinTheta * scale,
          0, 0, Math.PI * 2
        );
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8;
        ctx.fillText('PERFECT!', ringCenter.x, ringCenter.y - 30 - progress * 50);
        ctx.restore();
      });
    };

    const loop = () => {
      draw();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [blocks, movingBlock, fallingBlocks, perfectEffects, cameraY]);

  return (
    <canvas ref={canvasRef} className="w-full h-full block touch-none" />
  );
}
