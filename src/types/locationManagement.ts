export interface LocationManagement {
  id: string;
  name: string;
  rfidTag: string;
  description: string;
  category: LocationCategory;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  maxCapacity?: number;
  currentOccupancy?: number;
  equipment?: string[];
  responsiblePerson?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface LocationCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const DEFAULT_LOCATION_CATEGORIES: LocationCategory[] = [
  {
    id: "greenhouse",
    name: "Invernadero",
    color: "bg-green-500",
    icon: "🏠"
  },
  {
    id: "field",
    name: "Campo Abierto",
    color: "bg-blue-500",
    icon: "🌾"
  },
  {
    id: "cacao",
    name: "Área de Cacao",
    color: "bg-amber-600",
    icon: "🌳"
  },
  {
    id: "storage",
    name: "Almacenamiento",
    color: "bg-purple-500",
    icon: "📦"
  },
  {
    id: "office",
    name: "Oficina/Administración",
    color: "bg-gray-500",
    icon: "🏢"
  },
  {
    id: "processing",
    name: "Área de Procesamiento",
    color: "bg-orange-500",
    icon: "⚙️"
  },
  {
    id: "maintenance",
    name: "Mantenimiento",
    color: "bg-red-500",
    icon: "🔧"
  },
  {
    id: "other",
    name: "Otro",
    color: "bg-slate-500",
    icon: "📍"
  }
];

export interface LocationManagementData {
  locations: LocationManagement[];
  categories: LocationCategory[];
  lastUpdated: number;
}