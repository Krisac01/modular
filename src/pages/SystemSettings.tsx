import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  User, 
  ChevronDown, 
  UserCircle, 
  LogOut, 
  Home,
  Database,
  Shield,
  Bell,
  Mail,
  Smartphone,
  Globe,
  Clock,
  Save,
  RefreshCw,
  HardDrive,
  Trash2,
  FileText,
  AlertTriangle
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SystemSettings = () => {
  const { currentUser, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // General settings
  const [systemName, setSystemName] = useState("Sistema de Gestión Agrícola");
  const [companyName, setCompanyName] = useState("Modular Agrosolutions");
  const [language, setLanguage] = useState("es");
  const [timezone, setTimezone] = useState("America/Bogota");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("24h");

  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordExpiration, setPasswordExpiration] = useState("90");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [facialRecognition, setFacialRecognition] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [activityAssignments, setActivityAssignments] = useState(true);

  // Backup settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupRetention, setBackupRetention] = useState("30");
  const [lastBackup, setLastBackup] = useState("2025-06-27 08:30:00");
  const [nextBackup, setNextBackup] = useState("2025-06-28 08:30:00");

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder a la configuración del sistema",
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

  const handleSaveSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Copia de seguridad iniciada",
      description: "La copia de seguridad se está realizando en segundo plano",
    });
  };

  const handleRestoreBackup = () => {
    toast({
      title: "Restauración iniciada",
      description: "El sistema se está restaurando desde la copia de seguridad seleccionada",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Acción no permitida",
      description: "Esta acción requiere confirmación adicional por seguridad",
      variant: "destructive",
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4">
            {/* Fila Superior - Título e Ícono */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
                <Settings className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                  Configuración del Sistema
                </h1>
                <p className="text-gray-300 text-xs md:text-sm mt-1 leading-tight">
                  Administración de parámetros y preferencias globales
                </p>
              </div>
            </div>
            
            {/* Fila Inferior - Controles */}
            <div className="flex items-center justify-end gap-2">
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
                      {currentUser?.name || 'Administrador'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.email || 'admin@ejemplo.com'}
                    </p>
                  </div>
                  
                  <DropdownMenuItem 
                    onClick={handleProfile}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <UserCircle className="h-4 w-4" />
                    Ver Perfil
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

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="backup">Respaldo</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">Nombre del Sistema</Label>
                      <Input 
                        id="systemName" 
                        value={systemName} 
                        onChange={(e) => setSystemName(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa</Label>
                      <Input 
                        id="companyName" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Seleccionar zona horaria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Bogota">América/Bogotá (UTC-5)</SelectItem>
                          <SelectItem value="America/Mexico_City">América/Ciudad de México (UTC-6)</SelectItem>
                          <SelectItem value="America/Santiago">América/Santiago (UTC-4)</SelectItem>
                          <SelectItem value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Formato de Fecha</Label>
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Seleccionar formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Formato de Hora</Label>
                      <Select value={timeFormat} onValueChange={setTimeFormat}>
                        <SelectTrigger id="timeFormat">
                          <SelectValue placeholder="Seleccionar formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 horas</SelectItem>
                          <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Tiempo de Inactividad (minutos)</Label>
                      <Input 
                        id="sessionTimeout" 
                        type="number" 
                        value={sessionTimeout} 
                        onChange={(e) => setSessionTimeout(e.target.value)} 
                      />
                      <p className="text-xs text-gray-500">Tiempo antes de cerrar sesión por inactividad</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiration">Expiración de Contraseña (días)</Label>
                      <Input 
                        id="passwordExpiration" 
                        type="number" 
                        value={passwordExpiration} 
                        onChange={(e) => setPasswordExpiration(e.target.value)} 
                      />
                      <p className="text-xs text-gray-500">Días antes de solicitar cambio de contraseña</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="twoFactorAuth" 
                        checked={twoFactorAuth} 
                        onCheckedChange={setTwoFactorAuth} 
                      />
                      <Label htmlFor="twoFactorAuth">Autenticación de dos factores</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="facialRecognition" 
                        checked={facialRecognition} 
                        onCheckedChange={setFacialRecognition} 
                      />
                      <Label htmlFor="facialRecognition">Reconocimiento facial</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="locationTracking" 
                        checked={locationTracking} 
                        onCheckedChange={setLocationTracking} 
                      />
                      <Label htmlFor="locationTracking">Seguimiento de ubicación</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="dataEncryption" 
                        checked={dataEncryption} 
                        onCheckedChange={setDataEncryption} 
                      />
                      <Label htmlFor="dataEncryption">Cifrado de datos sensibles</Label>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerar Claves de API
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Canales de Notificación</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="emailNotifications" 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                      <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Notificaciones por Email
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="smsNotifications" 
                        checked={smsNotifications} 
                        onCheckedChange={setSmsNotifications} 
                      />
                      <Label htmlFor="smsNotifications" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Notificaciones por SMS
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="pushNotifications" 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                      <Label htmlFor="pushNotifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notificaciones Push
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Tipos de Alertas</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="maintenanceAlerts" 
                        checked={maintenanceAlerts} 
                        onCheckedChange={setMaintenanceAlerts} 
                      />
                      <Label htmlFor="maintenanceAlerts">Alertas de mantenimiento</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="expirationAlerts" 
                        checked={expirationAlerts} 
                        onCheckedChange={setExpirationAlerts} 
                      />
                      <Label htmlFor="expirationAlerts">Alertas de vencimiento</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="activityAssignments" 
                        checked={activityAssignments} 
                        onCheckedChange={setActivityAssignments} 
                      />
                      <Label htmlFor="activityAssignments">Asignación de actividades</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="emailSettings">Configuración de Correo Electrónico</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Servidor SMTP" />
                    <Input placeholder="Puerto" />
                    <Input placeholder="Usuario" />
                    <Input type="password" placeholder="Contraseña" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup Settings */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Respaldo y Restauración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Configuración de Respaldo</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="autoBackup" 
                        checked={autoBackup} 
                        onCheckedChange={setAutoBackup} 
                      />
                      <Label htmlFor="autoBackup">Respaldo automático</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
                      <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                        <SelectTrigger id="backupFrequency">
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Cada hora</SelectItem>
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupRetention">Retención de Respaldos (días)</Label>
                      <Input 
                        id="backupRetention" 
                        type="number" 
                        value={backupRetention} 
                        onChange={(e) => setBackupRetention(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Estado de Respaldo</Label>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Último respaldo:</span>
                          <span className="font-medium">{lastBackup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Próximo respaldo:</span>
                          <span className="font-medium">{nextBackup}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Acciones</h3>
                    
                    <div className="space-y-2">
                      <Button onClick={handleBackupNow} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Realizar Respaldo Ahora
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="restoreBackup">Restaurar desde Respaldo</Label>
                      <Select>
                        <SelectTrigger id="restoreBackup">
                          <SelectValue placeholder="Seleccionar respaldo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="backup1">Respaldo 2025-06-27 08:30:00</SelectItem>
                          <SelectItem value="backup2">Respaldo 2025-06-26 08:30:00</SelectItem>
                          <SelectItem value="backup3">Respaldo 2025-06-25 08:30:00</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleRestoreBackup} variant="outline" className="w-full mt-2">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restaurar Sistema
                      </Button>
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <h3 className="font-medium text-sm text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Zona de Peligro
                      </h3>
                      <div className="space-y-2">
                        <Button onClick={handleClearData} variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Limpiar Datos del Sistema
                        </Button>
                        <p className="text-xs text-gray-500">
                          Esta acción eliminará todos los datos del sistema. No se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Logs Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Registros del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Select defaultValue="error">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Nivel de log" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Advertencia</SelectItem>
                        <SelectItem value="info">Información</SelectItem>
                        <SelectItem value="debug">Depuración</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Logs
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-gray-50 h-64 overflow-auto font-mono text-xs">
                    <div className="text-red-600">[ERROR] 2025-06-27 10:15:23 - Error de conexión a la base de datos</div>
                    <div className="text-yellow-600">[WARN] 2025-06-27 09:45:12 - Intento de acceso no autorizado desde 192.168.1.45</div>
                    <div className="text-blue-600">[INFO] 2025-06-27 09:30:05 - Usuario admin@ejemplo.com inició sesión</div>
                    <div className="text-blue-600">[INFO] 2025-06-27 09:15:22 - Respaldo automático completado</div>
                    <div className="text-gray-600">[DEBUG] 2025-06-27 09:00:01 - Iniciando proceso de sincronización</div>
                    <div className="text-blue-600">[INFO] 2025-06-27 08:45:18 - Sistema iniciado correctamente</div>
                    <div className="text-yellow-600">[WARN] 2025-06-26 18:22:45 - Espacio de almacenamiento bajo (15% disponible)</div>
                    <div className="text-blue-600">[INFO] 2025-06-26 17:30:12 - Usuario usuario@ejemplo.com cerró sesión</div>
                    <div className="text-blue-600">[INFO] 2025-06-26 15:45:33 - 5 nuevos registros de patógenos añadidos</div>
                    <div className="text-red-600">[ERROR] 2025-06-26 14:12:09 - Error al procesar imagen de patógeno</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SystemSettings;