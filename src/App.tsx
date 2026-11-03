import React, { useState } from 'react';
import { SAMPLE_LEAVES, GENERATED_FARM_GRID, PROJECT_CREDITS } from './data/mockData';
import { SampleLeaf, PlantGridCell } from './types/phyto';
import { Header } from './components/Header';
import { QualityChecker } from './components/QualityChecker';
import { LeafEvidenceCanvas } from './components/LeafEvidenceCanvas';
import { RegionDetailsDrawer } from './components/RegionDetailsDrawer';
import { PlainLanguageBanner } from './components/PlainLanguageBanner';
import { LongitudinalTracker } from './components/LongitudinalTracker';
import { FarmGridMap } from './components/FarmGridMap';
import { SixLayersExplorer } from './components/SixLayersExplorer';
import { DamageFingerprintCard } from './components/DamageFingerprintCard';
import { ScientificCredibilityModal } from './components/ScientificCredibilityModal';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { FarmerPwaView } from './components/FarmerPwaView';
import { Sparkles, Camera, MapPin, Activity, HelpCircle, CheckCircle, ArrowRight, Info, Check } from 'lucide-react';

export default function App() {
  const [samples, setSamples] = useState<SampleLeaf[]>(SAMPLE_LEAVES);
  const [currentLeaf, setCurrentLeaf] = useState<SampleLeaf>(SAMPLE_LEAVES[0]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    SAMPLE_LEAVES[0].regions[0]?.id || null
  );
  const [activeView, setActiveView] = useState<
    'evidence' | 'farm-grid' | 'longitudinal' | 'six-layers' | 'benchmarks'
  >('evidence');
  const [pwaMode, setPwaMode] = useState<boolean>(false);
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedRegion = currentLeaf.regions.find((r) => r.id === selectedRegionId) || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectSample = (leaf: SampleLeaf) => {
    setCurrentLeaf(leaf);
    setSelectedRegionId(leaf.regions[0]?.id || null);
  };

  const handleNewInspectionComplete = (leaf: SampleLeaf) => {
    setSamples((prev) => [leaf, ...prev]);
    setCurrentLeaf(leaf);
    setSelectedRegionId(leaf.regions[0]?.id || null);
    showToast(`Specimen ${leaf.fingerprint.fingerprintId} analyzed successfully!`);
  };

  const handleSelectPlantFromGrid = (cell: PlantGridCell) => {
    // Locate or create leaf for plant
    const matchingLeaf = samples.find((s) => s.fingerprint.plantId === cell.plantId);
    if (matchingLeaf) {
      setCurrentLeaf(matchingLeaf);
      setSelectedRegionId(matchingLeaf.regions[0]?.id || null);
    } else {
      // Create associated leaf snapshot
      const newLeaf: SampleLeaf = {
        ...SAMPLE_LEAVES[0],
        id: `grid-${cell.plantId}`,
        title: `Plant ${cell.plantId} Field Specimen`,
        subtitle: `Greenhouse Block B · ${cell.rowId} · Plant ${cell.plantId}`,
        damagePercent: cell.damagePercent || 18.5,
        fingerprint: {
          ...SAMPLE_LEAVES[0].fingerprint,
          plantId: cell.plantId,
          rowId: cell.rowId,
          fingerprintId: `FP-GRID-${cell.plantId}`,
          totalLeafDamagePercent: cell.damagePercent || 18.5,
        },
      };
      setCurrentLeaf(newLeaf);
      setSelectedRegionId(newLeaf.regions[0]?.id || null);
    }
    showToast(`Loaded Plant ${cell.plantId} (${cell.rowId}) into diagnostic workspace.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Academic Ribbon (Page 1 OCR Citation) */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-400 font-mono flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">PhytoTrace</span>
          <span>·</span>
          <span>CHIP TO CROP 2026</span>
          <span>·</span>
          <span>Presidency University</span>
          <span>·</span>
          <span className="text-slate-300">Problem Statement 04</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">Team: Binary Bengaluru</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">Trace the Damage. Reveal the Threat. Protect the Crop.</span>
        </div>
      </div>

      {/* Top Bar Header (Standard 3-Zone Contract) */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        pwaMode={pwaMode}
        setPwaMode={setPwaMode}
        onOpenNewInspection={() => setCameraModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/80 text-emerald-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PWA Phone Frame Mode vs Full-Width Desktop Console */}
      {pwaMode ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full flex flex-col items-center">
          <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Smartphone PWA Field Simulation</span>
            <button
              onClick={() => setPwaMode(false)}
              className="text-emerald-400 hover:underline"
            >
              Exit to Desktop Console
            </button>
          </div>
          <FarmerPwaView
            currentLeaf={currentLeaf}
            onOpenCapture={() => setCameraModalOpen(true)}
            onSelectSample={handleSelectSample}
            allSamples={samples}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
          {/* Hero Specimen Ribbon & Quick Sample Switcher */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                <span>ACTIVE SPECIMEN:</span>
                <span className="text-emerald-400 font-semibold">{currentLeaf.fingerprint.plantId}</span>
                <span>·</span>
                <span>{currentLeaf.fingerprint.rowId}</span>
                <span>·</span>
                <span className="text-slate-300">{currentLeaf.fingerprint.fieldId}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentLeaf.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {currentLeaf.subtitle}
              </p>
            </div>

            {/* Quick Sample Selector Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {samples.slice(0, 4).map((leaf) => (
                <button
                  key={leaf.id}
                  onClick={() => handleSelectSample(leaf)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-2 cursor-pointer ${
                    leaf.id === currentLeaf.id
                      ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      leaf.pestCategory === 'mixed'
                        ? 'bg-amber-400'
                        : leaf.pestCategory === 'tuta'
                        ? 'bg-amber-500'
                        : leaf.pestCategory === 'liriomyza'
                        ? 'bg-emerald-400'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    {leaf.pestCategory === 'mixed'
                      ? 'Mixed Mines'
                      : leaf.pestCategory === 'tuta'
                      ? 'Tuta Blotch'
                      : leaf.pestCategory === 'liriomyza'
                      ? 'Liriomyza Trail'
                      : 'Healthy Control'}
                  </span>
                </button>
              ))}

              <button
                onClick={() => setCameraModalOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture Specimen</span>
              </button>
            </div>
          </section>

          {/* View Tab 1: Primary Evidence Map (Core Diagnostic Console) */}
          {activeView === 'evidence' && (
            <div className="space-y-6">
              {/* Pipeline Gate 02: Pre-inference Quality Assessment */}
              <QualityChecker quality={currentLeaf.qualityCheck} />

              {/* Pipeline Gate 03-05: Visual Stage & Morphological Analysis Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                  <LeafEvidenceCanvas
                    imageSrc={currentLeaf.imageSrc}
                    regions={currentLeaf.regions}
                    selectedRegionId={selectedRegionId}
                    onSelectRegion={setSelectedRegionId}
                    leafDamagePercent={currentLeaf.damagePercent}
                  />
                </div>

                <div className="lg:col-span-1">
                  <RegionDetailsDrawer
                    region={selectedRegion}
                    allRegions={currentLeaf.regions}
                    onSelectRegion={setSelectedRegionId}
                    onRequestCloseUp={() => {
                      showToast('Close-up macro request flagged for scout route.');
                      setCameraModalOpen(true);
                    }}
                    onConfirmVerification={() => {
                      showToast('Region verified and logged to expert validation corpus.');
                    }}
                  />
                </div>
              </div>

              {/* Pipeline Gate 06: Plain Language Farmer Directive (What is Known, Uncertain, Next Step) */}
              <PlainLanguageBanner
                message={currentLeaf.plainLanguage}
                primaryDiagnosis={currentLeaf.primaryDiagnosis}
                mixedInfestationSuspected={currentLeaf.pestCategory === 'mixed'}
                onApplyProtocol={() => {
                  showToast('IPM directive logged to farm scouting registry.');
                }}
              />

              {/* Pipeline Gate 07: Cryptographic Damage Fingerprint Certificate */}
              <DamageFingerprintCard
                fingerprint={currentLeaf.fingerprint}
                primaryDiagnosis={currentLeaf.primaryDiagnosis}
              />
            </div>
          )}

          {/* View Tab 2: Farm-Level Spatial Matrix (Layer 6) */}
          {activeView === 'farm-grid' && (
            <div className="space-y-6">
              <FarmGridMap
                grid={GENERATED_FARM_GRID}
                selectedPlantId={currentLeaf.fingerprint.plantId}
                onSelectPlant={handleSelectPlantFromGrid}
                onInspectLeaf={() => setActiveView('evidence')}
              />
            </div>
          )}

          {/* View Tab 3: Longitudinal Damage Progression (Layer 5) */}
          {activeView === 'longitudinal' && (
            <div className="space-y-6">
              <LongitudinalTracker
                records={currentLeaf.longitudinal}
                plantId={currentLeaf.fingerprint.plantId}
                rowId={currentLeaf.fingerprint.rowId}
              />
            </div>
          )}

          {/* View Tab 4: The 6 Layers of Intelligence System */}
          {activeView === 'six-layers' && (
            <div className="space-y-6">
              <SixLayersExplorer />
            </div>
          )}

          {/* View Tab 5: Scientific Credibility & Evaluation Benchmarks */}
          {activeView === 'benchmarks' && (
            <div className="space-y-6">
              <ScientificCredibilityModal />
            </div>
          )}
        </main>
      )}

      {/* Global Camera / Upload Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onInspectionComplete={handleNewInspectionComplete}
      />

      {/* Clean Scientific Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-800/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">PhytoTrace</span>
            <span>·</span>
            <span>Explainable AI for Mixed Leaf-Miner Infestation Detection</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Presidency University</span>
            <span>·</span>
            <span>Binary Bengaluru</span>
            <span>·</span>
            <span>Chip to Crop 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
