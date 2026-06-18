import React from 'react';
import { Play, Trophy, Flame, Layers } from 'lucide-react';

/**
 * StartScreen - Renders the initial landing screen menu with stats.
 */
export default function StartScreen({ bestScore, gamesPlayed, highestCombo, totalBlocksPlaced, onStart }) {
  const bestVal = bestScore || 0;
  const comboVal = highestCombo || 0;
  const gamesVal = gamesPlayed || 0;
  const blocksVal = totalBlocksPlaced || 0;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-slate-950/10 backdrop-blur-[1px] z-10 select-none overflow-hidden pb-safe px-4"
      onClick={onStart} // Clicking anywhere on the backdrop starts the game
    >
      {/* Living Atmospheric Background (moving stars, fog, drifts) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Calm slow-moving volumetric blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-950/20 blur-[130px] animate-drift"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-900/15 blur-[130px] animate-drift" style={{ animationDelay: '-12s' }}></div>

        {/* Twinkling Soft Stars */}
        <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 bg-stone-100/50 rounded-full animate-star-1"></div>
        <div className="absolute top-[15%] right-[25%] w-1 h-1 bg-stone-100/35 rounded-full animate-star-2"></div>
        <div className="absolute top-[40%] left-[10%] w-1 h-1 bg-stone-100/25 rounded-full animate-star-3"></div>
        <div className="absolute top-[35%] right-[12%] w-1.5 h-1.5 bg-stone-100/55 rounded-full animate-star-1" style={{ animationDelay: '-2s' }}></div>

        {/* Floating atmospheric particles */}
        <div className="absolute bottom-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-stone-200/25 animate-particle-1"></div>
        <div className="absolute bottom-[10%] right-[30%] w-1 h-1 rounded-full bg-stone-200/20 animate-particle-2"></div>
        <div className="absolute bottom-[35%] right-[15%] w-2 h-2 rounded-full bg-stone-200/25 animate-particle-3"></div>
        <div className="absolute bottom-[5%] left-[45%] w-1 h-1 rounded-full bg-stone-200/20 animate-particle-4"></div>
      </div>

      {/* Main Glass Panel */}
      <div 
        onClick={(e) => e.stopPropagation()} // Stop click propagation inside the card
        className="w-full max-w-[92%] sm:max-w-[500px] md:max-w-[720px] lg:max-w-[800px] p-6 sm:p-10 md:p-12 rounded-[28px] sm:rounded-[36px] border border-white/5 bg-teal-950/10 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-between text-center transition-all duration-500"
      >
        {/* Title Section */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col items-center">
          <img 
            src="https://ik.imagekit.io/devnext/stackgamelogo.png" 
            alt="STACK Logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain select-none filter drop-shadow-[0_6px_20px_rgba(20,184,166,0.3)] mb-4 sm:mb-5 md:mb-6"
          />
          <h1 className="font-clamp-title font-black tracking-[0.3em] text-stone-100 font-title select-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)] leading-none">
            STACK
          </h1>
          <p className="font-clamp-subtitle tracking-[0.4em] uppercase text-teal-400 font-bold mt-2.5 sm:mt-3.5">
            3D Arcade Block Stacker
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-stone-400/80 text-xs sm:text-sm font-semibold font-ui">
            <Trophy className="w-4.5 h-4.5 text-amber-500/80 shrink-0" />
            <span>Best Score: <span className="font-number font-extrabold text-stone-200">{bestVal}</span></span>
          </div>
        </div>

        {/* Elegant Play Button */}
        <button 
          onClick={onStart}
          className="glass-button-gradient group relative my-6 sm:my-8 px-12 sm:px-16 py-4 rounded-[24px] cursor-pointer flex items-center justify-center gap-3 select-none focus:outline-none"
        >
          <Play className="w-5 h-5 text-stone-200 fill-current animate-pulse-slow mb-0.5" />
          <span className="text-stone-200 font-clamp-button font-bold tracking-[0.2em] uppercase font-title">
            PLAY
          </span>
        </button>

        {/* Statistics Grid (2x2 on mobile, horizontal row on desktop) */}
        <div className="w-full border-t border-white/5 pt-6 sm:pt-8 md:pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
            {/* Card 1: Best Score */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col items-center text-center relative overflow-hidden">
              <Trophy className="w-4.5 h-4.5 text-amber-500/80 mb-2 shrink-0" />
              <span className="font-clamp-stats-lbl text-stone-400/70 font-semibold tracking-wider uppercase mb-1.5 font-ui">
                Best Score
              </span>
              <span className="font-clamp-stats-val font-black font-number text-stone-100 leading-none">
                {bestVal}
              </span>
            </div>

            {/* Card 2: Max Combo */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col items-center text-center relative overflow-hidden">
              <Flame className="w-4.5 h-4.5 text-orange-400/85 mb-2 shrink-0" />
              <span className="font-clamp-stats-lbl text-stone-400/70 font-semibold tracking-wider uppercase mb-1.5 font-ui">
                Max Combo
              </span>
              <span className="font-clamp-stats-val font-black font-number text-stone-100 leading-none">
                {comboVal}
              </span>
            </div>

            {/* Card 3: Games Played */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col items-center text-center relative overflow-hidden">
              <Play className="w-4.5 h-4.5 text-emerald-400/80 mb-2 shrink-0 fill-current" />
              <span className="font-clamp-stats-lbl text-stone-400/70 font-semibold tracking-wider uppercase mb-1.5 font-ui">
                Played
              </span>
              <span className="font-clamp-stats-val font-black font-number text-stone-100 leading-none">
                {gamesVal}
              </span>
            </div>

            {/* Card 4: Total Blocks */}
            <div className="glass-card glass-card-hover rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col items-center text-center relative overflow-hidden">
              <Layers className="w-4.5 h-4.5 text-cyan-400/80 mb-2 shrink-0" />
              <span className="font-clamp-stats-lbl text-stone-400/70 font-semibold tracking-wider uppercase mb-1.5 font-ui">
                Total Blocks
              </span>
              <span className="font-clamp-stats-val font-black font-number text-stone-100 leading-none">
                {blocksVal}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Overlay Tip */}
        <div className="mt-6 sm:mt-8 md:mt-10 text-stone-400/40 uppercase tracking-[0.2em] text-[9px] sm:text-[10px] font-bold animate-glow-pulse font-ui">
          <span className="hidden md:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-teal-950/40 text-stone-400 border border-white/5 mx-1 font-mono">SPACE</kbd> to start or </span>
          <span>Tap to Play</span>
        </div>
      </div>
    </div>
  );
}
