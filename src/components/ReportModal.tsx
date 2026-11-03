import React from 'react';
import { X, Printer, Download, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Inspection } from '../types/phyto2';

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
  if (!isOpen || !inspection) return null;

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
Primary Diagnosis: ${inspection.primary_diagnosis}
Surface Damage: ${inspection.overall_damage_percent.toFixed(1)}%
Confidence Calibration: ${(inspection.calibration_confidence * 100).toFixed(1)}%
Status: ${inspection.verification_status}

REGIONS DETECTED:
${inspection.regions
  .map(
    (r) =>
      `- Region ${r.badge}: ${r.region_type} (${r.area_mm2.toFixed(1)} mm², ${(r.confidence * 100).toFixed(1)}% conf)\n  ${r.evidence_description}`
  )
  .join('\n')}

RECOMMENDED NEXT STEPS:
${inspection.plain_language_summary.recommended_next_step}

HASH: ${inspection.fingerprint?.fingerprint_hash || 'N/A'}
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#103D2B] border-2 border-[#244637] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-[#F8FAFC] shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A7B8AE] hover:text-white rounded-xl hover:bg-[#164A35] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

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
            <span className="text-[#73877B] text-[10px] uppercase font-mono block">Greenhouse Block</span>
            <span className="font-mono font-bold text-white">Block B · Row 07</span>
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
                <span className="text-[#73877B] text-[10px] uppercase font-mono block">ECE Confidence</span>
                <span className="font-mono font-bold text-[#38BDF8] text-sm tabular-nums">
                  {(inspection.calibration_confidence * 100).toFixed(1)}%
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
              <span className="font-mono text-[#A3E635] font-bold">{(r.confidence * 100).toFixed(0)}% Conf</span>
            </div>
          ))}
        </div>

        {/* 8. Recommended Next Steps */}
        <div className="bg-[#164A35] p-3.5 rounded-2xl border border-[#A3E635]/30 mb-5 text-xs text-slate-200">
          <span className="font-bold text-[#A3E635] uppercase tracking-wider text-[10px] font-mono block mb-1">
            Recommended Actionable Next Steps
          </span>
          <p className="leading-relaxed font-medium">
            {inspection.plain_language_summary.recommended_next_step}
          </p>
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
          Disclaimer: This report supports scouting and expert review rather than replacing confirmed statutory diagnosis.
        </p>
      </div>
    </div>
  );
};
