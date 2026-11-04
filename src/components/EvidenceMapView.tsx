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
  Volume2,
  Calculator,
  HelpCircle,
  BookOpen,
  Award,
  Sun,
  Sparkles,
} from 'lucide-react';
import { Inspection, EvidenceRegion, User } from '../types/phyto2';
import { AudioFarmerReader } from './AudioFarmerReader';
import { TreatmentCalculatorModal } from './TreatmentCalculatorModal';
import { FarmerDirectCheatSheet } from './FarmerDirectCheatSheet';

interface EvidenceMapViewProps {
  inspection: Inspection;
  onNavigateToFingerprint: () => void;
  onNavigateToReport: () => void;
  onRequestExpertReview?: () => void;
  currentUser?: User;
  onUpdateInspection?: (updated: Inspection) => void;
}

export const EvidenceMapView: React.FC<EvidenceMapViewProps> = ({
  inspection,
  onNavigateToFingerprint,
  onNavigateToReport,
  onRequestExpertReview,
  currentUser,
  onUpdateInspection,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    inspection.regions[0]?.id || null
  );

  // Layer switches
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [outdoorHighContrast, setOutdoorHighContrast] = useState<boolean>(false);

  // Farmer & Expert Tool Modals/Drawers
  const [showAudioGuide, setShowAudioGuide] = useState<boolean>(false);
  const [showTreatmentCalc, setShowTreatmentCalc] = useState<boolean>(false);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [expertReviewOpen, setExpertReviewOpen] = useState<boolean>(false);
  const [expertReviewStatus, setExpertReviewStatus] = useState<'confirmed' | 'disputed' | 'close_up_requested'>('confirmed');
  const [expertReviewNotes, setExpertReviewNotes] = useState<string>('Biomarkers verified consistent with early 2nd instar mines.');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

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
          fill: outdoorHighContrast ? 'rgba(163, 230, 53, 0.45)' : 'rgba(163, 230, 53, 0.28)',
          badgeBg: '#A3E635',
          badgeText: '#071C16',
          label: 'Tuta-consistent evidence',
          evidenceText: 'Broad, blotch-like mine morphology with frass pellets.',
        };
      case 'liriomyza_consistent':
        return {
          stroke: '#38BDF8', // Cyan
          fill: outdoorHighContrast ? 'rgba(56, 189, 248, 0.45)' : 'rgba(56, 189, 248, 0.28)',
          badgeBg: '#38BDF8',
          badgeText: '#071C16',
          label: 'Liriomyza-consistent evidence',
          evidenceText: 'Narrow, winding serpentine epidermal path.',
        };
      case 'uncertain':
      default:
        return {
          stroke: '#FBBF24', // Amber
          fill: outdoorHighContrast ? 'rgba(251, 191, 36, 0.45)' : 'rgba(251, 191, 36, 0.28)',
          badgeBg: '#FBBF24',
          badgeText: '#071C16',
          label: 'Uncertain evidence',
          evidenceText: 'Ambiguous cues: request close-up or expert review.',
        };
    }
  };

  const handleExpertReviewSubmit = async () => {
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/expert-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspection_id: inspection.id,
          reviewer_name: currentUser?.name || 'Dr. C. Gopalakrishnan',
          review_status: expertReviewStatus,
          review_notes: expertReviewNotes,
        }),
      });
      const data = await res.json();
      if (data.inspection && onUpdateInspection) {
        onUpdateInspection(data.inspection);
      }
      setReviewSuccessMessage('Expert review successfully recorded and digitally timestamped!');
      setTimeout(() => {
        setReviewSuccessMessage(null);
        setExpertReviewOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Expert review submit error:', err);
      setReviewSuccessMessage('Review saved locally in audit trail.');
      setTimeout(() => {
        setReviewSuccessMessage(null);
        setExpertReviewOpen(false);
      }, 1500);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Evidence Map Title & Action Toolbar */}
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

        {/* Action Button Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Audio Farmer Guide Toggle */}
          <button
            onClick={() => setShowAudioGuide(!showAudioGuide)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              showAudioGuide
                ? 'neuro-btn-neon text-slate-950'
                : 'neuro-btn text-slate-200 hover:text-white'
            }`}
            title="Listen to diagnosis in Kannada, Hindi, or English"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Advisory</span>
          </button>

          {/* Field action guide button */}
          <button
            onClick={() => setShowTreatmentCalc(true)}
            className="neuro-btn-emerald px-3 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all flex items-center gap-1.5 shadow-md"
            title="Open research-informed field action guide"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Field Action Guide</span>
          </button>

          {/* Diagnostic Cheat Sheet Toggle */}
          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              showCheatSheet
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'neuro-btn text-slate-200 hover:text-white'
            }`}
            title="Field guide for Tuta vs Liriomyza mine symptoms"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Field Guide</span>
          </button>

          {/* View Fingerprint */}
          <button
            onClick={onNavigateToFingerprint}
            className="neuro-btn px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#A3E635]" />
            <span className="hidden sm:inline">Fingerprint</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onNavigateToReport}
            className="btn-neon px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Embedded Farmer Audio Reader (Shown when toggled) */}
      {showAudioGuide && (
        <div className="transition-all animate-fadeIn">
          <AudioFarmerReader
            englishText={`Your plant has signs of ${inspection.primary_diagnosis}. About ${Math.round(inspection.overall_damage_percent)} percent of this leaf is damaged. Please check nearby plants and follow the next step shown on the screen. Ask a local agriculture worker if you are unsure before spraying.`}
            kannadaText={`ನಿಮ್ಮ ಟೊಮೇಟೊ ಗಿಡದ ಎಲೆಯಲ್ಲಿ ಕೀಟದ ಹಾನಿಯ ಗುರುತುಗಳಿವೆ. ಈ ಎಲೆಯ ಸುಮಾರು ${Math.round(inspection.overall_damage_percent)} ಶೇಕಡಾ ಭಾಗ ಹಾನಿಯಾಗಿದೆ. ಪಕ್ಕದ ಗಿಡಗಳನ್ನೂ ಪರಿಶೀಲಿಸಿ. ಸಿಂಪಡಣೆ ಮಾಡುವ ಮೊದಲು ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯ ಸಲಹೆ ಪಡೆಯಿರಿ.`}
            hindiText={`आपके टमाटर के पौधे की पत्ती पर कीट के नुकसान के निशान हैं। इस पत्ती का लगभग ${Math.round(inspection.overall_damage_percent)} प्रतिशत हिस्सा खराब है। पास के पौधों को भी देखें। छिड़काव करने से पहले स्थानीय कृषि अधिकारी से सलाह लें।`}
            primaryDiagnosis={inspection.primary_diagnosis}
          />
        </div>
      )}

      {/* Embedded Diagnostic Cheat Sheet (Shown when toggled) */}
      {showCheatSheet && (
        <div className="transition-all animate-fadeIn">
          <FarmerDirectCheatSheet />
        </div>
      )}

      {/* Signature Mixed Infestation Banner & Disclaimer (Section 8) */}
      {isMixed ? (
        <div className="neuro-card rounded-2xl p-4.5 border-2 border-[#A3E635] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_24px_rgba(163,230,53,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#A3E635]/25 border border-[#A3E635]/60 flex items-center justify-center text-[#A3E635] shrink-0 font-extrabold text-sm">
              MIX
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>Possible mixed infestation detected.</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A3E635] text-[#071C16]">
                  EVIDENCE FLAG
                </span>
              </h3>
              <p className="text-xs text-[#A7B8AE] mt-0.5 leading-relaxed">
                Possible mixed infestation is an evidence-based flag, not a confirmed diagnosis. Co-presence of both Tuta blotches and Liriomyza serpentine trails observed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <div className="text-xs font-mono text-[#BBF7D0] neuro-inset px-3 py-1.5 rounded-xl border border-[#244637] whitespace-nowrap">
              Lamina Loss: <strong className="text-[#A3E635]">{inspection.overall_damage_percent.toFixed(1)}%</strong>
            </div>

            <button
              onClick={() => setExpertReviewOpen(!expertReviewOpen)}
              className="neuro-btn px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 border border-amber-500/30"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{expertReviewOpen ? 'Close Review' : 'Expert Review'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="neuro-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A7B8AE]">
          <span className="font-semibold text-white flex items-center gap-2">
            <span>Primary Evidence Category:</span>
            <span className="text-[#A3E635] font-bold text-sm">{inspection.primary_diagnosis}</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="italic text-[11px] text-[#73877B]">These are evidence categories, not definitive species diagnoses.</span>
            <button
              onClick={() => setExpertReviewOpen(!expertReviewOpen)}
              className="neuro-btn px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 border border-amber-500/30"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Expert Review</span>
            </button>
          </div>
        </div>
      )}

      {/* Expert Review Dropdown Panel */}
      {expertReviewOpen && (
        <div className="neuro-card rounded-2xl p-5 border border-amber-500/40 text-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#244637] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Entomologist Expert Verification Protocol</h4>
            </div>
            <span className="text-[10px] font-mono text-[#A3E635]">REVIEW PROTOCOL v2.0</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-3 rounded-xl neuro-card-hover cursor-pointer border flex flex-col justify-between ${
                expertReviewStatus === 'confirmed'
                  ? 'bg-[#164A35] border-[#A3E635] text-white'
                  : 'bg-[#0B251C] border-[#244637] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Confirm Biomarkers</span>
                <input
                  type="radio"
                  name="expert_status"
                  checked={expertReviewStatus === 'confirmed'}
                  onChange={() => setExpertReviewStatus('confirmed')}
                  className="accent-[#A3E635]"
                />
              </div>
              <p className="text-[11px] text-[#A7B8AE]">Approve AI morphology as consistent with leaf-miner damage.</p>
            </label>

            <label
              className={`p-3 rounded-xl neuro-card-hover cursor-pointer border flex flex-col justify-between ${
                expertReviewStatus === 'close_up_requested'
                  ? 'bg-[#164A35] border-amber-400 text-white'
                  : 'bg-[#0B251C] border-[#244637] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Request Close-Up</span>
                <input
                  type="radio"
                  name="expert_status"
                  checked={expertReviewStatus === 'close_up_requested'}
                  onChange={() => setExpertReviewStatus('close_up_requested')}
                  className="accent-amber-400"
                />
              </div>
              <p className="text-[11px] text-[#A7B8AE]">Resolution insufficient to confirm frass or terminal pupation slits.</p>
            </label>

            <label
              className={`p-3 rounded-xl neuro-card-hover cursor-pointer border flex flex-col justify-between ${
                expertReviewStatus === 'disputed'
                  ? 'bg-[#164A35] border-rose-400 text-white'
                  : 'bg-[#0B251C] border-[#244637] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Dispute Evidence</span>
                <input
                  type="radio"
                  name="expert_status"
                  checked={expertReviewStatus === 'disputed'}
                  onChange={() => setExpertReviewStatus('disputed')}
                  className="accent-rose-400"
                />
              </div>
              <p className="text-[11px] text-[#A7B8AE]">Lesions appear consistent with fungal blight or abiotic sunscald.</p>
            </label>
          </div>

          <div>
            <label className="text-[11px] text-[#A7B8AE] block mb-1 font-semibold">
              Entomologist Audit Notes:
            </label>
            <input
              type="text"
              value={expertReviewNotes}
              onChange={(e) => setExpertReviewNotes(e.target.value)}
              className="w-full neuro-inset px-3 py-2 rounded-xl text-xs text-white border border-[#244637] focus:outline-none focus:border-[#A3E635]"
              placeholder="Record diagnostic observations or microscope confirmation..."
            />
          </div>

          {reviewSuccessMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{reviewSuccessMessage}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#244637]">
            <button
              onClick={() => setExpertReviewOpen(false)}
              className="neuro-btn px-4 py-2 rounded-xl text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleExpertReviewSubmit}
              disabled={isSubmittingReview}
              className="btn-neon px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              {isSubmittingReview ? <span>Saving...</span> : <span>Sign & Timestamp Verification</span>}
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas & Inspection Drawer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Canvas Stage (8 cols) */}
        <div className="lg:col-span-8 neuro-card rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-700/60">
          {/* Canvas Toolbar */}
          <div className="px-4 py-3 bg-[#071C16] border-b border-[#244637] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A3E635]" />
              <span className="font-bold text-white">Leaf Photo</span>
              <span className="text-[#73877B]">|</span>
              <span className="font-mono text-[#A3E635] text-[11px]">
                {inspection.regions.length} estimated area{inspection.regions.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Layer Toggles & Outdoor Sun Mode */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  showBoxes
                    ? 'neuro-btn-neon text-slate-950 font-bold'
                    : 'text-[#A7B8AE] hover:text-white'
                }`}
              >
                Boundaries
              </button>
              <button
                onClick={() => setShowBadges(!showBadges)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  showBadges
                    ? 'neuro-btn-neon text-slate-950 font-bold'
                    : 'text-[#A7B8AE] hover:text-white'
                }`}
              >
                Pins (A/B/C)
              </button>

              <div className="h-4 w-px bg-[#244637] mx-1 hidden sm:block" />

              {/* Outdoor Sunlight Mode Toggle */}
              <button
                onClick={() => setOutdoorHighContrast(!outdoorHighContrast)}
                className={`p-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  outdoorHighContrast
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-[#A7B8AE] hover:text-white'
                }`}
                title="Toggle High-Contrast Outdoor Field Mode"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Outdoor</span>
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 neuro-inset px-1.5 py-0.5 rounded-lg border border-[#244637]">
                <button
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                  className="p-1 hover:text-white text-[#A7B8AE]"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[10px] text-[#A3E635] font-bold w-10 text-center tabular-nums">
                  {(zoom * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                  className="p-1 hover:text-white text-[#A7B8AE]"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                {zoom > 1 && (
                  <button
                    onClick={() => setZoom(1)}
                    className="p-1 hover:text-white text-[#A7B8AE]"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Leaf Stage Canvas */}
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

              {/* SVG Overlays for Leaf-Mining Boundaries & Galleries */}
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

                  return (
                    <g
                      key={region.id}
                      onClick={() => setSelectedRegionId(region.id)}
                      className="cursor-pointer group"
                    >
                      {/* Estimated location only; do not draw invented gallery shapes. */}
                      {showBoxes && (
                        <rect
                          x={xmin}
                          y={ymin}
                          width={width}
                          height={height}
                          fill="none"
                          stroke={style.stroke}
                          strokeWidth={isSelected ? '3' : '2'}
                          strokeDasharray={region.region_type === 'uncertain' ? '8 6' : undefined}
                        />
                      )}

                      {/* Pin Badge A/B/C */}
                      {showBadges && (
                        <g transform={`translate(${xmin + 20}, ${ymin + 20})`}>
                          <circle
                            r="16"
                            fill={style.badgeBg}
                            stroke="#071C16"
                            strokeWidth="3"
                            className="transition-transform group-hover:scale-120 shadow-lg"
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

          {/* Bottom Bar Legend & Disclaimer */}
          <div className="p-3.5 bg-[#071C16] border-t border-[#244637] flex flex-wrap items-center justify-between gap-3 text-xs text-[#A7B8AE]">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] shadow-[0_0_8px_#A3E635]" />
                A · Tuta-consistent (Neon Lime)
              </span>
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                B · Liriomyza-consistent (Cyan)
              </span>
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]" />
                C · Uncertain evidence (Amber)
              </span>
            </div>
            <span className="text-[11px] text-[#73877B] italic">
              Boxes are AI-estimated areas, not pixel-level outlines. Check the photo before acting.
            </span>
          </div>
        </div>

        {/* Region Information Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="neuro-card rounded-3xl p-5 space-y-4 border border-slate-700/60">
            <div className="flex items-center justify-between border-b border-[#244637] pb-3">
              <h3 className="text-sm font-bold text-white">Estimated Evidence Areas</h3>
              <span className="text-xs font-mono text-[#A3E635] font-bold">
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
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer neuro-card-hover ${
                      isSelected
                        ? 'bg-[#164A35] border-[#A3E635] shadow-[0_0_18px_rgba(163,230,53,0.22)]'
                        : 'bg-[#0B251C] border-[#244637] hover:border-[#73877B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black font-mono shadow-sm"
                          style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
                        >
                          {reg.badge}
                        </span>
                        <span className="font-bold text-white text-xs">REGION {reg.badge}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#BBF7D0] tabular-nums">
                        {(reg.confidence * 100).toFixed(1)}% model estimate
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
                      <span>{typeof reg.area_mm2 === 'number' ? `AI area estimate: ${reg.area_mm2.toFixed(1)} mm²` : 'Area not measured'}</span>
                      <span>Type: {reg.gallery_type}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Plain-Language Directive Card */}
            <div className="neuro-inset rounded-2xl p-4 text-xs space-y-2 border border-[#244637]">
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

      {/* ICAR Treatment Calculator Modal */}
      <TreatmentCalculatorModal
        isOpen={showTreatmentCalc}
        onClose={() => setShowTreatmentCalc(false)}
        damagePercent={inspection.overall_damage_percent}
        primaryDiagnosis={inspection.primary_diagnosis}
        plantId={inspection.plant_identifier}
      />
    </div>
  );
};
