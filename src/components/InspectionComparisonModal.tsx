import React from 'react';
import { X, ArrowRight, TrendingUp, TrendingDown, Minus, Layers, ShieldCheck, CheckCircle2, AlertTriangle, Download, Share2 } from 'lucide-react';
import { Inspection } from '../types/phyto2';

interface InspectionComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionA: Inspection | null;
  inspectionB: Inspection | null;
  onSelectForView?: (inspection: Inspection) => void;
}

export const InspectionComparisonModal: React.FC<InspectionComparisonModalProps> = ({
  isOpen,
  onClose,
  inspectionA,
  inspectionB,
  onSelectForView,
}) => {
  if (!isOpen || !inspectionA || !inspectionB) return null;

  const dateA = new Date(inspectionA.inspection_date);
  const dateB = new Date(inspectionB.inspection_date);
  const isChronological = dateA <= dateB;
  const earlier = isChronological ? inspectionA : inspectionB;
  const later = isChronological ? inspectionB : inspectionA;

  const damageDelta = later.overall_damage_percent - earlier.overall_damage_percent;
  const damageDeltaAbs = Math.abs(damageDelta);

  const daysDifference = Math.max(
    0,
    Math.round((new Date(later.inspection_date).getTime() - new Date(earlier.inspection_date).getTime()) / (1000 * 60 * 60 * 24))
  );

  const getStatusBadge = (status: Inspection['overall_status']) => {
    switch (status) {
      case 'mixed_infestation':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/50">Mixed Infestation</span>;
      case 'tuta_absoluta':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/50">Tuta absoluta</span>;
      case 'liriomyza_spp':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50">Liriomyza spp.</span>;
      case 'healthy':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">Healthy Leaf</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/50">Uncertain</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="neuro-card rounded-3xl max-w-5xl w-full p-5 sm:p-7 text-slate-100 shadow-2xl border border-slate-700/60 max-h-[92vh] flex flex-col justify-between my-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#244637] pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635] font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A3E635] block">
                  LONGITUDINAL COMPARATIVE SCOUTING
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Side-by-Side Specimen & Damage Comparison
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#0B251C] hover:bg-[#164A35] border border-[#244637] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delta KPI Bar */}
          <div className="neuro-inset rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#A7B8AE]">Observed Time Elapsed:</span>
              <span className="font-bold text-white font-mono bg-[#103D2B] px-3 py-1 rounded-xl border border-[#244637]">
                {daysDifference} Day{daysDifference === 1 ? '' : 's'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#A7B8AE]">Lamina Damage Progression:</span>
              <div className="flex items-center gap-2 font-mono font-bold text-sm">
                {damageDelta > 0 ? (
                  <span className="flex items-center gap-1 text-[#FB7185] bg-rose-500/15 px-3 py-1 rounded-xl border border-rose-500/30">
                    <TrendingUp className="w-4 h-4" />
                    +{damageDelta.toFixed(1)}% (Expansion)
                  </span>
                ) : damageDelta < 0 ? (
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30">
                    <TrendingDown className="w-4 h-4" />
                    -{damageDeltaAbs.toFixed(1)}% (Contained)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-300 bg-slate-800 px-3 py-1 rounded-xl">
                    <Minus className="w-4 h-4" />
                    0.0% (Stable)
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-[#A3E635] font-mono">
              DIGITAL AUDIT TRAIL MATCHED
            </div>
          </div>

          {/* Side-by-Side Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Record 1 */}
            <div className="neuro-card rounded-2xl p-4 sm:p-5 border border-slate-700/60 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#244637] pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#A3E635] uppercase font-bold block">
                      {isChronological ? 'BASELINE SPECIMEN (EARLIER)' : 'LATER INSPECTION'}
                    </span>
                    <h4 className="text-base font-bold text-white">{inspectionA.plant_identifier}</h4>
                    <span className="text-xs font-mono text-[#73877B]">{inspectionA.id}</span>
                  </div>
                  {getStatusBadge(inspectionA.overall_status)}
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-[#244637] bg-black">
                  <img
                    src={inspectionA.image_path}
                    alt={inspectionA.plant_identifier}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-white border border-white/20">
                    {new Date(inspectionA.inspection_date).toLocaleDateString()}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-[#A3E635] font-bold border border-[#A3E635]/40">
                    {inspectionA.overall_damage_percent.toFixed(1)}% DMG
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#A7B8AE] text-[11px] block">Diagnosis:</span>
                    <span className="text-white font-semibold">{inspectionA.primary_diagnosis}</span>
                  </div>
                  <div>
                    <span className="text-[#A7B8AE] text-[11px] block">Active Evidence Regions:</span>
                    <span className="font-mono text-[#BBF7D0]">
                      {inspectionA.regions.length} region(s) identified
                    </span>
                  </div>
                  <div>
                    <span className="text-[#A7B8AE] text-[11px] block">Action Directive:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {inspectionA.plain_language_summary.recommended_next_step}
                    </p>
                  </div>
                </div>
              </div>

              {onSelectForView && (
                <button
                  onClick={() => {
                    onSelectForView(inspectionA);
                    onClose();
                  }}
                  className="w-full py-2 bg-[#0B251C] hover:bg-[#164A35] text-xs font-bold text-[#A3E635] rounded-xl border border-[#244637] transition-colors text-center"
                >
                  Open Evidence Map for {inspectionA.id}
                </button>
              )}
            </div>

            {/* Record 2 */}
            <div className="neuro-card rounded-2xl p-4 sm:p-5 border border-slate-700/60 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#244637] pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#38BDF8] uppercase font-bold block">
                      {isChronological ? 'FOLLOW-UP SPECIMEN (LATER)' : 'EARLIER INSPECTION'}
                    </span>
                    <h4 className="text-base font-bold text-white">{inspectionB.plant_identifier}</h4>
                    <span className="text-xs font-mono text-[#73877B]">{inspectionB.id}</span>
                  </div>
                  {getStatusBadge(inspectionB.overall_status)}
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-[#244637] bg-black">
                  <img
                    src={inspectionB.image_path}
                    alt={inspectionB.plant_identifier}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-white border border-white/20">
                    {new Date(inspectionB.inspection_date).toLocaleDateString()}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-[#38BDF8] font-bold border border-[#38BDF8]/40">
                    {inspectionB.overall_damage_percent.toFixed(1)}% DMG
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#A7B8AE] text-[11px] block">Diagnosis:</span>
                    <span className="text-white font-semibold">{inspectionB.primary_diagnosis}</span>
                  </div>
                  <div>
                    <span className="text-[#A7B8AE] text-[11px] block">Active Evidence Regions:</span>
                    <span className="font-mono text-[#BBF7D0]">
                      {inspectionB.regions.length} region(s) identified
                    </span>
                  </div>
                  <div>
                    <span className="text-[#A7B8AE] text-[11px] block">Action Directive:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {inspectionB.plain_language_summary.recommended_next_step}
                    </p>
                  </div>
                </div>
              </div>

              {onSelectForView && (
                <button
                  onClick={() => {
                    onSelectForView(inspectionB);
                    onClose();
                  }}
                  className="w-full py-2 bg-[#0B251C] hover:bg-[#164A35] text-xs font-bold text-[#38BDF8] rounded-xl border border-[#244637] transition-colors text-center"
                >
                  Open Evidence Map for {inspectionB.id}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#244637] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#73877B] text-[11px] italic">
            Comparison evaluates both visible blotch expansion and serpentine track evolution.
          </span>
          <button
            onClick={onClose}
            className="btn-neon px-6 py-2.5 rounded-xl text-xs font-bold shadow-md ml-auto"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
