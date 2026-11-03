import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { Inspection } from '../types/phyto2';

interface InspectionHistoryViewProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
  onOpenReport: (inspection: Inspection) => void;
  onCompareInspections: (insp1: Inspection, insp2: Inspection) => void;
}

export const InspectionHistoryView: React.FC<InspectionHistoryViewProps> = ({
  inspections,
  onSelectInspection,
  onOpenReport,
  onCompareInspections,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'damage' | 'plant'>('date');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const filtered = inspections
    .filter((insp) => {
      const matchesSearch =
        insp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insp.plant_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insp.primary_diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || insp.overall_status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'damage') {
        return b.overall_damage_percent - a.overall_damage_percent;
      }
      if (sortBy === 'plant') {
        return a.plant_identifier.localeCompare(b.plant_identifier);
      }
      return new Date(b.inspection_date).getTime() - new Date(a.inspection_date).getTime();
    });

  const toggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleTriggerCompare = () => {
    if (selectedForCompare.length === 2) {
      const i1 = inspections.find((i) => i.id === selectedForCompare[0]);
      const i2 = inspections.find((i) => i.id === selectedForCompare[1]);
      if (i1 && i2) {
        onCompareInspections(i1, i2);
      }
    }
  };

  const getStatusBadge = (status: Inspection['overall_status']) => {
    switch (status) {
      case 'mixed_infestation':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40">Mixed Infestation</span>;
      case 'tuta_absoluta':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40">Tuta absoluta</span>;
      case 'liriomyza_spp':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40">Liriomyza spp.</span>;
      case 'healthy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Healthy</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40">Uncertain</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-1">
            DIGITAL SCOUTING ARCHIVE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inspection History & Records
          </h1>
          <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1">
            Historical leaf diagnoses, Damage Fingerprints, and expert review statuses.
          </p>
        </div>

        {selectedForCompare.length === 2 && (
          <button
            onClick={handleTriggerCompare}
            className="btn-neon px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5"
          >
            <span>Compare Selected (2 Records)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#73877B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Plant, or Diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B251C] border border-[#244637] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#73877B] focus:outline-none focus:border-[#A3E635]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0B251C] border border-[#244637] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A3E635]"
          >
            <option value="all">All Evidence Types</option>
            <option value="mixed_infestation">Mixed Infestation</option>
            <option value="tuta_absoluta">Tuta absoluta</option>
            <option value="liriomyza_spp">Liriomyza spp.</option>
            <option value="healthy">Healthy Foliage</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0B251C] border border-[#244637] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A3E635]"
          >
            <option value="date">Sort by Date (Latest)</option>
            <option value="damage">Sort by Damage %</option>
            <option value="plant">Sort by Plant ID</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-[#103D2B] border border-[#244637] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#244637] text-[#A7B8AE] font-mono uppercase text-[11px] bg-[#0B251C]">
                <th className="py-3 px-4 w-10 text-center">Compare</th>
                <th className="py-3 px-4">Specimen</th>
                <th className="py-3 px-4">Plant & ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Evidence Summary</th>
                <th className="py-3 px-4">Damage %</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#244637]">
              {filtered.map((insp) => {
                const isChecked = selectedForCompare.includes(insp.id);
                return (
                  <tr
                    key={insp.id}
                    className="hover:bg-[#164A35]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCompare(insp.id)}
                        className="rounded accent-[#A3E635] cursor-pointer"
                        title="Select up to 2 records to compare"
                      />
                    </td>
                    <td className="py-3 px-4" onClick={() => onSelectInspection(insp)}>
                      <img
                        src={insp.image_path}
                        alt={insp.plant_identifier}
                        className="w-12 h-12 rounded-xl object-cover border border-[#244637] group-hover:border-[#A3E635] transition-colors"
                      />
                    </td>
                    <td className="py-3 px-4" onClick={() => onSelectInspection(insp)}>
                      <span className="font-bold text-white block">{insp.plant_identifier}</span>
                      <span className="font-mono text-[#73877B] text-[10px]">{insp.id}</span>
                    </td>
                    <td className="py-3 px-4 text-[#A7B8AE] font-mono text-[11px]" onClick={() => onSelectInspection(insp)}>
                      {new Date(insp.inspection_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4" onClick={() => onSelectInspection(insp)}>
                      <div className="space-y-1">
                        {getStatusBadge(insp.overall_status)}
                        <span className="text-[11px] text-[#A7B8AE] block truncate max-w-xs">
                          {insp.primary_diagnosis}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white tabular-nums" onClick={() => onSelectInspection(insp)}>
                      {insp.overall_damage_percent.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4" onClick={() => onSelectInspection(insp)}>
                      {insp.verification_status === 'verified_by_expert' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Expert Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FBBF24]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectInspection(insp)}
                          className="px-2.5 py-1 rounded-lg bg-[#0B251C] hover:bg-[#164A35] text-[#A3E635] font-semibold border border-[#244637] transition-colors"
                        >
                          View Map
                        </button>
                        <button
                          onClick={() => onOpenReport(insp)}
                          className="p-1 rounded-lg hover:bg-[#0B251C] text-[#A7B8AE] hover:text-white transition-colors"
                          title="Generate Report"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#73877B]">
            No inspection records match the selected search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
