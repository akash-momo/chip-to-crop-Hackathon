import React, { useState, useEffect } from 'react';
import { SampleLeaf } from '../types/phyto';
import { Camera, MapPin, History, Wifi, WifiOff, AlertTriangle, ShieldCheck, ArrowRight, Sparkles, RefreshCw, Calculator, Volume2, Check } from 'lucide-react';

interface FarmerPwaViewProps {
  currentLeaf: SampleLeaf;
  onOpenCapture: () => void;
  onSelectSample: (leaf: SampleLeaf) => void;
  allSamples: SampleLeaf[];
  onOpenCalculator?: () => void;
  onOpenAudio?: () => void;
}

export const FarmerPwaView: React.FC<FarmerPwaViewProps> = ({
  currentLeaf,
  onOpenCapture,
  onSelectSample,
  allSamples,
  onOpenCalculator,
  onOpenAudio,
}) => {
  const [offlineMode, setOfflineMode] = useState<boolean>(() => {
    return localStorage.getItem('phyto_offline_mode') === 'true';
  });
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<'scout' | 'history' | 'ipm'>('scout');
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  const toggleOfflineMode = () => {
    const next = !offlineMode;
    setOfflineMode(next);
    localStorage.setItem('phyto_offline_mode', String(next));
  };

  const handleSyncQueue = () => {
    if (offlineQueueCount === 0) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setOfflineQueueCount(0);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto neuro-card rounded-3xl overflow-hidden shadow-2xl flex flex-col my-3 border border-slate-700/60 w-full">
      {/* Phone Top Bezel / Status Bar */}
      <div className="bg-slate-950 px-5 pt-3 pb-2.5 flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span>PhytoTrace Field PWA</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              offlineMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {offlineMode ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{offlineMode ? 'Offline Queue' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {/* Main Mobile Screen Area */}
      <div className="p-4 flex-1 space-y-3.5 max-h-[720px] overflow-y-auto">
        {activeTab === 'scout' && (
          <>
            {/* Specimen Card with Image & Overlays (Matching Page 3 Phone Mockup) */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-[4/3] group shadow-inner">
              <img
                src={currentLeaf.imageSrc}
                alt={currentLeaf.title}
                className="w-full h-full object-cover"
              />

              {/* Top Meta Badges */}
              <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-emerald-400 border border-slate-800">
                    {currentLeaf.fingerprint.plantId} · {currentLeaf.fingerprint.rowId}
                  </span>
                  <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shadow-md">
                    {currentLeaf.damagePercent}% DAMAGE
                  </span>
                </div>

                {/* Simulated Region Pins (A, B, C) */}
                <div className="flex gap-2">
                  {currentLeaf.regions.map((r) => (
                    <span
                      key={r.id}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${
                        r.evidenceType === 'tuta_consistent'
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-black'
                          : r.evidenceType === 'liriomyza_consistent'
                          ? 'bg-emerald-400 text-slate-950 ring-2 ring-black'
                          : 'bg-rose-500 text-white ring-2 ring-black'
                      }`}
                    >
                      {r.badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality Pre-Check Hint Banner (Page 3) */}
            <div className="neuro-inset rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  Focus: <strong>Sharp</strong> · Glare: <strong>Optimal</strong>
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 neuro-btn-emerald px-2 py-0.5 rounded">
                GATE PASSED
              </span>
            </div>

            {/* Plain-Language Yellow/Amber Card (Page 3 direct replica) */}
            <div className="neuro-card rounded-2xl p-4 border border-amber-500/40 bg-gradient-to-br from-slate-900 to-amber-950/20 text-amber-100">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{currentLeaf.primaryDiagnosis}</span>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {currentLeaf.plainLanguage.whatIsKnown}
              </p>
              {currentLeaf.plainLanguage.whatIsUncertain && (
                <p className="text-[11px] text-amber-300 mt-2 p-2 rounded-lg bg-amber-950/40 border border-amber-800/40">
                  ⚠️ {currentLeaf.plainLanguage.whatIsUncertain}
                </p>
              )}
            </div>

            {/* Quick Action Buttons for Farmer */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenCapture}
                className="w-full py-3 px-3 neuro-btn-emerald font-bold text-xs rounded-xl flex items-center justify-center gap-2 text-slate-950 cursor-pointer shadow-lg active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Leaf Photo</span>
              </button>

              {onOpenCalculator && (
                <button
                  onClick={onOpenCalculator}
                  className="w-full py-3 px-3 neuro-btn font-bold text-xs rounded-xl flex items-center justify-center gap-2 text-emerald-300 hover:text-white cursor-pointer active:scale-95"
                >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Dose Calculator</span>
                </button>
              )}
            </div>

            {/* Offline Sync Card if items are pending */}
            {offlineQueueCount > 0 && (
              <div className="neuro-inset rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">
                    {offlineQueueCount} Field Inspections Queued
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ready to sync to cloud registry
                  </span>
                </div>
                <button
                  onClick={handleSyncQueue}
                  disabled={syncing}
                  className="neuro-btn px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-400 hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            )}

            {syncSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>All offline field scouting records successfully synced!</span>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2.5">
            <span className="text-xs text-slate-400 block font-semibold mb-1">
              Greenhouse Scouting Records:
            </span>
            {allSamples.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onSelectSample(s);
                  setActiveTab('scout');
                }}
                className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  s.id === currentLeaf.id
                    ? 'neuro-inset border border-emerald-500/80'
                    : 'neuro-card hover:border-slate-700'
                }`}
              >
                <img
                  src={s.imageSrc}
                  alt={s.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{s.title}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{s.primaryDiagnosis}</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {s.damagePercent}%
                </span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'ipm' && (
          <div className="space-y-3 text-xs">
            <div className="neuro-card p-4 rounded-2xl border border-slate-800">
              <span className="font-bold text-white text-sm block mb-2">
                ICAR-IIHR Tomato Leafminer Rules
              </span>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Scouting Window:</strong> Check 5 leaflets per plant every 48 hours.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Threshold:</strong> If &gt;1 blotch per leaf, hang 16 Qlure-TUA traps per acre immediately.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Bio-Control:</strong> Release <em>Nesidiocoris tenuis</em> predators when larvae are active.</span>
                </li>
              </ul>
            </div>

            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="w-full py-2.5 neuro-btn-emerald font-bold text-xs rounded-xl flex items-center justify-center gap-2 text-slate-950"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Exact Field Dose for Your Acreage</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Thumb Navigation Bar (Ergonomic Natural Reach Zone) */}
      <div className="bg-slate-950 border-t border-slate-800 grid grid-cols-3 p-1.5 text-[11px] font-bold text-slate-400">
        <button
          onClick={() => setActiveTab('scout')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'scout' ? 'neuro-inset text-emerald-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Scout</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'history' ? 'neuro-inset text-emerald-400 font-bold' : 'hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Records</span>
        </button>
        <button
          onClick={() => setActiveTab('ipm')}
          className={`py-2 flex flex-col items-center gap-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ipm' ? 'neuro-inset text-emerald-400 font-bold' : 'hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>IPM Rules</span>
        </button>
      </div>
    </div>
  );
};
