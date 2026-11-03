import React from 'react';
import { PlainLanguageMessage } from '../types/phyto';
import { AlertTriangle, CheckCircle, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface PlainLanguageBannerProps {
  message: PlainLanguageMessage;
  primaryDiagnosis: string;
  mixedInfestationSuspected: boolean;
  onApplyProtocol?: () => void;
}

export const PlainLanguageBanner: React.FC<PlainLanguageBannerProps> = ({
  message,
  primaryDiagnosis,
  mixedInfestationSuspected,
  onApplyProtocol,
}) => {
  const getUrgencyBadge = (urgency: PlainLanguageMessage['ipmUrgency']) => {
    switch (urgency) {
      case 'immediate':
        return { text: 'IMMEDIATE ACTION (within 48h)', color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
      case 'high':
        return { text: 'HIGH PRIORITY (scout adjacent rows)', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
      case 'moderate':
        return { text: 'MODERATE PROTOCOL', color: 'text-amber-300 bg-amber-950/40 border-amber-900' };
      case 'low':
      default:
        return { text: 'ROUTINE MONITORING', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
    }
  };

  const badge = getUrgencyBadge(message.ipmUrgency);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Agronomic Field Directive · Plain Language Output
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
            {primaryDiagnosis}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-md border font-semibold ${badge.color}`}>
            {badge.text}
          </span>
        </div>
      </div>

      {/* 3-Part Plain Language Cards: Known, Uncertain, Next Step (Page 3 & 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. What Is Known */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>1. What Is Known</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {message.whatIsKnown}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
            Ground truth confirmed via regional overlays
          </div>
        </div>

        {/* 2. What Is Uncertain */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>2. What Is Uncertain</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {message.whatIsUncertain}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
            Calibrated abstention prevents forced false diagnosis
          </div>
        </div>

        {/* 3. Recommended Next Step */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-2">
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span>3. Next Agronomic Step</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {message.recommendedNextStep}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60">
            <button
              onClick={onApplyProtocol}
              className="w-full py-1.5 px-2 text-[11px] font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded transition-colors"
            >
              Log Scouting Action to Field Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
