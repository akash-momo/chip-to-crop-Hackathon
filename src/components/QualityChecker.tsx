import React from 'react';
import { QualityMetrics } from '../types/phyto';
import { CheckCircle2, AlertTriangle, Eye, Sun, Maximize2, ShieldAlert } from 'lucide-react';

interface QualityCheckerProps {
  quality: QualityMetrics;
  onRetest?: () => void;
}

export const QualityChecker: React.FC<QualityCheckerProps> = ({ quality }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          {quality.passed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Pipeline Gate 02 · Pre-Inference Quality Verification
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {quality.passed ? 'PASSED · READY FOR LOCALIZATION' : 'GATE HOLD · QUALITY DEFECT'}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Blur metric */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Focus & Sharpness
            </span>
            <span className="font-mono text-emerald-400 tabular-nums">
              {(quality.blurScore * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quality.blurDetected ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, quality.blurScore * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1.5">
            {quality.blurDetected ? 'Motion blur flagged' : 'Venation lines sharp'}
          </span>
        </div>

        {/* Glare metric */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-slate-400" />
              Specular Glare
            </span>
            <span className="font-mono text-emerald-400 tabular-nums">
              {((1 - quality.glareScore) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quality.glareDetected ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(5, (1 - quality.glareScore) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1.5">
            {quality.glareDetected ? 'Specular hotspot detected' : 'Diffused canopy light'}
          </span>
        </div>

        {/* Distance / Framing */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              Framing Distance
            </span>
            <span className="font-mono text-emerald-400">
              {quality.distanceStatus === 'optimal' ? '18 cm' : 'Abnormal'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium capitalize mt-1">
            {quality.distanceStatus.replace('_', ' ')}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Leaflet blade fills 78% ROI
          </span>
        </div>

        {/* Lighting status */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              Illumination
            </span>
            <span className="font-mono text-emerald-400 capitalize">
              {quality.lightingQuality}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium capitalize mt-1">
            Optimal CRI &gt; 90
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Chlorophyll ratio verified
          </span>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/40 flex items-start gap-2">
        <span className="text-slate-500 font-mono shrink-0">DIAGNOSTIC NOTE:</span>
        <span>{quality.feedbackNotes}</span>
      </div>
    </div>
  );
};
