import React from 'react';
import { Trophy, Pause, Flame } from 'lucide-react';

/**
 * HUD - Head-up Display overlay for gameplay stats.
 */
export default function HUD({ score, bestScore, combo, onPause }) {
  return (
    <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-center pointer-events-none select-none z-10">
      
      {/* High Score / Personal Best Box (Top Left) */}
      <div className="flex items-center gap-2 bg-slate-950/40 backdrop-blur-[2px] px-3 py-2 rounded-xl border border-white/5 shadow-md">
        <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
        <div>
          <div className="text-[8px] tracking-widest text-slate-400 uppercase font-black leading-none mb-0.5">
            Record
          </div>
          <div className="text-base font-black font-mono text-cyan-400 leading-none">
            {bestScore}
          </div>
        </div>
      </div>

      {/* Live Active Score & Combo Indicator (Top Center) */}
      <div className="flex flex-col items-center">
        <div 
          className="text-6xl md:text-7xl font-black font-mono text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-pulse-slow"
          aria-live="polite" 
          aria-atomic="true"
        >
          {score}
        </div>
        
        {/* Animated Combo Badge */}
        {combo > 0 && (
          <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-bounce text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              COMBO x{combo}
            </span>
          </div>
        )}
      </div>

      {/* Pause Button (Top Right) */}
      <button 
        onClick={onPause}
        aria-label="Pause game"
        className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-slate-900/30 hover:bg-white/10 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer text-white shadow-lg focus:outline-none"
      >
        <Pause className="w-4.5 h-4.5 fill-current" />
      </button>
    </div>
  );
}
