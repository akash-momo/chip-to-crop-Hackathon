import React, { useState } from 'react';
import { SampleLeaf } from '../types/phyto';
import { Camera, MapPin, History, Wifi, WifiOff, AlertTriangle, ShieldCheck, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface FarmerPwaViewProps {
  currentLeaf: SampleLeaf;
  onOpenCapture: () => void;
  onSelectSample: (leaf: SampleLeaf) => void;
  allSamples: SampleLeaf[];
}

export const FarmerPwaView: React.FC<FarmerPwaViewProps> = ({
  currentLeaf,
  onOpenCapture,
  onSelectSample,
  allSamples,
}) => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'scout' | 'history' | 'ipm'>('scout');

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-4">
      {/* Phone Top Bezel / Status Bar */}
      <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>PhytoTrace PWA</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
            title="Toggle simulated offline cache"
          >
            {offlineMode ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400">Offline Queue</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Field Online</span>
              </>
            )}
          </button>
          <span>10:42 AM</span>
        </div>
      </div>

      {/* Main Mobile Screen Area */}
      <div className="p-4 flex-1 space-y-3.5 max-h-[720px] overflow-y-auto">
        {activeTab === 'scout' && (
          <>
            {/* Specimen Card with Image & Overlays (Matching Page 3 Phone Mockup) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] group shadow-inner">
              <img
                src={currentLeaf.imageSrc}
                alt={currentLeaf.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay badges (A, B, C) */}
              <div className="absolute inset-0 pointer-events-none p-3">
                <div className="flex justify-between items-start">
                  <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                    {currentLeaf.fingerprint.plantId} · {currentLeaf.fingerprint.rowId}
                  </span>
                  <span className="bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    {currentLeaf.damagePercent}% DAMAGE
                  </span>
                </div>

                {/* Simulated Pins */}
                {currentLeaf.regions.map((r) => (
                  <div
                    key={r.id}
                    className="absolute"
                    style={{
                      top: `${r.box.ymin / 10}%`,
                      left: `${r.box.xmin / 10}%`,
                    }}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md ${
                        r.evidenceType === 'tuta_consistent'
                          ? 'bg-amber-500 text-slate-950'
                          : r.evidenceType === 'liriomyza_consistent'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {r.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Pre-Check Hint Banner (Page 3) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  Focus: <strong>Optimal</strong> · Glare: <strong>Low</strong>
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">PASSED</span>
            </div>

            {/* Plain-Language Yellow/Amber Card (Page 3 direct replica) */}
            <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-3.5 text-amber-100">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300 mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{currentLeaf.primaryDiagnosis}</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {currentLeaf.plainLanguage.whatIsKnown}
              </p>
              {currentLeaf.plainLanguage.whatIsUncertain && (
                <p className="text-[11px] text-amber-300/80 mt-1.5 italic">
                  Uncertainty cue: {currentLeaf.plainLanguage.whatIsUncertain}
                </p>
              )}
            </div>

            {/* Quick Action Button for Field Scout */}
            <button
              onClick={onOpenCapture}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Next Leaflet (Camera)</span>
            </button>
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2">
            <span className="text-xs text-slate-400 block font-semibold mb-2">
              Recent Field Scouting Dossiers:
            </span>
            {allSamples.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onSelectSample(s);
                  setActiveTab('scout');
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                  s.id === currentLeaf.id
                    ? 'bg-slate-950 border-emerald-500/60'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <img
                  src={s.imageSrc}
                  alt={s.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{s.title}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{s.primaryDiagnosis}</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  {s.damagePercent}%
                </span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'ipm' && (
          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-1">ICAR-IIHR Protocol for Leaf-Miner:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li>Inspect 5 leaflets per plant across 20 randomized plants per row.</li>
                <li>Threshold: &gt;1 mine/leaf triggers biological control release.</li>
                <li>Deploy Qlure-TUA delta pheromone traps at 16 traps/acre.</li>
                <li>Conserve parasitoids (Diglyphus isaea) by avoiding broad-spectrum sprays.</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              Offline Cache Status: <strong>3 reports queued</strong>. Automatically syncs when 4G/WiFi is regained in farm office.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Thumb Navigation Bar (Ergonomic Natural Reach Zone) */}
      <div className="bg-slate-950 border-t border-slate-800 grid grid-cols-3 p-1 text-[11px] font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('scout')}
          className={`py-2 flex flex-col items-center gap-1 rounded-lg transition-colors ${
            activeTab === 'scout' ? 'text-emerald-400 font-bold bg-slate-900' : 'hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Scout</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 flex flex-col items-center gap-1 rounded-lg transition-colors ${
            activeTab === 'history' ? 'text-emerald-400 font-bold bg-slate-900' : 'hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
        <button
          onClick={() => setActiveTab('ipm')}
          className={`py-2 flex flex-col items-center gap-1 rounded-lg transition-colors ${
            activeTab === 'ipm' ? 'text-emerald-400 font-bold bg-slate-900' : 'hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>IPM Protocol</span>
        </button>
      </div>
    </div>
  );
};
