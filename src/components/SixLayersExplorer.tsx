import React, { useState } from 'react';
import { Layers, CheckCircle2, ShieldCheck, MapPin, Activity, HelpCircle, FileText } from 'lucide-react';

export const SixLayersExplorer: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(1);

  const layers = [
    {
      num: 1,
      title: 'Regional Evidence',
      tagline: 'Multi-label evidence for each damage region',
      icon: Activity,
      description:
        'Instead of forcing one single global label onto an entire image, PhytoTrace breaks the leaf down into discrete damage galleries. Each individual mine is evaluated independently for Tuta-consistent or Liriomyza-consistent biomarkers.',
      benchmark: 'Handles multi-pest co-infestation on a single leaf blade.',
    },
    {
      num: 2,
      title: 'Explainable Localization',
      tagline: 'Overlays and region boundaries',
      icon: Layers,
      description:
        'Overlays show where evidence sits on the leaf surface, not why an opaque neural net decided. Vector contours trace serpentine tunnels while bounding polygons enclose necrotic blotches, providing transparent visual proof for agronomists.',
      benchmark: 'Mean Segmentation IoU: 0.84 on field-annotated leaf galleries.',
    },
    {
      num: 3,
      title: 'Uncertainty-Aware Intelligence',
      tagline: 'Calibrated confidence and abstention',
      icon: HelpCircle,
      description:
        'When mining cues are ambiguous or overlapping, conventional classifiers force an unreliable guess. PhytoTrace features calibrated confidence and can safely abstain, advising the farmer: "Leaf-miner damage detected. Species uncertain: capture a close-up."',
      benchmark: 'ECE score ≤ 0.042; avoids catastrophic misdiagnosis.',
    },
    {
      num: 4,
      title: 'Damage Fingerprint',
      tagline: 'Structured record for every inspection',
      icon: FileText,
      description:
        'Creates an immutable, structured record for every scouting event. Quantifies total leaf surface damage %, active mine counts, necrotic ratio, canopy stratum, GPS coordinates, and cryptographic verification hash.',
      benchmark: 'Enables auditable compliance with phytosanitary and export standards.',
    },
    {
      num: 5,
      title: 'Longitudinal Monitoring',
      tagline: 'Repeat inspections; visible-damage trend',
      icon: CheckCircle2,
      description:
        'Tracks the exact same plant and leaf cohort across repeat scouting intervals (Day 1, Day 4, Day 8, Day 12). Visualizes lesion expansion rate (mm/day) and evaluates whether biological controls have successfully arrested larval growth.',
      benchmark: 'Quantifies true treatment efficacy over time instead of single-point guesses.',
    },
    {
      num: 6,
      title: 'Farm-Level Spatial Intelligence',
      tagline: 'Plant grid; unsampled plants are unknown',
      icon: MapPin,
      description:
        'Elevates leaf-level insights into a full greenhouse spatial matrix. Crucially respects scientific integrity: unsampled plants remain strictly marked as unknown, preventing false senses of security across large crop acreage.',
      benchmark: 'Directly guides targeted scout routes and pheromone trap placement.',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="border-b border-slate-800 pb-3 mb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Architecture & Differentiation · Chip to Crop 2026
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
          Beyond Classification: Six Layers of Intelligence
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Traditional crop AI forces a single label onto an entire image. PhytoTrace integrates six scientific layers from regional evidence to whole-farm spatial mapping.
        </p>
      </div>

      {/* 6 Layers Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.num;
          return (
            <div
              key={layer.num}
              onClick={() => setActiveLayer(layer.num)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-950 border-emerald-500/80 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    LAYER 0{layer.num}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{layer.title}</h3>
                <span className="text-xs text-emerald-300/90 font-medium block mb-2">
                  {layer.tagline}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{layer.description}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800/70 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{layer.benchmark}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix (Direct from Page 6 of PDF) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800 text-xs">
          <span className="font-semibold text-slate-200">
            Comparative Analysis: Basic Crop Classifier vs PhytoTrace
          </span>
          <span className="text-slate-500 text-[11px]">Source: Problem Statement 04 Specification</span>
        </div>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <th className="py-2 px-3 font-semibold">Capability</th>
              <th className="py-2 px-3 font-semibold text-rose-300/80">Basic Classifier (Single-Label)</th>
              <th className="py-2 px-3 font-semibold text-emerald-300">PhytoTrace Explainable Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr>
              <td className="py-2.5 px-3 font-medium text-slate-200">Output unit</td>
              <td className="py-2.5 px-3 text-slate-400">One label per image (loses mixed cases)</td>
              <td className="py-2.5 px-3 font-semibold text-emerald-400">Evidence per region (multi-label)</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-medium text-slate-200">Explanation</td>
              <td className="py-2.5 px-3 text-slate-400">Often none (opaque black box)</td>
              <td className="py-2.5 px-3 font-semibold text-emerald-400">Localization overlays & gallery tracing</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-medium text-slate-200">Uncertainty</td>
              <td className="py-2.5 px-3 text-slate-400">Forced class (hallucinates single diagnosis)</td>
              <td className="py-2.5 px-3 font-semibold text-emerald-400">Can abstain or flag close-up request</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-medium text-slate-200">Record format</td>
              <td className="py-2.5 px-3 text-slate-400">Ephemeral label only</td>
              <td className="py-2.5 px-3 font-semibold text-emerald-400">Damage Fingerprint with cryptographic hash</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-medium text-slate-200">Over time</td>
              <td className="py-2.5 px-3 text-slate-400">Single image in isolation</td>
              <td className="py-2.5 px-3 font-semibold text-emerald-400">Repeat inspections; expansion kinetics</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-medium text-slate-200">Spatial scope</td>
              <td className="py-2.5 px-3 text-slate-400">One detached leaf</td>
              <td className="py-2.5 px-3 font-semibold text-emerald-400">Plant and whole greenhouse field grid</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 text-[11px] text-slate-400 italic">
          Differentiation is the integrated use of these layers. Other tools may offer some of them individually.
        </div>
      </div>
    </div>
  );
};
