import React, { useState } from 'react';
import { LongitudinalRecord } from '../types/phyto';
import { TrendingUp, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LongitudinalTrackerProps {
  records: LongitudinalRecord[];
  plantId: string;
  rowId: string;
}

export const LongitudinalTracker: React.FC<LongitudinalTrackerProps> = ({
  records,
  plantId,
  rowId,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(records[records.length - 1]?.day || 12);
  const activeRecord = records.find((r) => r.day === selectedDay) || records[records.length - 1];

  // Maximum damage for scaling
  const maxDamage = Math.max(35, ...records.map((r) => r.damagePercent));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Intelligence Layer 05 · Longitudinal Monitoring
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
            Temporal Damage Progression Trend · {plantId} ({rowId})
          </h3>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>4 Inspections Recorded (12-Day Window)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Time-Series Chart */}
        <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Leaf Lamina Surface Loss (% of total area)</span>
            <span className="font-mono text-emerald-400 tabular-nums">
              Latest: {activeRecord.damagePercent.toFixed(1)}%
            </span>
          </div>

          <div className="relative h-44 w-full">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="170" x2="500" y2="170" stroke="#334155" strokeWidth="1" />

              {/* Grid labels */}
              <text x="5" y="26" fill="#64748B" fontSize="10" fontFamily="monospace">30%</text>
              <text x="5" y="76" fill="#64748B" fontSize="10" fontFamily="monospace">20%</text>
              <text x="5" y="126" fill="#64748B" fontSize="10" fontFamily="monospace">10%</text>

              {/* Economic Threshold line (15% damage) */}
              <line x1="0" y1="105" x2="500" y2="105" stroke="#F43F5E" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.6" />
              <text x="495" y="101" fill="#F43F5E" fontSize="9" textAnchor="end" fontFamily="monospace">
                ICAR IPM THRESHOLD (15%)
              </text>

              {/* Area fill under curve */}
              <polygon
                points={`
                  50,170
                  ${records
                    .map((r, i) => {
                      const x = 50 + i * 130;
                      const y = 170 - (r.damagePercent / 35) * 140;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  ${50 + (records.length - 1) * 130},170
                `}
                fill="url(#damageGradient)"
                opacity="0.25"
              />

              <defs>
                <linearGradient id="damageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Trend Polyline */}
              <polyline
                points={records
                  .map((r, i) => {
                    const x = 50 + i * 130;
                    const y = 170 - (r.damagePercent / 35) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {records.map((r, i) => {
                const x = 50 + i * 130;
                const y = 170 - (r.damagePercent / 35) * 140;
                const isSelected = r.day === selectedDay;

                return (
                  <g key={r.day} onClick={() => setSelectedDay(r.day)} className="cursor-pointer group">
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#10B981' : '#0F172A'}
                      stroke="#10B981"
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-transform group-hover:scale-125"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      fill={isSelected ? '#34D399' : '#94A3B8'}
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {r.damagePercent.toFixed(1)}%
                    </text>
                    <text
                      x={x}
                      y="178"
                      fill="#94A3B8"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      Day {r.day} ({r.date})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 border-t border-slate-800/60 pt-2">
            <span>Rate of expansion: +2.02% lamina / day</span>
            <span>Active Gallery Elongation: +4.6 mm / day</span>
          </div>
        </div>

        {/* Selected Day Inspection Snapshot Details */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">
                Day {activeRecord.day} Inspection Details
              </span>
              <span className="text-xs font-mono text-emerald-400">
                {activeRecord.date}, 2026
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Inspection Phase:</span>
                <span className="font-medium text-slate-200">{activeRecord.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Total Mines Identified:</span>
                <span className="font-mono text-slate-200">{activeRecord.mineCount} galleries</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Cumulative Path Length:</span>
                <span className="font-mono text-slate-200">{activeRecord.activeLengthMm} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Area Infested:</span>
                <span className="font-mono text-amber-400 font-semibold">{activeRecord.damagePercent}%</span>
              </div>
            </div>

            <div className="mt-3.5 bg-slate-900/90 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300">
              <span className="text-slate-500 font-mono block mb-1">SCOUT FIELD LOG:</span>
              <p>{activeRecord.notes}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5 justify-center">
              {records.map((r) => (
                <button
                  key={r.day}
                  onClick={() => setSelectedDay(r.day)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    r.day === selectedDay
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Day {r.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
