import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ToolData, ToolRecord } from "@/types/tools";
import { toast } from "@/components/ui/sonner";

interface ToolContextType {
  data: ToolData;
  addToolRecord: (record: Omit<ToolRecord, "id" | "assignedDate">) => void;
  updateToolRecord: (recordId: string, updates: Partial<ToolRecord>) => void;
  deleteToolRecord: (recordId: string) => void;
  exportToCSV: () => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

const initialData: ToolData = {
  records: [],
  lastUpdated: Date.now(),
};

export function ToolProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ToolData>(() => {
    const saved = localStorage.getItem("tool-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("tool-data", JSON.stringify(data));
  }, [data]);

  const addToolRecord = (record: Omit<ToolRecord, "id" | "assignedDate">) => {
    const newRecord: ToolRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assignedDate: Date.now(),
    };

    setData({
      records: [...data.records, newRecord],
      lastUpdated: Date.now(),
    });

    toast.success("Herramienta asignada correctamente");
  };

  const updateToolRecord = (recordId: string, updates: Partial<ToolRecord>) => {
    const updatedRecords = data.records.map((record) =>
      record.id === recordId ? { ...record, ...updates } : record
    );

    setData({
      records: updatedRecords,
      lastUpdated: Date.now(),
    });

    toast.success("Registro actualizado correctamente");
  };

  const deleteToolRecord = (recordId: string) => {
    const updatedRecords = data.records.filter((record) => record.id !== recordId);

    setData({
      records: updatedRecords,
      lastUpdated: Date.now(),
    });

    toast.success("Registro eliminado correctamente");
  };

  const exportToCSV = () => {
    try {
      let csvContent = "Nombre,Categoría,Marca,Modelo,Serie,Estado,Asignado a,Asignado por,Ubicación,Fecha de Asignación,Último Mantenimiento,Próximo Mantenimiento,Notas\n";
      
      data.records.forEach(record => {
        const date = new Date(record.assignedDate);
        const dateStr = date.toLocaleDateString();
        
        const notes = record.notes ? `"${record.notes.replace(/"/g, '""')}"` : "";
        const maintenanceInstructions = record.maintenanceInstructions ? `"${record.maintenanceInstructions.replace(/"/g, '""')}"` : "";
        
        csvContent += `"${record.name}","${record.category}","${record.brand || ''}","${record.model || ''}","${record.serialNumber || ''}","${record.condition}","${record.assignedTo}","${record.assignedBy}","${record.location || ''}","${dateStr}","${record.lastMaintenanceDate || ''}","${record.nextMaintenanceDate || ''}",${notes}\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `herramientas-asignadas-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Datos exportados correctamente");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Error al exportar los datos");
    }
  };

  return (
    <ToolContext.Provider
      value={{
        data,
        addToolRecord,
        updateToolRecord,
        deleteToolRecord,
        exportToCSV,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);
  if (context === undefined) {
    throw new Error("useTool must be used within a ToolProvider");
  }
  return context;
}