import React, { useState, useRef } from 'react';
import { RegionEvidence } from '../types/phyto';
import { Layers, Crosshair, ZoomIn, ZoomOut, RotateCcw, Info, Sparkles, Eye } from 'lucide-react';

interface LeafEvidenceCanvasProps {
  imageSrc: string;
  regions: RegionEvidence[];
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
  leafDamagePercent: number;
}

export const LeafEvidenceCanvas: React.FC<LeafEvidenceCanvasProps> = ({
  imageSrc,
  regions,
  selectedRegionId,
  onSelectRegion,
  leafDamagePercent,
}) => {
  // Layer visibility toggles
  const [showMasks, setShowMasks] = useState<boolean>(true);
  const [showVectorPaths, setShowVectorPaths] = useState<boolean>(true);
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [probeCoords, setProbeCoords] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000);
    setProbeCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setProbeCoords(null);
  };

  const getRegionColor = (type: string) => {
    switch (type) {
      case 'tuta_consistent':
        return {
          stroke: '#F59E0B', // Punchy Gold
          fill: 'rgba(245, 158, 11, 0.35)',
          badgeBg: '#F59E0B',
          badgeText: '#000000',
          glow: 'rgba(245, 158, 11, 0.6)',
          label: 'Tuta-consistent',
        };
      case 'liriomyza_consistent':
        return {
          stroke: '#10B981', // Punchy Emerald
          fill: 'rgba(16, 185, 129, 0.35)',
          badgeBg: '#10B981',
          badgeText: '#000000',
          glow: 'rgba(16, 185, 129, 0.6)',
          label: 'Liriomyza-consistent',
        };
      case 'uncertain':
      default:
        return {
          stroke: '#F43F5E', // Punchy Rose
          fill: 'rgba(244, 63, 94, 0.35)',
          badgeBg: '#F43F5E',
          badgeText: '#FFFFFF',
          glow: 'rgba(244, 63, 94, 0.6)',
          label: 'Uncertain evidence',
        };
    }
  };

  return (
    <div className="neuro-card rounded-2xl overflow-hidden flex flex-col">
      {/* Top Canvas Controls Bar (Neumorphic tactile strip) */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs sm:text-sm">
            Explainable Evidence Map
          </span>
          <span className="text-slate-500 font-mono">·</span>
          <span className="text-emerald-400 font-mono font-semibold">
            {regions.length} Localized {regions.length === 1 ? 'Region' : 'Regions'}
          </span>
        </div>

        {/* Tactile Layer Switches */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              showBoxes
                ? 'neuro-btn-emerald text-slate-950'
                : 'neuro-btn text-slate-400 hover:text-white'
            }`}
          >
            Boxes
          </button>
          <button
            onClick={() => setShowVectorPaths(!showVectorPaths)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              showVectorPaths
                ? 'neuro-btn-emerald text-slate-950'
                : 'neuro-btn text-slate-400 hover:text-white'
            }`}
          >
            Mine Vectors
          </button>
          <button
            onClick={() => setShowMasks(!showMasks)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              showMasks
                ? 'neuro-btn-emerald text-slate-950'
                : 'neuro-btn text-slate-400 hover:text-white'
            }`}
          >
            Damage Masks
          </button>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              showHeatmap
                ? 'neuro-btn-amber text-slate-950 font-bold'
                : 'neuro-btn text-slate-400 hover:text-white'
            }`}
          >
            Chlorophyll Heatmap
          </button>
          <button
            onClick={() => setShowBadges(!showBadges)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              showBadges
                ? 'neuro-btn-emerald text-slate-950'
                : 'neuro-btn text-slate-400 hover:text-white'
            }`}
          >
            Pins (A/B/C)
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 neuro-inset p-1 rounded-xl">
            <button
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
              title="Zoom In"
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-emerald-400 font-bold w-10 text-center tabular-nums">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              title="Zoom Out"
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoom > 1 && (
              <button
                onClick={() => setZoom(1)}
                title="Reset Zoom"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-0.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Stage Viewport with Neumorphic Inset Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[4/3] bg-black overflow-hidden cursor-crosshair select-none flex items-center justify-center border-y border-slate-900"
      >
        <div
          className="relative w-full h-full transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Base Photographic Specimen Image */}
          <img
            src={imageSrc}
            alt="Tomato Leaf Specimen Inspection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Chlorophyll Heatmap Simulation Layer (When Toggled) */}
          {showHeatmap && (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/40 via-amber-500/30 to-rose-600/40 mix-blend-color-burn pointer-events-none" />
          )}

          {/* SVG Overlay Stage for Regions, Polygons, and Vector Gallery Paths */}
          <svg
            viewBox="0 0 1000 1000"
            className="absolute inset-0 w-full h-full pointer-events-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="uncertainHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="12" stroke="#F43F5E" strokeWidth="2.5" strokeOpacity="0.5" />
              </pattern>
              <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.8" />
              </filter>
              <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10B981" floodOpacity="0.8" />
              </filter>
            </defs>

            {regions.map((region) => {
              const colors = getRegionColor(region.evidenceType);
              const isSelected = selectedRegionId === region.id;
              const { ymin, xmin, ymax, xmax } = region.box;
              const width = xmax - xmin;
              const height = ymax - ymin;
              const cx = xmin + width / 2;
              const cy = ymin + height / 2;

              return (
                <g
                  key={region.id}
                  onClick={() => onSelectRegion(region.id)}
                  className="cursor-pointer group"
                >
                  {/* Pixel Mask / Polygon Area */}
                  {showMasks && (
                    <rect
                      x={xmin}
                      y={ymin}
                      width={width}
                      height={height}
                      rx="18"
                      fill={region.evidenceType === 'uncertain' ? 'url(#uncertainHatch)' : colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isSelected ? '4' : '2'}
                      strokeDasharray={region.evidenceType === 'uncertain' ? '8 5' : 'none'}
                      className="transition-all duration-200 group-hover:opacity-100"
                    />
                  )}

                  {/* Vector Gallery Tracing (Slide 5: Blotch vs Serpentine spline) */}
                  {showVectorPaths && (
                    <>
                      {region.galleryType === 'serpentine' && (
                        // Serpentine meandering trajectory path (vibrant emerald with glow)
                        <path
                          d={`M ${xmin + 20} ${ymin + height * 0.3} 
                             Q ${xmin + width * 0.3} ${ymin + 10}, ${xmin + width * 0.5} ${ymin + height * 0.4} 
                             T ${xmax - 30} ${ymin + height * 0.2}
                             Q ${xmax - 10} ${ymin + height * 0.6}, ${xmin + width * 0.7} ${ymin + height * 0.75}
                             T ${xmin + 40} ${ymax - 20}`}
                          fill="none"
                          stroke={colors.stroke}
                          strokeWidth="4"
                          strokeLinecap="round"
                          filter={isSelected ? 'url(#glowEmerald)' : undefined}
                          className="opacity-95"
                        />
                      )}

                      {region.galleryType === 'blotch' && (
                        // Irregular blotch contour
                        <ellipse
                          cx={cx}
                          cy={cy}
                          rx={width * 0.42}
                          ry={height * 0.38}
                          fill="none"
                          stroke={colors.stroke}
                          strokeWidth="3.5"
                          strokeDasharray="5 3"
                          filter={isSelected ? 'url(#glowGold)' : undefined}
                          className="opacity-90"
                        />
                      )}

                      {region.galleryType === 'indeterminate' && (
                        // Uncertain overlapping contour
                        <path
                          d={`M ${xmin + 20} ${ymin + 30} 
                             C ${xmin + width * 0.4} ${ymin + 10}, ${xmax - 20} ${ymin + 40}, ${xmax - 20} ${cy}
                             C ${xmax - 10} ${ymax - 20}, ${xmin + width * 0.6} ${ymax - 10}, ${xmin + 20} ${ymax - 30}
                             Z`}
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="3"
                          strokeDasharray="6 4"
                        />
                      )}
                    </>
                  )}

                  {/* Bounding Box Outline */}
                  {showBoxes && (
                    <rect
                      x={xmin - 4}
                      y={ymin - 4}
                      width={width + 8}
                      height={height + 8}
                      fill="none"
                      stroke={isSelected ? '#FFFFFF' : colors.stroke}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      strokeOpacity={isSelected ? 1 : 0.7}
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* High-Impact Pin / Badge (A, B, C matching Page 5 schematic) */}
                  {showBadges && (
                    <g transform={`translate(${xmin + 20}, ${ymin + 20})`}>
                      <circle
                        r="16"
                        fill={colors.badgeBg}
                        stroke="#000000"
                        strokeWidth="2.5"
                        className="transition-transform group-hover:scale-125"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={colors.badgeText}
                        fontSize="14"
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

        {/* Live Coordinate & Spectral Crosshair Probe HUD (Bottom-Right) */}
        <div className="absolute bottom-3 right-3 neuro-card px-3.5 py-2 rounded-xl text-[11px] font-mono text-slate-200 pointer-events-none flex items-center gap-3 border border-slate-700/80 shadow-xl">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Crosshair className="w-3.5 h-3.5 animate-spin" />
            <span className="font-bold">PROBE:</span>
          </div>
          {probeCoords ? (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold tabular-nums">X: {probeCoords.x}</span>
              <span className="text-emerald-400 font-bold tabular-nums">Y: {probeCoords.y}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-200">Lamina ROI</span>
            </div>
          ) : (
            <span className="text-slate-400">Hover canvas to inspect</span>
          )}
        </div>

        {/* Damage Severity Watermark / Overlay Stat (Top-Left) */}
        <div className="absolute top-3 left-3 neuro-card px-3.5 py-2 rounded-xl text-[11px] text-slate-200 pointer-events-none flex items-center gap-2 border border-slate-700/80 shadow-xl">
          <span className="text-slate-400 font-medium">Surface Infestation:</span>
          <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
            {leafDamagePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Bottom Sub-Legend with Tactile Neumorphic Buttons (Slide 5 quotes) */}
      <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0" />
            <span className="font-bold">A · Tuta-consistent</span>
            <span className="text-slate-400 text-[11px]">(Broad, blotch-like)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
            <span className="font-bold">B · Liriomyza-consistent</span>
            <span className="text-slate-400 text-[11px]">(Narrow, winding serpentine)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] shrink-0" />
            <span className="font-bold">C · Uncertain evidence</span>
            <span className="text-slate-400 text-[11px]">(Ambiguous cues: request close-up)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 italic flex items-center gap-1.5 font-sans">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Tap pins A, B, or C on canvas to view fine morphological biomarkers.</span>
        </div>
      </div>
    </div>
  );
};
