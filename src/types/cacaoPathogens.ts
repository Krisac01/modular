
export interface CacaoPathogenRecord {
  id: string;
  section: string; // A, B, C, D, E, etc.
  treeNumber: number;
  pathogenType: string;
  incidenceLevel: number; // 0-10 scale
  notes?: string;
  photos: string[]; // Array of photo URLs/base64
  timestamp: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface CacaoSection {
  id: string;
  name: string; // A, B, C, D, E
  maxTrees: number;
  records: CacaoPathogenRecord[];
}

export interface CacaoPathogenData {
  sections: CacaoSection[];
  lastUpdated: number;
}

export const PATHOGEN_TYPES = [
  "Moniliasis (Moniliophthora roreri)",
  "Escoba de bruja (Moniliophthora perniciosa)",
  "Pudrición negra (Phytophthora palmivora)",
  "Antracnosis (Colletotrichum spp.)",
  "Mal del machete (Ceratocystis cacaofunesta)",
  "Otro"
] as const;

export type PathogenType = typeof PATHOGEN_TYPES[number];
