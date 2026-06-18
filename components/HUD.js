import React from 'react';
import { Pause, Volume2, VolumeX, Settings } from 'lucide-react';

/**
 * HUD - Minimal head-up display overlay for gameplay stats.
 */
export default function HUD({ score, combo, onPause, isMuted, onToggleMute, onOpenSettings }) {
  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none select-none z-10 font-ui">

      {/* Top Section (Score & Pause) */}
      <div className="w-full flex justify-between items-start">
        {/* Invisible spacer on the left to center the score */}
        <div className="w-10"></div>

        {/* Top Center: Current Score & Combo */}
        <div className="flex flex-col items-center mt-4">
          <span className="font-number font-extrabold text-5xl sm:text-6xl text-stone-100/90 leading-none">
            {score}
          </span>
          {combo > 0 && (
            <span className="mt-2 text-[10px] sm:text-xs font-bold tracking-[0.25em] text-teal-400/95 uppercase animate-fade-in">
              COMBO ×{combo}
            </span>
          )}
        </div>

        {/* Top Right: Controls (Volume, Settings & Pause) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-300 text-stone-300 focus:outline-none"
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-300 text-stone-300 focus:outline-none"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={onPause}
            aria-label="Pause game"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-300 text-stone-300 focus:outline-none"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Subtle Control Hints */}
      <div className="w-full flex justify-center pb-6">
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-stone-100/35 uppercase font-bold text-center">
          <span className="hidden md:inline">Press SPACE or </span>Tap to Drop
        </span>
      </div>
    </div>
  );
}
