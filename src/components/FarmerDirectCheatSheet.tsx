import React from 'react';
import { Bug, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const FarmerDirectCheatSheet: React.FC = () => {
  return (
    <div className="neuro-card rounded-2xl p-5 text-slate-200">
      <div className="border-b border-slate-800 pb-3 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
          FIELD DIAGNOSTIC CHEAT SHEET · ಕೃಷಿಕರ ಮಾರ್ಗದರ್ಶಿ
        </span>
        <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
          Two Pests. Similar Symptoms. How to Tell Them Apart in the Field
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Based on ICAR-Indian Institute of Horticultural Research (Bengaluru) scouting guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        {/* Tuta absoluta Column */}
        <div className="neuro-inset rounded-xl p-4 border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-400 text-sm">Tuta absoluta</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                MOTH LARVA
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mb-3 italic">
              Tomato Leafminer / Pinworm
            </span>

            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span><strong>Blotch Galleries:</strong> Broad, irregular, transparent necrotic patches.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span><strong>Frass Deposition:</strong> Black granular pellets aggregated inside mine.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span><strong>Fruit Threat:</strong> Larvae bore directly into green and ripe fruits!</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span><strong>Adult:</strong> Small nocturnal grey-brown moth (6-7mm).</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-800 text-[11px] text-amber-300/90 font-medium">
            Trap: Qlure-TUA Delta Pheromone Lure
          </div>
        </div>

        {/* Liriomyza spp. Column */}
        <div className="neuro-inset rounded-xl p-4 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-400 text-sm">Liriomyza spp.</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                FLY MAGGOT
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mb-3 italic">
              Serpentine Leaf Miner
            </span>

            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span><strong>Serpentine Trails:</strong> Narrow, winding, white/yellow meandering tracks.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span><strong>Frass Deposition:</strong> Fine lateral biseriate black frass lines.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span><strong>Fruit Threat:</strong> No fruit entry; strictly foliage lamina mining.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span><strong>Adult:</strong> Tiny black fly with bright yellow scutellum dot.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-800 text-[11px] text-emerald-300/90 font-medium">
            Trap: Bright Yellow Sticky Sheets (canopy height)
          </div>
        </div>

        {/* Mixed Infestation Column */}
        <div className="neuro-card p-4 rounded-xl border border-rose-500/40 bg-gradient-to-br from-slate-900 to-rose-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-rose-400 text-sm">Mixed Infestation</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-bold">
                CRITICAL THREAT
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mb-3 italic">
              Dual Colonization (Tuta + Liriomyza)
            </span>

            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span><strong>Overlapping Mines:</strong> Both serpentine lines and necrotic blotches present.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span><strong>Diagnostic Pitfall:</strong> Single-label apps misclassify this as either one.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span><strong>Economic Loss:</strong> Rapid foliar desiccation and fruit drop.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span><strong>Control:</strong> Integrated Bio-rational dual management.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2.5 border-t border-rose-900/60 text-[11px] text-rose-300 font-bold">
            Action: Dual Trapping + Azadirachtin Spray
          </div>
        </div>
      </div>
    </div>
  );
};
