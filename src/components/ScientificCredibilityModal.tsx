import React, { useState } from 'react';
import { SCIENTIFIC_METRICS, PROJECT_CREDITS } from '../data/mockData';
import { ShieldCheck, Award, BookOpen, Users, CheckCircle, ExternalLink, Cpu } from 'lucide-react';

export const ScientificCredibilityModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'roadmap' | 'team'>('metrics');

  const roadmapPhases = [
    { num: 1, title: 'Phase 1', desc: 'Dataset research, licensing & annotation' },
    { num: 2, title: 'Phase 2', desc: 'Baseline detection & leaf segmentation' },
    { num: 3, title: 'Phase 3', desc: 'Multi-label evidence & uncertainty handling' },
    { num: 4, title: 'Phase 4', desc: 'PWA & backend development' },
    { num: 5, title: 'Phase 5', desc: 'Inspection history & field analytics' },
    { num: 6, title: 'Phase 6', desc: 'Offline optimization & multilingual support' },
    { num: 7, title: 'Phase 7', desc: 'Expert validation & pilot field testing' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Validation & Rigor · Chip to Crop 2026
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Scientific Credibility & Benchmark Evaluation Suite
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeTab === 'metrics' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Validation Metrics
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeTab === 'roadmap' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Development Phases
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeTab === 'team' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Team & References
          </button>
        </div>
      </div>

      {activeTab === 'metrics' && (
        <div>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-2.5 px-3">Metric</th>
                  <th className="py-2.5 px-3">Question it answers</th>
                  <th className="py-2.5 px-3">Protocol</th>
                  <th className="py-2.5 px-3">Target Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {SCIENTIFIC_METRICS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                      {row.metric}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-relaxed">
                      {row.question}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {row.protocol}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold whitespace-nowrap">
                      {row.targetScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>
              <strong>Leakage Prevention:</strong> Dataset splits strictly separated by plant, greenhouse block, and acquisition session.
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">
              CALIBRATED WITH HELD-OUT SPLITS
            </span>
          </div>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div>
          <div className="mb-4">
            <span className="text-xs text-slate-400">
              From Research Prototype to Field-Ready PWA Platform (7 Engineering Milestones)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {roadmapPhases.map((phase) => (
              <div
                key={phase.num}
                className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {phase.title}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold flex items-center justify-center text-slate-300">
                      {phase.num}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white">{phase.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                  {phase.num <= 4 ? 'COMPLETED / PROTOTYPED' : 'IN PROGRESS'}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-950/30 border border-amber-800/50 p-3 rounded-lg text-xs text-amber-200">
            <strong>Most critical technical dependency:</strong> Expert-confirmed <em>Liriomyza</em> and genuine mixed-infestation field examples for fine-grained regional boundary validation.
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Team Roster */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Team Binary Bengaluru · Presidency University
              </h3>
            </div>
            <div className="space-y-2.5">
              {PROJECT_CREDITS.members.map((member, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-800/40">
                  <span className="font-semibold text-white">{member.name}</span>
                  <span className="text-slate-400 text-[11px]">{member.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Entomological References */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Entomology & Research Citations
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {PROJECT_CREDITS.references.map((ref, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono text-[11px]">{idx + 1}.</span>
                  <span className="leading-relaxed">{ref}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
