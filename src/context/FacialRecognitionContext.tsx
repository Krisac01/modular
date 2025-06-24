import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FacialRecognitionData, FacialRecognitionSession, REGISTERED_USERS, SESSION_DURATION } from "@/types/facialRecognition";
import { toast } from "@/components/ui/sonner";

interface FacialRecognitionContextType {
  data: FacialRecognitionData;
  currentSession: FacialRecognitionSession | null;
  isSessionActive: boolean;
  timeRemaining: number;
  startFacialRecognition: () => void;
  simulateFacialRecognition: (userId: string, confidence: number) => void;
  endSession: () => void;
  extendSession: () => void;
  exportToCSV: () => void;
}

const FacialRecognitionContext = createContext<FacialRecognitionContextType | undefined>(undefined);

const initialData: FacialRecognitionData = {
  currentSession: null,
  sessions: [],
  lastUpdated: Date.now(),
};

export function FacialRecognitionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FacialRecognitionData>(() => {
    const saved = localStorage.getItem("facial-recognition-data");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("facial-recognition-data", JSON.stringify(data));
  }, [data]);

  // Timer effect for active session
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (data.currentSession?.isActive) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = data.currentSession!.expirationTime - now;
        
        if (remaining <= 0) {
          endSession();
          setTimeRemaining(0);
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    } else {
      setTimeRemaining(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data.currentSession]);

  const startFacialRecognition = () => {
    toast.info("Iniciando reconocimiento facial... Posiciónese frente a la cámara");
    
    // Simulate camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          toast.success("Cámara activada - Listo para reconocimiento facial");
        })
        .catch(() => {
          toast.warning("No se pudo acceder a la cámara - Modo simulación activado");
        });
    } else {
      toast.info("Modo simulación activado - Use los botones de prueba");
    }
  };

  const simulateFacialRecognition = async (userId: string, confidence: number) => {
    const user = REGISTERED_USERS.find(u => u.id === userId);
    
    if (!user) {
      toast.error("Usuario no reconocido en el sistema");
      return;
    }

    if (confidence < 80) {
      toast.error(`Confianza insuficiente (${confidence}%) - Intente nuevamente`);
      return;
    }

    // Get current location if available
    let location;
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000
          });
        });
        
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      }
    } catch (error) {
      console.warn("Could not get GPS coordinates:", error);
    }

    const now = Date.now();
    const newSession: FacialRecognitionSession = {
      id: `${now}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      recognitionTime: now,
      expirationTime: now + SESSION_DURATION,
      isActive: true,
      confidence,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      },
      location
    };

    setData(prevData => ({
      currentSession: newSession,
      sessions: [newSession, ...prevData.sessions],
      lastUpdated: now,
    }));

    setTimeRemaining(SESSION_DURATION);
    
    toast.success(`¡Bienvenido ${user.name}! Sesión activa por 10 minutos`);
  };

  const endSession = () => {
    if (data.currentSession) {
      const updatedSession = {
        ...data.currentSession,
        isActive: false
      };

      setData(prevData => ({
        currentSession: null,
        sessions: prevData.sessions.map(s => 
          s.id === updatedSession.id ? updatedSession : s
        ),
        lastUpdated: Date.now(),
      }));

      setTimeRemaining(0);
      toast.info("Sesión de reconocimiento facial finalizada");
    }
  };

  const extendSession = () => {
    if (data.currentSession) {
      const now = Date.now();
      const extendedSession = {
        ...data.currentSession,
        expirationTime: now + SESSION_DURATION
      };

      setData(prevData => ({
        currentSession: extendedSession,
        sessions: prevData.sessions.map(s => 
          s.id === extendedSession.id ? extendedSession : s
        ),
        lastUpdated: now,
      }));

      setTimeRemaining(SESSION_DURATION);
      toast.success("Sesión extendida por 10 minutos adicionales");
    }
  };

  const exportToCSV = () => {
    try {
      let csvContent = "Fecha,Hora,Usuario,ID Usuario,Confianza,Duración Sesión,Estado,Dispositivo,Latitud,Longitud\n";
      
      data.sessions.forEach(session => {
        const startDate = new Date(session.recognitionTime);
        const dateStr = startDate.toLocaleDateString();
        const timeStr = startDate.toLocaleTimeString();
        
        const duration = session.isActive 
          ? "En curso" 
          : Math.round((session.expirationTime - session.recognitionTime) / (1000 * 60));
        
        const lat = session.location?.latitude || '';
        const lng = session.location?.longitude || '';
        const device = session.deviceInfo?.platform || '';
        const status = session.isActive ? "Activa" : "Finalizada";
        
        csvContent += `"${dateStr}","${timeStr}","${session.userName}","${session.userId}","${session.confidence}%","${duration} min","${status}","${device}","${lat}","${lng}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `reconocimiento-facial-${new Date().toISOString().split('T')[0]}.csv`);
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
    <FacialRecognitionContext.Provider
      value={{
        data,
        currentSession: data.currentSession,
        isSessionActive: data.currentSession?.isActive || false,
        timeRemaining,
        startFacialRecognition,
        simulateFacialRecognition,
        endSession,
        extendSession,
        exportToCSV,
      }}
    >
      {children}
    </FacialRecognitionContext.Provider>
  );
}

export function useFacialRecognition() {
  const context = useContext(FacialRecognitionContext);
  if (context === undefined) {
    throw new Error("useFacialRecognition must be used within a FacialRecognitionProvider");
  }
  return context;
}