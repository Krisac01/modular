import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  User, 
  MapPin, 
  Bug, 
  Package, 
  Wrench,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Timer,
  Target,
  Activity,
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Logbook = () => {
  const isMobile = useIsMobile();

  // Datos simulados de actividades registradas en la app
  const registeredActivities = [
    {
      id: "1",
      type: "pathogen_record",
      title: "Registro de Patógeno - Sección A",
      description: "Moniliasis detectada en árbol #15",
      user: "Juan Pérez",
      location: "Área de Cacao - Sección A",
      timestamp: Date.now() - 1000 * 60 * 30, // 30 min ago
      severity: "high",
      details: "Nivel de incidencia: 7/10",
      icon: <Bug className="h-5 w-5" />
    },
    {
      id: "2", 
      type: "incidence_record",
      title: "Control de Plagas - Invernadero",
      description: "Registro en Surco 5, Posición 3",
      user: "María González",
      location: "Invernadero Principal",
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      severity: "medium",
      details: "Nivel de incidencia: 4/10",
      icon: <Activity className="h-5 w-5" />
    },
    {
      id: "3",
      type: "supply_assignment",
      title: "Asignación de Insumo",
      description: "Fungicida XYZ asignado",
      user: "Carlos Rodríguez",
      location: "Bodega de Insumos",
      timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
      severity: "low",
      details: "Dosis: 2.5 g/L para Antracnosis",
      icon: <Package className="h-5 w-5" />
    },
    {
      id: "4",
      type: "tool_assignment",
      title: "Asignación de Herramienta",
      description: "Tijeras de podar asignadas",
      user: "Ana López",
      location: "Área de Herramientas",
      timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
      severity: "low",
      details: "Estado: Excelente - Mantenimiento al día",
      icon: <Wrench className="h-5 w-5" />
    },
    {
      id: "5",
      type: "location_update",
      title: "Actualización de Ubicación",
      description: "Cambio a Campo Abierto - Zona Norte",
      user: "Luis Martínez",
      location: "Campo Abierto - Zona Norte",
      timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
      severity: "low",
      details: "RFID: RFID006",
      icon: <MapPin className="h-5 w-5" />
    }
  ];

  // Datos simulados de actividades asignadas al usuario
  const assignedActivities = [
    {
      id: "a1",
      title: "Inspección de Patógenos - Sección B",
      description: "Revisar árboles 20-30 en busca de síntomas de Escoba de bruja",
      priority: "high",
      dueDate: Date.now() + 1000 * 60 * 60 * 2, // 2 hours from now
      estimatedTime: "45 min",
      assignedBy: "Supervisor Técnico",
      status: "pending",
      location: "Área de Cacao - Sección B",
      icon: <Bug className="h-5 w-5" />
    },
    {
      id: "a2",
      title: "Aplicación de Fungicida",
      description: "Aplicar tratamiento preventivo en Sección C",
      priority: "medium",
      dueDate: Date.now() + 1000 * 60 * 60 * 6, // 6 hours from now
      estimatedTime: "2 horas",
      assignedBy: "Jefe de Campo",
      status: "pending",
      location: "Área de Cacao - Sección C",
      icon: <Package className="h-5 w-5" />
    },
    {
      id: "a3",
      title: "Mantenimiento de Herramientas",
      description: "Revisar y limpiar equipos de fumigación",
      priority: "low",
      dueDate: Date.now() + 1000 * 60 * 60 * 24, // 1 day from now
      estimatedTime: "1 hora",
      assignedBy: "Supervisor de Mantenimiento",
      status: "pending",
      location: "Taller de Herramientas",
      icon: <Wrench className="h-5 w-5" />
    },
    {
      id: "a4",
      title: "Registro de Incidencia - Invernadero",
      description: "Completar evaluación de Surcos 15-20",
      priority: "medium",
      dueDate: Date.now() + 1000 * 60 * 60 * 12, // 12 hours from now
      estimatedTime: "1.5 horas",
      assignedBy: "Supervisora de Invernadero",
      status: "in_progress",
      location: "Invernadero Principal",
      icon: <Activity className="h-5 w-5" />
    },
    {
      id: "a5",
      title: "Actualización de Ubicación",
      description: "Verificar tags RFID en Campo Norte",
      priority: "low",
      dueDate: Date.now() + 1000 * 60 * 60 * 48, // 2 days from now
      estimatedTime: "30 min",
      assignedBy: "Coordinador de Campo",
      status: "pending",
      location: "Campo Abierto - Zona Norte",
      icon: <MapPin className="h-5 w-5" />
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Completada";
      case "in_progress": return "En Progreso";
      case "pending": return "Pendiente";
      case "overdue": return "Vencida";
      default: return "Desconocido";
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Hace un momento";
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  const formatTimeUntil = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Vencida";
    if (minutes < 60) return `En ${minutes} min`;
    if (hours < 24) return `En ${hours}h`;
    return `En ${days}d`;
  };

  const exportData = () => {
    // Simular exportación de datos
    console.log("Exportando datos de bitácora...");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-dark">
                Bitácora Electrónica
              </h1>
              <p className="text-gray-600 mt-1">
                Registro de actividades y tareas asignadas
              </p>
            </div>
          </div>
          <Button 
            onClick={exportData}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Datos
          </Button>
        </div>

        {/* Content */}
        {isMobile ? (
          <Tabs defaultValue="registered" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registered">
                Actividades Registradas ({registeredActivities.length})
              </TabsTrigger>
              <TabsTrigger value="assigned">
                Tareas Asignadas ({assignedActivities.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="registered">
              <RegisteredActivitiesCard activities={registeredActivities} />
            </TabsContent>
            <TabsContent value="assigned">
              <AssignedActivitiesCard activities={assignedActivities} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RegisteredActivitiesCard activities={registeredActivities} />
            <AssignedActivitiesCard activities={assignedActivities} />
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registros</p>
                  <p className="text-2xl font-bold text-green-600">{registeredActivities.length}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {assignedActivities.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <Timer className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {assignedActivities.filter(a => a.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alta Prioridad</p>
                  <p className="text-2xl font-bold text-red-600">
                    {assignedActivities.filter(a => a.priority === 'high').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );

  function RegisteredActivitiesCard({ activities }: { activities: any[] }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Actividades Registradas en la App ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className={`border-l-4 ${getSeverityColor(activity.severity)}`}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{activity.title}</h3>
                          <Badge className={getSeverityColor(activity.severity)}>
                            {activity.severity === 'high' ? 'Alta' : 
                             activity.severity === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{activity.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                        
                        {activity.details && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            {activity.details}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  function AssignedActivitiesCard({ activities }: { activities: any[] }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Actividades Asignadas al Usuario ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium text-sm">{activity.title}</h3>
                          <Badge className={getPriorityColor(activity.priority)}>
                            {activity.priority === 'high' ? 'Alta' : 
                             activity.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                          <Badge className={getStatusColor(activity.status)}>
                            {getStatusLabel(activity.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Asignado por: {activity.assignedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Vence: {formatTimeUntil(activity.dueDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            <span>Tiempo estimado: {activity.estimatedTime}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Ver Detalles
                          </Button>
                          {activity.status === 'pending' && (
                            <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                              Iniciar
                            </Button>
                          )}
                          {activity.status === 'in_progress' && (
                            <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                              Completar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
};

export default Logbook;