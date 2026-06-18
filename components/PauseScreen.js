import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

/**
 * PauseScreen - Renders a glassmorphic pause overlay over the gameplay state.
 */
export default function PauseScreen({ onResume, onRestart, onMainMenu }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md z-25 select-none animate-fade-in">
      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-lg shadow-2xl flex flex-col items-center text-center">
        
        {/* Header */}
        <h2 className="text-4xl font-black tracking-wider text-cyan-400 font-mono mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          PAUSED
        </h2>

        {/* Buttons */}
        <div className="space-y-4 w-full">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] text-white font-extrabold tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2.5 focus:outline-none"
          >
            <Play className="w-5 h-5 fill-current" />
            Resume Game
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white active:scale-[0.98] text-slate-300 font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none"
          >
            <RotateCcw className="w-4.5 h-4.5" />
            Restart
          </button>

          {/* Main Menu */}
          <button
            onClick={onMainMenu}
            className="w-full py-3.5 px-6 rounded-xl border border-white/5 bg-transparent hover:bg-white/5 hover:text-slate-200 active:scale-[0.98] text-slate-400 font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none"
          >
            <Home className="w-4.5 h-4.5" />
            Main Menu
          </button>
        </div>

        {/* Shortcut Tip */}
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-6">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">ESC</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">P</kbd> to resume
        </div>
      </div>
    </div>
  );
}
