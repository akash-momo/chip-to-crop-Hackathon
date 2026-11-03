import React, { useState } from 'react';
import { PlantGridCell } from '../types/phyto';
import { Grid, Eye, AlertTriangle, ShieldCheck, MapPin, Search } from 'lucide-react';

interface FarmGridMapProps {
  grid: PlantGridCell[];
  selectedPlantId: string;
  onSelectPlant: (cell: PlantGridCell) => void;
  onInspectLeaf: () => void;
}

export const FarmGridMap: React.FC<FarmGridMapProps> = ({
  grid,
  selectedPlantId,
  onSelectPlant,
  onInspectLeaf,
}) => {
  const [filter, setFilter] = useState<'all' | 'mixed' | 'tuta' | 'liriomyza' | 'unsampled'>('all');
  const selectedCell = grid.find((c) => c.plantId === selectedPlantId) || grid[0];

  const filteredGrid = grid.filter((cell) => {
    if (filter === 'mixed') return cell.status === 'mixed_active';
    if (filter === 'tuta') return cell.status === 'tuta_active';
    if (filter === 'liriomyza') return cell.status === 'liriomyza_active';
    if (filter === 'unsampled') return cell.status === 'unsampled';
    return true;
  });

  const getStatusColor = (status: PlantGridCell['status']) => {
    switch (status) {
      case 'mixed_active':
        return 'bg-amber-500 text-slate-950 border-amber-400 hover:ring-2 hover:ring-amber-300';
      case 'tuta_active':
        return 'bg-amber-600 text-white border-amber-500 hover:ring-2 hover:ring-amber-400';
      case 'liriomyza_active':
        return 'bg-emerald-600 text-white border-emerald-500 hover:ring-2 hover:ring-emerald-400';
      case 'under_treatment':
        return 'bg-sky-600 text-white border-sky-500 hover:ring-2 hover:ring-sky-400';
      case 'unsampled':
        return 'bg-slate-800/80 text-slate-400 border-dashed border-slate-600 hover:border-slate-400';
      case 'healthy':
      default:
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800/70 hover:bg-emerald-900';
    }
  };

  // Group by rows (10 rows)
  const rows = Array.from(new Set(grid.map((c) => c.rowIndex))).sort((a, b) => a - b);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Intelligence Layer 06 · Farm-Level Spatial Matrix
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Greenhouse Block B Canopy Grid · 80 Trellised Plants
          </h3>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 flex-wrap text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All (80)
          </button>
          <button
            onClick={() => setFilter('mixed')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filter === 'mixed' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mixed Hotspots
          </button>
          <button
            onClick={() => setFilter('tuta')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filter === 'tuta' ? 'bg-amber-600/20 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tuta Only
          </button>
          <button
            onClick={() => setFilter('liriomyza')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filter === 'liriomyza' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Liriomyza
          </button>
          <button
            onClick={() => setFilter('unsampled')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filter === 'unsampled' ? 'bg-slate-700 text-slate-200 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unsampled Alert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spatial Grid Canvas (10 rows x 8 cols) */}
        <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span>Irrigation Head (South Bay)</span>
            <span className="font-mono text-slate-500 text-[11px]">Columns C-01 → C-08</span>
          </div>

          <div className="space-y-2">
            {rows.map((rowNum) => {
              const rowCells = grid.filter((c) => c.rowIndex === rowNum);
              return (
                <div key={rowNum} className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500 w-10 shrink-0">
                    R-{rowNum.toString().padStart(2, '0')}
                  </span>
                  <div className="grid grid-cols-8 gap-2 flex-1">
                    {rowCells.map((cell) => {
                      const isSelected = cell.plantId === selectedCell.plantId;
                      const isDimmed = filter !== 'all' && !filteredGrid.some((c) => c.plantId === cell.plantId);

                      return (
                        <button
                          key={cell.plantId}
                          onClick={() => onSelectPlant(cell)}
                          title={`${cell.plantId} · ${cell.status.replace('_', ' ')} · Risk: ${cell.riskScore}%`}
                          className={`h-9 rounded-md border text-[11px] font-mono font-medium transition-all flex flex-col items-center justify-center relative cursor-pointer ${getStatusColor(
                            cell.status
                          )} ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''} ${
                            isDimmed ? 'opacity-20' : 'opacity-100'
                          }`}
                        >
                          <span className="text-[10px] leading-tight">
                            {cell.plantId.replace('P-', '')}
                          </span>
                          {cell.damagePercent !== undefined && cell.damagePercent > 0 && (
                            <span className="text-[9px] opacity-90 tabular-nums">
                              {cell.damagePercent}%
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

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800" />
                Healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                Mixed Infestation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-600" />
                Tuta Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                Liriomyza
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-dashed border-slate-600" />
                Unsampled (Unknown)
              </span>
            </div>
            <span className="italic text-slate-500 font-sans">
              Rule: Unsampled plants remain strictly unknown (Page 6)
            </span>
          </div>
        </div>

        {/* Selected Plant Information & Scouting Dossier */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">
                  Plant {selectedCell.plantId} Dossier
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {selectedCell.rowId} · Col {selectedCell.colIndex}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Infestation Status:</span>
                <span className="font-semibold capitalize text-white">
                  {selectedCell.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Surface Damage:</span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {selectedCell.damagePercent !== undefined ? `${selectedCell.damagePercent}%` : 'Unmeasured'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Pest Dispersion Risk:</span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                  {selectedCell.riskScore} / 100
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Last Scouted:</span>
                <span className="font-mono text-slate-300">
                  {selectedCell.lastScoutedDate || 'Pending Initial Inspection'}
                </span>
              </div>
            </div>

            <div className="mt-4 bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
              <span className="font-mono text-[11px] text-slate-400 block mb-1">
                SPATIAL SCOUTING ADVICE:
              </span>
              <p className="leading-relaxed">
                {selectedCell.status === 'mixed_active'
                  ? 'High risk of cross-row migration. Prioritize pheromone traps at Row 7 and inspect immediate neighbor plants (P-041 and P-043).'
                  : selectedCell.status === 'unsampled'
                  ? 'Plant has not been sampled in the last 48 hours. ICAR protocol requires immediate visual scouting.'
                  : 'Infestation within baseline management limits. Continue scheduled bi-weekly checks.'}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={onInspectLeaf}
              className="w-full py-2.5 px-3 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Load Foliage into Evidence Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
