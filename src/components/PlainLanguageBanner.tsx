import React, { useState } from 'react';
import { PlainLanguageMessage } from '../types/phyto';
import { AlertTriangle, CheckCircle, HelpCircle, ArrowRight, ShieldCheck, CheckSquare, Square, Calculator, Volume2 } from 'lucide-react';

interface PlainLanguageBannerProps {
  message: PlainLanguageMessage;
  primaryDiagnosis: string;
  mixedInfestationSuspected: boolean;
  onApplyProtocol?: () => void;
  onOpenCalculator?: () => void;
  onTriggerAudio?: () => void;
}

export const PlainLanguageBanner: React.FC<PlainLanguageBannerProps> = ({
  message,
  primaryDiagnosis,
  mixedInfestationSuspected,
  onApplyProtocol,
  onOpenCalculator,
  onTriggerAudio,
}) => {
  // Interactive farmer field checklist
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Inspect adjacent plants in current row for egg punctures', done: false, type: 'scout' },
    { id: 'c2', label: 'Deploy Qlure-TUA Delta pheromone traps (16 per acre at 1m height)', done: false, type: 'trap' },
    { id: 'c3', label: 'Mount yellow sticky sheets 20cm above tomato canopy for adult flies', done: false, type: 'trap' },
    { id: 'c4', label: 'Prepare Azadirachtin (Neem) spray tank for dusk application (5:30 PM)', done: false, type: 'spray' },
    { id: 'c5', label: 'Log scouting record to ICAR-IIHR compliant farm registry', done: false, type: 'log' },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const getUrgencyBadge = (urgency: PlainLanguageMessage['ipmUrgency']) => {
    switch (urgency) {
      case 'immediate':
        return {
          text: 'IMMEDIATE INTERVENTION (WITHIN 48H)',
          style: 'neuro-btn-rose font-bold text-white',
        };
      case 'high':
        return {
          text: 'HIGH SCOUTING PRIORITY',
          style: 'neuro-btn-amber font-bold text-slate-950',
        };
      case 'moderate':
        return {
          text: 'MODERATE MANAGEMENT',
          style: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold',
        };
      case 'low':
      default:
        return {
          text: 'ROUTINE 48H SCOUTING',
          style: 'neuro-btn-emerald font-bold text-slate-950',
        };
    }
  };

  const badge = getUrgencyBadge(message.ipmUrgency);
  const completedCount = checklist.filter((c) => c.done).length;

  return (
    <div className="neuro-card rounded-2xl p-5 text-slate-200">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
            FARMER ADVISORY DIRECTIVE · ಕೃಷಿ ಸಲಹೆ
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
            {primaryDiagnosis}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-3 py-1.5 rounded-xl shadow-md ${badge.style}`}>
            {badge.text}
          </span>
          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className="neuro-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dose Calculator</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Part Plain Language Cards: Known, Uncertain, Next Step (Page 3 & 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
        {/* 1. What Is Known */}
        <div className="neuro-inset rounded-xl p-4 flex flex-col justify-between border border-emerald-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>1. What Is Confirmed</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {message.whatIsKnown}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Validated via localized gallery contours
          </div>
        </div>

        {/* 2. What Is Uncertain */}
        <div className="neuro-inset rounded-xl p-4 flex flex-col justify-between border border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>2. What Is Uncertain</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {message.whatIsUncertain}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Calibrated abstention prevents false spray orders
          </div>
        </div>

        {/* 3. Recommended Next Step */}
        <div className="neuro-inset rounded-xl p-4 flex flex-col justify-between border border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span>3. Farmer Next Action</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {message.recommendedNextStep}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80">
            <button
              onClick={onApplyProtocol}
              className="w-full py-1.5 px-2 text-[11px] font-bold text-slate-950 neuro-btn-emerald rounded-lg transition-transform active:scale-95"
            >
              Log Scouting Action to Field Registry
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Field Action Checklist for Farm Workers */}
      <div className="neuro-inset rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Field Scouting & IPM Action Checklist</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            {completedCount} / {checklist.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-2.5 rounded-lg text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                item.done
                  ? 'bg-emerald-950/40 text-slate-400 line-through border border-emerald-800/40'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-800'
              }`}
            >
              {item.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug text-[11px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
