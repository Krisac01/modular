
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CacaoPathogenData, CacaoSection, CacaoPathogenRecord } from "@/types/cacaoPathogens";
import { toast } from "@/components/ui/sonner";

interface CacaoPathogenContextType {
  data: CacaoPathogenData;
  selectedSection: CacaoSection | null;
  selectSection: (sectionId: string) => void;
  addSection: (name: string, maxTrees: number) => void;
  addPathogenRecord: (record: Omit<CacaoPathogenRecord, "id" | "timestamp">) => void;
  updatePathogenRecord: (recordId: string, updates: Partial<CacaoPathogenRecord>) => void;
  deletePathogenRecord: (recordId: string) => void;
  exportToCSV: () => void;
}

const CacaoPathogenContext = createContext<CacaoPathogenContextType | undefined>(undefined);

// Initial sections A, B, C, D, E
const initialSections: CacaoSection[] = [
  { id: "A", name: "A", maxTrees: 50, records: [] },
  { id: "B", name: "B", maxTrees: 50, records: [] },
  { id: "C", name: "C", maxTrees: 50, records: [] },
  { id: "D", name: "D", maxTrees: 50, records: [] },
  { id: "E", name: "E", maxTrees: 50, records: [] },
];

const initialData: CacaoPathogenData = {
  sections: initialSections,
  lastUpdated: Date.now(),
};

export function CacaoPathogenProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CacaoPathogenData>(() => {
    const saved = localStorage.getItem("cacao-pathogen-data");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [selectedSection, setSelectedSection] = useState<CacaoSection | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("cacao-pathogen-data", JSON.stringify(data));
  }, [data]);

  const selectSection = (sectionId: string) => {
    const section = data.sections.find((s) => s.id === sectionId);
    if (section) {
      setSelectedSection(section);
    } else {
      toast.error("Sección no encontrada");
    }
  };

  const addSection = (name: string, maxTrees: number) => {
    const newSection: CacaoSection = {
      id: name,
      name,
      maxTrees,
      records: [],
    };

    setData({
      sections: [...data.sections, newSection],
      lastUpdated: Date.now(),
    });

    toast.success(`Sección ${name} añadida correctamente`);
  };

  const addPathogenRecord = (record: Omit<CacaoPathogenRecord, "id" | "timestamp">) => {
    if (!selectedSection) {
      toast.error("Por favor seleccione una sección primero");
      return;
    }

    // Check if tree already has a record for this pathogen type
    const existingRecord = selectedSection.records.find(
      (r) => r.treeNumber === record.treeNumber && r.pathogenType === record.pathogenType
    );

    if (existingRecord) {
      toast.error("Ya existe un registro para este árbol y tipo de patógeno");
      return;
    }

    const newRecord: CacaoPathogenRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const updatedSections = data.sections.map((section) => {
      if (section.id === selectedSection.id) {
        return {
          ...section,
          records: [...section.records, newRecord],
        };
      }
      return section;
    });

    setData({
      sections: updatedSections,
      lastUpdated: Date.now(),
    });

    // Update selected section
    setSelectedSection(updatedSections.find((s) => s.id === selectedSection.id) || null);
    
    toast.success("Registro de patógeno añadido correctamente");
  };

  const updatePathogenRecord = (recordId: string, updates: Partial<CacaoPathogenRecord>) => {
    if (!selectedSection) return;

    const updatedSections = data.sections.map((section) => {
      if (section.id === selectedSection.id) {
        return {
          ...section,
          records: section.records.map((record) =>
            record.id === recordId ? { ...record, ...updates } : record
          ),
        };
      }
      return section;
    });

    setData({
      sections: updatedSections,
      lastUpdated: Date.now(),
    });

    setSelectedSection(updatedSections.find((s) => s.id === selectedSection.id) || null);
    toast.success("Registro actualizado correctamente");
  };

  const deletePathogenRecord = (recordId: string) => {
    if (!selectedSection) return;

    const updatedSections = data.sections.map((section) => {
      if (section.id === selectedSection.id) {
        return {
          ...section,
          records: section.records.filter((record) => record.id !== recordId),
        };
      }
      return section;
    });

    setData({
      sections: updatedSections,
      lastUpdated: Date.now(),
    });

    setSelectedSection(updatedSections.find((s) => s.id === selectedSection.id) || null);
    toast.success("Registro eliminado correctamente");
  };

  const exportToCSV = () => {
    try {
      let csvContent = "Sección,Árbol,Tipo de Patógeno,Nivel de Incidencia,Notas,Fecha\n";
      
      data.sections.forEach(section => {
        section.records.forEach(record => {
          const date = new Date(record.timestamp);
          const dateStr = date.toLocaleDateString();
          const timeStr = date.toLocaleTimeString();
          
          const notes = record.notes ? `"${record.notes.replace(/"/g, '""')}"` : "";
          csvContent += `${section.name},${record.treeNumber},${record.pathogenType},${record.incidenceLevel},${notes},${dateStr} ${timeStr}\n`;
        });
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `patogenos-cacao-${new Date().toISOString().split('T')[0]}.csv`);
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
    <CacaoPathogenContext.Provider
      value={{
        data,
        selectedSection,
        selectSection,
        addSection,
        addPathogenRecord,
        updatePathogenRecord,
        deletePathogenRecord,
        exportToCSV,
      }}
    >
      {children}
    </CacaoPathogenContext.Provider>
  );
}

export function useCacaoPathogen() {
  const context = useContext(CacaoPathogenContext);
  if (context === undefined) {
    throw new Error("useCacaoPathogen must be used within a CacaoPathogenProvider");
  }
  return context;
}
