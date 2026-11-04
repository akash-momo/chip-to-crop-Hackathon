import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewView } from './components/OverviewView';
import { ScannerView } from './components/ScannerView';
import { EvidenceMapView } from './components/EvidenceMapView';
import { PlantMonitoringView } from './components/PlantMonitoringView';
import { InspectionHistoryView } from './components/InspectionHistoryView';
import { DamageFingerprintView } from './components/DamageFingerprintView';
import { FarmAnalyticsView } from './components/FarmAnalyticsView';
import { ReportModal } from './components/ReportModal';
import { InspectionComparisonModal } from './components/InspectionComparisonModal';
import { PlantHelpChat } from './components/PlantHelpChat';
import { User, Farm, Field, Plant, Inspection, DashboardOverviewData } from './types/phyto2';

export default function App() {
  const [appMode, setAppMode] = useState<'landing' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Authenticated State
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'USR-01',
    name: 'Field Scout',
    email: 'field.scout@phytotrace.ai',
    role: 'farmer',
    created_at: '2026-09-01T08:00:00Z',
  });

  const [activeFarm, setActiveFarm] = useState<Farm>({
    id: 'FARM-BLR-01',
    owner_id: 'USR-01',
    farm_name: 'Hessarghatta Precision Agri Hub',
    location: 'Bengaluru Rural, Karnataka (13.0498° N, 77.5872° E)',
    total_area_acres: 4.5,
    created_at: '2026-09-01T08:30:00Z',
  });

  const [activeField, setActiveField] = useState<Field>({
    id: 'FIELD-GH-B',
    farm_id: 'FARM-BLR-01',
    field_name: 'Greenhouse Block B (Trellised Tomatoes)',
    crop_type: 'Solanum lycopersicum (Tomato cv. Arka Rakshak)',
    total_plants: 80,
  });

  // Database collections
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [activeInspection, setActiveInspection] = useState<Inspection | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState<boolean>(false);
  const [comparisonPair, setComparisonPair] = useState<[Inspection, Inspection] | null>(null);

  // Fetch initial data from server
  useEffect(() => {
    fetch('/api/inspections')
      .then((res) => res.json())
      .then((data) => {
        if (data.inspections && data.inspections.length > 0) {
          setInspections(data.inspections);
          setActiveInspection(data.inspections[0]);
        }
      })
      .catch((err) => console.warn('Inspections fetch error:', err));

    fetch('/api/plants')
      .then((res) => res.json())
      .then((data) => {
        if (data.plants && data.plants.length > 0) {
          setPlants(data.plants);
        }
      })
      .catch((err) => console.warn('Plants fetch error:', err));
  }, []);

  const handleLaunchDashboard = (targetTab: string = 'overview') => {
    setCurrentTab(targetTab);
    setAppMode('dashboard');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    handleLaunchDashboard('overview');
  };

  const handleInspectionAnalyzed = (newInspection: Inspection) => {
    setInspections((prev) => [newInspection, ...prev.filter((i) => i.id !== newInspection.id)]);
    setActiveInspection(newInspection);

    // Update corresponding plant in local state
    setPlants((prev) =>
      prev.map((p) =>
        p.plant_identifier === newInspection.plant_identifier
          ? {
              ...p,
              status: newInspection.overall_status === 'healthy' ? 'recently_inspected' : 'evidence_detected',
              latest_damage_percent: newInspection.overall_damage_percent,
              last_inspected_at: newInspection.inspection_date,
            }
          : p
      )
    );
  };

  const handleUpdateInspection = (updated: Inspection) => {
    setInspections((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setActiveInspection(updated);
  };

  const handleSelectPlantToInspect = (plant: Plant) => {
    setCurrentTab('scanner');
  };

  const handleOpenEvidenceForPlant = (plantIdentifier: string) => {
    const matching = inspections.find((i) => i.plant_identifier === plantIdentifier);
    if (matching) {
      setActiveInspection(matching);
      setCurrentTab('evidence');
    }
  };

  const handleCompareInspections = (i1: Inspection, i2: Inspection) => {
    setComparisonPair([i1, i2]);
    setComparisonModalOpen(true);
  };

  const pendingReviewsCount = inspections.filter(
    (i) => i.verification_status === 'pending_expert_review'
  ).length;

  const overviewData: DashboardOverviewData = {
    totalInspections: inspections.length,
    plantsMonitored: plants.filter((p) => p.status !== 'not_inspected').length,
    suspectedCases: inspections.filter((i) => i.overall_status !== 'healthy').length,
    pendingReviews: pendingReviewsCount,
    evidenceDistribution: {
      tuta: inspections.filter((i) => i.overall_status === 'tuta_absoluta').length,
      liriomyza: inspections.filter((i) => i.overall_status === 'liriomyza_spp').length,
      mixed: inspections.filter((i) => i.overall_status === 'mixed_infestation').length,
      healthy: inspections.filter((i) => i.overall_status === 'healthy').length,
      uncertain: inspections.filter((i) => i.overall_status === 'uncertain').length,
    },
    recentInspections: inspections.slice(0, 5),
    activeFarm,
    activeField,
  };

  // 1. Public Landing Page Mode
  if (appMode === 'landing') {
    return (
      <LandingPage
        onLaunchDashboard={handleLaunchDashboard}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // 2. Authenticated Dashboard Mode
  return (
    <>
      <DashboardLayout
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeFarm={activeFarm}
        onExitToLanding={() => setAppMode('landing')}
        pendingReviewsCount={pendingReviewsCount}
      >
        {currentTab === 'overview' && (
          <OverviewView
            overviewData={overviewData}
            onSelectInspection={(insp) => {
              setActiveInspection(insp);
              setCurrentTab('evidence');
            }}
            onNavigateTab={setCurrentTab}
            userName={currentUser.name}
          />
        )}

        {currentTab === 'scanner' && (
          <ScannerView
            onInspectionAnalyzed={handleInspectionAnalyzed}
            onNavigateToEvidence={() => setCurrentTab('evidence')}
          />
        )}

        {currentTab === 'evidence' && activeInspection && (
          <EvidenceMapView
            inspection={activeInspection}
            onNavigateToFingerprint={() => setCurrentTab('reports')}
            onNavigateToReport={() => setReportModalOpen(true)}
            currentUser={currentUser}
            onUpdateInspection={handleUpdateInspection}
          />
        )}

        {currentTab === 'plants' && (
          <PlantMonitoringView
            plants={plants}
            onSelectPlantToInspect={handleSelectPlantToInspect}
            onOpenEvidenceForPlant={handleOpenEvidenceForPlant}
          />
        )}

        {currentTab === 'history' && (
          <InspectionHistoryView
            inspections={inspections}
            onSelectInspection={(insp) => {
              setActiveInspection(insp);
              setCurrentTab('evidence');
            }}
            onOpenReport={(insp) => {
              setActiveInspection(insp);
              setReportModalOpen(true);
            }}
            onCompareInspections={handleCompareInspections}
          />
        )}

        {currentTab === 'reports' && activeInspection && (
          <DamageFingerprintView
            inspection={activeInspection}
            onOpenReport={() => setReportModalOpen(true)}
            onNavigateToEvidence={() => setCurrentTab('evidence')}
          />
        )}

        {currentTab === 'analytics' && (
          <FarmAnalyticsView
            inspections={inspections}
            plants={plants}
          />
        )}
      </DashboardLayout>

      {/* Structured Report / PDF Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        inspection={activeInspection}
      />

      {/* Side-by-Side Specimen Comparison Modal */}
      <InspectionComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        inspectionA={comparisonPair?.[0] || null}
        inspectionB={comparisonPair?.[1] || null}
        onSelectForView={(insp) => {
          setActiveInspection(insp);
          setCurrentTab('evidence');
        }}
      />
      <PlantHelpChat />
    </>
  );
}
