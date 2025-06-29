import { Layout } from "@/components/Layout";
import { ActivityProvider } from "@/context/ActivityContext";
import { ActivityForm } from "@/components/ActivityForm";
import { ActivityList } from "@/components/ActivityList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Calendar, 
  User, 
  ChevronDown, 
  UserCircle, 
  Settings, 
  LogOut, 
  Home,
  PlusCircle,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useActivity } from "@/context/ActivityContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "@/types/activities";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ActivityAssignmentContent() {
  const { data, exportToCSV } = useActivity();
  const { currentUser, isAdmin, logout } = useUser();
  const isMobile = useIsMobile();
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "form" | "stats">("list");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder a la asignación de actividades",
        variant: "destructive",
      });
      navigate("/menu");
    }
  }, [isAdmin, navigate, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente",
    });
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    toast({
      title: "Configuración",
      description: "Funcionalidad en desarrollo",
    });
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setActiveTab("form");
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setActiveTab("list");
  };

  const handleSave = () => {
    setEditingActivity(null);
    setActiveTab("list");
  };

  // Calcular estadísticas
  const stats = {
    total: data.activities.length,
    pending: data.activities.filter(a => a.status === 'pending').length,
    inProgress: data.activities.filter(a => a.status === 'in_progress').length,
    completed: data.activities.filter(a => a.status === 'completed').length,
    cancelled: data.activities.filter(a => a.status === 'cancelled').length,
    overdue: data.activities.filter(a => 
      a.status === 'pending' && a.dueDate < Date.now()
    ).length,
    highPriority: data.activities.filter(a => a.priority === 'high').length,
    completionRate: data.activities.length > 0 
      ? Math.round((data.activities.filter(a => a.status === 'completed').length / data.activities.length) * 100)
      : 0
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                Asignación de Actividades
              </h1>
              <p className="text-green-100 text-xs md:text-sm mt-1 leading-tight">
                Cree y asigne tareas a los usuarios del sistema
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button 
              onClick={() => { setEditingActivity(null); setActiveTab("form"); }}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">Nueva Actividad</span>
              <span className="xs:hidden">Nueva</span>
            </Button>
            
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              disabled={data.activities.length === 0}
              size="sm"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">Exportar CSV</span>
              <span className="xs:hidden">CSV</span>
            </Button>
            
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9"
              >
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xs:inline text-sm">Panel Admin</span>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline text-sm">Mi Cuenta</span>
                  <ChevronDown className="h-3 w-3 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser?.name || 'Administrador'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.email || 'admin@ejemplo.com'}
                  </p>
                </div>
                
                <DropdownMenuItem onClick={handleProfile}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Ver Perfil
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Actividades</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">
              Lista ({data.activities.length})
            </TabsTrigger>
            <TabsTrigger value="form">
              {editingActivity ? "Editar" : "Nueva"}
            </TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <ActivityList 
              onEdit={handleEdit} 
              userId={currentUser?.id}
            />
          </TabsContent>
          
          <TabsContent value="form">
            <ActivityForm 
              editingActivity={editingActivity}
              onCancel={handleCancelEdit}
              onSave={handleSave}
              currentUserId={currentUser?.id}
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Detalladas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                      <p className="text-sm text-blue-800">Total Actividades</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.completionRate}%</p>
                      <p className="text-sm text-green-800">Tasa de Finalización</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pendientes:</span>
                      <span className="font-medium text-yellow-600">{stats.pending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>En Progreso:</span>
                      <span className="font-medium text-blue-600">{stats.inProgress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completadas:</span>
                      <span className="font-medium text-green-600">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Canceladas:</span>
                      <span className="font-medium text-gray-600">{stats.cancelled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vencidas:</span>
                      <span className="font-medium text-red-600">{stats.overdue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prioridad Alta:</span>
                      <span className="font-medium text-red-600">{stats.highPriority}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ActivityForm 
              editingActivity={editingActivity}
              onCancel={handleCancelEdit}
              onSave={handleSave}
              currentUserId={currentUser?.id}
            />
          </div>
          <div>
            <ActivityList 
              onEdit={handleEdit} 
              userId={currentUser?.id}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de asignación de actividades:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. <strong>Crear actividad:</strong> Complete el formulario con título, descripción, prioridad y fecha límite</li>
          <li>2. <strong>Asignar usuario:</strong> Seleccione el usuario responsable de completar la actividad</li>
          <li>3. <strong>Establecer prioridad:</strong> Defina la importancia de la tarea (alta, media, baja)</li>
          <li>4. <strong>Tiempo estimado:</strong> Indique cuánto tiempo debería tomar completar la actividad</li>
          <li>5. <strong>Seguimiento:</strong> Monitoree el estado de las actividades y actualice según sea necesario</li>
          <li>6. <strong>Completar/Cancelar:</strong> Registre la finalización o cancelación de actividades con notas</li>
          <li>7. <strong>Filtros:</strong> Use la búsqueda y filtros para encontrar actividades específicas</li>
        </ul>
      </div>
    </div>
  );
}

const ActivityAssignment = () => {
  return (
    <ActivityProvider>
      <Layout>
        <ActivityAssignmentContent />
      </Layout>
    </ActivityProvider>
  );
};

export default ActivityAssignment;