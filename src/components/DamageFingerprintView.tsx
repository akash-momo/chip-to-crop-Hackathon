import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  Printer,
  Calendar,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Inspection } from '../types/phyto2';

interface DamageFingerprintViewProps {
  inspection: Inspection;
  onOpenReport: () => void;
  onNavigateToEvidence: () => void;
}

export const DamageFingerprintView: React.FC<DamageFingerprintViewProps> = ({
  inspection,
  onOpenReport,
  onNavigateToEvidence,
}) => {
  const [copied, setCopied] = useState(false);
  const fp = inspection.fingerprint;
  const isSample = inspection.record_source !== 'live_ai';
  const liveHash = isSample ? undefined : fp?.fingerprint_hash;
  const gps = !isSample ? fp?.gps_coordinates : null;

  const handleCopyHash = () => {
    if (liveHash) {
      navigator.clipboard.writeText(liveHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inspection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${fp?.id || inspection.id}_fingerprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-1">
            INSPECTION RECORD · {isSample ? 'DEMO' : 'LIVE AI'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inspection Record Fingerprint
          </h1>
          <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1">
            {isSample ? 'Example record only. No verified fingerprint or field location is available.' : 'SHA-256 content fingerprint for this inspection and its source image.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJson}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#103D2B] hover:bg-[#164A35] text-white border border-[#244637] transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>Download JSON</span>
          </button>
          <button
            onClick={onOpenReport}
            className="btn-neon px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Diagnostic Certificate Card */}
      <div className="bg-[#103D2B] border-2 border-[#244637] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Watermark Badge */}
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <QrCode className="w-48 h-48 text-[#A3E635]" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#244637] pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] font-black text-xl shadow-[0_0_15px_rgba(163,230,53,0.25)]">
              Φ
            </div>
            <div>
              <span className="font-extrabold text-white text-base sm:text-lg block">
                PhytoTrace 2.0 Diagnostic Certificate
              </span>
              <span className="text-[#A3E635] text-xs font-mono font-bold">
                {isSample ? 'DEMO SAMPLE · NO VERIFIED FINGERPRINT' : fp?.id || 'Fingerprint unavailable'}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-[#A7B8AE]">
            <span className="block text-white font-bold">{new Date(inspection.inspection_date).toUTCString()}</span>
            <span>{inspection.field_id || 'Field not recorded'}</span>
          </div>
        </div>

        {/* Grid: Photo & Primary Meta */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <div className="md:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-[#244637]">
            <img
              src={inspection.image_path}
              alt={inspection.plant_identifier}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-[#071C16]/90 px-2 py-0.5 rounded text-[10px] font-mono text-[#A3E635]">
              {inspection.plant_identifier} Lamina
            </span>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">Plant Identifier</span>
              <span className="text-sm font-bold text-white font-mono">{inspection.plant_identifier}</span>
            </div>

            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">Primary Evidence</span>
              <span className="text-xs font-bold text-[#A3E635] block truncate">{inspection.primary_diagnosis}</span>
            </div>

            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">AI-estimated leaf damage</span>
              <span className="text-sm font-bold text-white font-mono tabular-nums">
                {inspection.overall_damage_percent.toFixed(1)}%
              </span>
            </div>

            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">Active Mines Count</span>
              <span className="text-sm font-bold text-white font-mono">{inspection.regions.length} AI-detected regions</span>
            </div>

            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">Unvalidated AI estimate</span>
              <span className="text-sm font-bold text-[#BBF7D0] font-mono">
                {(inspection.calibration_confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">Verification Status</span>
              <span className="text-xs font-bold capitalize text-white">
                {inspection.verification_status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="sm:col-span-2 bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">GPS Geolocation</span>
              <span className="font-mono text-white text-[11px]">
                {gps ? `${gps.lat.toFixed(5)}°, ${gps.lng.toFixed(5)}°` : 'Not recorded'}
              </span>
            </div>

            <div className="bg-[#0B251C] p-3 rounded-xl border border-[#244637]">
              <span className="text-[#73877B] text-[10px] uppercase font-mono block">Quality Pre-Check</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{isSample ? 'DEMO DATA' : 'AI CHECKS ONLY'}</span>
            </div>
          </div>
        </div>

        {/* Region Evidence Breakdown */}
        <div className="bg-[#0B251C] rounded-2xl p-4 border border-[#244637] mb-6">
          <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">
            Granular Regional Evidence
          </span>
          <div className="space-y-2 text-xs">
            {inspection.regions.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#103D2B] border border-[#244637]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#A3E635] text-[#071C16] font-black text-xs flex items-center justify-center font-mono">
                    {reg.badge}
                  </span>
                  <div>
                    <span className="font-bold text-white block capitalize">{reg.region_type.replace('_', ' ')}</span>
                    <span className="text-[#A7B8AE] text-[11px]">{reg.evidence_description}</span>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="text-[#A3E635] font-bold block">{(reg.confidence * 100).toFixed(0)}% AI estimate</span>
                  <span className="text-[#73877B]">Area not measured</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic Hash Badge (Section 9) */}
        <div className="bg-[#071C16] p-3 rounded-xl border border-[#244637] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[#73877B] shrink-0 font-bold">{isSample ? 'SAMPLE RECORD:' : 'SHA-256:'}</span>
            <span className="text-[#A3E635] truncate">{liveHash || (isSample ? 'Not generated for demo data' : 'Fingerprint unavailable')}</span>
          </div>
          <button
            onClick={handleCopyHash}
            className="text-[#A7B8AE] hover:text-white p-1 rounded-lg hover:bg-[#103D2B] transition-colors ml-2 shrink-0"
            title={liveHash ? 'Copy SHA-256 fingerprint' : 'No verified fingerprint on a sample record'}
            disabled={!liveHash}
            aria-label="Copy SHA-256 fingerprint"
          >
            {copied ? <Check className="w-4 h-4 text-[#A3E635]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
