import React from 'react';
import { Play, Trophy, Flame, Layers } from 'lucide-react';

/**
 * StartScreen - Renders the initial landing screen menu with stats.
 */
export default function StartScreen({ bestScore, gamesPlayed, highestCombo, totalBlocksPlaced, onStart }) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] z-10 select-none animate-fade-in px-4"
      onClick={onStart} // Clicking anywhere on the backdrop starts the game
    >
      <div 
        onClick={(e) => e.stopPropagation()} // Stop propagation so clicks inside the card don't double start
        className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-slate-900/35 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center transition-all duration-300"
      >
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-mono select-none drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)]">
            STACK
          </h1>
          <p className="text-cyan-400 text-[10px] tracking-[0.25em] mt-2.5 uppercase font-black">
            3D Arcade Block Stacker
          </p>
        </div>

        {/* Tap/Click to Start Button */}
        <button 
          onClick={onStart}
          className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all duration-300 shadow-lg shadow-cyan-500/20 cursor-pointer w-36 h-36 select-none focus:outline-none mb-8"
        >
          <span className="absolute inset-0 rounded-2xl border border-cyan-400/20 scale-100 group-hover:scale-105 animate-ping opacity-15 transition-all duration-700"></span>
          <Play className="w-10 h-10 text-white fill-current animate-pulse mb-1.5" />
          <span className="text-white text-[11px] font-black tracking-widest uppercase">
            Start Game
          </span>
        </button>

        {/* Lifetime Stats Dashboard */}
        <div className="w-full border-t border-white/10 pt-6">
          <h3 className="text-slate-500 text-[9px] tracking-[0.2em] uppercase font-black mb-4">
            Lifetime Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Best Score */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0 drop-shadow-[0_0_4px_rgba(245,158,11,0.3)]" />
              <div className="text-left">
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">
                  Best Score
                </div>
                <div className="text-base font-black font-mono text-white leading-none">
                  {bestScore || 0}
                </div>
              </div>
            </div>

            {/* Highest Combo */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-400 shrink-0 drop-shadow-[0_0_4px_rgba(249,115,22,0.3)]" />
              <div className="text-left">
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">
                  Max Combo
                </div>
                <div className="text-base font-black font-mono text-white leading-none">
                  {highestCombo || 0}
                </div>
              </div>
            </div>

            {/* Games Played */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <Play className="w-5 h-5 text-emerald-400 shrink-0 fill-current drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
              <div className="text-left">
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">
                  Played
                </div>
                <div className="text-base font-black font-mono text-white leading-none">
                  {gamesPlayed || 0}
                </div>
              </div>
            </div>

            {/* Total Blocks Placed */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <Layers className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]" />
              <div className="text-left">
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">
                  Blocks
                </div>
                <div className="text-base font-black font-mono text-white leading-none">
                  {totalBlocksPlaced || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard tip */}
        <div className="hidden md:block text-slate-500 text-[9px] tracking-widest mt-6 uppercase">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">SPACE</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">ENTER</kbd> to drop
        </div>
      </div>
    </div>
  );
}
