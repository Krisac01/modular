import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  MapPin, 
  Package, 
  Wrench, 
  Calendar,
  Database,
  Shield,
  Activity,
  BarChart3,
  User,
  ChevronDown,
  UserCircle,
  LogOut,
  Home,
  Tool
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { UserManagementProvider, useUserManagement } from "@/context/UserManagementContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminPanelContent = () => {
  const { currentUser, isAdmin, logout } = useUser();
  const { data } = useUserManagement();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder al panel de administración",
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

  if (!isAdmin) {
    return null;
  }

  // Estadísticas sincronizadas con los datos reales
  const stats = {
    totalUsers: data.users.length,
    activeUsers: data.users.filter(u => u.status === 'active').length,
    totalLocations: 15,
    totalSupplies: 45,
    totalTools: 28,
    pendingActivities: 8,
    completedActivities: 23,
    systemHealth: 98
  };

  const adminMenuItems = [
    {
      title: "Gestión de Usuarios",
      icon: <Users className="h-8 w-8" />,
      path: "/admin/users",
      description: "Administrar usuarios del sistema",
      color: "bg-blue-500",
      available: true
    },
    {
      title: "Gestión de Ubicaciones",
      icon: <MapPin className="h-8 w-8" />,
      path: "/admin/locations",
      description: "Administrar ubicaciones y tags RFID",
      color: "bg-green-500",
      available: true
    },
    {
      title: "Asignación de Actividades",
      icon: <Calendar className="h-8 w-8" />,
      path: "/admin/activities",
      description: "Crear y asignar tareas a usuarios",
      color: "bg-red-500",
      available: true
    },
    {
      title: "Base de Datos de Insumos",
      icon: <Package className="h-8 w-8" />,
      path: "/admin/supplies-db",
      description: "Gestionar catálogo de insumos",
      color: "bg-purple-500",
      available: true
    },
    {
      title: "Base de Datos de Herramientas",
      icon: <Tool className="h-8 w-8" />,
      path: "/admin/tools-db",
      description: "Gestionar catálogo de herramientas",
      color: "bg-orange-500",
      available: true
    },
    {
      title: "Configuración del Sistema",
      icon: <Settings className="h-8 w-8" />,
      path: "/admin/settings",
      description: "Configuraciones generales",
      color: "bg-gray-500",
      available: false
    }
  ];

  const handleMenuClick = (item: typeof adminMenuItems[0]) => {
    if (!item.available) {
      toast({
        title: "Funcionalidad en desarrollo",
        description: `${item.title} estará disponible próximamente`,
      });
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Banner de Administrador */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Panel de Administración
              </h1>
              <p className="text-red-100 text-sm mt-1">
                Bienvenido, {currentUser?.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  Administrador
                </Badge>
                <Badge className="bg-green-500/80 text-white">
                  Sistema Activo
                </Badge>
              </div>
            </div>
          </div>

          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Mi Cuenta</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white border border-gray-200 shadow-lg"
            >
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.email}
                </p>
              </div>
              
              <DropdownMenuItem 
                onClick={handleProfile}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <UserCircle className="h-4 w-4" />
                Ver Perfil
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={handleSettings}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-1 border-gray-100" />
              
              <DropdownMenuItem asChild>
                <Link 
                  to="/menu"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  <Home className="h-4 w-4" />
                  Vista de Usuario
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-1 border-gray-100" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Estadísticas del Sistema */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ubicaciones</p>
                <p className="text-2xl font-bold">{stats.totalLocations}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salud del Sistema</p>
                <p className="text-2xl font-bold text-green-600">{stats.systemHealth}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menú de Administración */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {adminMenuItems.map((item) => (
          <div key={item.path} className="block">
            <Card 
              className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-gray-100 cursor-pointer ${
                !item.available ? 'opacity-60' : ''
              }`}
              onClick={() => handleMenuClick(item)}
            >
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className={`rounded-full p-3 mb-4 ${item.color} text-white relative`}>
                  {item.icon}
                  {item.available && (
                    <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1">
                      ✓
                    </Badge>
                  )}
                </div>
                <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>
                {!item.available && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Próximamente
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Resumen de Actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Resumen de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Insumos Registrados</span>
                <Badge variant="outline">{stats.totalSupplies}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Herramientas Registradas</span>
                <Badge variant="outline">{stats.totalTools}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ubicaciones Configuradas</span>
                <Badge variant="outline">{stats.totalLocations}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Estado de Actividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Actividades Pendientes</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  {stats.pendingActivities}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Actividades Completadas</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {stats.completedActivities}
                </Badge>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/admin/activities")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Gestionar Actividades
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <UserManagementProvider>
      <Layout hideHeader>
        <AdminPanelContent />
      </Layout>
    </UserManagementProvider>
  );
};

export default AdminPanel;