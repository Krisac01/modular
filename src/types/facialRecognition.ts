export interface FacialRecognitionSession {
  id: string;
  userId: string;
  userName: string;
  recognitionTime: number;
  expirationTime: number;
  isActive: boolean;
  confidence: number; // Porcentaje de confianza del reconocimiento
  deviceInfo?: {
    userAgent: string;
    platform: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface FacialRecognitionData {
  currentSession: FacialRecognitionSession | null;
  sessions: FacialRecognitionSession[];
  lastUpdated: number;
}

// Usuarios predefinidos para el sistema de reconocimiento
export const REGISTERED_USERS = [
  {
    id: "user001",
    name: "Juan Pérez",
    role: "Técnico Agrícola",
    department: "Campo"
  },
  {
    id: "user002", 
    name: "María González",
    role: "Supervisora",
    department: "Invernadero"
  },
  {
    id: "user003",
    name: "Carlos Rodríguez", 
    role: "Operario",
    department: "Mantenimiento"
  },
  {
    id: "user004",
    name: "Ana López",
    role: "Técnica en Plagas",
    department: "Control Fitosanitario"
  },
  {
    id: "user005",
    name: "Luis Martínez",
    role: "Jefe de Campo",
    department: "Producción"
  }
] as const;

export type RegisteredUser = typeof REGISTERED_USERS[number];

// Duración de la sesión en milisegundos (10 minutos)
export const SESSION_DURATION = 10 * 60 * 1000;