import { Layout } from "@/components/Layout";
import { LocationProvider } from "@/context/LocationContext";
import { RFIDScanner } from "@/components/RFIDScanner";
import { LocationHistory } from "@/components/LocationHistory";
import { Button } from "@/components/ui/button";
import { Download, MapPin, User, ChevronDown, UserCircle, Settings, LogOut, Home } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function LocationContent() {
  const { exportToCSV, data } = useLocation();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    
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

  return (
    <div className="space-y-6">
      {/* Header Banner Optimizado para Móvil */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4">
          {/* Fila Superior - Título e Ícono */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                Actualizar Ubicación
              </h1>
              <p className="text-green-100 text-xs md:text-sm mt-1 leading-tight">
                Registro automático por acercamiento a tags RFID
              </p>
            </div>
          </div>
          
          {/* Fila Inferior - Controles */}
          <div className="flex items-center justify-end gap-2">
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
              disabled={data.records.length === 0}
              size="sm"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">Exportar CSV</span>
              <span className="xs:hidden">CSV</span>
            </Button>
            
            {/* Botón Inicio */}
            <Link to="/menu">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9"
              >
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xs:inline text-sm">Inicio</span>
              </Button>
            </Link>
            
            {/* User Dropdown Menu */}
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
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white border border-gray-200 shadow-lg"
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'usuario@ejemplo.com'}
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
      </div>

      {/* Content */}
      {isMobile ? (
        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner">Escáner RFID</TabsTrigger>
            <TabsTrigger value="history">
              Historial ({data.records.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner">
            <RFIDScanner />
          </TabsContent>
          <TabsContent value="history">
            <LocationHistory />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <RFIDScanner />
          </div>
          <div>
            <LocationHistory />
          </div>
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ubicaciones Disponibles
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Invernadero Principal (Secciones A-E)</p>
            <p>• Campo Abierto (Zona Norte y Sur)</p>
            <p>• Área de Cacao (Secciones A-E)</p>
            <p>• Bodega de Insumos</p>
            <p>• Oficina Técnica</p>
            <p>• Área de Compostaje</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ventajas del Sistema RFID
          </h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>• Registro automático sin intervención manual</p>
            <p>• Precisión en la ubicación del personal</p>
            <p>• Trazabilidad completa de movimientos</p>
            <p>• Integración con GPS para coordenadas exactas</p>
            <p>• Historial detallado para análisis</p>
            <p>• Exportación de datos para reportes</p>
          </div>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Requisitos Técnicos</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• Dispositivo móvil con capacidad NFC/RFID habilitada</p>
          <p>• Permisos de ubicación activados para GPS</p>
          <p>• Tags RFID programados y ubicados en puntos estratégicos</p>
          <p>• Conexión a internet para sincronización de datos</p>
        </div>
      </div>
    </div>
  );
}

const Location = () => {
  return (
    <LocationProvider>
      <Layout>
        <LocationContent />
      </Layout>
    </LocationProvider>
  );
};

export default Location;