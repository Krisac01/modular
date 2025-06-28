import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, LayoutGrid, Package, Wrench, BookOpen, Lightbulb, Bug, User, Settings, LogOut, Clock, ChevronDown, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainMenu = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [facialRecognitionEnabled, setFacialRecognitionEnabled] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Load facial recognition setting
    const facialSetting = localStorage.getItem("facialRecognitionEnabled");
    setFacialRecognitionEnabled(facialSetting === "true");

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
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

  const handleFacialRecognitionToggle = (enabled: boolean) => {
    setFacialRecognitionEnabled(enabled);
    localStorage.setItem("facialRecognitionEnabled", enabled.toString());
    
    toast({
      title: enabled ? "Reconocimiento facial activado" : "Reconocimiento facial desactivado",
      description: enabled 
        ? "El sistema de reconocimiento facial está ahora disponible" 
        : "El sistema de reconocimiento facial ha sido desactivado",
    });
  };

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCurrentDate = () => {
    return currentTime.toLocaleDateString('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const menuItems = [
    {
      title: "Actualizar Ubicación",
      icon: <MapPin className="h-8 w-8" />,
      path: "/location",
      description: "Actualizar la ubicación del trabajo en campo"
    },
    {
      title: "Actualizar Área de trabajo",
      icon: <Settings className="h-8 w-8" />,
      path: "/work-area",
      description: "Administrar el área de trabajo actual"
    },
    {
      title: "Registrar Posesión de Insumo",
      icon: <Package className="h-8 w-8" />,
      path: "/supplies",
      description: "Registro de insumos adquiridos o utilizados"
    },
    {
      title: "Registrar Posesión de Herramienta",
      icon: <Wrench className="h-8 w-8" />,
      path: "/tools",
      description: "Registro de herramientas adquiridas o utilizadas"
    },
    {
      title: "Alertas y Recomendaciones AI",
      icon: <Lightbulb className="h-8 w-8" />,
      path: "/ai-alerts",
      description: "Análisis inteligente de datos con AI"
    }
  ];

  return (
    <Layout hideHeader>
      <div className="max-w-4xl mx-auto">
        {/* User Banner with Dropdown */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  ¡Bienvenido, {user?.name || 'Usuario'}!
                </h2>
                <p className="text-green-100 text-sm">
                  {user?.email || 'usuario@ejemplo.com'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-green-100 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{getCurrentTime()}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{getCurrentDate()}</span>
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

        {/* Facial Recognition Control Card */}
        <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reconocimiento Facial
                  </h3>
                  <p className="text-sm text-gray-600">
                    {facialRecognitionEnabled 
                      ? "Sistema activo - Autenticación biométrica habilitada" 
                      : "Sistema desactivado - Funcionalidad no disponible"
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="facial-recognition"
                    checked={facialRecognitionEnabled}
                    onCheckedChange={handleFacialRecognitionToggle}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Label 
                    htmlFor="facial-recognition" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    {facialRecognitionEnabled ? "Activado" : "Desactivado"}
                  </Label>
                </div>
                
                {facialRecognitionEnabled && (
                  <Link to="/facial-recognition">
                    <Button 
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Acceder
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            {facialRecognitionEnabled && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700">
                  ✓ Autenticación biométrica para registro de posesión (10 min activo)
                  <br />
                  ✓ Trazabilidad de actividades por usuario autenticado
                  <br />
                  ✓ Geolocalización de registros y actividades
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/1b34c799-c8d6-481c-a574-7fcafc61c176.png" 
            alt="Modular Agrosolutions" 
            className="h-20 w-20 mb-4"
          />
          <h1 className="text-3xl font-bold text-green-dark text-center">
            Menú Principal
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path} className="block">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-gray-100">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="rounded-full p-3 mb-4 bg-green-50 text-green-dark">
                    {item.icon}
                  </div>
                  <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Bitácora electrónica card with expanded content */}
          <Link to="/logbook" className="block col-span-1 md:col-span-2 lg:col-span-3">
            <Card className="h-full bg-green-50 transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-green-100">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4 text-green-dark">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h2 className="font-semibold text-lg mb-2">
                  Bitácora electrónica/Registro de actividad
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Registro de actividades, incluyendo control de plagas y patógenos
                </p>

                {/* Sub-options container */}
                <div className="w-full max-w-2xl mt-2 grid md:grid-cols-2 gap-4">
                  <Link to="/data" className="block">
                    <Card className="h-full bg-white transition-all duration-200 hover:shadow-md hover:scale-102">
                      <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
                        <div className="rounded-full bg-green-50 p-2 mb-2 text-green-600">
                          <LayoutGrid className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-md mb-1">
                          Control de Plagas - Invernadero
                        </h3>
                        <p className="text-xs text-gray-600">
                          Registro y seguimiento de incidencia de plagas
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/cacao-pathogens" className="block">
                    <Card className="h-full bg-white transition-all duration-200 hover:shadow-md hover:scale-102">
                      <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
                        <div className="rounded-full bg-orange-50 p-2 mb-2 text-orange-600">
                          <Bug className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-md mb-1">
                          Control de patógenos - Incidencia de patógenos del cacao
                        </h3>
                        <p className="text-xs text-gray-600">
                          Registro y seguimiento de patógenos del cacao
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default MainMenu;