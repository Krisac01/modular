export interface ToolDatabaseItem {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  image?: string;
  maintenanceInstructions: string;
  safetyInstructions: string;
  recommendedUses: string[];
  technicalSpecifications?: string;
  status: 'active' | 'maintenance' | 'discontinued' | 'damaged';
  purchaseDate?: string;
  warrantyExpiration?: string;
  estimatedLifespan?: string;
  maintenanceFrequency?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const DEFAULT_TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "cutting",
    name: "Herramientas de corte",
    color: "bg-red-500",
    icon: "✂️"
  },
  {
    id: "digging",
    name: "Herramientas de excavación",
    color: "bg-brown-500",
    icon: "🪓"
  },
  {
    id: "measuring",
    name: "Herramientas de medición",
    color: "bg-blue-500",
    icon: "📏"
  },
  {
    id: "spraying",
    name: "Equipos de fumigación",
    color: "bg-purple-500",
    icon: "💦"
  },
  {
    id: "pruning",
    name: "Herramientas de poda",
    color: "bg-green-500",
    icon: "🌿"
  },
  {
    id: "irrigation",
    name: "Equipos de riego",
    color: "bg-cyan-500",
    icon: "💧"
  },
  {
    id: "manual",
    name: "Herramientas manuales",
    color: "bg-gray-500",
    icon: "🔧"
  },
  {
    id: "electric",
    name: "Equipos eléctricos",
    color: "bg-yellow-500",
    icon: "⚡"
  },
  {
    id: "machinery",
    name: "Maquinaria agrícola",
    color: "bg-orange-500",
    icon: "🚜"
  },
  {
    id: "protection",
    name: "Equipos de protección",
    color: "bg-pink-500",
    icon: "🥽"
  },
  {
    id: "other",
    name: "Otro",
    color: "bg-slate-500",
    icon: "🔨"
  }
];

export interface ToolDatabaseData {
  tools: ToolDatabaseItem[];
  categories: ToolCategory[];
  lastUpdated: number;
}