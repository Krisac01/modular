import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  BellRing, 
  User, 
  ChevronDown, 
  UserCircle, 
  Settings, 
  LogOut, 
  Home,
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  Brain,
  Lightbulb,
  Bug,
  Droplets,
  Thermometer,
  CloudRain,
  Leaf,
  Zap,
  MapPin,
  Save
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

// Tipos para las alertas
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
type AlertCategory = 'pathogen' | 'pest' | 'weather' | 'supply' | 'maintenance' | 'prediction';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  location: string;
  timestamp: number;
  status: AlertStatus;
  aiConfidence: number;
  relatedData?: {
    type: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
    percentage?: number;
  }[];
}

// Datos de ejemplo para las alertas
const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    title: 'Brote potencial de Moniliasis detectado',
    description: 'El sistema ha detectado un incremento significativo en la incidencia de Moniliasis en la Sección B del área de cacao. Se recomienda inspección inmediata y aplicación preventiva de fungicida.',
    severity: 'critical',
    category: 'pathogen',
    location: 'Área de Cacao - Sección B',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
    status: 'active',
    aiConfidence: 92,
    relatedData: [
      { type: 'Incremento de incidencia', value: '27%', trend: 'up', percentage: 27 },
      { type: 'Árboles afectados', value: 12 },
      { type: 'Nivel promedio', value: 7.3 }
    ]
  },
  {
    id: 'alert-002',
    title: 'Condiciones favorables para Phytophthora',
    description: 'Las condiciones de humedad elevada (85%) sostenidas durante las últimas 48 horas crean un ambiente propicio para el desarrollo de Phytophthora. Se recomienda monitoreo intensivo y considerar aplicación preventiva.',
    severity: 'high',
    category: 'weather',
    location: 'Invernadero Principal',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 horas atrás
    status: 'acknowledged',
    aiConfidence: 87,
    relatedData: [
      { type: 'Humedad', value: '85%', trend: 'up', percentage: 12 },
      { type: 'Temperatura', value: '26°C' },
      { type: 'Duración', value: '48 horas' }
    ]
  },
  {
    id: 'alert-003',
    title: 'Predicción de escasez de fungicida',
    description: 'Basado en el ritmo actual de uso y las proyecciones de necesidad, el stock de Fungicida XYZ solo cubrirá aproximadamente 7 días más. Se recomienda reordenar inmediatamente.',
    severity: 'high',
    category: 'supply',
    location: 'Bodega de Insumos',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 día atrás
    status: 'active',
    aiConfidence: 95,
    relatedData: [
      { type: 'Stock actual', value: '5 litros' },
      { type: 'Consumo diario', value: '0.7 litros', trend: 'up', percentage: 15 },
      { type: 'Días restantes', value: 7 }
    ]
  },
  {
    id: 'alert-004',
    title: 'Patrón inusual de propagación de plagas',
    description: 'Se ha detectado un patrón atípico de propagación de áfidos en el Invernadero Principal. La distribución sugiere un posible punto de entrada en la esquina noreste.',
    severity: 'medium',
    category: 'pest',
    location: 'Invernadero Principal - Sección D',
    timestamp: Date.now() - 1000 * 60 * 60 * 30, // 30 horas atrás
    status: 'active',
    aiConfidence: 78,
    relatedData: [
      { type: 'Incremento semanal', value: '18%', trend: 'up', percentage: 18 },
      { type: 'Área afectada', value: '35%' }
    ]
  },
  {
    id: 'alert-005',
    title: 'Fumigadora requiere mantenimiento preventivo',
    description: 'Basado en el historial de uso y el calendario de mantenimiento, la fumigadora #3 está próxima a requerir mantenimiento preventivo. Se recomienda programar servicio en los próximos 5 días.',
    severity: 'low',
    category: 'maintenance',
    location: 'Bodega de Herramientas',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 días atrás
    status: 'resolved',
    aiConfidence: 89
  },
  {
    id: 'alert-006',
    title: 'Predicción de condiciones favorables para Escoba de Bruja',
    description: 'El modelo predictivo indica que las condiciones climáticas de los próximos 7 días serán altamente favorables para el desarrollo de Escoba de Bruja en el área de cacao.',
    severity: 'medium',
    category: 'prediction',
    location: 'Área de Cacao - General',
    timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 horas atrás
    status: 'active',
    aiConfidence: 83,
    relatedData: [
      { type: 'Probabilidad', value: '76%' },
      { type: 'Humedad proyectada', value: '82%', trend: 'up', percentage: 8 },
      { type: 'Temperatura proyectada', value: '27°C', trend: 'up', percentage: 5 }
    ]
  },
  {
    id: 'alert-007',
    title: 'Anomalía en patrón de crecimiento detectada',
    description: 'Se ha detectado un patrón anómalo de crecimiento en varios árboles de la Sección C. Los síntomas sugieren posible deficiencia nutricional o estrés hídrico.',
    severity: 'medium',
    category: 'prediction',
    location: 'Área de Cacao - Sección C',
    timestamp: Date.now() - 1000 * 60 * 60 * 36, // 36 horas atrás
    status: 'acknowledged',
    aiConfidence: 75,
    relatedData: [
      { type: 'Árboles afectados', value: 8 },
      { type: 'Reducción de crecimiento', value: '22%', trend: 'down', percentage: 22 }
    ]
  },
  {
    id: 'alert-008',
    title: 'Riesgo de inundación en zona baja',
    description: 'Las precipitaciones previstas para los próximos 3 días (>120mm) presentan un riesgo significativo de inundación en la zona baja del campo abierto.',
    severity: 'high',
    category: 'weather',
    location: 'Campo Abierto - Zona Sur',
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 horas atrás
    status: 'active',
    aiConfidence: 91,
    relatedData: [
      { type: 'Precipitación prevista', value: '120mm', trend: 'up', percentage: 200 },
      { type: 'Probabilidad de inundación', value: '65%' }
    ]
  }
];

const AIAlerts = () => {
  const { currentUser, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder a las alertas de IA",
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

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve' | 'dismiss') => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              status: action === 'acknowledge' 
                ? 'acknowledged' 
                : action === 'resolve' 
                  ? 'resolved' 
                  : 'dismissed' 
            } 
          : alert
      )
    );
    
    toast({
      title: action === 'acknowledge' 
        ? "Alerta reconocida" 
        : action === 'resolve' 
          ? "Alerta resuelta" 
          : "Alerta descartada",
      description: "El estado de la alerta ha sido actualizado",
    });
  };

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    // Filtro por pestaña activa
    if (activeTab !== "all" && alert.status !== activeTab) {
      return false;
    }
    
    // Filtro por término de búsqueda
    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !alert.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !alert.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro por severidad
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) {
      return false;
    }
    
    // Filtro por categoría
    if (filterCategory !== "all" && alert.category !== filterCategory) {
      return false;
    }
    
    // Filtro por estado
    if (filterStatus !== "all" && alert.status !== filterStatus) {
      return false;
    }
    
    return true;
  });

  // Obtener el color de severidad
  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return "bg-red-100 text-red-800 border-red-200";
      case 'high': return "bg-amber-100 text-amber-800 border-amber-200";
      case 'medium': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low': return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Obtener el icono de categoría
  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'pathogen': return <Bug className="h-4 w-4" />;
      case 'pest': return <Bug className="h-4 w-4" />;
      case 'weather': return <CloudRain className="h-4 w-4" />;
      case 'supply': return <Droplets className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'prediction': return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Obtener el nombre de la categoría
  const getCategoryName = (category: AlertCategory) => {
    switch (category) {
      case 'pathogen': return "Patógeno";
      case 'pest': return "Plaga";
      case 'weather': return "Clima";
      case 'supply': return "Insumo";
      case 'maintenance': return "Mantenimiento";
      case 'prediction': return "Predicción";
    }
  };

  // Formatear tiempo relativo
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `Hace ${interval} año${interval === 1 ? '' : 's'}`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `Hace ${interval} mes${interval === 1 ? '' : 'es'}`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `Hace ${interval} día${interval === 1 ? '' : 's'}`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `Hace ${interval} hora${interval === 1 ? '' : 's'}`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `Hace ${interval} minuto${interval === 1 ? '' : 's'}`;
    }
    
    return "Hace un momento";
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
                <BellRing className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                  Alertas de IA
                </h1>
                <p className="text-amber-100 text-xs md:text-sm mt-1 leading-tight">
                  Sistema inteligente de alertas y predicciones
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center space-x-2 bg-white/10 rounded-md px-3 py-1 border border-white/30">
                <Label htmlFor="notifications" className="text-white text-sm">Notificaciones</Label>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
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

        {/* Resumen de Alertas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-800">Alertas Críticas</p>
                  <p className="text-2xl font-bold text-red-900">
                    {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
                  </p>
                </div>
                <div className="p-2 bg-red-200 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-800">Alertas Altas</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {alerts.filter(a => a.severity === 'high' && a.status === 'active').length}
                  </p>
                </div>
                <div className="p-2 bg-amber-200 rounded-full">
                  <Bell className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-800">Alertas Resueltas</p>
                  <p className="text-2xl font-bold text-green-900">
                    {alerts.filter(a => a.status === 'resolved').length}
                  </p>
                </div>
                <div className="p-2 bg-green-200 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-800">Precisión IA</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.round(alerts.reduce((sum, alert) => sum + alert.aiConfidence, 0) / alerts.length)}%
                  </p>
                </div>
                <div className="p-2 bg-purple-200 rounded-full">
                  <Brain className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, descripción o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pathogen">Patógeno</SelectItem>
              <SelectItem value="pest">Plaga</SelectItem>
              <SelectItem value="weather">Clima</SelectItem>
              <SelectItem value="supply">Insumo</SelectItem>
              <SelectItem value="maintenance">Mantenimiento</SelectItem>
              <SelectItem value="prediction">Predicción</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="acknowledged">Reconocidas</SelectItem>
              <SelectItem value="resolved">Resueltas</SelectItem>
              <SelectItem value="dismissed">Descartadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs de Alertas */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">
              Todas ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Activas ({alerts.filter(a => a.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="acknowledged">
              Reconocidas ({alerts.filter(a => a.status === 'acknowledged').length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resueltas ({alerts.filter(a => a.status === 'resolved').length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-l-red-500' :
                    alert.severity === 'high' ? 'border-l-amber-500' :
                    alert.severity === 'medium' ? 'border-l-yellow-500' :
                    'border-l-blue-500'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                            
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity === 'critical' ? 'Crítica' :
                               alert.severity === 'high' ? 'Alta' :
                               alert.severity === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                            
                            <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                              {getCategoryIcon(alert.category)}
                              {getCategoryName(alert.category)}
                            </Badge>
                            
                            {alert.status === 'active' && (
                              <Badge className="bg-blue-500 text-white">Activa</Badge>
                            )}
                            {alert.status === 'acknowledged' && (
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Reconocida</Badge>
                            )}
                            {alert.status === 'resolved' && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resuelta</Badge>
                            )}
                            {alert.status === 'dismissed' && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Descartada</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{alert.location}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{getTimeAgo(alert.timestamp)}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Brain className="h-4 w-4 text-purple-500" />
                              <span>Confianza IA: <strong>{alert.aiConfidence}%</strong></span>
                            </div>
                          </div>
                          
                          {alert.relatedData && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {alert.relatedData.map((data, index) => (
                                <div key={index} className="bg-gray-50 p-2 rounded-md">
                                  <div className="text-xs text-gray-500">{data.type}</div>
                                  <div className="font-medium flex items-center gap-1">
                                    {data.value}
                                    {data.trend && (
                                      <span className={data.trend === 'up' ? 'text-red-500' : 'text-green-500'}>
                                        {data.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3 transform rotate-180" />}
                                      </span>
                                    )}
                                    {data.percentage && (
                                      <span className={`text-xs ${data.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                                        {data.trend === 'up' ? '+' : '-'}{data.percentage}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {alert.status === 'active' && (
                          <div className="flex md:flex-col gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Reconocer</span>
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAlertAction(alert.id, 'resolve')}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Resolver</span>
                            </Button>
                          </div>
                        )}
                        
                        {alert.status === 'acknowledged' && (
                          <div className="flex md:flex-col gap-2 justify-end">
                            <Button 
                              size="sm" 
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAlertAction(alert.id, 'resolve')}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Resolver</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 text-gray-600"
                              onClick={() => handleAlertAction(alert.id, 'dismiss')}
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Descartar</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <BellRing className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No hay alertas</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterSeverity !== "all" || filterCategory !== "all" || filterStatus !== "all"
                      ? "No se encontraron alertas con los filtros seleccionados"
                      : "No hay alertas activas en este momento"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Configuración de Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración de Alertas
            </CardTitle>
            <CardDescription>
              Personalice qué tipos de alertas desea recibir y cómo se notifican
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Categorías de Alertas</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-amber-500" />
                      <Label htmlFor="pathogen-alerts">Alertas de Patógenos</Label>
                    </div>
                    <Switch id="pathogen-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="weather-alerts">Alertas Climáticas</Label>
                    </div>
                    <Switch id="weather-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-purple-500" />
                      <Label htmlFor="supply-alerts">Alertas de Insumos</Label>
                    </div>
                    <Switch id="supply-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="maintenance-alerts">Alertas de Mantenimiento</Label>
                    </div>
                    <Switch id="maintenance-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <Label htmlFor="prediction-alerts">Alertas Predictivas</Label>
                    </div>
                    <Switch id="prediction-alerts" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Umbrales y Notificaciones</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-threshold">Umbral para Alertas Críticas</Label>
                    <Select defaultValue="80">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Umbral" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="75">75%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="85">85%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Notificaciones Push</Label>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-digest">Resumen Diario</Label>
                    <Switch id="daily-digest" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-learning">Aprendizaje Continuo de IA</Label>
                    <Switch id="ai-learning" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información sobre el Sistema de IA */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Brain className="h-5 w-5 text-purple-600" />
              Acerca del Sistema de Alertas de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-purple-800 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Detección Temprana
                </h3>
                <p className="text-sm text-purple-700">
                  El sistema analiza continuamente los datos de monitoreo para identificar patrones anómalos antes de que se conviertan en problemas graves.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-purple-800 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Predicciones Inteligentes
                </h3>
                <p className="text-sm text-purple-700">
                  Utilizando modelos predictivos, el sistema anticipa condiciones favorables para plagas y enfermedades con hasta 7 días de antelación.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-purple-800 flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Recomendaciones Personalizadas
                </h3>
                <p className="text-sm text-purple-700">
                  Cada alerta incluye recomendaciones específicas basadas en el contexto, historial y mejores prácticas agrícolas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIAlerts;