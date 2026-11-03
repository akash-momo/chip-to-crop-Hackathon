import React, { useState, useRef } from 'react';
import { RegionEvidence } from '../types/phyto';
import { Layers, Crosshair, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

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
          stroke: '#F59E0B', // Amber
          fill: 'rgba(245, 158, 11, 0.28)',
          badgeBg: '#F59E0B',
          badgeText: '#0F172A',
          label: 'Tuta-consistent',
        };
      case 'liriomyza_consistent':
        return {
          stroke: '#10B981', // Emerald
          fill: 'rgba(16, 185, 129, 0.28)',
          badgeBg: '#10B981',
          badgeText: '#0F172A',
          label: 'Liriomyza-consistent',
        };
      case 'uncertain':
      default:
        return {
          stroke: '#F43F5E', // Rose
          fill: 'rgba(244, 63, 94, 0.28)',
          badgeBg: '#F43F5E',
          badgeText: '#FFFFFF',
          label: 'Uncertain evidence',
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Top Canvas Controls Bar */}
      <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-200">Interactive Evidence Map</span>
          <span className="text-slate-500 font-mono">·</span>
          <span className="text-slate-400">
            {regions.length} Damage {regions.length === 1 ? 'Region' : 'Regions'} Localized
          </span>
        </div>

        {/* Layer Switches */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showBoxes
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'bg-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Boundaries
          </button>
          <button
            onClick={() => setShowVectorPaths(!showVectorPaths)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showVectorPaths
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'bg-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Gallery Vectors
          </button>
          <button
            onClick={() => setShowMasks(!showMasks)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showMasks
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'bg-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Pixel Masks
          </button>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showHeatmap
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                : 'bg-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Chlorophyll Heatmap
          </button>
          <button
            onClick={() => setShowBadges(!showBadges)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showBadges
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'bg-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Pins (A/B/C)
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))}
              title="Zoom In"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-400 w-8 text-center tabular-nums">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              title="Zoom Out"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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

      {/* Main Stage Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden cursor-crosshair select-none flex items-center justify-center"
      >
        <div
          className="relative w-full h-full transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Base Photographic Image */}
          <img
            src={imageSrc}
            alt="Tomato Leaf Specimen Inspection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Chlorophyll Heatmap Simulation Layer (When Toggled) */}
          {showHeatmap && (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 via-amber-500/25 to-rose-600/30 mix-blend-color-burn pointer-events-none" />
          )}

          {/* SVG Overlay Stage for Regions, Polygons, and Vector Gallery Paths */}
          <svg
            viewBox="0 0 1000 1000"
            className="absolute inset-0 w-full h-full pointer-events-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="uncertainHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#F43F5E" strokeWidth="2" strokeOpacity="0.4" />
              </pattern>
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
                      rx="16"
                      fill={region.evidenceType === 'uncertain' ? 'url(#uncertainHatch)' : colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isSelected ? '3.5' : '1.5'}
                      strokeDasharray={region.evidenceType === 'uncertain' ? '6 4' : 'none'}
                      className="transition-all duration-200 group-hover:opacity-90"
                    />
                  )}

                  {/* Vector Gallery Tracing (Slide 5: Blotch vs Serpentine spline) */}
                  {showVectorPaths && (
                    <>
                      {region.galleryType === 'serpentine' && (
                        // Serpentine meandering trajectory path
                        <path
                          d={`M ${xmin + 20} ${ymin + height * 0.3} 
                             Q ${xmin + width * 0.3} ${ymin + 10}, ${xmin + width * 0.5} ${ymin + height * 0.4} 
                             T ${xmax - 30} ${ymin + height * 0.2}
                             Q ${xmax - 10} ${ymin + height * 0.6}, ${xmin + width * 0.7} ${ymin + height * 0.75}
                             T ${xmin + 40} ${ymax - 20}`}
                          fill="none"
                          stroke={colors.stroke}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className="opacity-90"
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
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                          className="opacity-80"
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
                          strokeWidth="2.5"
                          strokeDasharray="5 3"
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
                      strokeWidth={isSelected ? '2' : '1'}
                      strokeOpacity={isSelected ? 1 : 0.6}
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Pin / Badge (A, B, C matching Page 5 schematic) */}
                  {showBadges && (
                    <g transform={`translate(${xmin + 18}, ${ymin + 18})`}>
                      <circle
                        r="14"
                        fill={colors.badgeBg}
                        stroke="#0F172A"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-110"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={colors.badgeText}
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="sans-serif"
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

        {/* Live Coordinate & Telemetry Crosshair Probe HUD (Bottom-Right) */}
        <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-300 pointer-events-none flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Crosshair className="w-3 h-3 text-emerald-400" />
            <span>SPECTRAL PROBE:</span>
          </div>
          {probeCoords ? (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 tabular-nums">X: {probeCoords.x}</span>
              <span className="text-emerald-400 tabular-nums">Y: {probeCoords.y}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">Mesophyll intact</span>
            </div>
          ) : (
            <span className="text-slate-500">Hover canvas to sample</span>
          )}
        </div>

        {/* Damage Severity Watermark / Overlay Stat (Top-Left) */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-300 pointer-events-none flex items-center gap-2">
          <span className="text-slate-400">Surface Damage:</span>
          <span className="font-mono font-bold text-amber-400 tabular-nums">
            {leafDamagePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Bottom Sub-Legend (Slide 5 direct quotes & scientific clarity) */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="font-medium">A · Tuta-consistent</span>
            <span className="text-slate-500 text-[11px]">(Broad, blotch-like)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium">B · Liriomyza-consistent</span>
            <span className="text-slate-500 text-[11px]">(Narrow, winding serpentine)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="font-medium">C · Uncertain evidence</span>
            <span className="text-slate-500 text-[11px]">(Ambiguous cues: request close-up)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 italic flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Overlays show where evidence sits, not why the model decided.</span>
        </div>
      </div>
    </div>
  );
};
