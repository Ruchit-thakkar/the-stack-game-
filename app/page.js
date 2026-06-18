'use client';

import dynamic from 'next/dynamic';

// Disable SSR to prevent errors with browser APIs (window, localStorage, requestAnimationFrame)
const StackGame = dynamic(() => import('../components/StackGame'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 font-mono text-cyan-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
        <span className="text-xs uppercase tracking-widest animate-pulse">Loading Stack...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617]">
      {/* Responsive layout: capped at 480px centered on desktop, full-viewport on mobile */}
      <div className="relative w-full max-w-[480px] h-screen bg-slate-950 overflow-hidden md:border-x md:border-white/5 md:shadow-[0_0_80px_-15px_rgba(0,0,0,0.9)]">
        <StackGame />
      </div>
    </main>
  );
}
