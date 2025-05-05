
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GreenHouseData, IncidenceRecord, Row } from "@/types";
import { toast } from "@/components/ui/sonner";

interface DataContextType {
  data: GreenHouseData;
  selectedRow: Row | null;
  selectRow: (rowId: number) => void;
  addIncidenceRecord: (record: Omit<IncidenceRecord, "id" | "timestamp">) => void;
  updateIncidenceRecord: (recordId: string, level: number, notes?: string) => void;
  deleteIncidenceRecord: (recordId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial data
const initialRows: Row[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Surco ${i + 1}`,
  records: [],
}));

const initialData: GreenHouseData = {
  rows: initialRows,
  lastUpdated: Date.now(),
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GreenHouseData>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("greenhouse-data");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("greenhouse-data", JSON.stringify(data));
  }, [data]);

  // Select a row by ID
  const selectRow = (rowId: number) => {
    const row = data.rows.find((r) => r.id === rowId);
    if (row) {
      setSelectedRow(row);
    } else {
      toast.error("Surco no encontrado");
    }
  };

  // Add a new incidence record
  const addIncidenceRecord = (record: Omit<IncidenceRecord, "id" | "timestamp">) => {
    if (!selectedRow) {
      toast.error("Por favor seleccione un surco primero");
      return;
    }

    // Check if position already has a record
    const existingRecord = selectedRow.records.find(
      (r) => r.position === record.position
    );

    if (existingRecord) {
      toast.error("Ya existe un registro en esta posición");
      return;
    }

    const newRecord: IncidenceRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const updatedRows = data.rows.map((row) => {
      if (row.id === selectedRow.id) {
        // Check if we've reached the limit of 100 records
        if (row.records.length >= 100) {
          toast.error("Se ha alcanzado el límite de 100 registros para este surco");
          return row;
        }
        
        return {
          ...row,
          records: [...row.records, newRecord],
        };
      }
      return row;
    });

    setData({
      rows: updatedRows,
      lastUpdated: Date.now(),
    });

    // Update selected row
    setSelectedRow(updatedRows.find((r) => r.id === selectedRow.id) || null);
    
    toast.success("Registro añadido correctamente");
  };

  // Update an existing incidence record
  const updateIncidenceRecord = (recordId: string, level: number, notes?: string) => {
    if (!selectedRow) return;

    const updatedRows = data.rows.map((row) => {
      if (row.id === selectedRow.id) {
        return {
          ...row,
          records: row.records.map((record) =>
            record.id === recordId ? { ...record, level, notes } : record
          ),
        };
      }
      return row;
    });

    setData({
      rows: updatedRows,
      lastUpdated: Date.now(),
    });

    // Update selected row
    setSelectedRow(updatedRows.find((r) => r.id === selectedRow.id) || null);
    
    toast.success("Registro actualizado correctamente");
  };

  // Delete an incidence record
  const deleteIncidenceRecord = (recordId: string) => {
    if (!selectedRow) return;

    const updatedRows = data.rows.map((row) => {
      if (row.id === selectedRow.id) {
        return {
          ...row,
          records: row.records.filter((record) => record.id !== recordId),
        };
      }
      return row;
    });

    setData({
      rows: updatedRows,
      lastUpdated: Date.now(),
    });

    // Update selected row
    setSelectedRow(updatedRows.find((r) => r.id === selectedRow.id) || null);
    
    toast.success("Registro eliminado correctamente");
  };

  return (
    <DataContext.Provider
      value={{
        data,
        selectedRow,
        selectRow,
        addIncidenceRecord,
        updateIncidenceRecord,
        deleteIncidenceRecord,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
