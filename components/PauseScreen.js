import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

/**
 * PauseScreen - Renders a calm minimalist pause overlay over the gameplay state.
 */
export default function PauseScreen({ onResume, onRestart, onMainMenu }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md z-25 select-none animate-fade-in font-ui">
      <div className="w-full max-w-xs p-8 rounded-[24px] border border-white/5 bg-teal-950/20 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center">
        
        {/* Header */}
        <h2 className="text-3xl font-black tracking-widest text-stone-200 font-title mb-8">
          PAUSED
        </h2>

        {/* Buttons */}
        <div className="space-y-3 w-full">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3.5 px-6 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-stone-200 font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none"
          >
            <Play className="w-4 h-4 fill-current" />
            Resume
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-6 rounded-xl border border-white/5 bg-transparent hover:bg-white/5 active:scale-[0.98] text-stone-300 font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>

          {/* Main Menu */}
          <button
            onClick={onMainMenu}
            className="w-full py-3.5 px-6 rounded-xl border border-transparent hover:bg-white/5 active:scale-[0.98] text-stone-400 hover:text-stone-300 font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none"
          >
            <Home className="w-4 h-4" />
            Exit Menu
          </button>
        </div>

        {/* Shortcut Tip */}
        <div className="text-[9px] text-stone-500 uppercase tracking-widest mt-6">
          Press <kbd className="px-1.5 py-0.5 rounded bg-teal-950/40 text-stone-400 font-mono border border-white/5">ESC</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-teal-950/40 text-stone-400 font-mono border border-white/5">P</kbd>
        </div>
      </div>
    </div>
  );
}
