import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Activity, ActivityData, ActivityCategory } from "@/types/activities";
import { toast } from "@/components/ui/sonner";

interface ActivityContextType {
  data: ActivityData;
  addActivity: (activity: Omit<Activity, "id" | "createdAt" | "updatedAt">) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
  deleteActivity: (activityId: string) => void;
  completeActivity: (activityId: string, notes?: string) => void;
  cancelActivity: (activityId: string, notes?: string) => void;
  getActivitiesByUser: (userId: string) => Activity[];
  getActivitiesByStatus: (status: Activity['status']) => Activity[];
  exportToCSV: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// Initial data
const initialData: ActivityData = {
  activities: [],
  lastUpdated: Date.now(),
};

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ActivityData>(() => {
    const saved = localStorage.getItem("activity-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("activity-data", JSON.stringify(data));
  }, [data]);

  const addActivity = (activity: Omit<Activity, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const newActivity: Activity = {
      ...activity,
      id: `act_${now}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };

    setData(prevData => ({
      ...prevData,
      activities: [...prevData.activities, newActivity],
      lastUpdated: now,
    }));

    toast.success("Actividad creada y asignada correctamente");
  };

  const updateActivity = (activityId: string, updates: Partial<Activity>) => {
    setData(prevData => ({
      ...prevData,
      activities: prevData.activities.map(activity =>
        activity.id === activityId
          ? { ...activity, ...updates, updatedAt: Date.now() }
          : activity
      ),
      lastUpdated: Date.now(),
    }));

    toast.success("Actividad actualizada correctamente");
  };

  const deleteActivity = (activityId: string) => {
    setData(prevData => ({
      ...prevData,
      activities: prevData.activities.filter(activity => activity.id !== activityId),
      lastUpdated: Date.now(),
    }));

    toast.success("Actividad eliminada correctamente");
  };

  const completeActivity = (activityId: string, notes?: string) => {
    const now = Date.now();
    setData(prevData => ({
      ...prevData,
      activities: prevData.activities.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              status: 'completed', 
              completedAt: now, 
              updatedAt: now,
              notes: notes ? (activity.notes ? `${activity.notes}\n\n${notes}` : notes) : activity.notes
            }
          : activity
      ),
      lastUpdated: now,
    }));

    toast.success("Actividad marcada como completada");
  };

  const cancelActivity = (activityId: string, notes?: string) => {
    const now = Date.now();
    setData(prevData => ({
      ...prevData,
      activities: prevData.activities.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              status: 'cancelled', 
              updatedAt: now,
              notes: notes ? (activity.notes ? `${activity.notes}\n\n${notes}` : notes) : activity.notes
            }
          : activity
      ),
      lastUpdated: now,
    }));

    toast.success("Actividad cancelada");
  };

  const getActivitiesByUser = (userId: string): Activity[] => {
    return data.activities.filter(activity => activity.assignedTo === userId);
  };

  const getActivitiesByStatus = (status: Activity['status']): Activity[] => {
    return data.activities.filter(activity => activity.status === status);
  };

  const exportToCSV = () => {
    try {
      let csvContent = "ID,Título,Descripción,Prioridad,Fecha Límite,Tiempo Estimado,Asignado Por,Asignado A,Estado,Ubicación,Categoría,Fecha Creación,Última Actualización,Fecha Completado,Notas\n";
      
      data.activities.forEach(activity => {
        const dueDate = new Date(activity.dueDate).toLocaleDateString();
        const createdDate = new Date(activity.createdAt).toLocaleDateString();
        const updatedDate = new Date(activity.updatedAt).toLocaleDateString();
        const completedDate = activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : "";
        
        const description = activity.description ? `"${activity.description.replace(/"/g, '""')}"` : "";
        const notes = activity.notes ? `"${activity.notes.replace(/"/g, '""')}"` : "";
        
        csvContent += `"${activity.id}","${activity.title}",${description},"${activity.priority}","${dueDate}","${activity.estimatedTime}","${activity.assignedBy}","${activity.assignedTo}","${activity.status}","${activity.location}","${activity.category}","${createdDate}","${updatedDate}","${completedDate}",${notes}\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `actividades-${new Date().toISOString().split('T')[0]}.csv`);
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
    <ActivityContext.Provider
      value={{
        data,
        addActivity,
        updateActivity,
        deleteActivity,
        completeActivity,
        cancelActivity,
        getActivitiesByUser,
        getActivitiesByStatus,
        exportToCSV,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}