import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LocationManagement, LocationManagementData, DEFAULT_LOCATION_CATEGORIES, LocationCategory } from "@/types/locationManagement";
import { PREDEFINED_LOCATIONS } from "@/types/location";
import { toast } from "@/components/ui/sonner";

interface LocationManagementContextType {
  data: LocationManagementData;
  addLocation: (location: Omit<LocationManagement, "id" | "createdAt" | "updatedAt">) => void;
  updateLocation: (locationId: string, updates: Partial<LocationManagement>) => void;
  deleteLocation: (locationId: string) => void;
  toggleLocationStatus: (locationId: string) => void;
  addCategory: (category: Omit<LocationCategory, "id">) => void;
  updateCategory: (categoryId: string, updates: Partial<LocationCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  exportToCSV: () => void;
  importFromPredefined: () => void;
}

const LocationManagementContext = createContext<LocationManagementContextType | undefined>(undefined);

// Generar ubicaciones iniciales basadas en PREDEFINED_LOCATIONS
const generateInitialLocations = (): LocationManagement[] => {
  return Object.entries(PREDEFINED_LOCATIONS).map(([rfidTag, name], index) => {
    let category = "other";
    
    // Categorizar automáticamente basado en el nombre
    if (name.toLowerCase().includes("invernadero")) category = "greenhouse";
    else if (name.toLowerCase().includes("campo")) category = "field";
    else if (name.toLowerCase().includes("cacao")) category = "cacao";
    else if (name.toLowerCase().includes("bodega") || name.toLowerCase().includes("almacén")) category = "storage";
    else if (name.toLowerCase().includes("oficina")) category = "office";
    else if (name.toLowerCase().includes("compostaje") || name.toLowerCase().includes("procesamiento")) category = "processing";
    
    return {
      id: `loc_${index + 1}`,
      name,
      rfidTag,
      description: `Ubicación ${name}`,
      category: DEFAULT_LOCATION_CATEGORIES.find(c => c.id === category) || DEFAULT_LOCATION_CATEGORIES[7],
      isActive: true,
      maxCapacity: Math.floor(Math.random() * 20) + 5, // 5-25 personas
      currentOccupancy: Math.floor(Math.random() * 10), // 0-10 personas
      equipment: [],
      responsiblePerson: "Por asignar",
      notes: "",
      createdAt: Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30, // Últimos 30 días
      updatedAt: Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7, // Últimos 7 días
      createdBy: "admin001"
    };
  });
};

const initialData: LocationManagementData = {
  locations: generateInitialLocations(),
  categories: DEFAULT_LOCATION_CATEGORIES,
  lastUpdated: Date.now(),
};

export function LocationManagementProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LocationManagementData>(() => {
    const saved = localStorage.getItem("location-management-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("location-management-data", JSON.stringify(data));
  }, [data]);

  const addLocation = (location: Omit<LocationManagement, "id" | "createdAt" | "updatedAt">) => {
    // Verificar que el tag RFID no esté duplicado
    const existingLocation = data.locations.find(loc => loc.rfidTag === location.rfidTag);
    if (existingLocation) {
      toast.error("Ya existe una ubicación con este tag RFID");
      return;
    }

    const newLocation: LocationManagement = {
      ...location,
      id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setData(prevData => ({
      ...prevData,
      locations: [...prevData.locations, newLocation],
      lastUpdated: Date.now(),
    }));

    toast.success("Ubicación añadida correctamente");
  };

  const updateLocation = (locationId: string, updates: Partial<LocationManagement>) => {
    // Si se está actualizando el RFID tag, verificar que no esté duplicado
    if (updates.rfidTag) {
      const existingLocation = data.locations.find(loc => loc.rfidTag === updates.rfidTag && loc.id !== locationId);
      if (existingLocation) {
        toast.error("Ya existe una ubicación con este tag RFID");
        return;
      }
    }

    setData(prevData => ({
      ...prevData,
      locations: prevData.locations.map(location =>
        location.id === locationId
          ? { ...location, ...updates, updatedAt: Date.now() }
          : location
      ),
      lastUpdated: Date.now(),
    }));

    toast.success("Ubicación actualizada correctamente");
  };

  const deleteLocation = (locationId: string) => {
    setData(prevData => ({
      ...prevData,
      locations: prevData.locations.filter(location => location.id !== locationId),
      lastUpdated: Date.now(),
    }));

    toast.success("Ubicación eliminada correctamente");
  };

  const toggleLocationStatus = (locationId: string) => {
    setData(prevData => ({
      ...prevData,
      locations: prevData.locations.map(location =>
        location.id === locationId
          ? { ...location, isActive: !location.isActive, updatedAt: Date.now() }
          : location
      ),
      lastUpdated: Date.now(),
    }));

    const location = data.locations.find(loc => loc.id === locationId);
    toast.success(`Ubicación ${location?.isActive ? 'desactivada' : 'activada'} correctamente`);
  };

  const addCategory = (category: Omit<LocationCategory, "id">) => {
    const newCategory: LocationCategory = {
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

  const updateCategory = (categoryId: string, updates: Partial<LocationCategory>) => {
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
    // Verificar que no haya ubicaciones usando esta categoría
    const locationsUsingCategory = data.locations.filter(loc => loc.category.id === categoryId);
    if (locationsUsingCategory.length > 0) {
      toast.error(`No se puede eliminar la categoría. ${locationsUsingCategory.length} ubicaciones la están usando.`);
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
      let csvContent = "ID,Nombre,Tag RFID,Descripción,Categoría,Estado,Capacidad Máxima,Ocupación Actual,Responsable,Coordenadas,Fecha Creación,Última Actualización\n";
      
      data.locations.forEach(location => {
        const coords = location.coordinates 
          ? `"${location.coordinates.latitude}, ${location.coordinates.longitude}"`
          : "";
        
        const createdDate = new Date(location.createdAt).toLocaleDateString();
        const updatedDate = new Date(location.updatedAt).toLocaleDateString();
        
        csvContent += `"${location.id}","${location.name}","${location.rfidTag}","${location.description}","${location.category.name}","${location.isActive ? 'Activa' : 'Inactiva'}","${location.maxCapacity || ''}","${location.currentOccupancy || ''}","${location.responsiblePerson || ''}",${coords},"${createdDate}","${updatedDate}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `ubicaciones-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Datos exportados correctamente");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Error al exportar los datos");
    }
  };

  const importFromPredefined = () => {
    const newLocations = generateInitialLocations();
    setData(prevData => ({
      ...prevData,
      locations: newLocations,
      lastUpdated: Date.now(),
    }));
    
    toast.success("Ubicaciones predefinidas importadas correctamente");
  };

  return (
    <LocationManagementContext.Provider
      value={{
        data,
        addLocation,
        updateLocation,
        deleteLocation,
        toggleLocationStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        exportToCSV,
        importFromPredefined,
      }}
    >
      {children}
    </LocationManagementContext.Provider>
  );
}

export function useLocationManagement() {
  const context = useContext(LocationManagementContext);
  if (context === undefined) {
    throw new Error("useLocationManagement must be used within a LocationManagementProvider");
  }
  return context;
}