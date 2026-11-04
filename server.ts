import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini Client server-side
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

// ==========================================
// IN-MEMORY SCIENTIFIC DATABASE & SEED DATA
// ==========================================

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
  area_mm2?: number;
  active_larvae_prob?: number;
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
  gps_coordinates?: { lat: number; lng: number } | null;
  created_at: string;
  image_sha256?: string;
  algorithm?: string;
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
  record_source?: 'sample' | 'live_ai';
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

// Global In-Memory Stores
let USERS: User[] = [
  {
    id: 'USR-01',
    name: 'Field Scout',
    email: 'field.scout@phytotrace.ai',
    role: 'farmer',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'USR-EXPERT',
    name: 'Dr. C. Gopalakrishnan',
    email: 'gopal.ento@iihr.res.in',
    role: 'expert',
    created_at: '2026-08-15T09:00:00Z',
  },
];

let FARMS: Farm[] = [
  {
    id: 'FARM-BLR-01',
    owner_id: 'USR-01',
    farm_name: 'Hessarghatta Precision Agri Hub',
    location: 'Bengaluru Rural, Karnataka (13.0498° N, 77.5872° E)',
    total_area_acres: 4.5,
    created_at: '2026-09-01T08:30:00Z',
  },
];

let FIELDS: Field[] = [
  {
    id: 'FIELD-GH-B',
    farm_id: 'FARM-BLR-01',
    field_name: 'Greenhouse Block B (Trellised Hybrid Tomatoes)',
    crop_type: 'Solanum lycopersicum (Tomato cv. Arka Rakshak)',
    total_plants: 80,
  },
];

// Seed 80 Plants for Greenhouse Block B
let PLANTS: Plant[] = (() => {
  const list: Plant[] = [];
  const rows = 10;
  const cols = 8;
  for (let r = 1; r <= rows; r++) {
    const rowId = `R-${r.toString().padStart(2, '0')}`;
    for (let c = 1; c <= cols; c++) {
      const pNum = (r - 1) * cols + c;
      const plantId = `P-${pNum.toString().padStart(3, '0')}`;

      let status: Plant['status'] = 'not_inspected';
      let damage: number | undefined = undefined;
      let lastInspected: string | undefined = undefined;

      if (r === 7 && c === 4) {
        status = 'evidence_detected';
        damage = 28.4;
        lastInspected = '2026-11-03T10:14:22Z';
      } else if (r === 3 && c === 2) {
        status = 'evidence_detected';
        damage = 32.1;
        lastInspected = '2026-11-03T09:28:10Z';
      } else if (r === 9 && c === 7) {
        status = 'evidence_detected';
        damage = 16.5;
        lastInspected = '2026-11-03T08:45:00Z';
      } else if (r === 1 && c === 5) {
        status = 'recently_inspected';
        damage = 0.0;
        lastInspected = '2026-11-03T07:15:20Z';
      } else if (r === 7 && (c === 3 || c === 5)) {
        status = 'needs_review';
        damage = 19.2;
        lastInspected = '2026-11-02T14:30:00Z';
      }

      list.push({
        id: `PLANT-${plantId}`,
        field_id: 'FIELD-GH-B',
        plant_identifier: plantId,
        row_identifier: rowId,
        col_identifier: c,
        planting_date: '2026-09-15',
        status,
        latest_damage_percent: damage,
        last_inspected_at: lastInspected,
      });
    }
  }
  return list;
})();

// Seed Initial Inspections
let INSPECTIONS: Inspection[] = [
  {
    id: 'INSP-2026-0042',
    plant_id: 'PLANT-P-042',
    plant_identifier: 'P-042',
    field_id: 'FIELD-GH-B',
    farm_id: 'FARM-BLR-01',
    image_path: '/src/assets/images/tomato_leaf_mixed_mines_1793734448287.jpg',
    inspection_date: '2026-11-03T10:14:22Z',
    quality_status: {
      passed: true,
      blur_detected: false,
      glare_detected: false,
      distance_acceptable: true,
      feedback_notes: 'Optimal focal depth and diffused light. Clear lamina differentiation.',
    },
    overall_status: 'mixed_infestation',
    primary_diagnosis: 'Mixed Infestation (Tuta absoluta + Liriomyza spp.)',
    overall_damage_percent: 28.4,
    calibration_confidence: 0.91,
    uncertainty_flagged: true,
    abstention_recommended: false,
    verification_status: 'pending_expert_review',
    plain_language_summary: {
      what_is_known: 'Confirmed co-occurrence of broad blotch necrotic mine (Tuta) and narrow serpentine winding trails (Liriomyza).',
      what_is_uncertain: 'Overlapping region C exhibits intermediate morphology near terminal pupation slit.',
      recommended_next_step: 'Deploy Qlure-TUA delta traps and yellow sticky cards immediately; prepare bio-rational Bt/Azadirachtin treatment.',
    },
    regions: [
      {
        id: 'REG-0042-A',
        inspection_id: 'INSP-2026-0042',
        badge: 'A',
        region_type: 'tuta_consistent',
        bounding_coordinates: { ymin: 490, xmin: 480, ymax: 820, xmax: 840 },
        confidence: 0.94,
        evidence_description: 'Broad irregular blotch-like necrotic gallery with internal dark frass granular aggregates and parenchymal loss.',
        gallery_type: 'blotch',
        area_mm2: 36.8,
        active_larvae_prob: 0.89,
      },
      {
        id: 'REG-0042-B',
        inspection_id: 'INSP-2026-0042',
        badge: 'B',
        region_type: 'liriomyza_consistent',
        bounding_coordinates: { ymin: 140, xmin: 220, ymax: 390, xmax: 640 },
        confidence: 0.92,
        evidence_description: 'Narrow winding serpentine epidermal path meandering across secondary veins without blotch widening.',
        gallery_type: 'serpentine',
        area_mm2: 17.5,
        active_larvae_prob: 0.82,
      },
      {
        id: 'REG-0042-C',
        inspection_id: 'INSP-2026-0042',
        badge: 'C',
        region_type: 'uncertain',
        bounding_coordinates: { ymin: 410, xmin: 160, ymax: 760, xmax: 480 },
        confidence: 0.58,
        evidence_description: 'Ambiguous cues: winding trail converging into expanding necrosis. Flagged for close-up or stereomicroscope verification.',
        gallery_type: 'indeterminate',
        area_mm2: 13.9,
        active_larvae_prob: 0.54,
      },
    ],
    fingerprint: {
      id: 'FP-MIX-8892A',
      inspection_id: 'INSP-2026-0042',
      plant_id: 'P-042',
      farm_id: 'FARM-BLR-01',
      field_id: 'FIELD-GH-B',
      fingerprint_hash: '0x8f4c2e17d9ab40c3912ee567fa09321e8842',
      leaf_surface_damage_percent: 28.4,
      active_mines_count: 3,
      canopy_stratum: 'Upper',
      gps_coordinates: { lat: 13.0498, lng: 77.5872 },
      created_at: '2026-11-03T10:14:22Z',
    },
  },
  {
    id: 'INSP-2026-0014',
    plant_id: 'PLANT-P-014',
    plant_identifier: 'P-014',
    field_id: 'FIELD-GH-B',
    farm_id: 'FARM-BLR-01',
    image_path: '/src/assets/images/tomato_leaf_tuta_blotch_1793734447498.jpg',
    inspection_date: '2026-11-03T09:28:10Z',
    quality_status: {
      passed: true,
      blur_detected: false,
      glare_detected: false,
      distance_acceptable: true,
      feedback_notes: 'Excellent illumination. Blotch border high sharpness.',
    },
    overall_status: 'tuta_absoluta',
    primary_diagnosis: 'Tuta absoluta (Tomato Pinworm)',
    overall_damage_percent: 32.1,
    calibration_confidence: 0.98,
    uncertainty_flagged: false,
    abstention_recommended: false,
    verification_status: 'verified_by_expert',
    plain_language_summary: {
      what_is_known: 'Large irregular blotch gallery with heavy black frass aggregation. 85% of region displays complete mesophyll destruction.',
      what_is_uncertain: 'None. Typical late 3rd instar parchment damage.',
      recommended_next_step: 'Prune severely infested leaflet; deploy Qlure-TUA lures at 16 traps/acre.',
    },
    regions: [
      {
        id: 'REG-0014-A',
        inspection_id: 'INSP-2026-0014',
        badge: 'A',
        region_type: 'tuta_consistent',
        bounding_coordinates: { ymin: 260, xmin: 270, ymax: 780, xmax: 750 },
        confidence: 0.98,
        evidence_description: 'Characteristic parchment-like necrotic blotch with transparent leaf epidermis intact. Frass grains dispersed heavily along margins.',
        gallery_type: 'blotch',
        area_mm2: 48.2,
        active_larvae_prob: 0.93,
      },
    ],
    fingerprint: {
      id: 'FP-TUT-4109B',
      inspection_id: 'INSP-2026-0014',
      plant_id: 'P-014',
      farm_id: 'FARM-BLR-01',
      field_id: 'FIELD-GH-B',
      fingerprint_hash: '0x3a99e821bc10d944e8720aa442e90c51014a',
      leaf_surface_damage_percent: 32.1,
      active_mines_count: 1,
      canopy_stratum: 'Middle',
      gps_coordinates: { lat: 13.0512, lng: 77.5891 },
      created_at: '2026-11-03T09:28:10Z',
    },
    review: {
      id: 'REV-0014',
      inspection_id: 'INSP-2026-0014',
      reviewer_name: 'Dr. C. Gopalakrishnan (IIHR Entomologist)',
      review_status: 'confirmed',
      review_notes: 'Confirmed Tuta absoluta damage. High frass density indicates active larval feeding.',
      reviewed_at: '2026-11-03T11:00:00Z',
    },
  },
  {
    id: 'INSP-2026-0088',
    plant_id: 'PLANT-P-088',
    plant_identifier: 'P-088',
    field_id: 'FIELD-GH-B',
    farm_id: 'FARM-BLR-01',
    image_path: '/src/assets/images/tomato_leaf_liriomyza_trail_1793734447042.jpg',
    inspection_date: '2026-11-03T08:45:00Z',
    quality_status: {
      passed: true,
      blur_detected: false,
      glare_detected: false,
      distance_acceptable: true,
      feedback_notes: 'Sharp fine trail venation. Glare minimal.',
    },
    overall_status: 'liriomyza_spp',
    primary_diagnosis: 'Liriomyza spp. (Serpentine Leaf Miner)',
    overall_damage_percent: 16.5,
    calibration_confidence: 0.94,
    uncertainty_flagged: false,
    abstention_recommended: false,
    verification_status: 'pending_expert_review',
    plain_language_summary: {
      what_is_known: 'Classic narrow, twisting serpentine mines with typical width expansion from oviposition site toward margin.',
      what_is_uncertain: 'Whether larva has already exited to pupate in soil/leaf surface or remains active at the terminal tunnel.',
      recommended_next_step: 'Deploy yellow sticky traps at canopy level. Introduce Diglyphus isaea parasitoid wasps.',
    },
    regions: [
      {
        id: 'REG-0088-B1',
        inspection_id: 'INSP-2026-0088',
        badge: 'B',
        region_type: 'liriomyza_consistent',
        bounding_coordinates: { ymin: 210, xmin: 400, ymax: 480, xmax: 750 },
        confidence: 0.95,
        evidence_description: 'Meandering continuous white-to-yellow tunnel without necrotic blotch formation. High sinuosity index (3.8).',
        gallery_type: 'serpentine',
        area_mm2: 14.8,
        active_larvae_prob: 0.78,
      },
      {
        id: 'REG-0088-B2',
        inspection_id: 'INSP-2026-0088',
        badge: 'B',
        region_type: 'liriomyza_consistent',
        bounding_coordinates: { ymin: 490, xmin: 200, ymax: 730, xmax: 710 },
        confidence: 0.93,
        evidence_description: 'Extended winding loop along lower leaflet lobe. Terminus shows widened exit slit indicating late 3rd instar.',
        gallery_type: 'serpentine',
        area_mm2: 18.6,
        active_larvae_prob: 0.65,
      },
    ],
    fingerprint: {
      id: 'FP-LIR-1940C',
      inspection_id: 'INSP-2026-0088',
      plant_id: 'P-088',
      farm_id: 'FARM-BLR-01',
      field_id: 'FIELD-GH-B',
      fingerprint_hash: '0x992cf019a820c441ef314a821e98bb42088b',
      leaf_surface_damage_percent: 16.5,
      active_mines_count: 2,
      canopy_stratum: 'Lower',
      gps_coordinates: { lat: 13.0489, lng: 77.5865 },
      created_at: '2026-11-03T08:45:00Z',
    },
  },
  {
    id: 'INSP-2026-0005',
    plant_id: 'PLANT-P-005',
    plant_identifier: 'P-005',
    field_id: 'FIELD-GH-B',
    farm_id: 'FARM-BLR-01',
    image_path: '/src/assets/images/tomato_leaf_healthy_field_1793734448616.jpg',
    inspection_date: '2026-11-03T07:15:20Z',
    quality_status: {
      passed: true,
      blur_detected: false,
      glare_detected: false,
      distance_acceptable: true,
      feedback_notes: 'Pristine specimen. Healthy trichome density.',
    },
    overall_status: 'healthy',
    primary_diagnosis: 'Healthy Tomato Leaf (Zero Pest Damage Detected)',
    overall_damage_percent: 0.0,
    calibration_confidence: 0.99,
    uncertainty_flagged: false,
    abstention_recommended: false,
    verification_status: 'verified_by_expert',
    plain_language_summary: {
      what_is_known: 'Zero leaf-mining galleries, frass deposits, or necrotic lesions identified across the lamina.',
      what_is_uncertain: 'None. High confidence in negative control.',
      recommended_next_step: 'Maintain standard routine scouting schedule (once every 48 hours per ICAR-IIHR guidelines).',
    },
    regions: [],
    fingerprint: {
      id: 'FP-HEA-0012Z',
      inspection_id: 'INSP-2026-0005',
      plant_id: 'P-005',
      farm_id: 'FARM-BLR-01',
      field_id: 'FIELD-GH-B',
      fingerprint_hash: '0x000000000000000000000000000000000005',
      leaf_surface_damage_percent: 0.0,
      active_mines_count: 0,
      canopy_stratum: 'Upper',
      gps_coordinates: { lat: 13.0531, lng: 77.5912 },
      created_at: '2026-11-03T07:15:20Z',
    },
  },
];

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    product: 'PhytoTrace 2.0',
    tagline: 'Intelligence in Every Leaf.',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
    total_inspections: INSPECTIONS.length,
    total_plants: PLANTS.length,
  });
});

// Plant care helper: keep responses limited to crops, gardening, and plant health.
function getPlantHelpFallback(question: string) {
  const q = question.toLowerCase();
  const plantTopic = /\b(plant|crop|leaf|leaves|tomato|seed|soil|garden|pest|insect|fungus|disease|water|watering|fertili[sz]er|farm|wilting|yellow|spot|hole)\b/.test(q);
  if (!plantTopic) {
    return 'I can only help with plants, crops, pests, and plant care. Tell me the crop and what you can see on it.';
  }
  if (/yellow|pale|discolou?r/.test(q)) {
    return 'Yellow leaves can happen from too much or too little water, a nutrient issue, or pests. Check whether the soil is soggy or very dry, then look under the leaves for insects. Avoid spraying or adding fertilizer until you know more. Which crop is it, and are the older or newer leaves turning yellow?';
  }
  if (/pest|insect|bug|caterpillar|worm|hole|chew/.test(q)) {
    return 'Look on both sides of a few affected leaves for insects, eggs, or fine webbing. Take a clear close-up photo and check nearby plants too. If damage is spreading, ask your local agriculture officer to confirm the pest before spraying. Which crop is affected?';
  }
  if (/water|watering|dry|soggy|wilting/.test(q)) {
    return 'Check the soil near the roots before watering. If it is still wet, wait; if the top soil is dry, water slowly at the base of the plant. Avoid keeping the soil waterlogged. The right amount depends on the crop, soil, and weather—what crop are you growing?';
  }
  if (/spot|blotch|mark|rot|fungus|disease/.test(q)) {
    return 'Many problems can make spots on leaves, and a photo alone may not confirm the cause. Check whether the spots are spreading and whether the underside of the leaf is affected. Avoid spraying until the cause is clearer. Which crop is this, and when did the spots first appear?';
  }
  return 'I can help you check plant symptoms and care. Tell me the crop, what you see, and when it started. A clear photo of one affected leaf can help narrow down the next steps.';
}

app.post('/api/plant-help', async (req, res) => {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question || question.length > 500) {
    return res.status(400).json({ error: 'Please enter a plant question under 500 characters.' });
  }
  if (!ai) {
    return res.json({ answer: getPlantHelpFallback(question), limited: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are PhytoTrace Plant Help, a small crop-care helper for farmers. Answer only questions about crops, plants, soil, watering, plant diseases, pests, and safe farm practices. If unrelated, reply exactly: I can only help with plants, crops, pests, and plant care. Use simple, friendly language, short sentences, and practical steps. Ask a brief follow-up if needed. Never make a certain diagnosis from text alone. Do not recommend pesticide brands, unsafe mixtures, or unsupported chemical doses. Encourage checking the product label and asking a local agriculture officer before spraying.\n\nFarmer question: ${question}`,
    });
    res.json({ answer: response.text || 'I could not prepare an answer. Please try asking in a different way.' });
  } catch (error) {
    console.error('Plant help error:', error);
    res.json({ answer: getPlantHelpFallback(question), limited: true });
  }
});

// Create Kannada speech on the server: Uses Gemini if available, or seamlessly
// falls back to the high-reliability audio engine (No API Key required)
app.post('/api/plant-audio', async (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text) {
    return res.status(400).json({ error: 'Audio text is required.' });
  }

  // 1. If GEMINI_API_KEY is configured, try Gemini TTS first
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const ttsResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          model: 'gemini-3.8-flash-tts',
          input: [{ type: 'user_input', content: [{ type: 'text', text: `Read this farmer advisory aloud in clear, natural Kannada at a calm pace. Do not translate it or add words: ${text}` }] }],
          response_format: { type: 'audio' },
          generation_config: { speech_config: [{ voice: 'Kore' }] },
        }),
      });

      if (ttsResponse.ok) {
        const result = await ttsResponse.json();
        const audioData = result.output_audio?.data || result.output?.audio?.data;
        if (audioData) {
          return res.json({ audio: audioData, mimeType: result.output_audio?.mime_type || 'audio/wav' });
        }
      }
    } catch (geminiError) {
      console.warn('Gemini TTS unavailable, falling back to direct Kannada audio stream:', geminiError);
    }
  }

  // 2. High-reliability fallback: Free Kannada audio stream (Always works, no key required)
  try {
    const cleanText = text.slice(0, 250);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=kn&client=tw-ob`;

    const ttsResponse = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!ttsResponse.ok) {
      throw new Error(`Upstream TTS returned HTTP ${ttsResponse.status}`);
    }

    const arrayBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return res.json({
      audio: base64Audio,
      mimeType: 'audio/mpeg',
    });
  } catch (error: any) {
    console.error('All Kannada audio generators failed:', error.message);
    return res.status(500).json({ error: 'Kannada audio could not be generated. Please try again.' });
  }
});

// Auth Routes (Section 16)
app.post('/api/auth/login', (req, res) => {
  const { email, password, role = 'farmer' } = req.body;
  const user = USERS.find((u) => u.email === email) || {
    id: 'USR-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    name: role === 'expert' ? 'Dr. Agricultural Expert' : 'Field Scout',
    email: email || 'farmer@phytotrace.ai',
    role,
    created_at: new Date().toISOString(),
  };

  res.json({
    success: true,
    token: 'jwt-phytotrace-' + Buffer.from(user.id).toString('base64'),
    user,
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role = 'farmer' } = req.body;
  const newUser: User = {
    id: 'USR-' + (USERS.length + 1).toString().padStart(2, '0'),
    name: name || 'New Farm Operator',
    email: email || 'farmer@phytotrace.ai',
    role: role as any,
    created_at: new Date().toISOString(),
  };
  USERS.push(newUser);
  res.json({
    success: true,
    token: 'jwt-phytotrace-' + Buffer.from(newUser.id).toString('base64'),
    user: newUser,
  });
});

// Dashboard Overview
app.get('/api/dashboard/overview', (req, res) => {
  const totalInspections = INSPECTIONS.length;
  const plantsMonitored = PLANTS.filter((p) => p.status !== 'not_inspected').length;
  const suspectedCases = INSPECTIONS.filter((i) => i.overall_status !== 'healthy').length;
  const pendingReviews = INSPECTIONS.filter((i) => i.verification_status === 'pending_expert_review').length;

  const evidenceDistribution = {
    tuta: INSPECTIONS.filter((i) => i.overall_status === 'tuta_absoluta').length,
    liriomyza: INSPECTIONS.filter((i) => i.overall_status === 'liriomyza_spp').length,
    mixed: INSPECTIONS.filter((i) => i.overall_status === 'mixed_infestation').length,
    healthy: INSPECTIONS.filter((i) => i.overall_status === 'healthy').length,
    uncertain: INSPECTIONS.filter((i) => i.overall_status === 'uncertain').length,
  };

  res.json({
    totalInspections,
    plantsMonitored,
    suspectedCases,
    pendingReviews,
    evidenceDistribution,
    recentInspections: INSPECTIONS.slice(0, 5),
    activeFarm: FARMS[0],
    activeField: FIELDS[0],
  });
});

// Farms and Analytics
app.get('/api/farms', (req, res) => {
  res.json({ farms: FARMS });
});

app.get('/api/farms/:id/analytics', (req, res) => {
  const farmInspections = INSPECTIONS.filter((i) => i.farm_id === req.params.id || req.params.id === 'FARM-BLR-01');
  const avgDamage =
    farmInspections.length > 0
      ? farmInspections.reduce((acc, curr) => acc + curr.overall_damage_percent, 0) / farmInspections.length
      : 0;

  res.json({
    farm_id: req.params.id,
    inspections_count: farmInspections.length,
    average_damage_percent: Number(avgDamage.toFixed(1)),
    distribution: {
      mixed: farmInspections.filter((i) => i.overall_status === 'mixed_infestation').length,
      tuta: farmInspections.filter((i) => i.overall_status === 'tuta_absoluta').length,
      liriomyza: farmInspections.filter((i) => i.overall_status === 'liriomyza_spp').length,
      healthy: farmInspections.filter((i) => i.overall_status === 'healthy').length,
    },
    timeline: [
      { date: 'Oct 24', inspections: 2, damage_avg: 4.5 },
      { date: 'Oct 28', inspections: 5, damage_avg: 12.0 },
      { date: 'Nov 01', inspections: 8, damage_avg: 19.8 },
      { date: 'Nov 03', inspections: farmInspections.length, damage_avg: Number(avgDamage.toFixed(1)) },
    ],
  });
});

// Plants
app.get('/api/plants', (req, res) => {
  res.json({ plants: PLANTS });
});

app.get('/api/plants/:id', (req, res) => {
  const plant = PLANTS.find((p) => p.id === req.params.id || p.plant_identifier === req.params.id);
  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  const plantInspections = INSPECTIONS.filter(
    (i) => i.plant_id === plant.id || i.plant_identifier === plant.plant_identifier
  );
  res.json({ plant, inspections: plantInspections });
});

// Inspections
app.get('/api/inspections', (req, res) => {
  const { search, status, plant } = req.query;
  let results = [...INSPECTIONS];

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    results = results.filter(
      (i) =>
        i.id.toLowerCase().includes(s) ||
        i.plant_identifier.toLowerCase().includes(s) ||
        i.primary_diagnosis.toLowerCase().includes(s)
    );
  }

  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter((i) => i.overall_status === status);
  }

  if (plant && typeof plant === 'string') {
    results = results.filter((i) => i.plant_identifier === plant);
  }

  res.json({ inspections: results });
});

app.get('/api/inspections/:id', (req, res) => {
  const inspection = INSPECTIONS.find((i) => i.id === req.params.id);
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  res.json({ inspection });
});

app.get('/api/inspections/:id/evidence', (req, res) => {
  const inspection = INSPECTIONS.find((i) => i.id === req.params.id);
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  res.json({
    inspection_id: inspection.id,
    plant_identifier: inspection.plant_identifier,
    image_path: inspection.image_path,
    overall_status: inspection.overall_status,
    damage_percent: inspection.overall_damage_percent,
    regions: inspection.regions,
    uncertainty_flagged: inspection.uncertainty_flagged,
  });
});

// Fingerprints
app.get('/api/fingerprints/:id', (req, res) => {
  const inspection = INSPECTIONS.find((i) => i.fingerprint?.id === req.params.id || i.id === req.params.id);
  if (!inspection || !inspection.fingerprint) {
    return res.status(404).json({ error: 'Damage Fingerprint record not found' });
  }
  res.json({ fingerprint: inspection.fingerprint, inspection });
});

// Expert Reviews
app.post('/api/expert-reviews', (req, res) => {
  const { inspection_id, reviewer_name = 'Dr. Agricultural Expert', review_status, review_notes } = req.body;
  const inspection = INSPECTIONS.find((i) => i.id === inspection_id);
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }

  const review: ExpertReview = {
    id: 'REV-' + Date.now().toString(36).toUpperCase(),
    inspection_id,
    reviewer_name,
    review_status: review_status || 'confirmed',
    review_notes: review_notes || 'Expert verified leaf damage biomarkers and approved diagnosis.',
    reviewed_at: new Date().toISOString(),
  };

  inspection.review = review;
  inspection.verification_status =
    review_status === 'confirmed'
      ? 'verified_by_expert'
      : review_status === 'close_up_requested'
      ? 'close_up_required'
      : 'pending_expert_review';

  res.json({ success: true, review, inspection });
});

// Core AI Leaf Analyzer & Inspection Pipeline
app.post('/api/analyze-leaf', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      plantId = 'P-042',
      rowId = 'R-07',
      fieldId = 'FIELD-GH-B',
      farmId = 'FARM-BLR-01',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 parameter is required' });
    }

    let cleanBase64 = imageBase64;
    let actualMime = mimeType;
    let finalImagePath = imageBase64;

    if (imageBase64.startsWith('/src/assets/images') || imageBase64.startsWith('src/assets/images')) {
      const relativePart = imageBase64.startsWith('/') ? imageBase64.slice(1) : imageBase64;
      const filePath = path.join(process.cwd(), relativePart);
      if (fs.existsSync(filePath)) {
        cleanBase64 = fs.readFileSync(filePath).toString('base64');
        actualMime = 'image/jpeg';
      }
      finalImagePath = imageBase64;
    } else {
      cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      finalImagePath = imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${cleanBase64}`;
    }
    const sourceImageBytes = Buffer.from(cleanBase64, 'base64');
    const imageSha256 = crypto.createHash('sha256').update(sourceImageBytes).digest('hex');
    let analysisResult: any = null;

    if (ai) {
      try {
        const prompt = `
You are the PhytoTrace 2.0 diagnostic engine for tomato leaf-miner infestations (Chip to Crop 2026).
Analyze this tomato leaf photograph according to the scientific guidelines for:
1. Tuta absoluta (tomato pinworm / leafminer): produces irregular, broad blotch-like necrotic feeding galleries, translucent patches, frass aggregates.
2. Liriomyza spp. (serpentine leaf miner): produces narrow, winding serpentine trails meandering across the leaf.
3. Mixed infestation: leaf exhibits BOTH Tuta blotch galleries and Liriomyza serpentine trails.
4. Healthy / Negative: no leaf miner galleries, or unrelated abiotic stress.

Conduct:
- Quality assessment (flag blur, glare, bad lighting, or inadequate leaf distance if present).
- Localization of suspected mine regions with normalized bounding boxes [ymin, xmin, ymax, xmax] on a 0-1000 scale.
- For each region, determine evidence category: 'tuta_consistent', 'liriomyza_consistent', or 'uncertain'.
- Calculate leaf damage percentage (0-100%).
- Provide confidence calibration and abstention check (whether a close-up capture or expert review is warranted).
- Generate a plain-language agronomist advisory message: what is known, what is uncertain, and clear next steps (referencing ICAR-IIHR and EPPO IPM protocols).
- Do not invent physical area, GPS, calibrated confidence, or treatment doses. Mark uncertain evidence clearly.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                qualityCheck: {
                  type: Type.OBJECT,
                  properties: {
                    passed: { type: Type.BOOLEAN },
                    blurDetected: { type: Type.BOOLEAN },
                    glareDetected: { type: Type.BOOLEAN },
                    distanceAcceptable: { type: Type.BOOLEAN },
                    lightingScore: { type: Type.NUMBER },
                    feedbackNotes: { type: Type.STRING },
                  },
                  required: ['passed', 'blurDetected', 'glareDetected', 'distanceAcceptable', 'feedbackNotes'],
                },
                primaryDiagnosis: {
                  type: Type.STRING,
                },
                overallDamagePercent: { type: Type.NUMBER },
                mixedInfestationSuspected: { type: Type.BOOLEAN },
                calibrationConfidence: { type: Type.NUMBER },
                uncertaintyFlagged: { type: Type.BOOLEAN },
                abstentionRecommended: { type: Type.BOOLEAN },
                regions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      evidenceType: { type: Type.STRING },
                      confidence: { type: Type.NUMBER },
                      box: {
                        type: Type.OBJECT,
                        properties: {
                          ymin: { type: Type.NUMBER },
                          xmin: { type: Type.NUMBER },
                          ymax: { type: Type.NUMBER },
                          xmax: { type: Type.NUMBER },
                        },
                        required: ['ymin', 'xmin', 'ymax', 'xmax'],
                      },
                      morphologyDescription: { type: Type.STRING },
                      galleryType: { type: Type.STRING },
                      areaMm2Approx: { type: Type.NUMBER },
                      activeLarvaeProb: { type: Type.NUMBER },
                    },
                    required: ['id', 'label', 'evidenceType', 'confidence', 'box', 'morphologyDescription', 'galleryType'],
                  },
                },
                plainLanguageSummary: {
                  type: Type.OBJECT,
                  properties: {
                    whatIsKnown: { type: Type.STRING },
                    whatIsUncertain: { type: Type.STRING },
                    recommendedNextStep: { type: Type.STRING },
                  },
                  required: ['whatIsKnown', 'whatIsUncertain', 'recommendedNextStep'],
                },
              },
              required: [
                'qualityCheck',
                'primaryDiagnosis',
                'overallDamagePercent',
                'mixedInfestationSuspected',
                'calibrationConfidence',
                'uncertaintyFlagged',
                'abstentionRecommended',
                'regions',
                'plainLanguageSummary',
              ],
            },
          },
        });

        analysisResult = JSON.parse(response.text || '{}');
      } catch (err: any) {
        console.warn('Gemini vision analysis failed:', err.message);
      }
    }

    if (!analysisResult) {
      return res.status(503).json({ error: 'Live AI analysis is unavailable; no synthetic report was created.' });
    }

    const newInspectionId = 'INSP-' + crypto.randomUUID().toUpperCase();
    const createdAt = new Date().toISOString();
    const normalizedRegions = (analysisResult.regions || [])
      .filter((region: any) => region?.box && ['ymin', 'xmin', 'ymax', 'xmax'].every((key) => Number.isFinite(region.box[key])))
      .map((r: any, idx: number) => ({
        id: r.id || `REG-${newInspectionId}-${idx + 1}`,
        inspection_id: newInspectionId,
        badge: (['A', 'B', 'C', 'D'][idx] || 'A') as any,
        region_type: ['tuta_consistent', 'liriomyza_consistent', 'uncertain', 'healthy'].includes(r.evidenceType) ? r.evidenceType : 'uncertain',
        bounding_coordinates: r.box,
        confidence: r.confidence ?? 0,
        evidence_description: r.morphologyDescription || 'Description unavailable; please review the leaf image.',
        gallery_type: ['blotch', 'serpentine', 'punctate', 'indeterminate'].includes(r.galleryType) ? r.galleryType : 'indeterminate',
        ...(Number.isFinite(r.areaMm2Approx) ? { area_mm2: r.areaMm2Approx } : {}),
        ...(Number.isFinite(r.activeLarvaeProb) ? { active_larvae_prob: r.activeLarvaeProb } : {}),
      }));

    const createdInspection: Inspection = {
      id: newInspectionId,
      record_source: 'live_ai',
      plant_id: `PLANT-${plantId}`,
      plant_identifier: plantId,
      field_id: fieldId,
      farm_id: farmId,
      image_path: finalImagePath,
      inspection_date: createdAt,
      quality_status: {
        passed: analysisResult.qualityCheck.passed,
        blur_detected: analysisResult.qualityCheck.blurDetected,
        glare_detected: analysisResult.qualityCheck.glareDetected,
        distance_acceptable: analysisResult.qualityCheck.distanceAcceptable,
        feedback_notes: analysisResult.qualityCheck.feedbackNotes,
      },
      overall_status: analysisResult.mixedInfestationSuspected
        ? 'mixed_infestation'
        : analysisResult.primaryDiagnosis.toLowerCase().includes('tuta')
        ? 'tuta_absoluta'
        : analysisResult.primaryDiagnosis.toLowerCase().includes('liriomyza')
        ? 'liriomyza_spp'
        : analysisResult.primaryDiagnosis.toLowerCase().includes('healthy')
        ? 'healthy'
        : 'uncertain',
      primary_diagnosis: analysisResult.primaryDiagnosis,
      overall_damage_percent: analysisResult.overallDamagePercent,
      calibration_confidence: analysisResult.calibrationConfidence,
      uncertainty_flagged: analysisResult.uncertaintyFlagged,
      abstention_recommended: analysisResult.abstentionRecommended,
      verification_status: 'pending_expert_review',
      plain_language_summary: {
        what_is_known: analysisResult.plainLanguageSummary.whatIsKnown,
        what_is_uncertain: analysisResult.plainLanguageSummary.whatIsUncertain,
        recommended_next_step: analysisResult.plainLanguageSummary.recommendedNextStep,
      },
      regions: normalizedRegions,
      fingerprint: {
        id: '',
        inspection_id: newInspectionId,
        plant_id: plantId,
        farm_id: farmId,
        field_id: fieldId,
        fingerprint_hash: '',
        leaf_surface_damage_percent: analysisResult.overallDamagePercent,
        active_mines_count: normalizedRegions.length,
        canopy_stratum: 'Not recorded',
        gps_coordinates: null,
        image_sha256: imageSha256,
        algorithm: 'SHA-256 over canonical inspection record and source-image SHA-256',
        created_at: createdAt,
      },
    };

    const { fingerprint, ...inspectionBody } = createdInspection;
    const fingerprintBody = Object.fromEntries(
      Object.entries(fingerprint!).filter(([key]) => key !== 'id' && key !== 'fingerprint_hash'),
    );
    const fingerprintPayload = stableStringify({ inspection: inspectionBody, fingerprint: fingerprintBody });
    const fingerprintHash = crypto.createHash('sha256').update(fingerprintPayload).digest('hex');
    createdInspection.fingerprint!.fingerprint_hash = `sha256:${fingerprintHash}`;
    createdInspection.fingerprint!.id = `FP-${fingerprintHash.slice(0, 16).toUpperCase()}`;

    // Store in global in-memory database
    INSPECTIONS.unshift(createdInspection);

    // Update corresponding plant status
    const targetPlant = PLANTS.find((p) => p.plant_identifier === plantId);
    if (targetPlant) {
      targetPlant.status = createdInspection.overall_status === 'healthy' ? 'recently_inspected' : 'evidence_detected';
      targetPlant.latest_damage_percent = createdInspection.overall_damage_percent;
      targetPlant.last_inspected_at = createdInspection.inspection_date;
    }

    return res.json({
      success: true,
      source: 'gemini-3.8-flash-vision',
      inspection: createdInspection,
      analysis: analysisResult,
    });
  } catch (err: any) {
    console.error('Server leaf analysis error:', err);
    res.status(500).json({ error: err.message || 'Internal server error during leaf inspection' });
  }
});

// PDF / Structured Report Data
app.get('/api/reports/:id/pdf', (req, res) => {
  const inspection = INSPECTIONS.find((i) => i.id === req.params.id);
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection report not found' });
  }

  res.json({
    reportTitle: `PhytoTrace 2.0 Inspection Certificate · ${inspection.id}`,
    brand: 'PhytoTrace 2.0 — Intelligence in Every Leaf.',
    secondaryTagline: 'Trace the Damage. Reveal the Threat. Protect the Crop.',
    generatedAt: new Date().toISOString(),
    inspection,
    disclaimer:
      'This report provides evidence-based agricultural decision support and does not replace statutory quarantine diagnosis. Generated via PhytoTrace 2.0 Explainable Vision Pipeline.',
  });
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PhytoTrace 2.0 server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();