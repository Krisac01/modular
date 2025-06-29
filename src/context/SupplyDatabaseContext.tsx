import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupplyDatabaseData, SupplyDatabaseItem, SupplyCategory, DEFAULT_SUPPLY_CATEGORIES } from "@/types/supplyDatabase";
import { toast } from "@/components/ui/sonner";

interface SupplyDatabaseContextType {
  data: SupplyDatabaseData;
  addSupply: (supply: Omit<SupplyDatabaseItem, "id" | "createdAt" | "updatedAt">) => void;
  updateSupply: (supplyId: string, updates: Partial<SupplyDatabaseItem>) => void;
  deleteSupply: (supplyId: string) => void;
  toggleSupplyStatus: (supplyId: string) => void;
  addCategory: (category: Omit<SupplyCategory, "id">) => void;
  updateCategory: (categoryId: string, updates: Partial<SupplyCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  exportToCSV: () => void;
  importSampleData: () => void;
}

const SupplyDatabaseContext = createContext<SupplyDatabaseContextType | undefined>(undefined);

// Generate sample supplies for demonstration
const generateSampleSupplies = (): SupplyDatabaseItem[] => {
  return [
    {
      id: "supply_001",
      name: "Fungicida XYZ",
      category: DEFAULT_SUPPLY_CATEGORIES[1], // Fungicida
      description: "Fungicida sistémico de amplio espectro para control de enfermedades en cacao",
      activeIngredient: "Azoxistrobina",
      concentration: "25% SC",
      instructions: "Aplicar en dosis de 1-2 ml/L de agua. Aplicar al follaje asegurando buena cobertura.",
      recommendedDose: "1-2 ml/L",
      targetPests: ["Moniliasis", "Escoba de bruja", "Phytophthora"],
      applicationMethods: ["Aspersión foliar"],
      safetyNotes: "Usar equipo de protección personal. No aplicar en horas de alta temperatura. Periodo de reingreso: 24 horas.",
      manufacturer: "AgroQuímicos S.A.",
      registrationNumber: "REG-001-AGR",
      status: "active",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
      createdBy: "admin001"
    },
    {
      id: "supply_002",
      name: "Insecticida ABC",
      category: DEFAULT_SUPPLY_CATEGORIES[0], // Insecticida
      description: "Insecticida de contacto para control de plagas en cacao",
      activeIngredient: "Cipermetrina",
      concentration: "20% EC",
      instructions: "Aplicar en dosis de 1.5 ml/L de agua. Aplicar al follaje asegurando buena cobertura.",
      recommendedDose: "1.5 ml/L",
      targetPests: ["Áfidos", "Trips", "Chinches"],
      applicationMethods: ["Aspersión foliar"],
      safetyNotes: "Usar equipo de protección personal. No aplicar en horas de alta temperatura. Periodo de reingreso: 48 horas.",
      manufacturer: "ProtectCrop Inc.",
      registrationNumber: "REG-002-AGR",
      status: "active",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25, // 25 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
      createdBy: "admin001"
    },
    {
      id: "supply_003",
      name: "Fertilizante NPK Plus",
      category: DEFAULT_SUPPLY_CATEGORIES[3], // Fertilizante
      description: "Fertilizante completo con micronutrientes para cacao",
      activeIngredient: "N-P-K (15-15-15) + micronutrientes",
      concentration: "Granulado",
      instructions: "Aplicar 100-150 g por planta, incorporando al suelo alrededor de la zona de goteo.",
      recommendedDose: "100-150 g/planta",
      targetPests: [],
      applicationMethods: ["Aplicación al suelo"],
      safetyNotes: "Mantener fuera del alcance de niños y animales. Lavarse las manos después de la aplicación.",
      manufacturer: "NutriAgro S.A.",
      registrationNumber: "REG-003-AGR",
      status: "active",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20, // 20 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      createdBy: "admin001"
    },
    {
      id: "supply_004",
      name: "Bioestimulante Raíz-Max",
      category: DEFAULT_SUPPLY_CATEGORIES[4], // Bioestimulante
      description: "Bioestimulante radicular para mejorar absorción de nutrientes",
      activeIngredient: "Extracto de algas + aminoácidos",
      concentration: "10% SL",
      instructions: "Aplicar en drench a razón de 3-5 ml/L de agua, dirigido a la zona radicular.",
      recommendedDose: "3-5 ml/L",
      targetPests: [],
      applicationMethods: ["Aplicación al suelo", "Fertirrigación"],
      safetyNotes: "Producto de origen natural, bajo impacto ambiental. Mantener en lugar fresco y seco.",
      manufacturer: "BioAgro Solutions",
      registrationNumber: "REG-004-AGR",
      status: "active",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
      createdBy: "admin001"
    },
    {
      id: "supply_005",
      name: "Herbicida Total",
      category: DEFAULT_SUPPLY_CATEGORIES[2], // Herbicida
      description: "Herbicida sistémico no selectivo para control de malezas",
      activeIngredient: "Glifosato",
      concentration: "48% SL",
      instructions: "Aplicar en dosis de 100-150 ml por bomba de 20L. Aplicar directamente sobre las malezas.",
      recommendedDose: "100-150 ml/bomba 20L",
      targetPests: ["Malezas de hoja ancha", "Gramíneas"],
      applicationMethods: ["Aspersión dirigida"],
      safetyNotes: "PRECAUCIÓN: Usar equipo de protección completo. No aplicar cerca de fuentes de agua. Periodo de reingreso: 24 horas.",
      manufacturer: "AgroQuímicos S.A.",
      registrationNumber: "REG-005-AGR",
      status: "restricted",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45, // 45 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
      createdBy: "admin001"
    }
  ];
};

const initialData: SupplyDatabaseData = {
  supplies: generateSampleSupplies(),
  categories: DEFAULT_SUPPLY_CATEGORIES,
  lastUpdated: Date.now(),
};

export function SupplyDatabaseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SupplyDatabaseData>(() => {
    const saved = localStorage.getItem("supply-database-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("supply-database-data", JSON.stringify(data));
  }, [data]);

  const addSupply = (supply: Omit<SupplyDatabaseItem, "id" | "createdAt" | "updatedAt">) => {
    // Verificar que el nombre no esté duplicado
    const existingSupply = data.supplies.find(s => s.name.toLowerCase() === supply.name.toLowerCase());
    if (existingSupply) {
      toast.error("Ya existe un insumo con este nombre");
      return;
    }

    const newSupply: SupplyDatabaseItem = {
      ...supply,
      id: `supply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setData(prevData => ({
      ...prevData,
      supplies: [...prevData.supplies, newSupply],
      lastUpdated: Date.now(),
    }));

    toast.success("Insumo añadido correctamente");
  };

  const updateSupply = (supplyId: string, updates: Partial<SupplyDatabaseItem>) => {
    // Si se está actualizando el nombre, verificar que no esté duplicado
    if (updates.name) {
      const existingSupply = data.supplies.find(s => 
        s.name.toLowerCase() === updates.name?.toLowerCase() && s.id !== supplyId
      );
      if (existingSupply) {
        toast.error("Ya existe un insumo con este nombre");
        return;
      }
    }

    setData(prevData => ({
      ...prevData,
      supplies: prevData.supplies.map(supply =>
        supply.id === supplyId
          ? { ...supply, ...updates, updatedAt: Date.now() }
          : supply
      ),
      lastUpdated: Date.now(),
    }));

    toast.success("Insumo actualizado correctamente");
  };

  const deleteSupply = (supplyId: string) => {
    setData(prevData => ({
      ...prevData,
      supplies: prevData.supplies.filter(supply => supply.id !== supplyId),
      lastUpdated: Date.now(),
    }));

    toast.success("Insumo eliminado correctamente");
  };

  const toggleSupplyStatus = (supplyId: string) => {
    setData(prevData => ({
      ...prevData,
      supplies: prevData.supplies.map(supply =>
        supply.id === supplyId
          ? { 
              ...supply, 
              status: supply.status === 'active' ? 'discontinued' : 'active',
              updatedAt: Date.now() 
            }
          : supply
      ),
      lastUpdated: Date.now(),
    }));

    const supply = data.supplies.find(s => s.id === supplyId);
    toast.success(`Insumo ${supply?.status === 'active' ? 'desactivado' : 'activado'} correctamente`);
  };

  const addCategory = (category: Omit<SupplyCategory, "id">) => {
    const newCategory: SupplyCategory = {
      ...category,
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setData(prevData => ({
      ...prevData,
      categories: [...prevData.categories, newCategory],
      lastUpdated: Date.now(),
    }));

    toast.success("Categoría añadida correctamente");
  };

  const updateCategory = (categoryId: string, updates: Partial<SupplyCategory>) => {
    setData(prevData => ({
      ...prevData,
      categories: prevData.categories.map(category =>
        category.id === categoryId ? { ...category, ...updates } : category
      ),
      lastUpdated: Date.now(),
    }));

    toast.success("Categoría actualizada correctamente");
  };

  const deleteCategory = (categoryId: string) => {
    // Verificar que no haya insumos usando esta categoría
    const suppliesUsingCategory = data.supplies.filter(s => s.category.id === categoryId);
    if (suppliesUsingCategory.length > 0) {
      toast.error(`No se puede eliminar la categoría. ${suppliesUsingCategory.length} insumos la están usando.`);
      return;
    }

    setData(prevData => ({
      ...prevData,
      categories: prevData.categories.filter(category => category.id !== categoryId),
      lastUpdated: Date.now(),
    }));

    toast.success("Categoría eliminada correctamente");
  };

  const exportToCSV = () => {
    try {
      let csvContent = "ID,Nombre,Categoría,Ingrediente Activo,Concentración,Dosis Recomendada,Fabricante,Número de Registro,Estado,Fecha Creación,Última Actualización\n";
      
      data.supplies.forEach(supply => {
        const createdDate = new Date(supply.createdAt).toLocaleDateString();
        const updatedDate = new Date(supply.updatedAt).toLocaleDateString();
        
        const description = supply.description ? `"${supply.description.replace(/"/g, '""')}"` : "";
        const instructions = supply.instructions ? `"${supply.instructions.replace(/"/g, '""')}"` : "";
        const safetyNotes = supply.safetyNotes ? `"${supply.safetyNotes.replace(/"/g, '""')}"` : "";
        
        csvContent += `"${supply.id}","${supply.name}","${supply.category.name}","${supply.activeIngredient || ''}","${supply.concentration || ''}","${supply.recommendedDose}","${supply.manufacturer || ''}","${supply.registrationNumber || ''}","${supply.status}","${createdDate}","${updatedDate}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `catalogo-insumos-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Datos exportados correctamente");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Error al exportar los datos");
    }
  };

  const importSampleData = () => {
    const sampleSupplies = generateSampleSupplies();
    setData(prevData => ({
      ...prevData,
      supplies: sampleSupplies,
      lastUpdated: Date.now(),
    }));
    
    toast.success("Datos de muestra importados correctamente");
  };

  return (
    <SupplyDatabaseContext.Provider
      value={{
        data,
        addSupply,
        updateSupply,
        deleteSupply,
        toggleSupplyStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        exportToCSV,
        importSampleData,
      }}
    >
      {children}
    </SupplyDatabaseContext.Provider>
  );
}

export function useSupplyDatabase() {
  const context = useContext(SupplyDatabaseContext);
  if (context === undefined) {
    throw new Error("useSupplyDatabase must be used within a SupplyDatabaseProvider");
  }
  return context;
}