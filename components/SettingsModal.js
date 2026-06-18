import React from 'react';
import { X, Volume2, Music, Palette, Accessibility, Sparkles } from 'lucide-react';

/**
 * SettingsModal - A premium glassmorphism settings menu.
 */
export default function SettingsModal({ onClose, speedMode, onSetSpeedMode }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="absolute inset-0 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md z-30 select-none animate-fade-in font-ui"
    >
      <div className="w-full max-w-sm p-6 sm:p-7 rounded-[32px] border border-white/5 bg-teal-950/25 backdrop-blur-3xl shadow-2xl flex flex-col relative transition-all duration-300">
        
        {/* Top-right X button */}
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="absolute top-5 right-5 flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-90 transition-all duration-300 text-stone-400 hover:text-stone-200 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <h2 className="text-2xl font-black tracking-widest text-stone-200 font-title mb-6 mt-1 text-center">
          SETTINGS
        </h2>

        {/* Speed Settings Group */}
        <div className="mb-6">
          <div className="text-stone-400 text-[10px] tracking-widest uppercase font-bold mb-3">
            Game Speed
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['slow', 'medium', 'fast'].map((mode) => {
              const isActive = speedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => onSetSpeedMode(mode)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer ${
                    isActive
                      ? 'border-teal-500/40 bg-teal-500/10 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)] font-black'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-stone-400'
                  }`}
                >
                  {mode === 'medium' ? 'Medium' : mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Future Settings Group (Placeholders) */}
        <div className="border-t border-white/5 pt-5 space-y-4">
          <div className="text-stone-500/80 text-[10px] tracking-widest uppercase font-bold mb-1">
            General Preferences
          </div>

          {/* Sound Effects Switch */}
          <div className="flex items-center justify-between py-1 opacity-50 pointer-events-none">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-stone-400" />
              <span className="text-stone-300 text-sm font-semibold">Sound Effects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest font-black uppercase text-teal-500/80 px-1.5 py-0.5 rounded border border-teal-500/10 bg-teal-500/5">
                Soon
              </span>
              <div className="w-8 h-4 rounded-full bg-white/10 relative">
                <div className="w-3.5 h-3.5 rounded-full bg-stone-400 absolute top-0.25 left-0.5"></div>
              </div>
            </div>
          </div>

          {/* Music Volume Slider */}
          <div className="space-y-2 opacity-50 pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-stone-400" />
                <span className="text-stone-300 text-sm font-semibold">Music Volume</span>
              </div>
              <span className="text-[9px] tracking-widest font-black uppercase text-teal-500/80 px-1.5 py-0.5 rounded border border-teal-500/10 bg-teal-500/5">
                Soon
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-lg relative">
              <div className="w-[80%] h-full bg-stone-400 rounded-lg"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-stone-300 absolute -top-0.75 left-[80%]"></div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center justify-between py-1 opacity-50 pointer-events-none">
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-stone-400" />
              <span className="text-stone-300 text-sm font-semibold">Theme</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                Teal Stone
              </span>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between py-1 opacity-50 pointer-events-none">
            <div className="flex items-center gap-2.5">
              <Accessibility className="w-4 h-4 text-stone-400" />
              <span className="text-stone-300 text-sm font-semibold">Reduced Motion</span>
            </div>
            <div className="w-8 h-4 rounded-full bg-white/10 relative">
              <div className="w-3.5 h-3.5 rounded-full bg-stone-400 absolute top-0.25 left-0.5"></div>
            </div>
          </div>
        </div>

        {/* Action Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-stone-200 font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 focus:outline-none mt-7"
        >
          Close Settings
        </button>

      </div>
    </div>
  );
}
