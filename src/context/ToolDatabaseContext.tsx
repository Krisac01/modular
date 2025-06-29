import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ToolDatabaseData, ToolDatabaseItem, ToolCategory, DEFAULT_TOOL_CATEGORIES } from "@/types/toolDatabase";
import { toast } from "@/components/ui/sonner";

interface ToolDatabaseContextType {
  data: ToolDatabaseData;
  addTool: (tool: Omit<ToolDatabaseItem, "id" | "createdAt" | "updatedAt">) => void;
  updateTool: (toolId: string, updates: Partial<ToolDatabaseItem>) => void;
  deleteTool: (toolId: string) => void;
  toggleToolStatus: (toolId: string) => void;
  addCategory: (category: Omit<ToolCategory, "id">) => void;
  updateCategory: (categoryId: string, updates: Partial<ToolCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  exportToCSV: () => void;
  importSampleData: () => void;
}

const ToolDatabaseContext = createContext<ToolDatabaseContextType | undefined>(undefined);

// Generate sample tools for demonstration
const generateSampleTools = (): ToolDatabaseItem[] => {
  return [
    {
      id: "tool_001",
      name: "Tijeras de Podar Profesionales",
      category: DEFAULT_TOOL_CATEGORIES[4], // Herramientas de poda
      description: "Tijeras de podar de alta calidad para cortes precisos en ramas de hasta 25mm",
      brand: "Fiskars",
      model: "PowerGear X",
      serialNumber: "PGX-12345",
      maintenanceInstructions: "Limpiar después de cada uso. Lubricar las partes móviles semanalmente. Afilar cuando sea necesario.",
      safetyInstructions: "Usar guantes de protección. Mantener el seguro puesto cuando no esté en uso. No cortar materiales no vegetales.",
      recommendedUses: ["Poda de ramas pequeñas", "Mantenimiento de árboles de cacao", "Corte de tallos"],
      technicalSpecifications: "Capacidad de corte: 25mm. Material: Acero de alta calidad. Peso: 280g.",
      status: "active",
      purchaseDate: "2023-05-15",
      warrantyExpiration: "2025-05-15",
      estimatedLifespan: "5 años",
      maintenanceFrequency: "Semanal",
      lastMaintenanceDate: "2023-12-10",
      nextMaintenanceDate: "2024-01-10",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
      createdBy: "admin001"
    },
    {
      id: "tool_002",
      name: "Fumigadora de Mochila",
      category: DEFAULT_TOOL_CATEGORIES[3], // Equipos de fumigación
      description: "Fumigadora de mochila con capacidad de 20 litros para aplicación de agroquímicos",
      brand: "Jacto",
      model: "PJH-20",
      serialNumber: "JT-78901",
      maintenanceInstructions: "Enjuagar con agua limpia después de cada uso. Revisar empaques y válvulas mensualmente. Reemplazar piezas desgastadas.",
      safetyInstructions: "Usar equipo de protección completo. No mezclar productos químicos incompatibles. Lavarse las manos después del uso.",
      recommendedUses: ["Aplicación de fungicidas", "Aplicación de insecticidas", "Aplicación de fertilizantes foliares"],
      technicalSpecifications: "Capacidad: 20L. Presión máxima: 6 bar. Peso vacío: 4.2kg.",
      status: "active",
      purchaseDate: "2023-03-20",
      warrantyExpiration: "2024-03-20",
      estimatedLifespan: "3 años",
      maintenanceFrequency: "Después de cada uso",
      lastMaintenanceDate: "2023-12-15",
      nextMaintenanceDate: "2024-01-15",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25, // 25 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
      createdBy: "admin001"
    },
    {
      id: "tool_003",
      name: "Machete para Cacao",
      category: DEFAULT_TOOL_CATEGORIES[0], // Herramientas de corte
      description: "Machete especializado para labores en cultivo de cacao",
      brand: "Bellota",
      model: "Tradicional 24\"",
      maintenanceInstructions: "Limpiar y secar después de cada uso. Afilar regularmente. Mantener la funda cuando no esté en uso.",
      safetyInstructions: "Usar guantes resistentes a cortes. Mantener distancia segura de otras personas. Transportar en funda.",
      recommendedUses: ["Limpieza de malezas", "Corte de ramas bajas", "Apertura de mazorcas de cacao"],
      status: "active",
      purchaseDate: "2023-06-10",
      estimatedLifespan: "2 años",
      maintenanceFrequency: "Semanal",
      lastMaintenanceDate: "2023-12-05",
      nextMaintenanceDate: "2024-01-05",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20, // 20 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      createdBy: "admin001"
    },
    {
      id: "tool_004",
      name: "Refractómetro Digital",
      category: DEFAULT_TOOL_CATEGORIES[2], // Herramientas de medición
      description: "Refractómetro digital para medir contenido de azúcares en pulpa de cacao",
      brand: "Atago",
      model: "PAL-1",
      serialNumber: "AT-45678",
      maintenanceInstructions: "Limpiar el prisma con agua destilada después de cada uso. Calibrar mensualmente. Cambiar baterías cuando sea necesario.",
      safetyInstructions: "Evitar contacto del prisma con objetos duros. No sumergir en agua. Mantener alejado de altas temperaturas.",
      recommendedUses: ["Medición de grados Brix", "Control de calidad de cacao"],
      technicalSpecifications: "Rango: 0-53° Brix. Precisión: ±0.2° Brix. Alimentación: 2 baterías AAA.",
      status: "active",
      purchaseDate: "2023-04-05",
      warrantyExpiration: "2025-04-05",
      estimatedLifespan: "5 años",
      maintenanceFrequency: "Mensual",
      lastMaintenanceDate: "2023-12-01",
      nextMaintenanceDate: "2024-01-01",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
      createdBy: "admin001"
    },
    {
      id: "tool_005",
      name: "Motosierra",
      category: DEFAULT_TOOL_CATEGORIES[7], // Equipos eléctricos
      description: "Motosierra para poda y mantenimiento de árboles de cacao",
      brand: "Stihl",
      model: "MS 180",
      serialNumber: "ST-12345",
      maintenanceInstructions: "Revisar nivel de aceite y combustible antes de cada uso. Limpiar filtro de aire semanalmente. Afilar cadena cuando sea necesario.",
      safetyInstructions: "PELIGRO: Usar equipo de protección completo. Mantener ambas manos en la motosierra durante su uso. No operar cerca de otras personas.",
      recommendedUses: ["Poda de árboles", "Eliminación de árboles enfermos", "Mantenimiento de sombra"],
      technicalSpecifications: "Potencia: 1.4 kW. Longitud de espada: 35 cm. Peso: 4.1 kg.",
      status: "maintenance",
      purchaseDate: "2022-10-15",
      warrantyExpiration: "2023-10-15",
      estimatedLifespan: "8 años",
      maintenanceFrequency: "Después de cada uso",
      lastMaintenanceDate: "2023-11-20",
      nextMaintenanceDate: "2024-01-20",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45, // 45 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
      createdBy: "admin001"
    }
  ];
};

const initialData: ToolDatabaseData = {
  tools: generateSampleTools(),
  categories: DEFAULT_TOOL_CATEGORIES,
  lastUpdated: Date.now(),
};

export function ToolDatabaseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ToolDatabaseData>(() => {
    const saved = localStorage.getItem("tool-database-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("tool-database-data", JSON.stringify(data));
  }, [data]);

  const addTool = (tool: Omit<ToolDatabaseItem, "id" | "createdAt" | "updatedAt">) => {
    // Verificar que el nombre no esté duplicado
    const existingTool = data.tools.find(t => t.name.toLowerCase() === tool.name.toLowerCase());
    if (existingTool) {
      toast.error("Ya existe una herramienta con este nombre");
      return;
    }

    const newTool: ToolDatabaseItem = {
      ...tool,
      id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setData(prevData => ({
      ...prevData,
      tools: [...prevData.tools, newTool],
      lastUpdated: Date.now(),
    }));

    toast.success("Herramienta añadida correctamente");
  };

  const updateTool = (toolId: string, updates: Partial<ToolDatabaseItem>) => {
    // Si se está actualizando el nombre, verificar que no esté duplicado
    if (updates.name) {
      const existingTool = data.tools.find(t => 
        t.name.toLowerCase() === updates.name?.toLowerCase() && t.id !== toolId
      );
      if (existingTool) {
        toast.error("Ya existe una herramienta con este nombre");
        return;
      }
    }

    setData(prevData => ({
      ...prevData,
      tools: prevData.tools.map(tool =>
        tool.id === toolId
          ? { ...tool, ...updates, updatedAt: Date.now() }
          : tool
      ),
      lastUpdated: Date.now(),
    }));

    toast.success("Herramienta actualizada correctamente");
  };

  const deleteTool = (toolId: string) => {
    setData(prevData => ({
      ...prevData,
      tools: prevData.tools.filter(tool => tool.id !== toolId),
      lastUpdated: Date.now(),
    }));

    toast.success("Herramienta eliminada correctamente");
  };

  const toggleToolStatus = (toolId: string) => {
    setData(prevData => ({
      ...prevData,
      tools: prevData.tools.map(tool => {
        if (tool.id === toolId) {
          let newStatus: 'active' | 'maintenance' | 'discontinued' | 'damaged';
          
          // Ciclo de estados: active -> maintenance -> active
          if (tool.status === 'active') {
            newStatus = 'maintenance';
          } else {
            newStatus = 'active';
          }
          
          return { 
            ...tool, 
            status: newStatus,
            updatedAt: Date.now() 
          };
        }
        return tool;
      }),
      lastUpdated: Date.now(),
    }));

    const tool = data.tools.find(t => t.id === toolId);
    const statusText = tool?.status === 'active' ? 'en mantenimiento' : 'activa';
    toast.success(`Herramienta marcada como ${statusText}`);
  };

  const addCategory = (category: Omit<ToolCategory, "id">) => {
    const newCategory: ToolCategory = {
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

  const updateCategory = (categoryId: string, updates: Partial<ToolCategory>) => {
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
    // Verificar que no haya herramientas usando esta categoría
    const toolsUsingCategory = data.tools.filter(t => t.category.id === categoryId);
    if (toolsUsingCategory.length > 0) {
      toast.error(`No se puede eliminar la categoría. ${toolsUsingCategory.length} herramientas la están usando.`);
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
      let csvContent = "ID,Nombre,Categoría,Marca,Modelo,Número de Serie,Estado,Fecha de Compra,Garantía,Último Mantenimiento,Próximo Mantenimiento,Fecha Creación,Última Actualización\n";
      
      data.tools.forEach(tool => {
        const createdDate = new Date(tool.createdAt).toLocaleDateString();
        const updatedDate = new Date(tool.updatedAt).toLocaleDateString();
        
        const description = tool.description ? `"${tool.description.replace(/"/g, '""')}"` : "";
        const maintenanceInstructions = tool.maintenanceInstructions ? `"${tool.maintenanceInstructions.replace(/"/g, '""')}"` : "";
        const safetyInstructions = tool.safetyInstructions ? `"${tool.safetyInstructions.replace(/"/g, '""')}"` : "";
        
        csvContent += `"${tool.id}","${tool.name}","${tool.category.name}","${tool.brand || ''}","${tool.model || ''}","${tool.serialNumber || ''}","${tool.status}","${tool.purchaseDate || ''}","${tool.warrantyExpiration || ''}","${tool.lastMaintenanceDate || ''}","${tool.nextMaintenanceDate || ''}","${createdDate}","${updatedDate}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `catalogo-herramientas-${new Date().toISOString().split('T')[0]}.csv`);
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
    const sampleTools = generateSampleTools();
    setData(prevData => ({
      ...prevData,
      tools: sampleTools,
      lastUpdated: Date.now(),
    }));
    
    toast.success("Datos de muestra importados correctamente");
  };

  return (
    <ToolDatabaseContext.Provider
      value={{
        data,
        addTool,
        updateTool,
        deleteTool,
        toggleToolStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        exportToCSV,
        importSampleData,
      }}
    >
      {children}
    </ToolDatabaseContext.Provider>
  );
}

export function useToolDatabase() {
  const context = useContext(ToolDatabaseContext);
  if (context === undefined) {
    throw new Error("useToolDatabase must be used within a ToolDatabaseProvider");
  }
  return context;
}