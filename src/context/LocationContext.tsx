import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LocationData, LocationRecord, PREDEFINED_LOCATIONS } from "@/types/location";
import { toast } from "@/components/ui/sonner";

interface LocationContextType {
  data: LocationData;
  currentLocation: LocationRecord | null;
  isScanning: boolean;
  startRFIDScan: () => void;
  stopRFIDScan: () => void;
  simulateRFIDScan: (rfidTag: string) => void;
  updateLocation: (rfidTag: string, coordinates?: { latitude: number; longitude: number }) => void;
  exportToCSV: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const initialData: LocationData = {
  records: [],
  lastUpdated: Date.now(),
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LocationData>(() => {
    const saved = localStorage.getItem("location-data");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [isScanning, setIsScanning] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("location-data", JSON.stringify(data));
  }, [data]);

  const startRFIDScan = () => {
    setIsScanning(true);
    toast.info("Escaneando tags RFID... Acerque el dispositivo al tag");
    
    // Simulate NFC/RFID scanning capability
    if ('NDEFReader' in window) {
      // Real NFC implementation would go here
      toast.info("Lector NFC activado - Acerque el dispositivo al tag RFID");
    } else {
      toast.info("Modo simulación activado - Use los botones de prueba");
    }
  };

  const stopRFIDScan = () => {
    setIsScanning(false);
    toast.info("Escaneo de RFID detenido");
  };

  const simulateRFIDScan = (rfidTag: string) => {
    if (!isScanning) {
      toast.error("Debe activar el escaneo primero");
      return;
    }
    
    updateLocation(rfidTag);
    setIsScanning(false);
  };

  const updateLocation = async (rfidTag: string, coordinates?: { latitude: number; longitude: number }) => {
    const locationName = PREDEFINED_LOCATIONS[rfidTag];
    
    if (!locationName) {
      toast.error(`Tag RFID no reconocido: ${rfidTag}`);
      return;
    }

    let coords = coordinates;
    
    // Try to get current GPS coordinates if not provided
    if (!coords && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000
          });
        });
        
        coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (error) {
        console.warn("Could not get GPS coordinates:", error);
      }
    }

    const newRecord: LocationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rfidTag,
      locationName,
      coordinates: coords,
      timestamp: Date.now(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    };

    setData(prevData => ({
      records: [newRecord, ...prevData.records],
      currentLocation: newRecord,
      lastUpdated: Date.now(),
    }));

    toast.success(`Ubicación actualizada: ${locationName}`);
  };

  const exportToCSV = () => {
    try {
      let csvContent = "Fecha,Hora,Tag RFID,Ubicación,Latitud,Longitud,Dispositivo\n";
      
      data.records.forEach(record => {
        const date = new Date(record.timestamp);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();
        
        const lat = record.coordinates?.latitude || '';
        const lng = record.coordinates?.longitude || '';
        const device = record.deviceInfo?.platform || '';
        
        csvContent += `"${dateStr}","${timeStr}","${record.rfidTag}","${record.locationName}","${lat}","${lng}","${device}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `ubicaciones-rfid-${new Date().toISOString().split('T')[0]}.csv`);
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
    <LocationContext.Provider
      value={{
        data,
        currentLocation: data.currentLocation || null,
        isScanning,
        startRFIDScan,
        stopRFIDScan,
        simulateRFIDScan,
        updateLocation,
        exportToCSV,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}