import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeView: 'evidence' | 'farm-grid' | 'longitudinal' | 'six-layers' | 'benchmarks';
  setActiveView: (view: 'evidence' | 'farm-grid' | 'longitudinal' | 'six-layers' | 'benchmarks') => void;
  pwaMode: boolean;
  setPwaMode: (val: boolean) => void;
  onOpenNewInspection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  pwaMode,
  setPwaMode,
  onOpenNewInspection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element wordmark, no decorative pill attachments) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
            Φ
          </div>
          <button
            onClick={() => setActiveView('evidence')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              PhytoTrace
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 font-normal">
              Chip to Crop 2026
            </span>
          </button>
        </div>

        {/* Zone 2: Concise navigation links (single line, no wrapping, subtle underline) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView('evidence')}
            className={`whitespace-nowrap pb-1 transition-colors hover:text-white ${
              activeView === 'evidence' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
            }`}
          >
            Evidence Map
          </button>
          <button
            onClick={() => setActiveView('farm-grid')}
            className={`whitespace-nowrap pb-1 transition-colors hover:text-white ${
              activeView === 'farm-grid' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
            }`}
          >
            Farm Grid
          </button>
          <button
            onClick={() => setActiveView('longitudinal')}
            className={`whitespace-nowrap pb-1 transition-colors hover:text-white ${
              activeView === 'longitudinal' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
            }`}
          >
            Progression
          </button>
          <button
            onClick={() => setActiveView('six-layers')}
            className={`whitespace-nowrap pb-1 transition-colors hover:text-white ${
              activeView === 'six-layers' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
            }`}
          >
            6 Layers
          </button>
          <button
            onClick={() => setActiveView('benchmarks')}
            className={`whitespace-nowrap pb-1 transition-colors hover:text-white ${
              activeView === 'benchmarks' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
            }`}
          >
            Scientific Proof
          </button>
        </nav>

        {/* Zone 3: Primary Action and PWA Viewport Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setPwaMode(!pwaMode)}
            title={pwaMode ? 'Switch to Agronomist Desktop Console' : 'Switch to Farmer PWA Mobile View'}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors whitespace-nowrap"
          >
            {pwaMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Desktop Hub</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Field PWA View</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenNewInspection}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm shadow-emerald-500/20 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Inspection</span>
          </button>
        </div>
      </div>
    </header>
  );
};
