import React, { useState } from 'react';
import { Calculator, X, Share2, Printer, Check, ShieldAlert, Sparkles, Sprout, Bug } from 'lucide-react';

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
  const [acres, setAcres] = useState<number>(1.0);
  const [tankSizeLiters, setTankSizeLiters] = useState<number>(200);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculation rules according to ICAR-IIHR and EPPO protocols
  const deltaTraps = Math.ceil(acres * 16);
  const stickyCards = Math.ceil(acres * 25);
  const biocontrolInsects = Math.round(acres * 4046 * 0.75); // ~0.75 insects per sq. meter
  const neemExtractMl = Math.round(tankSizeLiters * 3.5); // 3.5 ml per liter of water
  const estimatedSprayVolumeLiters = Math.round(acres * 400); // 400L water per acre for tomato canopy

  const isHighSeverity = damagePercent >= 20;

  const prescriptionSummary = `🍅 *PhytoTrace IPM Prescription* 🍅
• Specimen Plant: ${plantId}
• Diagnosis: ${primaryDiagnosis}
• Lamina Damage: ${damagePercent.toFixed(1)}% (${isHighSeverity ? 'URGENT' : 'MODERATE'})
• Crop Area: ${acres} Acre(s)

📋 *Required Inputs & Dosages:*
1. Qlure-TUA Delta Traps: ${deltaTraps} units (hang 1m above ground)
2. Yellow Sticky Cards: ${stickyCards} units (20cm above canopy)
3. Azadirachtin (10,000 ppm): ${neemExtractMl} ml per ${tankSizeLiters}L spray tank
4. Bio-Predators (Nesidiocoris/Diglyphus): ~${biocontrolInsects.toLocaleString()} units
5. Total Spray Water Needed: ~${estimatedSprayVolumeLiters} Liters

⚡ *Advice:* Spray strictly during dusk (5:30 PM - 7:00 PM). Avoid synthetic pyrethroids to protect native parasitoid wasps.`;

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(prescriptionSummary)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="neuro-card rounded-2xl max-w-xl w-full p-6 text-slate-200 overflow-hidden shadow-2xl border border-slate-700/60 max-h-[90vh] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
                  ICAR-IIHR PROTOCOL CALCULATOR
                </span>
                <h3 className="text-base font-bold text-white">
                  Tomato Leaf-Miner Dosage & Field Prescription
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Acreage & Tank Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="neuro-inset rounded-xl p-3">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400 font-medium">Cultivated Area (Acres)</span>
                <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                  {acres.toFixed(2)} Ac ({(acres * 4046).toFixed(0)} m²)
                </span>
              </div>
              <input
                type="range"
                min="0.25"
                max="5.0"
                step="0.25"
                value={acres}
                onChange={(e) => setAcres(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0.25 Ac</span>
                <span>2.5 Ac</span>
                <span>5.0 Ac</span>
              </div>
            </div>

            <div className="neuro-inset rounded-xl p-3">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400 font-medium">Knapsack Spray Tank Size</span>
                <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                  {tankSizeLiters} Liters
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={tankSizeLiters}
                onChange={(e) => setTankSizeLiters(parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>50 L</span>
                <span>200 L (Tractor)</span>
                <span>500 L</span>
              </div>
            </div>
          </div>

          {/* Results Cards Strip (Neumorphic punchy cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs">
            <div className="neuro-card p-3 rounded-xl border border-amber-500/30 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Delta Traps</span>
              <span className="text-xl font-bold text-amber-400 font-mono my-1 tabular-nums">
                {deltaTraps} <span className="text-xs font-normal text-slate-400">units</span>
              </span>
              <span className="text-[10px] text-slate-500">Qlure-TUA lures</span>
            </div>

            <div className="neuro-card p-3 rounded-xl border border-yellow-500/30 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Sticky Cards</span>
              <span className="text-xl font-bold text-yellow-400 font-mono my-1 tabular-nums">
                {stickyCards} <span className="text-xs font-normal text-slate-400">cards</span>
              </span>
              <span className="text-[10px] text-slate-500">Liriomyza flies</span>
            </div>

            <div className="neuro-card p-3 rounded-xl border border-emerald-500/30 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Neem / Azadirachtin</span>
              <span className="text-xl font-bold text-emerald-400 font-mono my-1 tabular-nums">
                {neemExtractMl} <span className="text-xs font-normal text-slate-400">mL</span>
              </span>
              <span className="text-[10px] text-slate-500">Per {tankSizeLiters}L water</span>
            </div>

            <div className="neuro-card p-3 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Biocontrol Bugs</span>
              <span className="text-xl font-bold text-cyan-400 font-mono my-1 tabular-nums">
                {biocontrolInsects.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500">Nesidiocoris nymphs</span>
            </div>
          </div>

          {/* Agronomist Guidelines Note */}
          <div className="neuro-inset rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
              <Sprout className="w-3.5 h-3.5" />
              <span>Application Golden Rules for Indian Tomato Growers</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              • Spray strictly between 5:00 PM and 7:00 PM to prevent leaf scorching and allow nocturnal absorption.
              • Maintain a Pre-Harvest Interval (PHI) of 3 days for Azadirachtin.
              • If mixed infestation exceeds 25%, repeat pheromone check after 72 hours.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="neuro-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Printer className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Prescription!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="neuro-btn-emerald px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share on WhatsApp to Farm Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};
