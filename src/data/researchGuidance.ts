import type { EvidenceRegion } from '../types/phyto2';

export const RESEARCH_SOURCES = [
  {
    id: 'desneux-2021',
    label: 'Desneux, Han, Mansour et al. (2021), Journal of Pest Science: Integrated pest management of Tuta absoluta across regions.',
    url: 'https://doi.org/10.1007/s10340-021-01442-8',
  },
  {
    id: 'biondi-2018',
    label: 'Biondi, Guedes, Wan & Desneux (2018), Annual Review of Entomology: ecology and management of Tuta absoluta.',
    url: 'https://doi.org/10.1146/annurev-ento-031616-034933',
  },
  {
    id: 'tnau-liriomyza',
    label: 'Tamil Nadu Agricultural University, Agritech Portal: Tomato serpentine leaf miner (Liriomyza trifolii), updated 2023.',
    url: 'https://agritech.tnau.ac.in/crop_protection/tomato/tomato_2.html',
  },
];

export function getResearchGuidance(regions: EvidenceRegion[]): string[] {
  const regionTypes = new Set(regions.map((region) => region.region_type));
  const guidance: string[] = [];

  if (regionTypes.has('tuta_consistent')) {
    guidance.push('Tomato leaf-miner research supports combining pheromone-based monitoring with biological control as part of an integrated plan. These studies do not establish a universal trap count or spray dose for this field.');
  }
  if (regionTypes.has('liriomyza_consistent')) {
    guidance.push('For serpentine leaf-miner signs, TNAU advises collecting and destroying mined leaves. Check nearby plants and confirm the pest before choosing any treatment.');
  }
  if (regionTypes.has('uncertain') || regions.length === 0) {
    guidance.push('The image evidence is uncertain or no mine area was detected. Take a clear close-up and ask a local agriculture officer to confirm the cause before spraying.');
  }
  guidance.push('Do not use a pesticide dose from this report. Follow the locally registered product label, including its waiting period before harvest, and get local advice.');
  return guidance;
}

export function getDiagnosisGuidance(diagnosis: string): string[] {
  const text = diagnosis.toLowerCase();
  const inferredRegions: EvidenceRegion[] = [];
  if (text.includes('tuta') || text.includes('mixed')) {
    inferredRegions.push({ id: 'guide-tuta', badge: 'A', region_type: 'tuta_consistent', confidence: 0, area_mm2: 0, evidence_description: '' });
  }
  if (text.includes('liriomyza') || text.includes('serpentine')) {
    inferredRegions.push({ id: 'guide-liriomyza', badge: 'B', region_type: 'liriomyza_consistent', confidence: 0, area_mm2: 0, evidence_description: '' });
  }
  if (inferredRegions.length === 0) inferredRegions.push({ id: 'guide-uncertain', badge: 'C', region_type: 'uncertain', confidence: 0, area_mm2: 0, evidence_description: '' });
  return getResearchGuidance(inferredRegions);
}
