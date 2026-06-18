import React from 'react';
import { X, Volume2, VolumeX, Music } from 'lucide-react';

/**
 * SettingsModal - A premium glassmorphism settings menu with working controls.
 */
export default function SettingsModal({
  onClose,
  speedMode,
  onSetSpeedMode,
  effectsVolume,
  onSetEffectsVolume,
  musicVolume,
  onSetMusicVolume,
}) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const pct = (val) => `${Math.round(val * 100)}%`;

  return (
    <div
      onClick={handleOverlayClick}
      className="absolute inset-0 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md z-30 select-none animate-fade-in font-ui"
    >
      <div className="w-full max-w-sm rounded-[32px] border border-white/5 bg-teal-950/25 backdrop-blur-3xl shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <h2 className="text-xl font-black tracking-widest text-stone-200 font-title">
            SETTINGS
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-90 transition-all duration-300 text-stone-400 hover:text-stone-200 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 overflow-y-auto max-h-[70vh]">

          {/* ── Game Speed ── */}
          <div>
            <div className="text-stone-400 text-[10px] tracking-widest uppercase font-bold mb-3">
              Game Speed
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slow', label: 'Slow' },
                { id: 'medium', label: 'Medium' },
                { id: 'fast', label: 'Fast' },
              ].map(({ id, label }) => {
                const isActive = speedMode === id;
                return (
                  <button
                    key={id}
                    onClick={() => onSetSpeedMode(id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer ${
                      isActive
                        ? 'border-teal-500/40 bg-teal-500/10 text-teal-300 shadow-[0_0_14px_rgba(20,184,166,0.2)]'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Sound Effects Volume ── */}
          <div className="border-t border-white/5 pt-5">
            <div className="text-stone-400 text-[10px] tracking-widest uppercase font-bold mb-4">
              Audio
            </div>

            <div className="space-y-5">
              {/* Sound Effects */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <Volume2 className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-200 text-sm font-semibold">Sound Effects</span>
                  </div>
                  <span className="text-teal-300 text-xs font-bold font-number tabular-nums w-9 text-right">
                    {pct(effectsVolume)}
                  </span>
                </div>

                {/* Effects Volume Slider */}
                <div className="relative flex items-center h-5">
                  <div className="absolute w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-75"
                      style={{ width: `${effectsVolume * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={effectsVolume}
                    onChange={(e) => onSetEffectsVolume(parseFloat(e.target.value))}
                    className="relative w-full h-1 appearance-none bg-transparent cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-stone-200 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(20,184,166,0.4)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-stone-200 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                    aria-label="Sound effects volume"
                  />
                </div>

                {/* Quick presets */}
                <div className="flex gap-1.5 mt-2.5">
                  {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                    <button
                      key={v}
                      onClick={() => onSetEffectsVolume(v)}
                      className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all duration-200 focus:outline-none cursor-pointer ${
                        Math.abs(effectsVolume - v) < 0.01
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-white/5 text-stone-500 hover:bg-white/10 hover:text-stone-300 border border-white/5'
                      }`}
                    >
                      {v === 0 ? 'Off' : `${v * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Music Volume */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <Music className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-200 text-sm font-semibold">Music Volume</span>
                  </div>
                  <span className="text-teal-300 text-xs font-bold font-number tabular-nums w-9 text-right">
                    {pct(musicVolume)}
                  </span>
                </div>

                {/* Music Volume Slider */}
                <div className="relative flex items-center h-5">
                  <div className="absolute w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-75"
                      style={{ width: `${musicVolume * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={musicVolume}
                    onChange={(e) => onSetMusicVolume(parseFloat(e.target.value))}
                    className="relative w-full h-1 appearance-none bg-transparent cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-stone-200 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(34,211,238,0.4)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-stone-200 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                    aria-label="Music volume"
                  />
                </div>

                {/* Quick presets */}
                <div className="flex gap-1.5 mt-2.5">
                  {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                    <button
                      key={v}
                      onClick={() => onSetMusicVolume(v)}
                      className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all duration-200 focus:outline-none cursor-pointer ${
                        Math.abs(musicVolume - v) < 0.01
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-white/5 text-stone-500 hover:bg-white/10 hover:text-stone-300 border border-white/5'
                      }`}
                    >
                      {v === 0 ? 'Off' : `${v * 100}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Close Button */}
        <div className="px-6 pb-6 pt-3 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-stone-200 font-bold tracking-wider transition-all duration-300 cursor-pointer focus:outline-none"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
