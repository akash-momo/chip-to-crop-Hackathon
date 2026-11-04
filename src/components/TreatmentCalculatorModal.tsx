import React from 'react';
import { BookOpen, X, Share2, Sprout } from 'lucide-react';
import { getDiagnosisGuidance, RESEARCH_SOURCES } from '../data/researchGuidance';

interface TreatmentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  damagePercent: number;
  primaryDiagnosis: string;
  plantId: string;
}

export const TreatmentCalculatorModal: React.FC<TreatmentCalculatorModalProps> = ({
  isOpen,
  onClose,
  damagePercent,
  primaryDiagnosis,
  plantId,
}) => {
  if (!isOpen) return null;
  const guidance = getDiagnosisGuidance(primaryDiagnosis);
  const summary = [
    `Plant check: ${plantId}`,
    `Possible issue: ${primaryDiagnosis}`,
    `AI image estimate: ${damagePercent.toFixed(1)}% (not field-calibrated; confirm in person)`,
    'Research-informed steps:',
    ...guidance.map((step) => `• ${step}`),
    'No pesticide dose is provided. Follow the locally registered product label and ask a local agriculture officer before treatment.',
  ].join('\n');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-xl w-full rounded-2xl bg-white text-slate-800 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><BookOpen className="w-5 h-5" /></span>
            <div><span className="text-xs uppercase tracking-wide font-bold text-emerald-700">Field action guide</span><h2 className="font-bold text-lg">What to do next</h2></div>
          </div>
          <button onClick={onClose} aria-label="Close field action guide" className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-950">
            This is an AI image estimate, not a confirmed diagnosis. Check several plants and compare symptoms before taking action.
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-900 mb-2"><Sprout className="w-4 h-4" />Suggested scouting steps</div>
            <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">{guidance.map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
          <div className="text-xs text-slate-600"><strong>Research used</strong><ul className="mt-1 space-y-1">{RESEARCH_SOURCES.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer" className="underline text-emerald-800">{source.label}</a></li>)}</ul></div>
          <p className="text-xs text-slate-600">No spray amount, trap count, or harvest waiting period is calculated here. These depend on the registered product, crop stage, and local guidance.</p>
        </div>
        <div className="px-5 pb-5"><button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`, '_blank')} className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2.5 flex items-center gap-2"><Share2 className="w-4 h-4" />Share steps</button></div>
      </div>
    </div>
  );
};
