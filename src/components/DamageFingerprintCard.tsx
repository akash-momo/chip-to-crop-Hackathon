import React from 'react';
import { DamageFingerprint } from '../types/phyto';
import { ShieldCheck, QrCode, Download, Printer, Copy, Check } from 'lucide-react';

interface DamageFingerprintCardProps {
  fingerprint: DamageFingerprint;
  primaryDiagnosis: string;
}

export const DamageFingerprintCard: React.FC<DamageFingerprintCardProps> = ({
  fingerprint,
  primaryDiagnosis,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(fingerprint.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fingerprint, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${fingerprint.fingerprintId}_audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="scouting-report-card"
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Intelligence Layer 04 · Agronomic Certificate
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Leaf Damage Fingerprint · {fingerprint.fingerprintId}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded hover:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON Audit</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded hover:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-4 mb-4">
        {/* QR / Barcode Visual Schematic */}
        <div className="md:col-span-1 bg-white p-3 rounded-lg flex flex-col items-center justify-center text-slate-950">
          <QrCode className="w-20 h-20 text-slate-900" />
          <span className="text-[10px] font-mono font-bold mt-1 tracking-tighter">
            {fingerprint.fingerprintId}
          </span>
          <span className="text-[9px] text-slate-600">ICAR-IIHR COMPLIANT</span>
        </div>

        {/* Structured Specimen Metadata */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Primary Diagnosis</span>
            <span className="font-semibold text-white">{primaryDiagnosis}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Plant Identifier</span>
            <span className="font-mono font-semibold text-emerald-400">{fingerprint.plantId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Row & Greenhouse</span>
            <span className="font-mono text-slate-200">
              {fingerprint.rowId} · {fingerprint.fieldId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Lamina Damage Area</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {fingerprint.totalLeafDamagePercent.toFixed(1)}% ({fingerprint.leafSurfaceAreaCm2} cm²)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Active Mine Count</span>
            <span className="font-mono text-slate-200">{fingerprint.activeMinesCount} verified</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Canopy Level</span>
            <span className="font-medium text-slate-200">{fingerprint.canopyLevel} Stratum</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-400 block text-[11px]">GPS Coordinates</span>
            <span className="font-mono text-slate-300">
              {fingerprint.gpsCoordinates.lat.toFixed(4)}° N, {fingerprint.gpsCoordinates.lng.toFixed(4)}° E
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Timestamp (UTC)</span>
            <span className="font-mono text-slate-300">{fingerprint.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Cryptographic Hash & Verification Badge */}
      <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-slate-500 shrink-0">SHA-256 HASH:</span>
          <span className="text-slate-400 truncate">{fingerprint.hash}</span>
        </div>
        <button
          onClick={handleCopyHash}
          className="text-slate-400 hover:text-white shrink-0 ml-2 p-1 rounded hover:bg-slate-800 transition-colors"
          title="Copy Hash"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
