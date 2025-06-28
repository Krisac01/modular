import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Bug, 
  LayoutGrid, 
  Package, 
  Wrench, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Activity,
  TrendingUp,
  FileText,
  Camera,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Zap,
  Target,
  Shield,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Database,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Heart,
  Bookmark,
  Share,
  Bell,
  Mail,
  Phone,
  Globe,
  Home,
  Building,
  Car,
  Truck,
  Plane,
  Ship,
  Train,
  Bike,
  Gamepad2,
  Music,
  Video,
  Image,
  Headphones,
  Mic,
  Speaker,
  Radio,
  Tv,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  Camera as CameraIcon,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  Usb,
  Wifi,
  Bluetooth,
  Battery,
  Power,
  Plug,
  Lightbulb,
  Flame,
  Snowflake,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Umbrella,
  Rainbow,
  Sunrise,
  Sunset,
  Moon,
  Stars,
  Cloudy,
  CloudDrizzle,
  CloudHail,
  Tornado,
  Volcano,
  Mountain,
  Trees,
  Flower,
  Leaf,
  Seedling,
  Apple,
  Cherry,
  Grape,
  Lemon,
  Orange,
  Strawberry,
  Banana,
  Carrot,
  Corn,
  Wheat,
  Rice,
  Coffee,
  Tea,
  Wine,
  Beer,
  Milk,
  Egg,
  Fish,
  Beef,
  Chicken,
  Pork,
  Bread,
  Cake,
  Cookie,
  Pizza,
  Hamburger,
  Sandwich,
  Salad,
  Soup,
  IceCream,
  Candy,
  Chocolate
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  path?: string;
  isNew?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface UserActivity {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedDate: Date;
  dueDate?: Date;
  completedDate?: Date;
  priority: 'low' | 'medium' | 'high';
  assignedBy: string;
  location?: string;
  progress?: number;
}

const Logbook = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  // Opciones de actividades con scroll infinito
  const activityOptions: ActivityOption[] = [
    // Registro de Plagas y Patógenos
    {
      id: 'greenhouse-pests',
      title: 'Control de Plagas - Invernadero',
      icon: <LayoutGrid className="h-6 w-6" />,
      description: 'Registro y seguimiento de incidencia de plagas en invernadero',
      category: 'Plagas y Patógenos',
      path: '/data',
      priority: 'high'
    },
    {
      id: 'cacao-pathogens',
      title: 'Patógenos del Cacao',
      icon: <Bug className="h-6 w-6" />,
      description: 'Control y registro de patógenos en cultivos de cacao',
      category: 'Plagas y Patógenos',
      path: '/cacao-pathogens',
      priority: 'high'
    },
    {
      id: 'pest-monitoring',
      title: 'Monitoreo de Plagas',
      icon: <Target className="h-6 w-6" />,
      description: 'Seguimiento continuo de poblaciones de plagas',
      category: 'Plagas y Patógenos',
      priority: 'medium'
    },
    {
      id: 'disease-prevention',
      title: 'Prevención de Enfermedades',
      icon: <Shield className="h-6 w-6" />,
      description: 'Medidas preventivas contra enfermedades de cultivos',
      category: 'Plagas y Patógenos',
      priority: 'medium'
    },

    // Gestión de Insumos
    {
      id: 'supply-possession',
      title: 'Posesión de Insumos',
      icon: <Package className="h-6 w-6" />,
      description: 'Registro de insumos agrícolas asignados',
      category: 'Gestión de Insumos',
      path: '/supplies',
      priority: 'high'
    },
    {
      id: 'fertilizer-application',
      title: 'Aplicación de Fertilizantes',
      icon: <Droplets className="h-6 w-6" />,
      description: 'Registro de aplicación de fertilizantes y nutrientes',
      category: 'Gestión de Insumos',
      priority: 'medium'
    },
    {
      id: 'pesticide-application',
      title: 'Aplicación de Pesticidas',
      icon: <Zap className="h-6 w-6" />,
      description: 'Control y registro de aplicación de pesticidas',
      category: 'Gestión de Insumos',
      priority: 'high'
    },
    {
      id: 'inventory-management',
      title: 'Gestión de Inventario',
      icon: <Database className="h-6 w-6" />,
      description: 'Control de stock y inventario de insumos',
      category: 'Gestión de Insumos',
      priority: 'medium'
    },

    // Herramientas y Equipos
    {
      id: 'tool-possession',
      title: 'Posesión de Herramientas',
      icon: <Wrench className="h-6 w-6" />,
      description: 'Registro de herramientas agrícolas asignadas',
      category: 'Herramientas y Equipos',
      path: '/tools',
      priority: 'high'
    },
    {
      id: 'equipment-maintenance',
      title: 'Mantenimiento de Equipos',
      icon: <Settings className="h-6 w-6" />,
      description: 'Programación y registro de mantenimiento',
      category: 'Herramientas y Equipos',
      priority: 'medium'
    },
    {
      id: 'tool-calibration',
      title: 'Calibración de Herramientas',
      icon: <Target className="h-6 w-6" />,
      description: 'Calibración y verificación de herramientas de medición',
      category: 'Herramientas y Equipos',
      priority: 'low'
    },

    // Monitoreo Ambiental
    {
      id: 'weather-monitoring',
      title: 'Monitoreo Climático',
      icon: <Sun className="h-6 w-6" />,
      description: 'Registro de condiciones climáticas y meteorológicas',
      category: 'Monitoreo Ambiental',
      priority: 'medium'
    },
    {
      id: 'temperature-control',
      title: 'Control de Temperatura',
      icon: <Thermometer className="h-6 w-6" />,
      description: 'Monitoreo y control de temperatura en invernaderos',
      category: 'Monitoreo Ambiental',
      priority: 'high'
    },
    {
      id: 'humidity-monitoring',
      title: 'Monitoreo de Humedad',
      icon: <Droplets className="h-6 w-6" />,
      description: 'Control de niveles de humedad en cultivos',
      category: 'Monitoreo Ambiental',
      priority: 'medium'
    },
    {
      id: 'soil-analysis',
      title: 'Análisis de Suelo',
      icon: <Mountain className="h-6 w-6" />,
      description: 'Análisis químico y físico del suelo',
      category: 'Monitoreo Ambiental',
      priority: 'medium'
    },

    // Ubicación y Trazabilidad
    {
      id: 'location-update',
      title: 'Actualización de Ubicación',
      icon: <MapPin className="h-6 w-6" />,
      description: 'Registro de ubicación mediante RFID',
      category: 'Ubicación y Trazabilidad',
      path: '/location',
      priority: 'high'
    },
    {
      id: 'facial-recognition',
      title: 'Reconocimiento Facial',
      icon: <User className="h-6 w-6" />,
      description: 'Autenticación biométrica para trazabilidad',
      category: 'Ubicación y Trazabilidad',
      path: '/facial-recognition',
      isNew: true,
      priority: 'high'
    },
    {
      id: 'activity-tracking',
      title: 'Seguimiento de Actividades',
      icon: <Activity className="h-6 w-6" />,
      description: 'Trazabilidad completa de actividades por usuario',
      category: 'Ubicación y Trazabilidad',
      priority: 'medium'
    },

    // Análisis y Reportes
    {
      id: 'data-analysis',
      title: 'Análisis de Datos',
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'Análisis estadístico de datos de campo',
      category: 'Análisis y Reportes',
      priority: 'medium'
    },
    {
      id: 'trend-analysis',
      title: 'Análisis de Tendencias',
      icon: <TrendingUp className="h-6 w-6" />,
      description: 'Identificación de patrones y tendencias',
      category: 'Análisis y Reportes',
      priority: 'low'
    },
    {
      id: 'performance-reports',
      title: 'Reportes de Rendimiento',
      icon: <PieChart className="h-6 w-6" />,
      description: 'Informes de productividad y eficiencia',
      category: 'Análisis y Reportes',
      priority: 'medium'
    },
    {
      id: 'export-data',
      title: 'Exportación de Datos',
      icon: <Download className="h-6 w-6" />,
      description: 'Exportar datos en diferentes formatos',
      category: 'Análisis y Reportes',
      priority: 'low'
    },

    // Documentación
    {
      id: 'photo-documentation',
      title: 'Documentación Fotográfica',
      icon: <Camera className="h-6 w-6" />,
      description: 'Captura y gestión de evidencia fotográfica',
      category: 'Documentación',
      priority: 'medium'
    },
    {
      id: 'field-notes',
      title: 'Notas de Campo',
      icon: <FileText className="h-6 w-6" />,
      description: 'Registro de observaciones y notas detalladas',
      category: 'Documentación',
      priority: 'medium'
    },
    {
      id: 'compliance-docs',
      title: 'Documentos de Cumplimiento',
      icon: <Shield className="h-6 w-6" />,
      description: 'Documentación para cumplimiento normativo',
      category: 'Documentación',
      priority: 'high'
    }
  ];

  // Actividades asignadas al usuario (datos de ejemplo)
  const userActivities: UserActivity[] = [
    {
      id: '1',
      title: 'Inspección de Plagas - Invernadero A',
      description: 'Realizar inspección completa de plagas en el invernadero A, secciones 1-5',
      type: 'Control de Plagas',
      status: 'pending',
      assignedDate: new Date('2024-01-15'),
      dueDate: new Date('2024-01-17'),
      priority: 'high',
      assignedBy: 'María González',
      location: 'Invernadero A',
      progress: 0
    },
    {
      id: '2',
      title: 'Aplicación de Fungicida - Cacao Sección B',
      description: 'Aplicar tratamiento fungicida preventivo en la sección B del cultivo de cacao',
      type: 'Aplicación de Insumos',
      status: 'in_progress',
      assignedDate: new Date('2024-01-14'),
      dueDate: new Date('2024-01-16'),
      priority: 'high',
      assignedBy: 'Luis Martínez',
      location: 'Cacao - Sección B',
      progress: 65
    },
    {
      id: '3',
      title: 'Mantenimiento de Herramientas',
      description: 'Realizar mantenimiento preventivo de tijeras de podar y aspersores',
      type: 'Mantenimiento',
      status: 'completed',
      assignedDate: new Date('2024-01-12'),
      dueDate: new Date('2024-01-14'),
      completedDate: new Date('2024-01-13'),
      priority: 'medium',
      assignedBy: 'Carlos Rodríguez',
      location: 'Taller de Mantenimiento',
      progress: 100
    },
    {
      id: '4',
      title: 'Monitoreo de Temperatura',
      description: 'Registrar temperaturas cada 2 horas en invernaderos principales',
      type: 'Monitoreo Ambiental',
      status: 'overdue',
      assignedDate: new Date('2024-01-10'),
      dueDate: new Date('2024-01-15'),
      priority: 'medium',
      assignedBy: 'Ana López',
      location: 'Todos los Invernaderos',
      progress: 30
    },
    {
      id: '5',
      title: 'Documentación Fotográfica - Patógenos',
      description: 'Capturar evidencia fotográfica de síntomas de patógenos en cacao',
      type: 'Documentación',
      status: 'pending',
      assignedDate: new Date('2024-01-16'),
      dueDate: new Date('2024-01-18'),
      priority: 'medium',
      assignedBy: 'María González',
      location: 'Área de Cacao',
      progress: 0
    }
  ];

  const categories = ['all', ...Array.from(new Set(activityOptions.map(option => option.category)))];

  const filteredOptions = activityOptions.filter(option => {
    const matchesCategory = selectedCategory === 'all' || option.category === selectedCategory;
    const matchesSearch = option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         option.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-dark">
                Bitácora Electrónica
              </h1>
              <p className="text-gray-600 mt-1">
                Registro de actividades y gestión de tareas asignadas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {user?.name || 'Usuario'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(), "dd/MM/yyyy", { locale: es })}
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Activity Options with Infinite Scroll */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Opciones de Actividades
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar actividades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs h-7"
                      >
                        {category === 'all' ? 'Todas' : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="p-4 space-y-3">
                    {filteredOptions.map((option) => (
                      <Card 
                        key={option.id} 
                        className="p-3 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-green-500"
                      >
                        {option.path ? (
                          <Link to={option.path} className="block">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-green-50 rounded-lg text-green-600 flex-shrink-0">
                                {option.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-sm text-gray-900 truncate">
                                    {option.title}
                                  </h3>
                                  {option.isNew && (
                                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                                      Nuevo
                                    </Badge>
                                  )}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getPriorityColor(option.priority || 'low')}`}
                                  >
                                    {option.priority === 'high' ? 'Alta' : 
                                     option.priority === 'medium' ? 'Media' : 'Baja'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {option.description}
                                </p>
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {option.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 flex-shrink-0">
                              {option.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-sm text-gray-500 truncate">
                                  {option.title}
                                </h3>
                                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500">
                                  Próximamente
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400 line-clamp-2">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - User Activities */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Mis Actividades Asignadas
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      {userActivities.filter(a => a.status === 'overdue').length} Vencidas
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {userActivities.filter(a => a.status === 'pending').length} Pendientes
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {userActivities.filter(a => a.status === 'in_progress').length} En Progreso
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="p-4 space-y-4">
                    {userActivities.map((activity) => (
                      <Card 
                        key={activity.id} 
                        className={`p-4 border-l-4 ${
                          activity.status === 'overdue' ? 'border-l-red-500 bg-red-50' :
                          activity.status === 'completed' ? 'border-l-green-500 bg-green-50' :
                          activity.status === 'in_progress' ? 'border-l-blue-500 bg-blue-50' :
                          'border-l-yellow-500 bg-yellow-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {activity.title}
                              </h3>
                              <Badge 
                                className={`text-xs border ${getStatusColor(activity.status)}`}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(activity.status)}
                                  {activity.status === 'completed' ? 'Completada' :
                                   activity.status === 'in_progress' ? 'En Progreso' :
                                   activity.status === 'pending' ? 'Pendiente' :
                                   'Vencida'}
                                </div>
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(activity.priority)}`}
                              >
                                {activity.priority === 'high' ? 'Alta' : 
                                 activity.priority === 'medium' ? 'Media' : 'Baja'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {activity.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>Asignado por: {activity.assignedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Asignado: {format(activity.assignedDate, "dd/MM/yyyy", { locale: es })}</span>
                              </div>
                              {activity.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Vence: {format(activity.dueDate, "dd/MM/yyyy", { locale: es })}</span>
                                </div>
                              )}
                              {activity.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>Ubicación: {activity.location}</span>
                                </div>
                              )}
                            </div>
                            
                            {activity.status === 'in_progress' && activity.progress !== undefined && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Progreso</span>
                                  <span>{activity.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${activity.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            
                            {activity.completedDate && (
                              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Completada: {format(activity.completedDate, "dd/MM/yyyy HH:mm", { locale: es })}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            {activity.status !== 'completed' && (
                              <Button size="sm" variant="outline" className="text-xs">
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Logbook;