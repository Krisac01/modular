
export interface IncidenceRecord {
  id: string;
  rowId: number;
  position: number;
  level: number; // 0-10 scale
  notes?: string;
  timestamp: number;
}

export interface Row {
  id: number;
  name: string;
  records: IncidenceRecord[];
}

export interface GreenHouseData {
  rows: Row[];
  lastUpdated: number;
}
