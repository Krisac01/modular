
export interface IncidenceRecord {
  id: string;
  rowId: number;
  position: number;
  level: number; // 0-10 scale
  notes?: string;
  timestamp: number;
  subsection: number; // 1-10 representing the subsection of the row
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

export interface SubsectionData {
  rowId: number;
  subsection: number; // 1-10
  level: number | null; // Null means no data
}
