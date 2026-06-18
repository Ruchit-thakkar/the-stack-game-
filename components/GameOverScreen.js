import React from 'react';
import { RotateCcw, Home, Trophy, Flame, Layers } from 'lucide-react';

/**
 * GameOverScreen - Displayed when a block falls off completely.
 */
export default function GameOverScreen({ score, bestScore, highestCombo, totalBlocksPlaced, onRestart, onMainMenu }) {
  const isNewRecord = score === bestScore && score > 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md z-20 select-none animate-fade-in font-ui">
      <div className="w-full max-w-sm p-8 rounded-[32px] border border-white/5 bg-teal-950/20 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center">
        
        {/* Header */}
        <h2 className="text-3xl font-black tracking-widest text-stone-300 font-title mb-6">
          GAME OVER
        </h2>

        {/* Details card */}
        <div className="space-y-4 mb-8 w-full">
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-300 text-[10px] font-bold uppercase tracking-widest animate-fade-in">
              <Trophy className="w-3.5 h-3.5" />
              New High Score!
            </div>
          )}

          <div>
            <div className="text-stone-400/70 text-[10px] tracking-widest uppercase mb-1.5 font-bold">
              Final Score
            </div>
            <div className="text-6xl font-black font-number text-stone-100 leading-none">
              {score}
            </div>
          </div>

          <div className="border-t border-white/5 pt-5 space-y-3">
            {/* Best Record */}
            <div className="flex justify-between items-center px-1">
              <span className="text-stone-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-stone-400" />
                Best Record
              </span>
              <span className="text-stone-100 font-number font-bold text-base">
                {bestScore}
              </span>
            </div>

            {/* Max Combo */}
            <div className="flex justify-between items-center px-1">
              <span className="text-stone-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-stone-400" />
                Max Combo
              </span>
              <span className="text-stone-100 font-number font-bold text-base">
                {highestCombo || 0}
              </span>
            </div>

            {/* Total Blocks */}
            <div className="flex justify-between items-center px-1">
              <span className="text-stone-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                Total Blocks
              </span>
              <span className="text-stone-100 font-number font-bold text-base">
                {totalBlocksPlaced || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 w-full">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-6 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-stone-100 font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 focus:outline-none"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>

          <button
            onClick={onMainMenu}
            className="w-full py-3 px-6 rounded-xl border border-transparent hover:bg-white/5 active:scale-[0.98] text-stone-400 hover:text-stone-300 font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 focus:outline-none"
          >
            <Home className="w-4 h-4" />
            Exit Menu
          </button>
        </div>
      </div>
    </div>
  );
}
