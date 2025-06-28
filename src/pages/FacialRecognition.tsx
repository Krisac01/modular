import { Layout } from "@/components/Layout";
import { FacialRecognitionProvider } from "@/context/FacialRecognitionContext";
import { FacialRecognitionScanner } from "@/components/FacialRecognitionScanner";
import { FacialRecognitionHistory } from "@/components/FacialRecognitionHistory";
import { Button } from "@/components/ui/button";
import { Download, User, Shield, Clock, ChevronDown, UserCircle, Settings, LogOut } from "lucide-react";
import { useFacialRecognition } from "@/context/FacialRecognitionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function FacialRecognitionContent() {
  const { exportToCSV, data, isSessionActive, currentSession } = useFacialRecognition();
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
      {/* Header Banner Normalizado */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Reconocimiento Facial
              </h1>
              <p className="text-green-100 text-sm mt-1">
                Autenticación biométrica para registro de posesión
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isSessionActive && currentSession && (
              <div className="bg-white/10 rounded-lg px-4 py-2 border border-white/30 flex items-center gap-2">
                <Clock className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">
                  Sesión: {currentSession.userName}
                </span>
              </div>
            )}
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
              disabled={data.sessions.length === 0}
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            
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
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">
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
            <TabsTrigger value="scanner">Reconocimiento</TabsTrigger>
            <TabsTrigger value="history">
              Historial ({data.sessions.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner">
            <FacialRecognitionScanner />
          </TabsContent>
          <TabsContent value="history">
            <FacialRecognitionHistory />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <FacialRecognitionScanner />
          </div>
          <div>
            <FacialRecognitionHistory />
          </div>
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad y Privacidad
          </h3>
          <div className="text-sm text-purple-700 space-y-1">
            <p>• Reconocimiento facial local (no se envían datos)</p>
            <p>• Algoritmos de alta precisión ({'>'} 80% confianza)</p>
            <p>• Sesiones temporales de 10 minutos</p>
            <p>• Datos biométricos no almacenados</p>
            <p>• Cumplimiento con normativas de privacidad</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Funcionalidades Habilitadas
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Registro de posesión de insumos agrícolas</p>
            <p>• Registro de posesión de herramientas</p>
            <p>• Trazabilidad de actividades por usuario</p>
            <p>• Geolocalización de registros</p>
            <p>• Historial de sesiones y actividades</p>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Flujo de Trabajo</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p><strong>1. Autenticación:</strong> Realice reconocimiento facial para iniciar sesión de 10 minutos</p>
          <p><strong>2. Registro:</strong> Durante la sesión activa, registre posesión de insumos o herramientas</p>
          <p><strong>3. Trazabilidad:</strong> Todos los registros quedan vinculados al usuario autenticado</p>
          <p><strong>4. Extensión:</strong> Extienda la sesión por 10 minutos adicionales si es necesario</p>
          <p><strong>5. Finalización:</strong> La sesión expira automáticamente o puede finalizarse manualmente</p>
        </div>
      </div>
    </div>
  );
}

const FacialRecognition = () => {
  return (
    <FacialRecognitionProvider>
      <Layout>
        <FacialRecognitionContent />
      </Layout>
    </FacialRecognitionProvider>
  );
};

export default FacialRecognition;