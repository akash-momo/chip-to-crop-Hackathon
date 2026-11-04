import React, { useEffect } from 'react';
import { X, Printer, Download, QrCode, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Inspection } from '../types/phyto2';
import { getResearchGuidance, RESEARCH_SOURCES } from '../data/researchGuidance';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: Inspection | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  inspection,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !inspection) return null;
  const isSample = inspection.record_source !== 'live_ai';
  const fieldGuidance = getResearchGuidance(inspection.regions);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportText = `
PHYTOTRACE 2.0 — INSPECTION CERTIFICATE
========================================
Report ID: ${inspection.id}
Plant: ${inspection.plant_identifier}
Field: ${inspection.field_id}
Date: ${new Date(inspection.inspection_date).toUTCString()}
Record Type: ${isSample ? 'DEMO SAMPLE — not field-verified' : 'Live AI-assisted inspection — pending expert review'}
Primary Finding: ${inspection.primary_diagnosis}
Surface Damage: ${inspection.overall_damage_percent.toFixed(1)}%
AI Estimate (not field-calibrated): ${(inspection.calibration_confidence * 100).toFixed(1)}%
Status: ${inspection.verification_status}

REGIONS DETECTED:
${inspection.regions
  .map(
    (r) =>
      `- Region ${r.badge}: ${r.region_type} (AI estimate ${(r.confidence * 100).toFixed(1)}%)\n  ${r.evidence_description}`
  )
  .join('\n')}

RECOMMENDED NEXT STEPS:
${fieldGuidance.join('\n')}

RESEARCH REFERENCES:
${RESEARCH_SOURCES.map((source) => `- ${source.label} ${source.url}`).join('\n')}

CONTENT FINGERPRINT: ${isSample ? 'Not generated for demo sample data' : inspection.fingerprint?.fingerprint_hash || 'Unavailable'}
PhytoTrace 2.0 — Intelligence in Every Leaf.
`;
    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `PhytoTrace_${inspection.id}_Report.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <>
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#103D2B] border-2 border-[#244637] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-[#F8FAFC] shadow-2xl relative my-8">
        {/* 1. Branding & Title Header */}
        <div className="border-b border-[#244637] pb-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3E635]/20 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] font-black text-lg">
              Φ
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">PhytoTrace 2.0 Inspection Report</h2>
              <span className="text-[#A3E635] text-xs font-mono">Intelligence in Every Leaf.</span>
            </div>
          </div>
          <span className="font-mono text-xs text-[#A7B8AE] hidden sm:block">
            CHIP TO CROP 2026 · PS-04
          </span>
        </div>

        {isSample && (
          <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
            Demonstration sample — these values are examples and are not verified field measurements.
          </div>
        )}

        {/* 2. Inspection Identification & Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5 bg-[#0B251C] p-3.5 rounded-2xl border border-[#244637]">
          <div>
            <span className="text-[#73877B] text-[10px] uppercase font-mono block">Inspection ID</span>
            <span className="font-mono font-bold text-white">{inspection.id}</span>
          </div>
          <div>
            <span className="text-[#73877B] text-[10px] uppercase font-mono block">Plant Identifier</span>
            <span className="font-mono font-bold text-[#A3E635]">{inspection.plant_identifier}</span>
          </div>
          <div>
            <span className="text-[#73877B] text-[10px] uppercase font-mono block">Field</span>
            <span className="font-mono font-bold text-white">{inspection.field_id}</span>
          </div>
          <div>
            <span className="text-[#73877B] text-[10px] uppercase font-mono block">Timestamp</span>
            <span className="font-mono text-white text-[11px]">
              {new Date(inspection.inspection_date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* 3. Original Leaf Image & 4. Evidence Map Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-5 items-center">
          <div className="sm:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-[#244637]">
            <img
              src={inspection.image_path}
              alt={inspection.plant_identifier}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="sm:col-span-7 space-y-2.5 text-xs">
            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">Primary Evidence Category</span>
              <span className="text-sm font-bold text-white">{inspection.primary_diagnosis}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0B251C] p-2.5 rounded-xl border border-[#244637]">
                <span className="text-[#73877B] text-[10px] uppercase font-mono block">Lamina Damage</span>
                <span className="font-mono font-bold text-[#A3E635] text-sm tabular-nums">
                  {inspection.overall_damage_percent.toFixed(1)}%
                </span>
              </div>
              <div className="bg-[#0B251C] p-2.5 rounded-xl border border-[#244637]">
                <span className="text-[#73877B] text-[10px] uppercase font-mono block">Unvalidated AI estimate</span>
                <span className="font-mono font-bold text-[#38BDF8] text-sm tabular-nums">
                  {(inspection.calibration_confidence * 100).toFixed(1)}% estimate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Region-wise Evidence */}
        <div className="bg-[#0B251C] p-4 rounded-2xl border border-[#244637] mb-5 text-xs space-y-2">
          <span className="font-mono text-[10px] font-bold uppercase text-[#A3E635] block">
            Regional Biomarker Localization
          </span>
          {inspection.regions.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-[#244637] last:border-0">
              <span className="font-bold text-white">
                Region {r.badge} · <span className="text-[#BBF7D0] capitalize">{r.region_type.replace('_', ' ')}</span>
              </span>
              <span className="font-mono text-[#A3E635] font-bold">{(r.confidence * 100).toFixed(0)}% AI estimate</span>
            </div>
          ))}
        </div>

        {/* Research-grounded guidance and named sources */}
        <div className="mb-5 rounded-2xl border border-[#d8e5d5] bg-[#f6faf3] p-4 text-sm text-[#26382a]">
          <h3 className="font-bold">Research-informed field notes</h3>
          <p className="mb-2 text-xs text-[#617363]">These studies support general scouting principles; they do not diagnose this leaf or give a universal treatment dose.</p>
          <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
            {fieldGuidance.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h4 className="mt-3 text-xs font-bold">Sources</h4>
          <ul className="mt-1 space-y-1 text-xs">
            {RESEARCH_SOURCES.map((source) => (
              <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer" className="text-[#315b35] underline underline-offset-2">{source.label}</a></li>
            ))}
          </ul>
        </div>

        {/* 10. Footer and Disclaimer (Section 13) */}
        <div className="border-t border-[#244637] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#73877B]">
          <span className="font-mono text-[#A3E635]">PhytoTrace 2.0 — Intelligence in Every Leaf.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-[#0B251C] hover:bg-[#164A35] text-white border border-[#244637] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-neon px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-[#73877B] italic mt-3 text-center">
          AI image estimates are not expert confirmation. No pesticide dose is prescribed. Confirm local rules and label instructions before treatment.
        </p>
      </div>
    </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close report and go back"
        title="Close report and go back"
        className="fixed right-3 top-3 z-[110] flex items-center gap-2 rounded-full border border-white/30 bg-[#103D2B] px-3 py-2 text-sm font-bold text-white shadow-xl hover:bg-[#164A35]"
      >
        <X className="h-5 w-5" /><span className="hidden sm:inline">Close report</span>
      </button>
      <button
        type="button"
        onClick={onClose}
        className="fixed bottom-4 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/30 bg-[#103D2B] px-5 py-3 text-sm font-bold text-white shadow-xl hover:bg-[#164A35]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to page
      </button>
    </>
  );
};
