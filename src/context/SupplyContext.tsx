import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupplyData, SupplyRecord } from "@/types/supplies";
import { toast } from "@/components/ui/sonner";

interface SupplyContextType {
  data: SupplyData;
  addSupplyRecord: (record: Omit<SupplyRecord, "id" | "assignedDate">) => void;
  updateSupplyRecord: (recordId: string, updates: Partial<SupplyRecord>) => void;
  deleteSupplyRecord: (recordId: string) => void;
  exportToCSV: () => void;
}

const SupplyContext = createContext<SupplyContextType | undefined>(undefined);

const initialData: SupplyData = {
  records: [],
  lastUpdated: Date.now(),
};

export function SupplyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SupplyData>(() => {
    const saved = localStorage.getItem("supply-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("supply-data", JSON.stringify(data));
  }, [data]);

  const addSupplyRecord = (record: Omit<SupplyRecord, "id" | "assignedDate">) => {
    const newRecord: SupplyRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assignedDate: Date.now(),
    };

    setData({
      records: [...data.records, newRecord],
      lastUpdated: Date.now(),
    });

    toast.success("Insumo asignado correctamente");
  };

  const updateSupplyRecord = (recordId: string, updates: Partial<SupplyRecord>) => {
    const updatedRecords = data.records.map((record) =>
      record.id === recordId ? { ...record, ...updates } : record
    );

    setData({
      records: updatedRecords,
      lastUpdated: Date.now(),
    });

    toast.success("Registro actualizado correctamente");
  };

  const deleteSupplyRecord = (recordId: string) => {
    const updatedRecords = data.records.filter((record) => record.id !== recordId);

    setData({
      records: updatedRecords,
      lastUpdated: Date.now(),
    });

    toast.success("Registro eliminado correctamente");
  };

  const exportToCSV = () => {
    try {
      let csvContent = "Nombre,Categoría,Ingrediente Activo,Concentración,Dosis Asignada,Asignado por,Método de Aplicación,Plaga Objetivo,Fecha de Asignación,Notas\n";
      
      data.records.forEach(record => {
        const date = new Date(record.assignedDate);
        const dateStr = date.toLocaleDateString();
        
        const notes = record.notes ? `"${record.notes.replace(/"/g, '""')}"` : "";
        const instructions = record.instructions ? `"${record.instructions.replace(/"/g, '""')}"` : "";
        
        csvContent += `"${record.name}","${record.category}","${record.activeIngredient || ''}","${record.concentration || ''}","${record.assignedDose}","${record.assignedBy}","${record.applicationMethod}","${record.targetPest || ''}","${dateStr}",${notes}\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `insumos-asignados-${new Date().toISOString().split('T')[0]}.csv`);
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
    <SupplyContext.Provider
      value={{
        data,
        addSupplyRecord,
        updateSupplyRecord,
        deleteSupplyRecord,
        exportToCSV,
      }}
    >
      {children}
    </SupplyContext.Provider>
  );
}

export function useSupply() {
  const context = useContext(SupplyContext);
  if (context === undefined) {
    throw new Error("useSupply must be used within a SupplyProvider");
  }
  return context;
}