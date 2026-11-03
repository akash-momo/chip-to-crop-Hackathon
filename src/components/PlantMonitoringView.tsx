import React, { useState } from 'react';
import {
  Grid,
  Filter,
  Eye,
  Scan,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Clock,
  MapPin,
  ArrowRight,
  Sprout,
} from 'lucide-react';
import { Plant, Inspection } from '../types/phyto2';

interface PlantMonitoringViewProps {
  plants: Plant[];
  onSelectPlantToInspect: (plant: Plant) => void;
  onOpenEvidenceForPlant: (plantIdentifier: string) => void;
}

export const PlantMonitoringView: React.FC<PlantMonitoringViewProps> = ({
  plants,
  onSelectPlantToInspect,
  onOpenEvidenceForPlant,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPlant, setSelectedPlant] = useState<Plant>(plants[0]);

  const filteredPlants = plants.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: Plant['status']) => {
    switch (status) {
      case 'evidence_detected':
        return {
          label: 'Evidence Detected',
          color: 'bg-[#A3E635] text-[#071C16] border-[#A3E635]',
          badgeText: 'text-[#A3E635]',
        };
      case 'needs_review':
        return {
          label: 'Needs Review',
          color: 'bg-[#FBBF24] text-[#071C16] border-[#FBBF24]',
          badgeText: 'text-[#FBBF24]',
        };
      case 'recently_inspected':
        return {
          label: 'Recently Inspected',
          color: 'bg-[#34D399] text-[#071C16] border-[#34D399]',
          badgeText: 'text-[#34D399]',
        };
      case 'not_inspected':
      default:
        return {
          label: 'Unsampled (Unknown)',
          color: 'bg-[#103D2B] text-[#73877B] border-[#244637] border-dashed',
          badgeText: 'text-[#73877B]',
        };
    }
  };

  const rows = Array.from(new Set(plants.map((p) => p.row_identifier))).sort();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-1">
            LAYER 06 · FARM-LEVEL INTELLIGENCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Greenhouse Plant Canopy Grid
          </h1>
          <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1">
            Block B · 80 Trellised Plants · 10 Rows × 8 Columns
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-[#103D2B] rounded-xl border border-[#244637] text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              statusFilter === 'all' ? 'btn-neon' : 'text-[#A7B8AE] hover:text-white'
            }`}
          >
            All (80)
          </button>
          <button
            onClick={() => setStatusFilter('evidence_detected')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              statusFilter === 'evidence_detected' ? 'btn-neon' : 'text-[#A7B8AE] hover:text-white'
            }`}
          >
            Evidence (3)
          </button>
          <button
            onClick={() => setStatusFilter('needs_review')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              statusFilter === 'needs_review' ? 'btn-neon' : 'text-[#A7B8AE] hover:text-white'
            }`}
          >
            Needs Review (2)
          </button>
          <button
            onClick={() => setStatusFilter('not_inspected')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              statusFilter === 'not_inspected' ? 'btn-neon' : 'text-[#A7B8AE] hover:text-white'
            }`}
          >
            Unsampled Unknown
          </button>
        </div>
      </div>

      {/* Grid Canvas + Plant Dossier Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Spatial Grid Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#103D2B] border border-[#244637] rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-[#A7B8AE] mb-3">
            <span className="font-semibold text-white">Canopy North Axis</span>
            <span className="font-mono text-[11px] text-[#A3E635]">C-01 through C-08</span>
          </div>

          <div className="space-y-2">
            {rows.map((rowId) => {
              const rowPlants = plants.filter((p) => p.row_identifier === rowId);
              return (
                <div key={rowId} className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#73877B] w-10 shrink-0 font-bold">
                    {rowId}
                  </span>
                  <div className="grid grid-cols-8 gap-2 flex-1">
                    {rowPlants.map((plant) => {
                      const isSelected = selectedPlant.id === plant.id;
                      const status = getStatusBadge(plant.status);
                      const isDimmed =
                        statusFilter !== 'all' &&
                        !filteredPlants.some((fp) => fp.id === plant.id);

                      return (
                        <button
                          key={plant.id}
                          onClick={() => setSelectedPlant(plant)}
                          className={`h-9 rounded-xl border text-[11px] font-mono font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                            status.color
                          } ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''} ${
                            isDimmed ? 'opacity-20' : 'opacity-100'
                          }`}
                          title={`${plant.plant_identifier} · ${status.label}`}
                        >
                          <span className="text-[10px] leading-tight">
                            {plant.plant_identifier.replace('P-', '')}
                          </span>
                          {plant.latest_damage_percent !== undefined && (
                            <span className="text-[9px] font-normal tabular-nums">
                              {plant.latest_damage_percent}%
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scientific Disclaimer (Page 6 & Section 10) */}
          <div className="mt-4 pt-3 border-t border-[#244637] flex flex-wrap items-center justify-between gap-3 text-xs text-[#A7B8AE]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#A3E635]" />
                Evidence Detected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FBBF24]" />
                Needs Review
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#34D399]" />
                Recently Inspected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#103D2B] border border-dashed border-[#244637]" />
                Unsampled (Unknown)
              </span>
            </div>

            <span className="text-[11px] text-[#A3E635] font-mono italic">
              Scientific Rule: Unsampled plants remain strictly unknown.
            </span>
          </div>
        </div>

        {/* Selected Plant Dossier (4 cols) */}
        <div className="lg:col-span-4 bg-[#103D2B] border border-[#244637] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#244637] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A3E635] font-bold block">
                PLANT DOSSIER
              </span>
              <h3 className="text-base font-bold text-white">
                Plant {selectedPlant.plant_identifier}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#A7B8AE]">
              {selectedPlant.row_identifier} · Col {selectedPlant.col_identifier}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#244637]">
              <span className="text-[#A7B8AE]">Inspection Status:</span>
              <span className="font-bold text-white capitalize">
                {selectedPlant.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#244637]">
              <span className="text-[#A7B8AE]">Latest Lamina Damage:</span>
              <span className="font-mono font-bold text-[#A3E635] tabular-nums">
                {selectedPlant.latest_damage_percent !== undefined
                  ? `${selectedPlant.latest_damage_percent.toFixed(1)}%`
                  : 'Unsampled'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#244637]">
              <span className="text-[#A7B8AE]">Last Scout Date:</span>
              <span className="font-mono text-white">
                {selectedPlant.last_inspected_at
                  ? new Date(selectedPlant.last_inspected_at).toLocaleDateString()
                  : 'No Records'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#244637]">
              <span className="text-[#A7B8AE]">Planting Date:</span>
              <span className="font-mono text-white">{selectedPlant.planting_date}</span>
            </div>
          </div>

          <div className="bg-[#0B251C] p-3.5 rounded-2xl border border-[#244637] text-xs text-[#A7B8AE] space-y-1">
            <span className="text-white font-bold block">Scouting Directive:</span>
            <p className="leading-relaxed text-[11px]">
              {selectedPlant.status === 'evidence_detected'
                ? 'Active leaf-miner damage flagged. Inspect adjacent leaves and check Qlure-TUA traps.'
                : selectedPlant.status === 'not_inspected'
                ? 'Sample has not been scouted within the last 48 hours. Recommended for immediate camera inspection.'
                : 'Foliage appears within baseline parameters. Maintain scheduled sampling.'}
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => onSelectPlantToInspect(selectedPlant)}
              className="btn-neon w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Capture New Leaf for this Plant</span>
            </button>

            {selectedPlant.status !== 'not_inspected' && (
              <button
                onClick={() => onOpenEvidenceForPlant(selectedPlant.plant_identifier)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#164A35] hover:bg-[#103D2B] text-white border border-[#244637] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#A3E635]" />
                <span>View Latest Evidence Map</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
