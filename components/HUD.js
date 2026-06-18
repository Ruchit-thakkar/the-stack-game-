import React from 'react';

/**
 * HUD - Head-up Display overlay for gameplay stats.
 */
export default function HUD({ score, bestScore }) {
  return (
    <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-start pointer-events-none select-none z-10">
      {/* Empty spacer to align the score in the exact center */}
      <div className="w-24"></div>

      {/* Live Active Score */}
      <div className="text-center">
        <div 
          className="text-6xl font-extrabold font-mono text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          aria-live="polite" 
          aria-atomic="true"
        >
          {score}
        </div>
      </div>

      {/* Personal Best indicator */}
      <div className="text-right w-24 bg-slate-950/20 backdrop-blur-[1px] p-2 rounded border border-white/5">
        <div className="text-[9px] tracking-widest text-slate-400 uppercase font-bold leading-none mb-1">
          Record
        </div>
        <div className="text-lg font-black font-mono text-cyan-400 leading-none">
          {bestScore}
        </div>
      </div>
    </div>
  );
}
