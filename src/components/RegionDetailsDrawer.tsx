import React from 'react';
import { RegionEvidence } from '../types/phyto';
import { ShieldCheck, AlertCircle, HelpCircle, ArrowRight, Microscope, Bug, CheckCircle } from 'lucide-react';

interface RegionDetailsDrawerProps {
  region: RegionEvidence | null;
  allRegions: RegionEvidence[];
  onSelectRegion: (id: string) => void;
  onRequestCloseUp: () => void;
  onConfirmVerification: () => void;
}

export const RegionDetailsDrawer: React.FC<RegionDetailsDrawerProps> = ({
  region,
  allRegions,
  onSelectRegion,
  onRequestCloseUp,
  onConfirmVerification,
}) => {
  if (!region) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <Microscope className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-300">No Region Selected</p>
        <p className="text-xs text-slate-500 mt-1">
          Click any pin (A, B, C) or boundary box on the leaf evidence map to inspect regional morphology.
        </p>
      </div>
    );
  }

  const isTuta = region.evidenceType === 'tuta_consistent';
  const isLiriomyza = region.evidenceType === 'liriomyza_consistent';
  const isUncertain = region.evidenceType === 'uncertain';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between text-slate-200">
      <div>
        {/* Region Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isTuta
                  ? 'bg-amber-500 text-slate-950'
                  : isLiriomyza
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {region.badge}
            </span>
            <span className="text-sm font-semibold text-white">{region.label}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            {allRegions.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id)}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  r.id === region.id
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Calibrated Confidence & Evidence Verdict */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Calibrated Evidence Score</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {(region.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isTuta ? 'bg-amber-500' : isLiriomyza ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${region.confidence * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span className="capitalize">{region.evidenceType.replace('_', ' ')}</span>
            <span>ECE Error Bound: ±0.038</span>
          </div>
        </div>

        {/* Morphological Analysis Metrics Grid */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Morphological Biomarkers
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800/50">
              <span className="text-slate-400 block text-[11px]">Gallery Morphology</span>
              <span className="font-semibold text-slate-200 capitalize">
                {region.galleryType} Mine
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800/50">
              <span className="text-slate-400 block text-[11px]">Damaged Surface</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {region.areaMm2Approx.toFixed(1)} mm²
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800/50">
              <span className="text-slate-400 block text-[11px]">Average Tunnel Width</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {region.characteristics.galleryWidthMm} mm
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800/50">
              <span className="text-slate-400 block text-[11px]">Sinuosity (Winding Index)</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {region.characteristics.windingIndex.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Entomological Evidence Detail */}
        <div className="mb-4 text-xs space-y-2">
          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/40">
            <span className="font-semibold text-slate-300 block mb-1">Frass Deposition:</span>
            <span className="text-slate-400">
              {region.characteristics.frassDetected
                ? `Confirmed: ${region.characteristics.frassType}`
                : 'No macroscopic frass pellets detected in lumen'}
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/40">
            <span className="font-semibold text-slate-300 block mb-1">Visual Observation:</span>
            <p className="text-slate-300 leading-relaxed">{region.morphologyDescription}</p>
          </div>

          {/* Uncertainty banner if flagged (Page 5: C Uncertain evidence) */}
          {isUncertain && (
            <div className="bg-rose-950/30 border border-rose-800/50 p-3 rounded-lg text-rose-200">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-rose-300 mb-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Ambiguous Diagnostic Cues Flagged</span>
              </div>
              <p className="text-[11px] text-rose-300/90 leading-relaxed">
                {region.uncertaintyReason ||
                  'Intermediate morphology between young Tuta blotch entry and serpentine terminal pupation chamber. Model abstains from forced single-label prediction.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Agricultural Pathway (Slide 5: close-up capture -> expert verification -> confirmed diagnosis) */}
      <div className="pt-3 border-t border-slate-800 mt-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Diagnostic Action Pathway
        </span>
        <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800 mb-3 text-xs text-slate-300 flex items-center gap-2">
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{region.recommendedPathway}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {isUncertain ? (
            <button
              onClick={onRequestCloseUp}
              className="w-full py-2 px-3 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>Request Close-up</span>
            </button>
          ) : (
            <button
              onClick={onConfirmVerification}
              className="w-full py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verify Region</span>
            </button>
          )}

          <button
            onClick={() => {
              const el = document.getElementById('scouting-report-card');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-2 px-3 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-center"
          >
            View Fingerprint
          </button>
        </div>
      </div>
    </div>
  );
};
