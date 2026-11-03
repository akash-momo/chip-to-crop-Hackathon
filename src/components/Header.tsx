import React from 'react';
import { Smartphone, Monitor, Sun, Moon, Calculator, Sparkles, UserCheck, Stethoscope } from 'lucide-react';

interface HeaderProps {
  activeView: 'evidence' | 'farm-grid' | 'longitudinal' | 'six-layers' | 'benchmarks';
  setActiveView: (view: 'evidence' | 'farm-grid' | 'longitudinal' | 'six-layers' | 'benchmarks') => void;
  pwaMode: boolean;
  setPwaMode: (val: boolean) => void;
  isDaylightMode: boolean;
  setIsDaylightMode: (val: boolean) => void;
  isFarmerSimpleMode: boolean;
  setIsFarmerSimpleMode: (val: boolean) => void;
  onOpenNewInspection: () => void;
  onOpenCalculator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  pwaMode,
  setPwaMode,
  isDaylightMode,
  setIsDaylightMode,
  isFarmerSimpleMode,
  setIsFarmerSimpleMode,
  onOpenNewInspection,
  onOpenCalculator,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark (single text element wordmark, no decorative pill attachments) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md shadow-emerald-500/30">
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
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-400">
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

        {/* Zone 3: Tactile Neumorphic Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Simple Farmer Mode vs Agronomist Pro Mode */}
          <button
            onClick={() => setIsFarmerSimpleMode(!isFarmerSimpleMode)}
            title={isFarmerSimpleMode ? 'Switch to Detailed Agronomist Mode' : 'Switch to Simplified Farmer Mode'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 neuro-btn ${
              isFarmerSimpleMode ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            {isFarmerSimpleMode ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Farmer Mode</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Agronomist Pro</span>
              </>
            )}
          </button>

          {/* Daylight High-Visibility Mode Toggle (for sunlight visibility in field) */}
          <button
            onClick={() => setIsDaylightMode(!isDaylightMode)}
            title={isDaylightMode ? 'Switch to Dark Greenhouse Mode' : 'Switch to High-Contrast Daylight Mode'}
            className="neuro-btn p-2 rounded-xl text-slate-300 hover:text-amber-400 transition-colors"
          >
            {isDaylightMode ? (
              <Moon className="w-4 h-4 text-cyan-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Dosage Calculator Button */}
          <button
            onClick={onOpenCalculator}
            title="Open IPM Treatment & Dosage Calculator"
            className="hidden sm:flex neuro-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>IPM Calculator</span>
          </button>

          {/* Smartphone PWA Viewport Switcher */}
          <button
            onClick={() => setPwaMode(!pwaMode)}
            title={pwaMode ? 'Switch to Desktop Console' : 'Switch to Farmer PWA Mobile View'}
            className="hidden lg:flex neuro-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors items-center gap-1.5"
          >
            {pwaMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile PWA</span>
              </>
            )}
          </button>

          {/* Primary CTA: New Inspection (Punchy tactile neumorphic button) */}
          <button
            onClick={onOpenNewInspection}
            className="neuro-btn-emerald px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Inspection</span>
          </button>
        </div>
      </div>
    </header>
  );
};
