import React from 'react';
import { RotateCcw, Home, Trophy, Flame, Layers } from 'lucide-react';

/**
 * GameOverScreen - Displayed when a block falls off completely with zero overlap.
 */
export default function GameOverScreen({ score, bestScore, highestCombo, totalBlocksPlaced, onRestart, onMainMenu }) {
  // If player sets a new record, the local storage updates immediately, meaning score will equal the bestScore.
  const isNewRecord = score === bestScore && score > 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md z-20 select-none animate-fade-in">
      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-lg shadow-2xl flex flex-col items-center text-center">
        
        {/* Header */}
        <h2 className="text-4xl font-black tracking-wider text-red-500 font-mono mb-6 animate-pulse">
          GAME OVER
        </h2>

        {/* Details card */}
        <div className="space-y-4 mb-8 w-full">
          {isNewRecord && (
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[11px] font-black uppercase tracking-widest animate-bounce">
              🏆 New High Score!
            </div>
          )}

          <div>
            <div className="text-slate-400 text-xs tracking-widest uppercase mb-1 font-semibold">
              Final Score
            </div>
            <div className="text-6.5xl font-black font-mono text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
              {score}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2.5">
            {/* Best Record */}
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Best Record
              </span>
              <span className="text-cyan-400 font-mono font-black text-lg">
                {bestScore}
              </span>
            </div>

            {/* Max Combo */}
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Max Combo
              </span>
              <span className="text-slate-200 font-mono font-black text-lg">
                {highestCombo || 0}
              </span>
            </div>

            {/* Total Blocks */}
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Total Blocks
              </span>
              <span className="text-slate-200 font-mono font-black text-lg">
                {totalBlocksPlaced || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3.5 w-full">
          <button
            onClick={onRestart}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] text-white font-extrabold tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 focus:outline-none"
          >
            <RotateCcw className="w-4.5 h-4.5" />
            Play Again
          </button>

          <button
            onClick={onMainMenu}
            className="w-full py-3.5 px-6 rounded-xl border border-white/10 hover:bg-white/5 active:scale-[0.98] text-slate-400 hover:text-white font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 focus:outline-none"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
