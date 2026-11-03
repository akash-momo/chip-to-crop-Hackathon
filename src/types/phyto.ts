export type PestEvidenceType = 'tuta_consistent' | 'liriomyza_consistent' | 'uncertain' | 'healthy';

export type GalleryType = 'blotch' | 'serpentine' | 'punctate' | 'indeterminate';

export interface BoundingBox {
  ymin: number; // 0 to 1000
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface RegionEvidence {
  id: string;
  badge: 'A' | 'B' | 'C' | 'D';
  label: string;
  evidenceType: PestEvidenceType;
  confidence: number; // 0.00 to 1.00
  box: BoundingBox;
  morphologyDescription: string;
  galleryType: GalleryType;
  areaMm2Approx: number;
  activeLarvaeProb: number;
  characteristics: {
    galleryWidthMm: number;
    frassDetected: boolean;
    frassType?: 'black granular aggregates' | 'lateral biseriate frass' | 'none';
    windingIndex: number; // 1.0 = straight, 2.0+ = high serpentine
    necroticRatio: number; // 0.0 to 1.0
  };
  uncertaintyReason?: string;
  recommendedPathway: string;
}

export interface QualityMetrics {
  passed: boolean;
  blurScore: number; // 0 (blurry) to 1 (sharp)
  blurDetected: boolean;
  glareScore: number; // 0 (no glare) to 1 (severe glare)
  glareDetected: boolean;
  distanceStatus: 'too_far' | 'optimal' | 'too_close';
  lightingQuality: 'suboptimal' | 'good' | 'excellent';
  feedbackNotes: string;
}

export interface PlainLanguageMessage {
  statusHeadline: string;
  whatIsKnown: string;
  whatIsUncertain: string;
  recommendedNextStep: string;
  ipmUrgency: 'low' | 'moderate' | 'high' | 'immediate';
  kannadaAudioText?: string;
  hindiAudioText?: string;
  farmerDirectSummary?: string;
  actionChecklist?: {
    id: string;
    task: string;
    priority: 'high' | 'medium' | 'low';
    category: 'trap' | 'biocontrol' | 'spray' | 'sanitation';
  }[];
}

export interface DamageFingerprint {
  fingerprintId: string;
  plantId: string;
  rowId: string;
  fieldId: string;
  timestamp: string;
  totalLeafDamagePercent: number;
  activeMinesCount: number;
  leafSurfaceAreaCm2: number;
  canopyLevel: 'Upper' | 'Middle' | 'Lower';
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  hash: string;
}

export interface LongitudinalRecord {
  day: number;
  date: string;
  damagePercent: number;
  mineCount: number;
  activeLengthMm: number;
  status: 'Initial Infestation' | 'Larval Expansion' | 'Biocontrol Applied' | 'Pupation / Arrested';
  notes: string;
}

export interface PlantGridCell {
  plantId: string;
  rowId: string;
  colIndex: number;
  rowIndex: number;
  status: 'healthy' | 'tuta_active' | 'liriomyza_active' | 'mixed_active' | 'unsampled' | 'under_treatment';
  damagePercent?: number;
  lastScoutedDate?: string;
  riskScore: number; // 0 to 100
}

export interface SampleLeaf {
  id: string;
  title: string;
  subtitle: string;
  pestCategory: 'mixed' | 'tuta' | 'liriomyza' | 'healthy' | 'uncertain';
  imageSrc: string;
  damagePercent: number;
  primaryDiagnosis: string;
  regions: RegionEvidence[];
  qualityCheck: QualityMetrics;
  plainLanguage: PlainLanguageMessage;
  fingerprint: DamageFingerprint;
  longitudinal: LongitudinalRecord[];
}
