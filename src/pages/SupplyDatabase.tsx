import { Layout } from "@/components/Layout";
import { SupplyDatabaseProvider } from "@/context/SupplyDatabaseContext";
import { SupplyDatabaseForm } from "@/components/SupplyDatabaseForm";
import { SupplyDatabaseList } from "@/components/SupplyDatabaseList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Package, 
  User, 
  ChevronDown, 
  UserCircle, 
  Settings, 
  LogOut, 
  Home,
  Upload,
  BarChart3,
  Database,
  AlertTriangle,
  Plus
} from "lucide-react";
import { useSupplyDatabase } from "@/context/SupplyDatabaseContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SupplyDatabaseItem } from "@/types/supplyDatabase";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SupplyDatabaseContent() {
  const { data, exportToCSV, importSampleData } = useSupplyDatabase();
  const { currentUser, isAdmin, logout } = useUser();
  const isMobile = useIsMobile();
  const [editingSupply, setEditingSupply] = useState<SupplyDatabaseItem | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "form" | "stats">("list");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder a la base de datos de insumos",
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

  const handleEdit = (supply: SupplyDatabaseItem) => {
    setEditingSupply(supply);
    setActiveTab("form");
  };

  const handleCancelEdit = () => {
    setEditingSupply(null);
    setActiveTab("list");
  };

  const handleSave = () => {
    setEditingSupply(null);
    setActiveTab("list");
  };

  // Calcular estadísticas
  const stats = {
    total: data.supplies.length,
    active: data.supplies.filter(s => s.status === 'active').length,
    discontinued: data.supplies.filter(s => s.status === 'discontinued').length,
    restricted: data.supplies.filter(s => s.status === 'restricted').length,
    categories: data.categories.length,
    insecticides: data.supplies.filter(s => s.category.id === 'insecticide').length,
    fungicides: data.supplies.filter(s => s.category.id === 'fungicide').length,
    fertilizers: data.supplies.filter(s => s.category.id === 'fertilizer').length
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
              <Database className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                Base de Datos de Insumos
              </h1>
              <p className="text-purple-100 text-xs md:text-sm mt-1 leading-tight">
                Gestión del catálogo de insumos agrícolas
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button 
              onClick={() => { setEditingSupply(null); setActiveTab("form"); }}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              size="sm"
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">Nuevo Insumo</span>
              <span className="xs:hidden">Nuevo</span>
            </Button>
            
            <Button 
              onClick={importSampleData}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              size="sm"
            >
              <Upload className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">Importar Datos</span>
              <span className="xs:hidden">Importar</span>
            </Button>
            
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              disabled={data.supplies.length === 0}
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
                <p className="text-sm font-medium text-gray-600">Total Insumos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Insumos Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uso Restringido</p>
                <p className="text-2xl font-bold text-red-600">{stats.restricted}</p>
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
              Lista ({data.supplies.length})
            </TabsTrigger>
            <TabsTrigger value="form">
              {editingSupply ? "Editar" : "Nuevo"}
            </TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <SupplyDatabaseList onEdit={handleEdit} />
          </TabsContent>
          
          <TabsContent value="form">
            <SupplyDatabaseForm 
              editingSupply={editingSupply}
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
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                      <p className="text-sm text-purple-800">Total Insumos</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                      <p className="text-sm text-green-800">Activos</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Insecticidas:</span>
                      <span className="font-medium">{stats.insecticides}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fungicidas:</span>
                      <span className="font-medium">{stats.fungicides}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fertilizantes:</span>
                      <span className="font-medium">{stats.fertilizers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Descontinuados:</span>
                      <span className="font-medium text-gray-600">{stats.discontinued}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uso Restringido:</span>
                      <span className="font-medium text-red-600">{stats.restricted}</span>
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
            <SupplyDatabaseForm 
              editingSupply={editingSupply}
              onCancel={handleCancelEdit}
              onSave={handleSave}
            />
          </div>
          <div>
            <SupplyDatabaseList onEdit={handleEdit} />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de gestión de insumos:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. <strong>Crear insumo:</strong> Complete el formulario con nombre, categoría, ingrediente activo, etc.</li>
          <li>2. <strong>Plagas objetivo:</strong> Agregue las plagas o enfermedades que controla el insumo</li>
          <li>3. <strong>Métodos de aplicación:</strong> Seleccione todos los métodos aplicables para el insumo</li>
          <li>4. <strong>Instrucciones y seguridad:</strong> Detalle cómo se debe aplicar y las precauciones necesarias</li>
          <li>5. <strong>Estado:</strong> Marque como activo, descontinuado o de uso restringido según corresponda</li>
          <li>6. <strong>Filtros:</strong> Use la búsqueda y filtros para encontrar insumos específicos</li>
          <li>7. <strong>Exportar:</strong> Descargue datos en CSV para análisis externos</li>
        </ul>
      </div>
    </div>
  );
}

const SupplyDatabase = () => {
  return (
    <SupplyDatabaseProvider>
      <Layout>
        <SupplyDatabaseContent />
      </Layout>
    </SupplyDatabaseProvider>
  );
};

export default SupplyDatabase;