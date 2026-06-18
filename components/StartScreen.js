import React from 'react';
import { Play, Trophy, Flame, Layers } from 'lucide-react';

/**
 * StartScreen - Renders the initial landing screen menu with stats.
 */
export default function StartScreen({ bestScore, gamesPlayed, highestCombo, totalBlocksPlaced, onStart }) {
  // Use actual values, default to standard defaults if not set
  const bestVal = bestScore || 0;
  const comboVal = highestCombo || 0;
  const gamesVal = gamesPlayed || 0;
  const blocksVal = totalBlocksPlaced || 0;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-slate-950/25 backdrop-blur-[1.5px] z-10 select-none overflow-hidden pb-safe px-4"
      onClick={onStart} // Clicking anywhere on the backdrop starts the game
    >
      {/* Cinematic / Volumetric Ambient Background Lighting (behind UI card) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Pulsing glow blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-purple-600/15 blur-[120px] animate-drift"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-cyan-500/15 blur-[120px] animate-drift" style={{ animationDelay: '-6s' }}></div>

        {/* Ambient floating depth particles */}
        <div className="absolute bottom-[20%] left-[12%] w-2 h-2 rounded-full bg-cyan-400/50 animate-particle-1"></div>
        <div className="absolute bottom-[10%] right-[22%] w-1.5 h-1.5 rounded-full bg-purple-400/50 animate-particle-2"></div>
        <div className="absolute bottom-[35%] right-[8%] w-2.5 h-2.5 rounded-full bg-cyan-300/50 animate-particle-3"></div>
        <div className="absolute bottom-[6%] left-[38%] w-1.5 h-1.5 rounded-full bg-purple-300/50 animate-particle-4"></div>
      </div>

      {/* Main Apple Arcade-Style Glass Card */}
      <div 
        onClick={(e) => e.stopPropagation()} // Stop click propagation inside the card
        className="w-full max-w-[90%] sm:max-w-[460px] md:max-w-[500px] lg:max-w-[540px] p-6 sm:p-9 rounded-[32px] sm:rounded-[36px] border border-white/10 bg-slate-950/45 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between text-center transition-all duration-300"
      >
        {/* Title Section */}
        <div>
          <h1 className="font-clamp-title font-black tracking-[0.25em] text-white font-mono select-none drop-shadow-[0_4px_15px_rgba(255,255,255,0.15)] leading-tight">
            STACK
          </h1>
          <p className="font-clamp-subtitle tracking-[0.3em] uppercase text-cyan-400 font-extrabold mt-1 sm:mt-1.5">
            3D Arcade Block Stacker
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-slate-300 text-xs sm:text-sm font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Best Score: <span className="font-mono font-black text-amber-400">{bestVal}</span></span>
          </div>
        </div>

        {/* Large Premium Gradient PLAY Button */}
        <button 
          onClick={onStart}
          className="group relative my-6 sm:my-8 px-10 sm:px-14 py-3.5 sm:py-4.5 rounded-[22px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-350 hover:to-purple-550 active:scale-95 transition-all duration-300 shadow-xl shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-3.5 select-none focus:outline-none"
        >
          {/* Outer glow aura on hover */}
          <span className="absolute inset-0 rounded-[22px] bg-gradient-to-r from-cyan-400 to-purple-600 blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300 -z-10"></span>
          <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current animate-pulse animate-duration-1000 mb-0.5" />
          <span className="text-white font-clamp-button font-black tracking-widest uppercase">
            PLAY
          </span>
        </button>

        {/* Lifetime Stats 2x2 Grid */}
        <div className="w-full border-t border-white/10 pt-5 sm:pt-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
            {/* Card 1: Best Score */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3 sm:p-4.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
              <div className="flex items-center gap-2 text-slate-400 mb-1.5 sm:mb-2 w-full">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-clamp-stats-lbl text-slate-400 font-black tracking-wider uppercase truncate">
                  Best Score
                </span>
              </div>
              <div className="font-clamp-stats-val font-black font-mono text-white leading-none">
                {bestVal}
              </div>
              <div className="font-clamp-stats-pct text-[9px] text-cyan-400 font-black uppercase mt-1 leading-none">
                TOP 11%
              </div>
            </div>

            {/* Card 2: Max Combo */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3 sm:p-4.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
              <div className="flex items-center gap-2 text-slate-400 mb-1.5 sm:mb-2 w-full">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="font-clamp-stats-lbl text-slate-400 font-black tracking-wider uppercase truncate">
                  Max Combo
                </span>
              </div>
              <div className="font-clamp-stats-val font-black font-mono text-white leading-none">
                {comboVal}
              </div>
              <div className="font-clamp-stats-pct text-[9px] text-cyan-400 font-black uppercase mt-1 leading-none">
                TOP 18%
              </div>
            </div>

            {/* Card 3: Games Played */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3 sm:p-4.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
              <div className="flex items-center gap-2 text-slate-400 mb-1.5 sm:mb-2 w-full">
                <Play className="w-4 h-4 text-emerald-400 shrink-0 fill-current" />
                <span className="font-clamp-stats-lbl text-slate-400 font-black tracking-wider uppercase truncate">
                  Games Played
                </span>
              </div>
              <div className="font-clamp-stats-val font-black font-mono text-white leading-none">
                {gamesVal}
              </div>
            </div>

            {/* Card 4: Total Blocks */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3 sm:p-4.5 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
              <div className="flex items-center gap-2 text-slate-400 mb-1.5 sm:mb-2 w-full">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-clamp-stats-lbl text-slate-400 font-black tracking-wider uppercase truncate">
                  Total Blocks
                </span>
              </div>
              <div className="font-clamp-stats-val font-black font-mono text-white leading-none">
                {blocksVal}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Overlay Tip */}
        <div className="mt-6 sm:mt-7 text-slate-400/50 uppercase tracking-[0.15em] text-[9px] sm:text-[10px] font-black animate-glow-pulse">
          <span className="hidden md:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 mx-1 font-mono">SPACE</kbd> to start or </span>
          <span>Click anywhere to play</span>
        </div>
      </div>
    </div>
  );
}
