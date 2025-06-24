export interface LocationRecord {
  id: string;
  rfidTag: string;
  locationName: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  deviceInfo?: {
    userAgent: string;
    platform: string;
  };
  notes?: string;
}

export interface LocationData {
  records: LocationRecord[];
  currentLocation?: LocationRecord;
  lastUpdated: number;
}

// Predefined RFID locations for the system
export const PREDEFINED_LOCATIONS: Record<string, string> = {
  "RFID001": "Invernadero Principal - Sección A",
  "RFID002": "Invernadero Principal - Sección B", 
  "RFID003": "Invernadero Principal - Sección C",
  "RFID004": "Invernadero Principal - Sección D",
  "RFID005": "Invernadero Principal - Sección E",
  "RFID006": "Campo Abierto - Zona Norte",
  "RFID007": "Campo Abierto - Zona Sur",
  "RFID008": "Área de Compostaje",
  "RFID009": "Bodega de Insumos",
  "RFID010": "Oficina Técnica",
  "RFID011": "Área de Cacao - Sección A",
  "RFID012": "Área de Cacao - Sección B",
  "RFID013": "Área de Cacao - Sección C",
  "RFID014": "Área de Cacao - Sección D",
  "RFID015": "Área de Cacao - Sección E",
};