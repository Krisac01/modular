export interface SupplyRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  activeIngredient?: string;
  concentration?: string;
  image?: string;
  instructions: string;
  assignedDose: string;
  assignedBy: string; // Técnico que asignó
  assignedDate: number;
  targetPest?: string;
  applicationMethod: string;
  safetyNotes?: string;
  expirationDate?: string;
  batchNumber?: string;
  supplier?: string;
  notes?: string;
}

export interface SupplyData {
  records: SupplyRecord[];
  lastUpdated: number;
}

export const SUPPLY_CATEGORIES = [
  "Insecticida",
  "Fungicida",
  "Herbicida",
  "Fertilizante",
  "Bioestimulante",
  "Adherente",
  "Regulador de crecimiento",
  "Otro"
] as const;

export type SupplyCategory = typeof SUPPLY_CATEGORIES[number];

export const APPLICATION_METHODS = [
  "Aspersión foliar",
  "Aplicación al suelo",
  "Fertirrigación",
  "Espolvoreo",
  "Inmersión",
  "Pincelado",
  "Inyección al tronco",
  "Otro"
] as const;

export type ApplicationMethod = typeof APPLICATION_METHODS[number];