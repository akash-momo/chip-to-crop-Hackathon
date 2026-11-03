import React from 'react';
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  Sprout,
  ArrowRight,
  TrendingUp,
  Scan,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Volume2,
  Calculator,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { DashboardOverviewData, Inspection } from '../types/phyto2';
import { GreenhouseClimateWidget } from './GreenhouseClimateWidget';

interface OverviewViewProps {
  overviewData: DashboardOverviewData;
  onSelectInspection: (inspection: Inspection) => void;
  onNavigateTab: (tab: string) => void;
  userName: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  overviewData,
  onSelectInspection,
  onNavigateTab,
  userName,
}) => {
  const {
    totalInspections,
    plantsMonitored,
    suspectedCases,
    pendingReviews,
    evidenceDistribution,
    recentInspections,
    activeFarm,
  } = overviewData;

  const getStatusBadge = (status: Inspection['overall_status']) => {
    switch (status) {
      case 'mixed_infestation':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/50">Mixed Infestation</span>;
      case 'tuta_absoluta':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/50">Tuta absoluta</span>;
      case 'liriomyza_spp':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50">Liriomyza spp.</span>;
      case 'healthy':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">Healthy Leaf</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/50">Uncertain</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Heading & Direct Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase text-[#A3E635] font-bold tracking-wider block mb-1">
            PHYTO INTELLIGENCE CONSOLE · 2.0
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Namaskara, {userName.split(' ')[0]}.
          </h1>
          <p className="text-sm text-[#A7B8AE] mt-1">
            Real-time crop intelligence & scouting diagnostics for {activeFarm.farm_name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('scanner')}
            className="btn-neon px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-lg"
          >
            <Scan className="w-4 h-4" />
            <span>Analyze New Leaf</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards (Tactile Neumorphic dark cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neuro-card neuro-card-hover rounded-2xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A7B8AE] mb-2">
            <span className="text-xs font-semibold">Total Inspections</span>
            <div className="w-7 h-7 rounded-lg bg-[#A3E635]/15 flex items-center justify-center text-[#A3E635]">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalInspections}
          </div>
          <span className="text-[11px] text-[#A7B8AE] mt-2">Logged in digital ledger</span>
        </div>

        <div className="neuro-card neuro-card-hover rounded-2xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A7B8AE] mb-2">
            <span className="text-xs font-semibold">Plants Monitored</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {plantsMonitored} <span className="text-xs text-[#73877B] font-normal">/ 80</span>
          </div>
          <span className="text-[11px] text-[#A7B8AE] mt-2">Greenhouse Block B</span>
        </div>

        <div className="neuro-card neuro-card-hover rounded-2xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A7B8AE] mb-2">
            <span className="text-xs font-semibold">Suspected Infestations</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-[#FBBF24]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#FBBF24] font-mono tabular-nums">
            {suspectedCases}
          </div>
          <span className="text-[11px] text-[#A7B8AE] mt-2">Requiring IPM protocol</span>
        </div>

        <div className="neuro-card neuro-card-hover rounded-2xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A7B8AE] mb-2">
            <span className="text-xs font-semibold">Pending Expert Reviews</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center text-[#38BDF8]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#38BDF8] font-mono tabular-nums">
            {pendingReviews}
          </div>
          <span className="text-[11px] text-[#A7B8AE] mt-2">Held for entomologist review</span>
        </div>
      </div>

      {/* Live Greenhouse Microclimate & Egg Incubation Forecast Widget */}
      <GreenhouseClimateWidget />

      {/* Main 2-Column Split: Recent Inspections & Evidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Inspections Table */}
        <div className="lg:col-span-8 neuro-card rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#244637] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Recent Leaf Inspections</h3>
                <span className="text-[11px] text-[#A7B8AE]">Latest verified entries from field scouting</span>
              </div>
              <button
                onClick={() => onNavigateTab('history')}
                className="text-xs font-bold text-[#A3E635] hover:underline flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentInspections.map((insp) => (
                <div
                  key={insp.id}
                  onClick={() => {
                    onSelectInspection(insp);
                    onNavigateTab('evidence');
                  }}
                  className="p-3 rounded-2xl bg-[#0B251C] hover:bg-[#164A35] border border-[#244637] hover:border-[#A3E635]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={insp.image_path}
                      alt={insp.plant_identifier}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#244637] group-hover:border-[#A3E635] transition-colors"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-[#A3E635] transition-colors">
                          {insp.plant_identifier}
                        </span>
                        <span className="text-[11px] font-mono text-[#73877B]">{insp.id}</span>
                      </div>
                      <span className="text-xs text-[#A7B8AE] block truncate">{insp.primary_diagnosis}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {getStatusBadge(insp.overall_status)}
                    <span className="text-xs font-mono font-bold text-[#F8FAFC] tabular-nums hidden sm:inline">
                      {insp.overall_damage_percent.toFixed(1)}% DMG
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#73877B] group-hover:text-[#A3E635] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#244637] flex items-center justify-between text-xs text-[#73877B]">
            <span>Click any inspection to view Mixed-Infestation Evidence Map & Audio</span>
            <span className="font-mono text-[#A3E635]">DATABASE IN SYNC</span>
          </div>
        </div>

        {/* Right: Infestation Evidence Distribution & Quick Action Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="neuro-card rounded-3xl p-5">
            <h3 className="text-sm font-bold text-white mb-1">Evidence Distribution</h3>
            <span className="text-[11px] text-[#A7B8AE] block mb-4">Breakdown across verified records</span>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-[#A7B8AE] mb-1">
                  <span>Mixed Infestation (Tuta + Liriomyza)</span>
                  <span className="font-mono text-[#A3E635] font-bold">{evidenceDistribution.mixed}</span>
                </div>
                <div className="w-full bg-[#071C16] h-2.5 rounded-full overflow-hidden neuro-inset">
                  <div
                    className="bg-[#A3E635] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(evidenceDistribution.mixed / Math.max(1, totalInspections)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#A7B8AE] mb-1">
                  <span>Tuta absoluta Dominant</span>
                  <span className="font-mono text-[#FBBF24] font-bold">{evidenceDistribution.tuta}</span>
                </div>
                <div className="w-full bg-[#071C16] h-2.5 rounded-full overflow-hidden neuro-inset">
                  <div
                    className="bg-[#FBBF24] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(evidenceDistribution.tuta / Math.max(1, totalInspections)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#A7B8AE] mb-1">
                  <span>Liriomyza spp. Dominant</span>
                  <span className="font-mono text-[#38BDF8] font-bold">{evidenceDistribution.liriomyza}</span>
                </div>
                <div className="w-full bg-[#071C16] h-2.5 rounded-full overflow-hidden neuro-inset">
                  <div
                    className="bg-[#38BDF8] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(evidenceDistribution.liriomyza / Math.max(1, totalInspections)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#A7B8AE] mb-1">
                  <span>Healthy Control Leaves</span>
                  <span className="font-mono text-emerald-400 font-bold">{evidenceDistribution.healthy}</span>
                </div>
                <div className="w-full bg-[#071C16] h-2.5 rounded-full overflow-hidden neuro-inset">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(evidenceDistribution.healthy / Math.max(1, totalInspections)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Scouting Action */}
          <div className="neuro-card rounded-3xl p-5 space-y-3 border border-[#A3E635]/30">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A3E635]">
              <ShieldCheck className="w-4 h-4" />
              <span>Scout Priority Advice</span>
            </div>
            <p className="text-xs text-[#F8FAFC] leading-relaxed">
              Row 07 has 3 plants flagged with active mixed mines. Prioritize delta trap checks and avoid spraying broad spectrum chemicals.
            </p>
            <button
              onClick={() => onNavigateTab('plants')}
              className="w-full py-2.5 px-3 neuro-btn text-xs font-bold text-[#BBF7D0] rounded-xl transition-colors text-center cursor-pointer"
            >
              Open Greenhouse Plant Grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
