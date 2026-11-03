import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, ShieldCheck, Calendar, Info } from 'lucide-react';
import { Inspection, Plant } from '../types/phyto2';

interface FarmAnalyticsViewProps {
  inspections: Inspection[];
  plants: Plant[];
}

export const FarmAnalyticsView: React.FC<FarmAnalyticsViewProps> = ({
  inspections,
  plants,
}) => {
  const totalCount = inspections.length;
  const mixedCount = inspections.filter((i) => i.overall_status === 'mixed_infestation').length;
  const tutaCount = inspections.filter((i) => i.overall_status === 'tuta_absoluta').length;
  const liriomyzaCount = inspections.filter((i) => i.overall_status === 'liriomyza_spp').length;
  const healthyCount = inspections.filter((i) => i.overall_status === 'healthy').length;

  const expertReviewedCount = inspections.filter((i) => i.verification_status === 'verified_by_expert').length;
  const pendingCount = inspections.filter((i) => i.verification_status === 'pending_expert_review').length;

  const avgDamage =
    totalCount > 0
      ? inspections.reduce((acc, curr) => acc + curr.overall_damage_percent, 0) / totalCount
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-1">
          ANALYTICS & POPULATION EPIDEMIOLOGY
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Greenhouse Canopy Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1">
          Aggregated visible damage metrics and verification audits from {totalCount} stored inspection records.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-4">
          <span className="text-[#A7B8AE] text-xs font-semibold block mb-1">Mean Foliar Damage</span>
          <div className="text-3xl font-extrabold text-[#A3E635] font-mono tabular-nums">
            {avgDamage.toFixed(1)}%
          </div>
          <span className="text-[11px] text-[#73877B] mt-1 block">Across sampled plants</span>
        </div>

        <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-4">
          <span className="text-[#A7B8AE] text-xs font-semibold block mb-1">Mixed Attack Ratio</span>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalCount > 0 ? ((mixedCount / totalCount) * 100).toFixed(0) : 0}%
          </div>
          <span className="text-[11px] text-[#73877B] mt-1 block">{mixedCount} dual-pest leaves</span>
        </div>

        <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-4">
          <span className="text-[#A7B8AE] text-xs font-semibold block mb-1">Expert Audit Rate</span>
          <div className="text-3xl font-extrabold text-[#34D399] font-mono tabular-nums">
            {totalCount > 0 ? ((expertReviewedCount / totalCount) * 100).toFixed(0) : 0}%
          </div>
          <span className="text-[11px] text-[#73877B] mt-1 block">{expertReviewedCount} confirmed</span>
        </div>

        <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-4">
          <span className="text-[#A7B8AE] text-xs font-semibold block mb-1">Scouted Coverage</span>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {plants.filter((p) => p.status !== 'not_inspected').length} / 80
          </div>
          <span className="text-[11px] text-[#73877B] mt-1 block">Greenhouse Block B</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Visual Damage Distribution */}
        <div className="bg-[#103D2B] border border-[#244637] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#244637] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Observed Damage Categories</h3>
              <span className="text-[11px] text-[#A7B8AE]">Calculated from verified regional contours</span>
            </div>
            <Activity className="w-4 h-4 text-[#A3E635]" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[#A7B8AE] mb-1 font-mono">
                <span>Mixed Infestation (Tuta + Liriomyza)</span>
                <span className="text-[#A3E635] font-bold">{mixedCount} leaves</span>
              </div>
              <div className="w-full bg-[#071C16] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#A3E635] h-full rounded-full"
                  style={{ width: `${(mixedCount / Math.max(1, totalCount)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#A7B8AE] mb-1 font-mono">
                <span>Tuta absoluta Blotch Galleries</span>
                <span className="text-[#FBBF24] font-bold">{tutaCount} leaves</span>
              </div>
              <div className="w-full bg-[#071C16] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#FBBF24] h-full rounded-full"
                  style={{ width: `${(tutaCount / Math.max(1, totalCount)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#A7B8AE] mb-1 font-mono">
                <span>Liriomyza spp. Serpentine Mines</span>
                <span className="text-[#38BDF8] font-bold">{liriomyzaCount} leaves</span>
              </div>
              <div className="w-full bg-[#071C16] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#38BDF8] h-full rounded-full"
                  style={{ width: `${(liriomyzaCount / Math.max(1, totalCount)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#A7B8AE] mb-1 font-mono">
                <span>Healthy Control Foliage</span>
                <span className="text-[#34D399] font-bold">{healthyCount} leaves</span>
              </div>
              <div className="w-full bg-[#071C16] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#34D399] h-full rounded-full"
                  style={{ width: `${(healthyCount / Math.max(1, totalCount)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Expert Review & Verification Funnel */}
        <div className="bg-[#103D2B] border border-[#244637] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#244637] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Scientific Verification Audit</h3>
              <span className="text-[11px] text-[#A7B8AE]">Human-in-the-loop validation breakdown</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-[#0B251C] border border-[#244637] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Expert Verified</span>
                <span className="text-[11px] text-[#A7B8AE]">Confirmed by ICAR-IIHR entomologists</span>
              </div>
              <span className="text-lg font-mono font-bold text-[#A3E635] tabular-nums">
                {expertReviewedCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B251C] border border-[#244637] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Pending Expert Review</span>
                <span className="text-[11px] text-[#A7B8AE]">Held in validation queue</span>
              </div>
              <span className="text-lg font-mono font-bold text-[#FBBF24] tabular-nums">
                {pendingCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B251C] border border-[#244637] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Close-Up Capture Requests</span>
                <span className="text-[11px] text-[#A7B8AE]">Ambiguous cues flagged for re-scout</span>
              </div>
              <span className="text-lg font-mono font-bold text-[#38BDF8] tabular-nums">
                {inspections.filter((i) => i.abstention_recommended).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Integrity Disclaimer (Section 12) */}
      <div className="bg-[#0B251C] border border-[#244637] rounded-2xl p-4 text-xs text-[#A7B8AE] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#A3E635] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Scientific Methodology Disclaimer:</strong> These charts reflect *observed damage trends* on sampled tomato leaflets, not real-time adult insect population census. Inferences follow the EPPO Global Database and ICAR-IIHR scouting guidelines. Unsampled plants remain strictly unknown.
        </p>
      </div>
    </div>
  );
};
