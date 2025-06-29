import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  User, 
  ChevronDown, 
  UserCircle, 
  Settings, 
  LogOut, 
  Home,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Bug,
  Droplets,
  Thermometer,
  CloudRain,
  ChevronRight,
  LayoutGrid,
  BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock data for charts
const mockIncidenceData = [
  { month: 'Ene', incidence: 42 },
  { month: 'Feb', incidence: 38 },
  { month: 'Mar', incidence: 45 },
  { month: 'Abr', incidence: 53 },
  { month: 'May', incidence: 49 },
  { month: 'Jun', incidence: 62 },
  { month: 'Jul', incidence: 78 },
  { month: 'Ago', incidence: 65 },
  { month: 'Sep', incidence: 59 },
  { month: 'Oct', incidence: 47 },
  { month: 'Nov', incidence: 52 },
  { month: 'Dic', incidence: 43 },
];

const mockPathogens = [
  { name: 'Moniliasis', percentage: 35 },
  { name: 'Escoba de bruja', percentage: 25 },
  { name: 'Phytophthora', percentage: 20 },
  { name: 'Antracnosis', percentage: 12 },
  { name: 'Otros', percentage: 8 },
];

const mockWeatherData = [
  { day: 'Lun', temperature: 28, humidity: 75, rainfall: 0 },
  { day: 'Mar', temperature: 29, humidity: 78, rainfall: 0 },
  { day: 'Mié', temperature: 27, humidity: 82, rainfall: 5 },
  { day: 'Jue', temperature: 26, humidity: 85, rainfall: 12 },
  { day: 'Vie', temperature: 25, humidity: 80, rainfall: 3 },
  { day: 'Sáb', temperature: 27, humidity: 75, rainfall: 0 },
  { day: 'Dom', temperature: 28, humidity: 72, rainfall: 0 },
];

// Definición de las bitácoras electrónicas disponibles
const electronicLogbooks = [
  {
    id: "pest-incidence",
    title: "Incidencia de Plagas en Invernadero",
    icon: <LayoutGrid className="h-5 w-5 text-green-600" />,
    description: "Registros de incidencia de plagas en surcos del invernadero",
    path: "/data"
  },
  {
    id: "cacao-pathogens",
    title: "Patógenos de Cacao",
    icon: <Bug className="h-5 w-5 text-amber-600" />,
    description: "Registros de patógenos en árboles de cacao",
    path: "/cacao-pathogens"
  },
  {
    id: "activities",
    title: "Actividades Asignadas",
    icon: <Calendar className="h-5 w-5 text-blue-600" />,
    description: "Seguimiento de actividades asignadas a usuarios",
    path: "/admin/activities"
  }
];

const Reports = () => {
  const { currentUser, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timeRange, setTimeRange] = useState("year");
  const [location, setLocation] = useState("all");
  const [expandedLogbook, setExpandedLogbook] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder a los reportes",
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

  const handleExportData = () => {
    toast({
      title: "Exportando datos",
      description: "Los datos se están preparando para su descarga",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Datos exportados",
        description: "El reporte ha sido descargado correctamente",
      });
    }, 2000);
  };

  const handleLogbookSelect = (logbookId: string) => {
    setExpandedLogbook(expandedLogbook === logbookId ? null : logbookId);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
                <LineChart className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                  Reportes y Análisis
                </h1>
                <p className="text-green-100 text-xs md:text-sm mt-1 leading-tight">
                  Visualización de datos y análisis estadístico
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <Button 
                onClick={handleExportData}
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
                size="sm"
              >
                <Download className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Exportar Datos</span>
                <span className="xs:hidden">Exportar</span>
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

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                <SelectItem value="greenhouse">Invernadero Principal</SelectItem>
                <SelectItem value="cacao">Área de Cacao</SelectItem>
                <SelectItem value="field">Campo Abierto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-800">Incidencia Promedio</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-green-900">3.2</p>
                    <span className="text-xs text-green-700">/10</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-green-700">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>12% vs mes anterior</span>
                  </div>
                </div>
                <div className="p-2 bg-green-200 rounded-full">
                  <TrendingDown className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-800">Árboles Afectados</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-red-900">27</p>
                    <span className="text-xs text-red-700">%</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-red-700">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>8% vs mes anterior</span>
                  </div>
                </div>
                <div className="p-2 bg-red-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-800">Efectividad Tratamientos</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-blue-900">78</p>
                    <span className="text-xs text-blue-700">%</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-blue-700">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>5% vs mes anterior</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-800">Cobertura Monitoreo</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-purple-900">92</p>
                    <span className="text-xs text-purple-700">%</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-purple-700">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>3% vs mes anterior</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Principal y Bitácoras Electrónicas */}
        <div className="space-y-6">
          {/* Dashboard Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Dashboard General
              </CardTitle>
              <CardDescription>
                Resumen consolidado de todos los indicadores clave
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                {/* Aquí iría el gráfico real */}
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Dashboard general con indicadores clave</p>
                  <p className="text-xs text-gray-400 mt-1">Datos consolidados de todas las bitácoras</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bitácoras Electrónicas con Acordeón */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Bitácoras Electrónicas
              </CardTitle>
              <CardDescription>
                Reportes detallados por cada tipo de registro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {electronicLogbooks.map((logbook) => (
                  <AccordionItem key={logbook.id} value={logbook.id}>
                    <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        {logbook.icon}
                        <div className="text-left">
                          <h3 className="font-medium">{logbook.title}</h3>
                          <p className="text-xs text-gray-500">{logbook.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 pb-4">
                      {logbook.id === "pest-incidence" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2">
                              <CardHeader>
                                <CardTitle>Tendencia de Incidencia</CardTitle>
                                <CardDescription>Nivel promedio de incidencia por mes</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="h-80 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                                  {/* Aquí iría el gráfico real */}
                                  <div className="text-center">
                                    <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500">Gráfico de tendencia de incidencia</p>
                                    <p className="text-xs text-gray-400 mt-1">Datos de {timeRange === 'year' ? 'los últimos 12 meses' : timeRange === 'quarter' ? 'los últimos 3 meses' : 'el último mes'}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle>Distribución por Zonas</CardTitle>
                                <CardDescription>Incidencia por ubicación</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="h-80 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                                  {/* Aquí iría el gráfico real */}
                                  <div className="text-center">
                                    <PieChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500">Gráfico de distribución por zonas</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => navigate("/data")}
                            >
                              <LayoutGrid className="h-4 w-4" />
                              Ver Bitácora Completa
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {logbook.id === "cacao-pathogens" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle>Distribución de Patógenos</CardTitle>
                                <CardDescription>Porcentaje de incidencia por tipo de patógeno</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="h-80 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                                  {/* Aquí iría el gráfico real */}
                                  <div className="text-center">
                                    <PieChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500">Gráfico de distribución de patógenos</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle>Prevalencia por Patógeno</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {mockPathogens.map((pathogen) => (
                                    <div key={pathogen.name} className="space-y-1">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <Bug className="h-4 w-4 text-amber-500" />
                                          <span className="font-medium">{pathogen.name}</span>
                                        </div>
                                        <span className="text-sm font-bold">{pathogen.percentage}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-amber-500 h-2 rounded-full" 
                                          style={{ width: `${pathogen.percentage}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => navigate("/cacao-pathogens")}
                            >
                              <Bug className="h-4 w-4" />
                              Ver Bitácora Completa
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {logbook.id === "activities" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Actividades Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-600">8</p>
                                  </div>
                                  <Calendar className="h-8 w-8 text-yellow-500" />
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Completadas</p>
                                    <p className="text-2xl font-bold text-green-600">23</p>
                                  </div>
                                  <Calendar className="h-8 w-8 text-green-500" />
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Tasa de Finalización</p>
                                    <p className="text-2xl font-bold text-blue-600">74%</p>
                                  </div>
                                  <Calendar className="h-8 w-8 text-blue-500" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle>Distribución de Actividades por Categoría</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="h-64 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                                {/* Aquí iría el gráfico real */}
                                <div className="text-center">
                                  <PieChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                  <p className="text-gray-500">Gráfico de distribución de actividades</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => navigate("/admin/activities")}
                            >
                              <Calendar className="h-4 w-4" />
                              Ver Actividades Completas
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Condiciones Ambientales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-600" />
              Condiciones Ambientales
            </CardTitle>
            <CardDescription>Datos climáticos y su impacto en los cultivos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Día</th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span>Temperatura</span>
                      </div>
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>Humedad</span>
                      </div>
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        <CloudRain className="h-4 w-4 text-cyan-500" />
                        <span>Precipitación</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockWeatherData.map((day) => (
                    <tr key={day.day} className="border-b border-gray-100">
                      <td className="py-2 px-4 font-medium">{day.day}</td>
                      <td className="py-2 px-4">{day.temperature}°C</td>
                      <td className="py-2 px-4">{day.humidity}%</td>
                      <td className="py-2 px-4">{day.rainfall} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;