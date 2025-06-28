import { Layout } from "@/components/Layout";
import { LocationManagementProvider } from "@/context/LocationManagementContext";
import { LocationManagementForm } from "@/components/LocationManagementForm";
import { LocationManagementList } from "@/components/LocationManagementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  MapPin, 
  User, 
  ChevronDown, 
  UserCircle, 
  Settings, 
  LogOut, 
  Home,
  Upload,
  BarChart3,
  Users,
  Activity
} from "lucide-react";
import { useLocationManagement } from "@/context/LocationManagementContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LocationManagement } from "@/types/locationManagement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function LocationManagementContent() {
  const { data, exportToCSV, importFromPredefined } = useLocationManagement();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationManagement | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "form" | "stats">("list");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente",
    });
    
    navigate("/login");
  };

  const handleProfile = () => {
    toast({
      title: "Perfil de usuario",
      description: "Funcionalidad en desarrollo",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Configuración",
      description: "Funcionalidad en desarrollo",
    });
  };

  const handleEdit = (location: LocationManagement) => {
    setEditingLocation(location);
    setActiveTab("form");
  };

  const handleCancelEdit = () => {
    setEditingLocation(null);
    setActiveTab("list");
  };

  const handleSave = () => {
    setEditingLocation(null);
    setActiveTab("list");
  };

  // Calcular estadísticas
  const stats = {
    total: data.locations.length,
    active: data.locations.filter(l => l.isActive).length,
    inactive: data.locations.filter(l => !l.isActive).length,
    totalCapacity: data.locations.reduce((sum, l) => sum + (l.maxCapacity || 0), 0),
    currentOccupancy: data.locations.reduce((sum, l) => sum + (l.currentOccupancy || 0), 0),
    categories: data.categories.length,
    averageOccupancy: data.locations.length > 0 
      ? Math.round((data.locations.reduce((sum, l) => sum + (l.currentOccupancy || 0), 0) / 
          data.locations.reduce((sum, l) => sum + (l.maxCapacity || 0), 0)) * 100) || 0
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                Gestión de Ubicaciones
              </h1>
              <p className="text-red-100 text-xs md:text-sm mt-1 leading-tight">
                Administración de ubicaciones y tags RFID del sistema
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button 
              onClick={importFromPredefined}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              size="sm"
            >
              <Upload className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">Importar Predefinidas</span>
              <span className="xs:hidden">Importar</span>
            </Button>
            
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              disabled={data.locations.length === 0}
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
                    {user?.name || 'Administrador'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'admin@ejemplo.com'}
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
                <p className="text-sm font-medium text-gray-600">Total Ubicaciones</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ubicaciones Activas</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capacidad Total</p>
                <p className="text-2xl font-bold">{stats.totalCapacity}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocupación Promedio</p>
                <p className="text-2xl font-bold text-orange-600">{stats.averageOccupancy}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">
              Lista ({data.locations.length})
            </TabsTrigger>
            <TabsTrigger value="form">
              {editingLocation ? "Editar" : "Nueva"}
            </TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <LocationManagementList onEdit={handleEdit} />
          </TabsContent>
          
          <TabsContent value="form">
            <LocationManagementForm 
              editingLocation={editingLocation}
              onCancel={handleCancelEdit}
              onSave={handleSave}
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
                      <p className="text-sm text-blue-800">Total Ubicaciones</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                      <p className="text-sm text-green-800">Activas</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ocupación Actual:</span>
                      <span className="font-medium">{stats.currentOccupancy}/{stats.totalCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categorías:</span>
                      <span className="font-medium">{stats.categories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inactivas:</span>
                      <span className="font-medium text-red-600">{stats.inactive}</span>
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
            <LocationManagementForm 
              editingLocation={editingLocation}
              onCancel={handleCancelEdit}
              onSave={handleSave}
            />
          </div>
          <div>
            <LocationManagementList onEdit={handleEdit} />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de gestión de ubicaciones:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. <strong>Crear ubicación:</strong> Complete el formulario con nombre, tag RFID único y categoría</li>
          <li>2. <strong>Tag RFID:</strong> Use el botón "+" para generar automáticamente o ingrese manualmente</li>
          <li>3. <strong>Coordenadas GPS:</strong> Use "Obtener GPS" para capturar la ubicación actual</li>
          <li>4. <strong>Capacidad:</strong> Defina la capacidad máxima y ocupación actual para control</li>
          <li>5. <strong>Estado:</strong> Active/desactive ubicaciones según necesidad operativa</li>
          <li>6. <strong>Filtros:</strong> Use la búsqueda y filtros para encontrar ubicaciones específicas</li>
          <li>7. <strong>Exportar:</strong> Descargue datos en CSV para análisis externos</li>
        </ul>
      </div>
    </div>
  );
}

const LocationManagement = () => {
  return (
    <LocationManagementProvider>
      <Layout>
        <LocationManagementContent />
      </Layout>
    </LocationManagementProvider>
  );
};

export default LocationManagement;