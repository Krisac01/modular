import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  LayoutGrid, 
  Package, 
  Wrench, 
  BookOpen, 
  Bug, 
  User, 
  Settings, 
  LogOut, 
  Clock, 
  ChevronDown, 
  UserCircle,
  CheckCircle,
  Timer,
  Target,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
      location: "Área de Cacao - Sección B"
    },
    {
      id: "a2",
      title: "Aplicación de Fungicida",
      description: "Aplicar tratamiento preventivo en Surcos 8-12",
      priority: "medium",
      dueDate: Date.now() + 1000 * 60 * 60 * 6, // 6 hours from now
      estimatedTime: "2 horas",
      assignedBy: "Jefe de Campo",
      status: "pending",
      location: "Invernadero Principal"
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
      location: "Taller de Herramientas"
    },
    {
      id: "a4",
      title: "Recolección de Muestras",
      description: "Tomar muestras de suelo en Sección C para análisis",
      priority: "medium",
      dueDate: Date.now() + 1000 * 60 * 60 * 48, // 2 days from now
      estimatedTime: "30 min",
      assignedBy: "Laboratorio",
      status: "pending",
      location: "Área de Cacao - Sección C"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const formatTimeUntil = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 24) return `En ${hours}h`;
    return `En ${days}d`;
  };

  // Menú simplificado sin "Actualizar Área de trabajo"
  const menuItems = [
    {
      title: "Actualizar Ubicación",
      icon: <MapPin className="h-8 w-8" />,
      path: "/location",
      description: "Actualizar la ubicación del trabajo en campo"
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
    }
  ];

  return (
    <Layout hideHeader>
      <div className="max-w-7xl mx-auto">
        {/* Header Banner Normalizado - Menú Principal */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  ¡Bienvenido, {user?.name || 'Usuario'}!
                </h1>
                <p className="text-green-100 text-sm mt-1">
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

        {/* Título Minimalista con Efectos Sutiles */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Efecto de resplandor sutil */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-600/30 to-green-500/20 rounded-xl blur-md opacity-60"></div>
            
            {/* Contenedor principal minimalista */}
            <div className="relative bg-white border border-green-200 rounded-xl p-8 shadow-lg">
              {/* Título principal limpio */}
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-2 tracking-wide">
                Menú Principal
              </h1>
              
              {/* Línea decorativa minimalista */}
              <div className="w-24 h-0.5 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-3"></div>
              
              {/* Subtítulo elegante */}
              <p className="text-green-600 text-sm font-medium tracking-wider uppercase">
                Sistema de Gestión Agrícola
              </p>
              
              {/* Efecto de brillo sutil en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Grid simplificado con 3 opciones */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
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
        </div>

        {/* Bitácora electrónica reorganizada */}
        <Card className="mt-8 bg-green-50 border-2 border-green-100">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="rounded-full bg-green-100 p-3 text-green-dark">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Bitácora electrónica/Registro de actividad
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Registro de actividades de control de plagas y patógenos
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna Izquierda - Enlaces de Bitácora */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    Acceso a Bitácoras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/data" className="block">
                    <Button variant="outline" className="w-full flex items-center gap-3 justify-start px-4 py-4 h-auto hover:bg-green-50 hover:border-green-300">
                      <LayoutGrid className="h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium text-base">Control de Plagas - Invernadero</div>
                        <div className="text-sm text-gray-500">Registro de incidencia en surcos del invernadero</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link to="/cacao-pathogens" className="block">
                    <Button variant="outline" className="w-full flex items-center gap-3 justify-start px-4 py-4 h-auto hover:bg-orange-50 hover:border-orange-300">
                      <Bug className="h-6 w-6 text-orange-600" />
                      <div className="text-left">
                        <div className="font-medium text-base">Control de Patógenos - Cacao</div>
                        <div className="text-sm text-gray-500">Registro de patógenos en árboles de cacao</div>
                      </div>
                    </Button>
                  </Link>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 text-center">
                      Seleccione el tipo de registro que desea realizar
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Columna Derecha - Actividades Asignadas */}
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Actividades Asignadas
                  </CardTitle>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {assignedActivities.filter(a => a.status === 'pending').length} pendientes
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3">
                      {assignedActivities.map((activity) => (
                        <Card key={activity.id} className="border-l-4 border-l-orange-400">
                          <CardContent className="pt-3 pb-3">
                            <div className="flex items-start gap-3">
                              <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(activity.priority)}`}></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{activity.title}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      activity.priority === 'high' ? 'border-red-300 text-red-700' :
                                      activity.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                      'border-green-300 text-green-700'
                                    }`}
                                  >
                                    {activity.priority === 'high' ? 'Alta' : 
                                     activity.priority === 'medium' ? 'Media' : 'Baja'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                  <User className="h-3 w-3" />
                                  <span>Por: {activity.assignedBy}</span>
                                  <span>•</span>
                                  <MapPin className="h-3 w-3" />
                                  <span>{activity.location}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Timer className="h-3 w-3" />
                                    <span>{activity.estimatedTime}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    <span className={`font-medium ${
                                      activity.dueDate < Date.now() + 1000 * 60 * 60 * 4 ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                      {formatTimeUntil(activity.dueDate)}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <Button size="sm" variant="outline" className="w-full text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Marcar como Completada
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ver Todas las Asignaciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MainMenu;