export interface ToolRecord {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  description: string;
  image?: string;
  assignedBy: string; // Técnico que asignó
  assignedTo: string; // Persona a quien se asigna
  assignedDate: number;
  condition: string; // Estado de la herramienta
  maintenanceInstructions: string;
  safetyInstructions: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  purchaseDate?: string;
  warrantyExpiration?: string;
  location?: string; // Ubicación donde se usa
  notes?: string;
}

export interface ToolData {
  records: ToolRecord[];
  lastUpdated: number;
}

export const TOOL_CATEGORIES = [
  "Herramientas de corte",
  "Herramientas de excavación",
  "Herramientas de medición",
  "Equipos de fumigación",
  "Herramientas de poda",
  "Equipos de riego",
  "Herramientas manuales",
  "Equipos eléctricos",
  "Maquinaria agrícola",
  "Equipos de protección",
  "Otro"
] as const;

export type ToolCategory = typeof TOOL_CATEGORIES[number];

export const TOOL_CONDITIONS = [
  "Excelente",
  "Bueno",
  "Regular",
  "Necesita mantenimiento",
  "Fuera de servicio"
] as const;

export type ToolCondition = typeof TOOL_CONDITIONS[number];