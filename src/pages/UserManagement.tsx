import { Layout } from "@/components/Layout";
import { UserManagementProvider } from "@/context/UserManagementContext";
import { UserManagementForm } from "@/components/UserManagementForm";
import { UserManagementList } from "@/components/UserManagementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Users, 
  User, 
  ChevronDown, 
  UserCircle, 
  Settings, 
  LogOut, 
  Home,
  UserPlus,
  BarChart3,
  Shield,
  Activity
} from "lucide-react";
import { useUserManagement } from "@/context/UserManagementContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UserManagement as UserManagementType } from "@/types/userManagement";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserManagementContent() {
  const { data, exportToCSV } = useUserManagement();
  const { currentUser, isAdmin, logout } = useUser();
  const isMobile = useIsMobile();
  const [editingUser, setEditingUser] = useState<UserManagementType | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "form" | "stats">("list");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder a la gestión de usuarios",
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

  const handleEdit = (user: UserManagementType) => {
    setEditingUser(user);
    setActiveTab("form");
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setActiveTab("list");
  };

  const handleSave = () => {
    setEditingUser(null);
    setActiveTab("list");
  };

  // Calcular estadísticas
  const stats = {
    total: data.users.length,
    active: data.users.filter(u => u.status === 'active').length,
    inactive: data.users.filter(u => u.status !== 'active').length,
    admins: data.users.filter(u => u.role === 'admin').length,
    regularUsers: data.users.filter(u => u.role === 'user').length,
    departments: [...new Set(data.users.map(u => u.department).filter(Boolean))].length,
    recentLogins: data.users.filter(u => u.lastLogin && (Date.now() - u.lastLogin) < 1000 * 60 * 60 * 24 * 7).length // Últimos 7 días
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                Gestión de Usuarios
              </h1>
              <p className="text-red-100 text-xs md:text-sm mt-1 leading-tight">
                Administración de usuarios y permisos del sistema
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button 
              onClick={() => { setEditingUser(null); setActiveTab("form"); }}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              size="sm"
            >
              <UserPlus className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">Nuevo Usuario</span>
              <span className="xs:hidden">Nuevo</span>
            </Button>
            
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              disabled={data.users.length === 0}
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
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold">{stats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">
              Lista ({data.users.length})
            </TabsTrigger>
            <TabsTrigger value="form">
              {editingUser ? "Editar" : "Nuevo"}
            </TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <UserManagementList onEdit={handleEdit} />
          </TabsContent>
          
          <TabsContent value="form">
            <UserManagementForm 
              editingUser={editingUser}
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
                      <p className="text-sm text-blue-800">Total Usuarios</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                      <p className="text-sm text-green-800">Activos</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Administradores:</span>
                      <span className="font-medium">{stats.admins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usuarios Regulares:</span>
                      <span className="font-medium">{stats.regularUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Departamentos:</span>
                      <span className="font-medium">{stats.departments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inactivos:</span>
                      <span className="font-medium text-red-600">{stats.inactive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accesos recientes (7 días):</span>
                      <span className="font-medium">{stats.recentLogins}</span>
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
            <UserManagementForm 
              editingUser={editingUser}
              onCancel={handleCancelEdit}
              onSave={handleSave}
            />
          </div>
          <div>
            <UserManagementList onEdit={handleEdit} />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de gestión de usuarios:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. <strong>Crear usuario:</strong> Complete el formulario con nombre, email y seleccione un rol</li>
          <li>2. <strong>Contraseña:</strong> Use el botón "Generar Contraseña" para crear una contraseña segura</li>
          <li>3. <strong>Permisos:</strong> Los permisos se asignan automáticamente según el rol, pero pueden personalizarse</li>
          <li>4. <strong>Estado:</strong> Active/desactive usuarios según sea necesario</li>
          <li>5. <strong>Filtros:</strong> Use la búsqueda y filtros para encontrar usuarios específicos</li>
          <li>6. <strong>Exportar:</strong> Descargue datos en CSV para análisis externos</li>
          <li>7. <strong>Seguridad:</strong> El usuario administrador principal no puede ser eliminado ni desactivado</li>
        </ul>
      </div>
    </div>
  );
}

const UserManagement = () => {
  return (
    <UserManagementProvider>
      <Layout>
        <UserManagementContent />
      </Layout>
    </UserManagementProvider>
  );
};

export default UserManagement;