export interface SupplyDatabaseItem {
  id: string;
  name: string;
  category: SupplyCategory;
  description: string;
  activeIngredient?: string;
  concentration?: string;
  image?: string;
  instructions: string;
  recommendedDose: string;
  targetPests: string[];
  applicationMethods: ApplicationMethod[];
  safetyNotes: string;
  manufacturer?: string;
  registrationNumber?: string;
  status: 'active' | 'discontinued' | 'restricted';
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface SupplyCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const DEFAULT_SUPPLY_CATEGORIES: SupplyCategory[] = [
  {
    id: "insecticide",
    name: "Insecticida",
    color: "bg-red-500",
    icon: "🐞"
  },
  {
    id: "fungicide",
    name: "Fungicida",
    color: "bg-blue-500",
    icon: "🍄"
  },
  {
    id: "herbicide",
    name: "Herbicida",
    color: "bg-orange-500",
    icon: "🌿"
  },
  {
    id: "fertilizer",
    name: "Fertilizante",
    color: "bg-green-500",
    icon: "🌱"
  },
  {
    id: "biostimulant",
    name: "Bioestimulante",
    color: "bg-purple-500",
    icon: "🌟"
  },
  {
    id: "adjuvant",
    name: "Adherente",
    color: "bg-yellow-500",
    icon: "💧"
  },
  {
    id: "growth_regulator",
    name: "Regulador de crecimiento",
    color: "bg-pink-500",
    icon: "📏"
  },
  {
    id: "other",
    name: "Otro",
    color: "bg-gray-500",
    icon: "📦"
  }
];

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

export interface SupplyDatabaseData {
  supplies: SupplyDatabaseItem[];
  categories: SupplyCategory[];
  lastUpdated: number;
}