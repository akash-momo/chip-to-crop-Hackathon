import React, { useState } from 'react';
import {
  Layers,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Download,
  Share2,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Inspection, EvidenceRegion } from '../types/phyto2';

interface EvidenceMapViewProps {
  inspection: Inspection;
  onNavigateToFingerprint: () => void;
  onNavigateToReport: () => void;
  onRequestExpertReview?: () => void;
}

export const EvidenceMapView: React.FC<EvidenceMapViewProps> = ({
  inspection,
  onNavigateToFingerprint,
  onNavigateToReport,
  onRequestExpertReview,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    inspection.regions[0]?.id || null
  );

  // Layer switches
  const [showMasks, setShowMasks] = useState<boolean>(true);
  const [showVectorPaths, setShowVectorPaths] = useState<boolean>(true);
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);

  const selectedRegion =
    inspection.regions.find((r) => r.id === selectedRegionId) || inspection.regions[0] || null;

  const isMixed =
    inspection.overall_status === 'mixed_infestation' ||
    (inspection.regions.some((r) => r.region_type === 'tuta_consistent') &&
      inspection.regions.some((r) => r.region_type === 'liriomyza_consistent'));

  const getRegionStyle = (type: EvidenceRegion['region_type']) => {
    switch (type) {
      case 'tuta_consistent':
        return {
          stroke: '#A3E635', // Neon Lime
          fill: 'rgba(163, 230, 53, 0.28)',
          badgeBg: '#A3E635',
          badgeText: '#071C16',
          label: 'Tuta-consistent evidence',
          evidenceText: 'Broad, blotch-like mine morphology.',
        };
      case 'liriomyza_consistent':
        return {
          stroke: '#38BDF8', // Cyan
          fill: 'rgba(56, 189, 248, 0.28)',
          badgeBg: '#38BDF8',
          badgeText: '#071C16',
          label: 'Liriomyza-consistent evidence',
          evidenceText: 'Narrow, winding serpentine path.',
        };
      case 'uncertain':
      default:
        return {
          stroke: '#FBBF24', // Amber
          fill: 'rgba(251, 191, 36, 0.28)',
          badgeBg: '#FBBF24',
          badgeText: '#071C16',
          label: 'Uncertain evidence',
          evidenceText: 'Ambiguous cues: request close-up or expert review.',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Evidence Map Title & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#A7B8AE] mb-1">
            <span>EVIDENCE MAP VIEWER:</span>
            <span className="text-[#A3E635] font-bold">{inspection.plant_identifier}</span>
            <span>·</span>
            <span>{inspection.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mixed-Infestation Evidence Map
          </h1>
          <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1">
            Spatial localization of suspected leaf-mining galleries and morphological biomarkers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToFingerprint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#103D2B] hover:bg-[#164A35] text-white border border-[#244637] transition-colors flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>View Fingerprint</span>
          </button>
          <button
            onClick={onNavigateToReport}
            className="btn-neon px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Signature Mixed Infestation Banner & Disclaimer (Section 8) */}
      {isMixed ? (
        <div className="bg-[#103D2B] border-2 border-[#A3E635] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(163,230,53,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A3E635]/20 flex items-center justify-center text-[#A3E635] shrink-0 font-bold text-sm">
              MIX
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Possible mixed infestation detected.</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#A3E635] text-[#071C16]">
                  EVIDENCE FLAG
                </span>
              </h3>
              <p className="text-xs text-[#A7B8AE] mt-0.5">
                Possible mixed infestation is an evidence-based flag, not a confirmed diagnosis.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-[#BBF7D0] bg-[#071C16] px-3 py-1.5 rounded-lg border border-[#244637] whitespace-nowrap self-start sm:self-auto">
            Lamina Loss: {inspection.overall_damage_percent.toFixed(1)}%
          </div>
        </div>
      ) : (
        <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-4 flex items-center justify-between text-xs text-[#A7B8AE]">
          <span className="font-semibold text-white">
            Primary Evidence Category: <span className="text-[#A3E635]">{inspection.primary_diagnosis}</span>
          </span>
          <span className="italic text-[11px]">These are evidence categories, not definitive species diagnoses.</span>
        </div>
      )}

      {/* Main Canvas & Inspection Drawer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B251C] border border-[#244637] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* Canvas Toolbar */}
          <div className="px-4 py-3 bg-[#071C16] border-b border-[#244637] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A3E635]" />
              <span className="font-bold text-white">Specimen Stage</span>
              <span className="text-[#73877B]">|</span>
              <span className="font-mono text-[#A3E635] text-[11px]">
                {inspection.regions.length} Evidence Region{inspection.regions.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  showBoxes
                    ? 'bg-[#103D2B] text-[#A3E635] border border-[#A3E635]/40'
                    : 'text-[#A7B8AE] hover:text-white'
                }`}
              >
                Boundaries
              </button>
              <button
                onClick={() => setShowVectorPaths(!showVectorPaths)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  showVectorPaths
                    ? 'bg-[#103D2B] text-[#A3E635] border border-[#A3E635]/40'
                    : 'text-[#A7B8AE] hover:text-white'
                }`}
              >
                Gallery Vectors
              </button>
              <button
                onClick={() => setShowMasks(!showMasks)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  showMasks
                    ? 'bg-[#103D2B] text-[#A3E635] border border-[#A3E635]/40'
                    : 'text-[#A7B8AE] hover:text-white'
                }`}
              >
                Masks
              </button>
              <button
                onClick={() => setShowBadges(!showBadges)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  showBadges
                    ? 'bg-[#103D2B] text-[#A3E635] border border-[#A3E635]/40'
                    : 'text-[#A7B8AE] hover:text-white'
                }`}
              >
                Pins (A/B/C)
              </button>

              <div className="h-4 w-px bg-[#244637] mx-1 hidden sm:block" />

              <div className="flex items-center gap-1 bg-[#103D2B] px-1 py-0.5 rounded-lg border border-[#244637]">
                <button
                  onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))}
                  className="p-1 hover:text-white text-[#A7B8AE]"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[10px] text-[#A3E635] font-bold w-8 text-center tabular-nums">
                  {(zoom * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                  className="p-1 hover:text-white text-[#A7B8AE]"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Leaf Stage */}
          <div className="relative aspect-[4/3] bg-black overflow-hidden select-none flex items-center justify-center">
            <div
              className="relative w-full h-full transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              <img
                src={inspection.image_path}
                alt={inspection.plant_identifier}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* SVG Overlays */}
              <svg
                viewBox="0 0 1000 1000"
                className="absolute inset-0 w-full h-full pointer-events-auto"
                preserveAspectRatio="none"
              >
                {inspection.regions.map((region) => {
                  const style = getRegionStyle(region.region_type);
                  const isSelected = selectedRegion?.id === region.id;
                  const { ymin, xmin, ymax, xmax } = region.bounding_coordinates;
                  const width = xmax - xmin;
                  const height = ymax - ymin;
                  const cx = xmin + width / 2;
                  const cy = ymin + height / 2;

                  return (
                    <g
                      key={region.id}
                      onClick={() => setSelectedRegionId(region.id)}
                      className="cursor-pointer group"
                    >
                      {/* Mask Rectangle */}
                      {showMasks && (
                        <rect
                          x={xmin}
                          y={ymin}
                          width={width}
                          height={height}
                          rx="16"
                          fill={style.fill}
                          stroke={style.stroke}
                          strokeWidth={isSelected ? '3.5' : '1.5'}
                          strokeDasharray={region.region_type === 'uncertain' ? '6 4' : 'none'}
                          className="transition-all duration-200 group-hover:opacity-95"
                        />
                      )}

                      {/* Vector Gallery Tracing */}
                      {showVectorPaths && (
                        <>
                          {region.gallery_type === 'serpentine' && (
                            <path
                              d={`M ${xmin + 20} ${ymin + height * 0.3} 
                                 Q ${xmin + width * 0.3} ${ymin + 10}, ${xmin + width * 0.5} ${ymin + height * 0.4} 
                                 T ${xmax - 30} ${ymin + height * 0.2}
                                 Q ${xmax - 10} ${ymin + height * 0.6}, ${xmin + width * 0.7} ${ymin + height * 0.75}
                                 T ${xmin + 40} ${ymax - 20}`}
                              fill="none"
                              stroke={style.stroke}
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                          )}

                          {region.gallery_type === 'blotch' && (
                            <ellipse
                              cx={cx}
                              cy={cy}
                              rx={width * 0.42}
                              ry={height * 0.38}
                              fill="none"
                              stroke={style.stroke}
                              strokeWidth="3"
                              strokeDasharray="4 2"
                            />
                          )}

                          {region.gallery_type === 'indeterminate' && (
                            <path
                              d={`M ${xmin + 20} ${ymin + 30} 
                                 C ${xmin + width * 0.4} ${ymin + 10}, ${xmax - 20} ${ymin + 40}, ${xmax - 20} ${cy}
                                 C ${xmax - 10} ${ymax - 20}, ${xmin + width * 0.6} ${ymax - 10}, ${xmin + 20} ${ymax - 30}
                                 Z`}
                              fill="none"
                              stroke="#FBBF24"
                              strokeWidth="2.5"
                              strokeDasharray="5 3"
                            />
                          )}
                        </>
                      )}

                      {/* Boundary Box */}
                      {showBoxes && (
                        <rect
                          x={xmin - 3}
                          y={ymin - 3}
                          width={width + 6}
                          height={height + 6}
                          fill="none"
                          stroke={isSelected ? '#FFFFFF' : style.stroke}
                          strokeWidth={isSelected ? '2' : '1'}
                          strokeDasharray="4 4"
                        />
                      )}

                      {/* Pin Badge A/B/C */}
                      {showBadges && (
                        <g transform={`translate(${xmin + 18}, ${ymin + 18})`}>
                          <circle
                            r="15"
                            fill={style.badgeBg}
                            stroke="#071C16"
                            strokeWidth="2.5"
                            className="transition-transform group-hover:scale-115"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={style.badgeText}
                            fontSize="13"
                            fontWeight="900"
                            fontFamily="monospace"
                          >
                            {region.badge}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Bottom Bar Disclaimer */}
          <div className="p-3 bg-[#071C16] border-t border-[#244637] flex flex-wrap items-center justify-between gap-3 text-xs text-[#A7B8AE]">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
                A · Tuta-consistent (Lime)
              </span>
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                B · Liriomyza-consistent (Cyan)
              </span>
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                C · Uncertain evidence (Amber)
              </span>
            </div>
            <span className="text-[11px] text-[#73877B] italic">
              Overlays show where evidence sits, not why the model decided.
            </span>
          </div>
        </div>

        {/* Region Information Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#103D2B] border border-[#244637] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#244637] pb-3">
              <h3 className="text-sm font-bold text-white">Region Evidence Breakdown</h3>
              <span className="text-xs font-mono text-[#A3E635]">
                {inspection.regions.length} Regions
              </span>
            </div>

            {/* Individual Region Cards */}
            <div className="space-y-3">
              {inspection.regions.map((reg) => {
                const style = getRegionStyle(reg.region_type);
                const isSelected = selectedRegion?.id === reg.id;
                return (
                  <div
                    key={reg.id}
                    onClick={() => setSelectedRegionId(reg.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#164A35] border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.15)]'
                        : 'bg-[#0B251C] border-[#244637] hover:border-[#73877B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black font-mono"
                          style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
                        >
                          {reg.badge}
                        </span>
                        <span className="font-bold text-white text-xs">REGION {reg.badge}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#BBF7D0] tabular-nums">
                        {(reg.confidence * 100).toFixed(1)}% Conf
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-semibold block" style={{ color: style.stroke }}>
                        {style.label}
                      </span>
                      <p className="text-[#A7B8AE] leading-relaxed text-[11px]">
                        {reg.evidence_description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#244637] flex items-center justify-between text-[10px] text-[#73877B] font-mono">
                      <span>Area: {reg.area_mm2.toFixed(1)} mm²</span>
                      <span>Type: {reg.gallery_type}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Plain-Language Directive Card */}
            <div className="bg-[#0B251C] border border-[#244637] rounded-2xl p-4 text-xs space-y-2">
              <span className="font-bold text-[#A3E635] uppercase tracking-wider text-[10px] block font-mono">
                Plain-Language Action Recommendation
              </span>
              <p className="text-white leading-relaxed font-medium">
                {inspection.plain_language_summary.recommended_next_step}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
