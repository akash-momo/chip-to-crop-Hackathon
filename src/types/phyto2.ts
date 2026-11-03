export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'expert' | 'admin';
  created_at: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  farm_name: string;
  location: string;
  total_area_acres: number;
  created_at: string;
}

export interface Field {
  id: string;
  farm_id: string;
  field_name: string;
  crop_type: string;
  total_plants: number;
}

export interface Plant {
  id: string;
  field_id: string;
  plant_identifier: string;
  row_identifier: string;
  col_identifier: number;
  planting_date: string;
  status: 'not_inspected' | 'recently_inspected' | 'evidence_detected' | 'needs_review';
  latest_damage_percent?: number;
  last_inspected_at?: string;
}

export interface EvidenceRegion {
  id: string;
  inspection_id: string;
  badge: 'A' | 'B' | 'C' | 'D';
  region_type: 'tuta_consistent' | 'liriomyza_consistent' | 'uncertain' | 'healthy';
  bounding_coordinates: { ymin: number; xmin: number; ymax: number; xmax: number };
  confidence: number;
  evidence_description: string;
  gallery_type: 'blotch' | 'serpentine' | 'punctate' | 'indeterminate';
  area_mm2: number;
  active_larvae_prob: number;
}

export interface DamageFingerprintRecord {
  id: string;
  inspection_id: string;
  plant_id: string;
  farm_id: string;
  field_id: string;
  fingerprint_hash: string;
  leaf_surface_damage_percent: number;
  active_mines_count: number;
  canopy_stratum: string;
  gps_coordinates: { lat: number; lng: number };
  created_at: string;
}

export interface ExpertReview {
  id: string;
  inspection_id: string;
  reviewer_name: string;
  review_status: 'confirmed' | 'disputed' | 'close_up_requested';
  review_notes: string;
  reviewed_at: string;
}

export interface Inspection {
  id: string;
  plant_id: string;
  plant_identifier: string;
  field_id: string;
  farm_id: string;
  image_path: string;
  inspection_date: string;
  quality_status: {
    passed: boolean;
    blur_detected: boolean;
    glare_detected: boolean;
    distance_acceptable: boolean;
    feedback_notes: string;
  };
  overall_status: 'mixed_infestation' | 'tuta_absoluta' | 'liriomyza_spp' | 'healthy' | 'uncertain';
  primary_diagnosis: string;
  overall_damage_percent: number;
  calibration_confidence: number;
  uncertainty_flagged: boolean;
  abstention_recommended: boolean;
  verification_status: 'pending_expert_review' | 'verified_by_expert' | 'close_up_required';
  plain_language_summary: {
    what_is_known: string;
    what_is_uncertain: string;
    recommended_next_step: string;
  };
  regions: EvidenceRegion[];
  fingerprint?: DamageFingerprintRecord;
  review?: ExpertReview;
}

export interface DashboardOverviewData {
  totalInspections: number;
  plantsMonitored: number;
  suspectedCases: number;
  pendingReviews: number;
  evidenceDistribution: {
    tuta: number;
    liriomyza: number;
    mixed: number;
    healthy: number;
    uncertain: number;
  };
  recentInspections: Inspection[];
  activeFarm: Farm;
  activeField: Field;
}
