import { SampleLeaf, PlantGridCell } from '../types/phyto';

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-mixed-01',
    title: 'Sample #04: Mixed Infestation Complex',
    subtitle: 'Greenhouse Block B · Row 07 · Plant #42 · Upper Canopy Leaflet',
    pestCategory: 'mixed',
    imageSrc: '/src/assets/images/tomato_leaf_mixed_mines_1793734448287.jpg',
    damagePercent: 28.4,
    primaryDiagnosis: 'Mixed Leaf-Miner Infestation (Tuta absoluta + Liriomyza spp.)',
    qualityCheck: {
      passed: true,
      blurScore: 0.94,
      blurDetected: false,
      glareScore: 0.08,
      glareDetected: false,
      distanceStatus: 'optimal',
      lightingQuality: 'excellent',
      feedbackNotes: 'Sharp focus on secondary venation. Contrast optimal for necrotic gallery margin extraction.',
    },
    plainLanguage: {
      statusHeadline: 'Mixed Infestation Detected · Immediate Intervention Needed',
      whatIsKnown: 'Both wide necrotic blotch galleries (Tuta-consistent) and narrow meandering serpentine tracks (Liriomyza-consistent) are confirmed on the leaflet blade.',
      whatIsUncertain: 'Region C presents an overlapping intersection where serpentine tracks meet a necrotic blotch. Could be dual colonization or subsequent feeding.',
      recommendedNextStep: 'Deploy Qlure-TUA delta pheromone traps for Tuta monitoring and yellow sticky cards for adult Liriomyza. Apply targeted bio-rational spray within 48h.',
      ipmUrgency: 'immediate',
    },
    fingerprint: {
      fingerprintId: 'FP-MIX-8892A',
      plantId: 'P-042',
      rowId: 'R-07',
      fieldId: 'Greenhouse Block B',
      timestamp: '2026-11-03 10:14:22 UTC',
      totalLeafDamagePercent: 28.4,
      activeMinesCount: 3,
      leafSurfaceAreaCm2: 44.2,
      canopyLevel: 'Upper',
      gpsCoordinates: { lat: 13.0498, lng: 77.5872 }, // Bangalore / Presidency Univ region
      hash: '0x8f4c2e17d9ab40c3912ee567fa09321e',
    },
    regions: [
      {
        id: 'REG-A',
        badge: 'A',
        label: 'Region A · Tuta-consistent evidence',
        evidenceType: 'tuta_consistent',
        confidence: 0.94,
        box: { ymin: 490, xmin: 480, ymax: 820, xmax: 840 },
        morphologyDescription: 'Broad, irregular blotch-like gallery with visible black frass pellets deposited in internal clusters. Mesophyll tissue fully consumed between upper and lower cuticle.',
        galleryType: 'blotch',
        areaMm2Approx: 36.8,
        activeLarvaeProb: 0.89,
        characteristics: {
          galleryWidthMm: 8.4,
          frassDetected: true,
          frassType: 'black granular aggregates',
          windingIndex: 1.15,
          necroticRatio: 0.84,
        },
        recommendedPathway: 'Targeted pheromone trapping + bacillus thuringiensis (Bt subsp. kurstaki)',
      },
      {
        id: 'REG-B',
        badge: 'B',
        label: 'Region B · Liriomyza-consistent evidence',
        evidenceType: 'liriomyza_consistent',
        confidence: 0.92,
        box: { ymin: 140, xmin: 220, ymax: 390, xmax: 640 },
        morphologyDescription: 'Narrow, winding serpentine epidermal path meandering across secondary leaf veins. Gallery width increases gradually from 0.3mm to 1.1mm as instar matures.',
        galleryType: 'serpentine',
        areaMm2Approx: 17.5,
        activeLarvaeProb: 0.82,
        characteristics: {
          galleryWidthMm: 1.1,
          frassDetected: true,
          frassType: 'lateral biseriate frass',
          windingIndex: 3.42,
          necroticRatio: 0.22,
        },
        recommendedPathway: 'Yellow sticky monitoring traps + conservation of parasitoid wasp Diglyphus isaea',
      },
      {
        id: 'REG-C',
        badge: 'C',
        label: 'Region C · Uncertain evidence',
        evidenceType: 'uncertain',
        confidence: 0.58,
        box: { ymin: 410, xmin: 160, ymax: 760, xmax: 480 },
        morphologyDescription: 'Ambiguous cues: winding track abruptly widening into necrotic patch. Could represent either an early 2nd instar Tuta mine or overlapping Liriomyza gallery termination.',
        galleryType: 'indeterminate',
        areaMm2Approx: 13.9,
        activeLarvaeProb: 0.54,
        characteristics: {
          galleryWidthMm: 3.2,
          frassDetected: false,
          windingIndex: 1.88,
          necroticRatio: 0.51,
        },
        uncertaintyReason: 'Overlapping symptoms between young Tuta blotch entry and serpentine terminal pupation chamber.',
        recommendedPathway: 'Capture macro close-up at 10x or flag for agronomist stereomicroscope verification',
      },
    ],
    longitudinal: [
      { day: 1, date: 'Oct 23', damagePercent: 4.2, mineCount: 1, activeLengthMm: 12, status: 'Initial Infestation', notes: 'First solitary winding track detected on leaflet margin.' },
      { day: 4, date: 'Oct 26', damagePercent: 11.5, mineCount: 2, activeLengthMm: 34, status: 'Larval Expansion', notes: 'Second mine emerged near apex with blotch widening.' },
      { day: 8, date: 'Oct 30', damagePercent: 21.0, mineCount: 3, activeLengthMm: 58, status: 'Larval Expansion', notes: 'Necrotic blotch expanded, frass accumulation confirmed.' },
      { day: 12, date: 'Nov 03', damagePercent: 28.4, mineCount: 3, activeLengthMm: 68, status: 'Biocontrol Applied', notes: 'Current inspection. Nesidiocoris biological predator released.' },
    ],
  },
  {
    id: 'sample-tuta-02',
    title: 'Sample #02: Dominant Tuta Blotch Necrosis',
    subtitle: 'Greenhouse Block A · Row 03 · Plant #14 · Mid Canopy Leaf',
    pestCategory: 'tuta',
    imageSrc: '/src/assets/images/tomato_leaf_tuta_blotch_1793734447498.jpg',
    damagePercent: 32.1,
    primaryDiagnosis: 'Tuta absoluta (Tomato Pinworm)',
    qualityCheck: {
      passed: true,
      blurScore: 0.96,
      blurDetected: false,
      glareScore: 0.05,
      glareDetected: false,
      distanceStatus: 'optimal',
      lightingQuality: 'excellent',
      feedbackNotes: 'Optimal lighting. Epidermal blistering clearly differentiated from surrounding green parenchyma.',
    },
    plainLanguage: {
      statusHeadline: 'High-Severity Tuta absoluta Necrosis Confirmed',
      whatIsKnown: 'Large irregular blotch gallery with heavy black frass aggregation. 85% of region displays complete mesophyll destruction.',
      whatIsUncertain: 'Larval presence: frass is fresh, high probability of active 3rd instar larva inside intact translucent chamber.',
      recommendedNextStep: 'Prune severely damaged leaflet and bag immediately to prevent adult moth emergence. Apply Azadirachtin / Neem extract.',
      ipmUrgency: 'immediate',
    },
    fingerprint: {
      fingerprintId: 'FP-TUT-4109B',
      plantId: 'P-014',
      rowId: 'R-03',
      fieldId: 'Greenhouse Block A',
      timestamp: '2026-11-03 09:28:10 UTC',
      totalLeafDamagePercent: 32.1,
      activeMinesCount: 2,
      leafSurfaceAreaCm2: 38.6,
      canopyLevel: 'Middle',
      gpsCoordinates: { lat: 13.0512, lng: 77.5891 },
      hash: '0x3a99e821bc10d944e8720aa442e90c51',
    },
    regions: [
      {
        id: 'REG-A1',
        badge: 'A',
        label: 'Region A · Tuta Blotch Gallery',
        evidenceType: 'tuta_consistent',
        confidence: 0.98,
        box: { ymin: 260, xmin: 270, ymax: 780, xmax: 750 },
        morphologyDescription: 'Characteristic parchment-like necrotic blotch with transparent leaf epidermis intact. Frass grains dispersed heavily along margins.',
        galleryType: 'blotch',
        areaMm2Approx: 48.2,
        activeLarvaeProb: 0.93,
        characteristics: {
          galleryWidthMm: 14.5,
          frassDetected: true,
          frassType: 'black granular aggregates',
          windingIndex: 1.08,
          necroticRatio: 0.91,
        },
        recommendedPathway: 'Sanitation + Biopesticide application (Bt kurstaki or Spinosad if economic threshold reached)',
      },
    ],
    longitudinal: [
      { day: 1, date: 'Oct 22', damagePercent: 6.0, mineCount: 1, activeLengthMm: 15, status: 'Initial Infestation', notes: 'Small pinpoint feeding puncture observed.' },
      { day: 5, date: 'Oct 26', damagePercent: 18.2, mineCount: 1, activeLengthMm: 38, status: 'Larval Expansion', notes: 'Blotch doubled in diameter.' },
      { day: 9, date: 'Oct 30', damagePercent: 27.5, mineCount: 2, activeLengthMm: 52, status: 'Larval Expansion', notes: 'Frass aggregates darkening.' },
      { day: 13, date: 'Nov 03', damagePercent: 32.1, mineCount: 2, activeLengthMm: 62, status: 'Larval Expansion', notes: 'Substantial epidermal drying and parenchymal loss.' },
    ],
  },
  {
    id: 'sample-liriomyza-03',
    title: 'Sample #03: Classic Liriomyza Serpentine Mines',
    subtitle: 'Greenhouse Block B · Row 11 · Plant #88 · Lower Canopy Leaf',
    pestCategory: 'liriomyza',
    imageSrc: '/src/assets/images/tomato_leaf_liriomyza_trail_1793734447042.jpg',
    damagePercent: 16.5,
    primaryDiagnosis: 'Liriomyza spp. (Serpentine Leaf Miner)',
    qualityCheck: {
      passed: true,
      blurScore: 0.91,
      blurDetected: false,
      glareScore: 0.11,
      glareDetected: false,
      distanceStatus: 'optimal',
      lightingQuality: 'good',
      feedbackNotes: 'Fine trail contrast sharp. No motion blur or lens distortion detected.',
    },
    plainLanguage: {
      statusHeadline: 'Liriomyza Serpentine Trail Confirmed · Moderate Infestation',
      whatIsKnown: 'Classic narrow, twisting serpentine mines with typical width expansion from oviposition site toward margin.',
      whatIsUncertain: 'Whether larva has already exited to pupate in soil/leaf surface or remains active at the terminal tunnel.',
      recommendedNextStep: 'Deploy yellow sticky traps at canopy level. Check soil surface for puparia. Introduce Diglyphus isaea parasitoid wasps.',
      ipmUrgency: 'moderate',
    },
    fingerprint: {
      fingerprintId: 'FP-LIR-1940C',
      plantId: 'P-088',
      rowId: 'R-11',
      fieldId: 'Greenhouse Block B',
      timestamp: '2026-11-03 08:45:00 UTC',
      totalLeafDamagePercent: 16.5,
      activeMinesCount: 2,
      leafSurfaceAreaCm2: 41.0,
      canopyLevel: 'Lower',
      gpsCoordinates: { lat: 13.0489, lng: 77.5865 },
      hash: '0x992cf019a820c441ef314a821e98bb42',
    },
    regions: [
      {
        id: 'REG-B1',
        badge: 'B',
        label: 'Region B1 · Upper Serpentine Mine',
        evidenceType: 'liriomyza_consistent',
        confidence: 0.95,
        box: { ymin: 210, xmin: 400, ymax: 480, xmax: 750 },
        morphologyDescription: 'Meandering continuous white-to-yellow tunnel without necrotic blotch formation. High sinuosity index (3.8).',
        galleryType: 'serpentine',
        areaMm2Approx: 14.8,
        activeLarvaeProb: 0.78,
        characteristics: {
          galleryWidthMm: 0.85,
          frassDetected: true,
          frassType: 'lateral biseriate frass',
          windingIndex: 3.8,
          necroticRatio: 0.15,
        },
        recommendedPathway: 'Parasitoid conservation + yellow sticky trap monitoring',
      },
      {
        id: 'REG-B2',
        badge: 'B',
        label: 'Region B2 · Lower Serpentine Track',
        evidenceType: 'liriomyza_consistent',
        confidence: 0.93,
        box: { ymin: 490, xmin: 200, ymax: 730, xmax: 710 },
        morphologyDescription: 'Extended winding loop along lower leaflet lobe. Terminus shows widened exit slit indicating late 3rd instar.',
        galleryType: 'serpentine',
        areaMm2Approx: 18.6,
        activeLarvaeProb: 0.65,
        characteristics: {
          galleryWidthMm: 1.25,
          frassDetected: true,
          frassType: 'lateral biseriate frass',
          windingIndex: 4.1,
          necroticRatio: 0.18,
        },
        recommendedPathway: 'Soil drench monitoring for pupae + biological control',
      },
    ],
    longitudinal: [
      { day: 1, date: 'Oct 24', damagePercent: 2.5, mineCount: 1, activeLengthMm: 8, status: 'Initial Infestation', notes: 'First oviposition puncture found.' },
      { day: 5, date: 'Oct 28', damagePercent: 7.8, mineCount: 1, activeLengthMm: 22, status: 'Larval Expansion', notes: 'Track curved through midvein.' },
      { day: 9, date: 'Nov 01', damagePercent: 12.4, mineCount: 2, activeLengthMm: 44, status: 'Larval Expansion', notes: 'Second track initiated.' },
      { day: 12, date: 'Nov 03', damagePercent: 16.5, mineCount: 2, activeLengthMm: 56, status: 'Pupation / Arrested', notes: 'Exit slit observed; pupation imminent.' },
    ],
  },
  {
    id: 'sample-healthy-04',
    title: 'Sample #01: Control Baseline · Healthy Foliage',
    subtitle: 'Greenhouse Block C · Row 01 · Plant #05 · Upper Canopy Leaf',
    pestCategory: 'healthy',
    imageSrc: '/src/assets/images/tomato_leaf_healthy_field_1793734448616.jpg',
    damagePercent: 0.0,
    primaryDiagnosis: 'Healthy Leaf (Zero Pest Damage Detected)',
    qualityCheck: {
      passed: true,
      blurScore: 0.98,
      blurDetected: false,
      glareScore: 0.03,
      glareDetected: false,
      distanceStatus: 'optimal',
      lightingQuality: 'excellent',
      feedbackNotes: 'Pristine focus. Uniform chlorophyll pigmentation without chlorosis or epidermal tunneling.',
    },
    plainLanguage: {
      statusHeadline: 'Healthy Leaf Tissue · No Action Required',
      whatIsKnown: 'Zero leaf-mining galleries, frass deposits, or necrotic lesions identified across the lamina.',
      whatIsUncertain: 'None. Confidence in negative status is 99.4%.',
      recommendedNextStep: 'Maintain standard routine scouting schedule (once every 48 hours per ICAR-IIHR guidelines).',
      ipmUrgency: 'low',
    },
    fingerprint: {
      fingerprintId: 'FP-HEA-0012Z',
      plantId: 'P-005',
      rowId: 'R-01',
      fieldId: 'Greenhouse Block C',
      timestamp: '2026-11-03 07:15:20 UTC',
      totalLeafDamagePercent: 0.0,
      activeMinesCount: 0,
      leafSurfaceAreaCm2: 46.5,
      canopyLevel: 'Upper',
      gpsCoordinates: { lat: 13.0531, lng: 77.5912 },
      hash: '0x00000000000000000000000000000000',
    },
    regions: [],
    longitudinal: [
      { day: 1, date: 'Oct 23', damagePercent: 0.0, mineCount: 0, activeLengthMm: 0, status: 'Pupation / Arrested', notes: 'Healthy emergence.' },
      { day: 4, date: 'Oct 26', damagePercent: 0.0, mineCount: 0, activeLengthMm: 0, status: 'Pupation / Arrested', notes: 'Vigorous vegetative growth.' },
      { day: 8, date: 'Oct 30', damagePercent: 0.0, mineCount: 0, activeLengthMm: 0, status: 'Pupation / Arrested', notes: 'Canopy fully green.' },
      { day: 12, date: 'Nov 03', damagePercent: 0.0, mineCount: 0, activeLengthMm: 0, status: 'Pupation / Arrested', notes: 'Clean control sample.' },
    ],
  },
];

// 12 rows x 8 plants greenhouse grid for Farm-Level Intelligence (Layer 6)
export const GENERATED_FARM_GRID: PlantGridCell[] = (() => {
  const cells: PlantGridCell[] = [];
  const rows = 10;
  const cols = 8;

  for (let r = 1; r <= rows; r++) {
    const rowId = `R-${r.toString().padStart(2, '0')}`;
    for (let c = 1; c <= cols; c++) {
      const plantId = `P-${((r - 1) * cols + c).toString().padStart(3, '0')}`;

      // Create realistic spatial clustering: Row 7 plant 42 is mixed hot zone
      let status: PlantGridCell['status'] = 'healthy';
      let damagePercent = 0;
      let riskScore = 8;

      const distToHotZone = Math.hypot(r - 7, c - 4);
      const distToTutaZone = Math.hypot(r - 3, c - 2);
      const distToLiriomyzaZone = Math.hypot(r - 9, c - 7);

      if (r === 7 && c === 4) {
        status = 'mixed_active';
        damagePercent = 28.4;
        riskScore = 94;
      } else if (distToHotZone < 1.6) {
        status = 'mixed_active';
        damagePercent = Math.round(18 + Math.random() * 10);
        riskScore = 85;
      } else if (distToTutaZone < 1.8) {
        status = 'tuta_active';
        damagePercent = Math.round(22 + Math.random() * 12);
        riskScore = 78;
      } else if (distToLiriomyzaZone < 1.8) {
        status = 'liriomyza_active';
        damagePercent = Math.round(12 + Math.random() * 8);
        riskScore = 65;
      } else if ((r === 4 && c === 7) || (r === 8 && c === 1) || (r === 10 && c === 3)) {
        status = 'unsampled';
        riskScore = 45;
      } else if (r === 2 && c === 5) {
        status = 'under_treatment';
        damagePercent = 14.2;
        riskScore = 32;
      } else {
        status = 'healthy';
        damagePercent = 0;
        riskScore = Math.round(5 + Math.random() * 10);
      }

      cells.push({
        plantId,
        rowId,
        colIndex: c,
        rowIndex: r,
        status,
        damagePercent: status === 'unsampled' ? undefined : damagePercent,
        lastScoutedDate: status === 'unsampled' ? undefined : '2026-11-03',
        riskScore,
      });
    }
  }
  return cells;
})();

// Scientific Credibility & Benchmark Table (Page 8 of PDF)
export const SCIENTIFIC_METRICS = [
  {
    metric: 'Precision, Recall, F1',
    question: 'Are pest-related predictions correct and complete?',
    protocol: 'Per class, on held-out expert-labelled images (ICAR-IIHR)',
    status: 'Planned / Simulated Benchmark',
    targetScore: 'Tuta: 93.4% F1 · Liriomyza: 91.8% F1',
  },
  {
    metric: 'Mixed-infestation recall',
    question: 'Do we catch genuine mixed cases without collapsing to single label?',
    protocol: 'Expert-confirmed mixed samples with dual oviposition',
    status: 'Planned / Simulated Benchmark',
    targetScore: '88.6% Mixed Recall',
  },
  {
    metric: 'Segmentation IoU / Dice',
    question: 'Are mines and leaf area outlined accurately for damage % calculation?',
    protocol: 'Pixel masks vs expert polygon annotation',
    status: 'Planned / Simulated Benchmark',
    targetScore: 'Mean IoU: 0.84 · Dice: 0.89',
  },
  {
    metric: 'False positives rejection',
    question: 'Are healthy leaves or unrelated damage (mildew, sunscald) falsely flagged?',
    protocol: 'Healthy and other-damage negative control set',
    status: 'Planned / Simulated Benchmark',
    targetScore: '< 2.4% False Positive Rate',
  },
  {
    metric: 'Confidence calibration',
    question: 'Does confidence match true empirical correctness?',
    protocol: 'Reliability diagram, ECE (Expected Calibration Error)',
    status: 'Planned / Simulated Benchmark',
    targetScore: 'ECE ≤ 0.042 (High Reliability)',
  },
  {
    metric: 'Unknown-case rejection',
    question: 'Does the system abstain and recommend close-ups on out-of-scope input?',
    protocol: 'Held-out unseen abiotic stress and extreme blur',
    status: 'Planned / Simulated Benchmark',
    targetScore: '96.2% Safe Abstention Rate',
  },
  {
    metric: 'Inference latency',
    question: 'Is it fast enough in the field on budget smartphones?',
    protocol: 'Capture-to-result time on target Android/iOS PWA runtime',
    status: 'Planned / Simulated Benchmark',
    targetScore: '142 ms (Mobile WebAssembly / ONNX)',
  },
  {
    metric: 'Usability & field testing',
    question: 'Can farmers and scouts use it effectively in daylight conditions?',
    protocol: 'Scouting trials with smallholder farmers & agronomists',
    status: 'Planned / Simulated Benchmark',
    targetScore: '4.8 / 5.0 Farmer Ease of Use Score',
  },
];

// Project credits from Page 1 & 9
export const PROJECT_CREDITS = {
  competition: 'CHIP TO CROP 2026 · Problem Statement 04',
  institution: 'Presidency University',
  teamName: 'Binary Bengaluru',
  teamLead: 'Muskan Singh (Team Lead & AI / System Integration)',
  members: [
    { name: 'Muskan Singh', role: 'Team Lead & AI / System Integration' },
    { name: 'Akash', role: 'Dataset & Annotation Research' },
    { name: 'Jeevith P', role: 'AI Model Development' },
    { name: 'Hitesh S L', role: 'Frontend & UX' },
    { name: 'Mahaida Hashmi', role: 'Backend, QA & Validation' },
  ],
  references: [
    'CHIP TO CROP 24-hour AgriTech Hackathon Rulebook & Problem Statements',
    'ICAR-Indian Institute of Horticultural Research, Bengaluru',
    'EPPO Global Database — Tuta absoluta (Tomato Leafminer)',
    'Campos MR et al. (2017) Journal of Pest Science 90, 787–796',
    'FastAPI documentation & PyTorch / OpenCV Leaf Segmentation Pipeline',
  ],
};
