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
    <main className="flex min-h-screen items-center justify-center bg-[#020617] w-full overflow-hidden">
      {/* Full screen layout for premium, immersive experience */}
      <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
        <StackGame />
      </div>
    </main>
  );
}
