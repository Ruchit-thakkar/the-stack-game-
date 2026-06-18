import React from 'react';

/**
 * StartScreen - Renders the initial landing screen over the canvas autopilot.
 */
export default function StartScreen({ bestScore, onStart }) {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-between py-16 px-6 bg-slate-950/45 backdrop-blur-[2px] z-10 select-none animate-fade-in"
      onClick={onStart} // Clicking anywhere on the screen starts the game
    >
      {/* Title */}
      <div className="text-center mt-12">
        <h1 className="text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-mono select-none drop-shadow-[0_4px_12px_rgba(255,255,255,0.12)]">
          STACK
        </h1>
        <p className="text-slate-400 text-[11px] tracking-[0.25em] mt-3 uppercase font-medium">
          3D Arcade Block Stacker
        </p>
      </div>

      {/* Tap/Click to Start Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Avoid double triggers from parent onClick
          onStart();
        }}
        className="group relative flex flex-col items-center justify-center p-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer w-48 h-48 select-none focus:outline-none"
      >
        {/* Pulsing ring outline */}
        <span className="absolute inset-0 rounded-full border border-white/20 scale-100 group-hover:scale-110 animate-ping opacity-15 transition-all duration-700"></span>
        
        <span className="text-white text-xl font-bold tracking-widest animate-pulse uppercase">
          Play
        </span>
        <span className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.15em] font-medium">
          Tap or Click
        </span>
      </button>

      {/* Best Score Indicator */}
      <div className="text-center">
        <div className="text-slate-500 text-[10px] tracking-[0.2em] uppercase mb-1 font-semibold">
          High Score
        </div>
        <div className="text-4xl font-extrabold font-mono text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
          {bestScore}
        </div>
        <div className="hidden md:block text-slate-500 text-[9px] tracking-widest mt-5 uppercase">
          Press <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">SPACE</kbd> or <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">ENTER</kbd> to drop
        </div>
      </div>
    </div>
  );
}
