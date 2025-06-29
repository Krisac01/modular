import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
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
  Clock,
  Calendar,
  Smartphone,
  Globe,
  HardDrive,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SystemConfiguration = () => {
  const { currentUser, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  
  // System settings state
  const [settings, setSettings] = useState({
    general: {
      systemName: "Sistema de Gestión Agrícola",
      companyName: "Modular Agrosolutions",
      timezone: "America/Bogota",
      language: "es",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      maintenanceMode: false,
      debugMode: false
    },
    security: {
      sessionTimeout: "30",
      passwordExpiration: "90",
      passwordMinLength: "8",
      passwordComplexity: "medium",
      twoFactorAuth: false,
      facialRecognition: true,
      loginAttempts: "5",
      ipRestriction: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      maintenanceAlerts: true,
      expirationAlerts: true,
      systemAlerts: true,
      dailyReports: false,
      weeklyReports: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      backupTime: "02:00",
      retentionDays: "30",
      backupLocation: "local",
      includeImages: true,
      compressionLevel: "medium",
      encryptBackups: true
    }
  });

  // System stats
  const [systemStats, setSystemStats] = useState({
    uptime: "23 days, 4 hours",
    lastBackup: "2025-06-27 02:00:00",
    databaseSize: "156.4 MB",
    totalUsers: 24,
    activeUsers: 18,
    totalRecords: 12458,
    storageUsed: "1.2 GB",
    storageTotal: "10 GB",
    version: "1.5.2",
    lastUpdate: "2025-06-15"
  });

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para acceder a la configuración del sistema",
        variant: "destructive",
      });
      navigate("/menu");
    }
    
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem("system-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
  }, [isAdmin, navigate]);

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
    // Save settings to localStorage
    localStorage.setItem("system-settings", JSON.stringify(settings));
    
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido aplicados correctamente",
    });
  };

  const handleResetSettings = () => {
    // Reset to default settings
    setSettings({
      general: {
        systemName: "Sistema de Gestión Agrícola",
        companyName: "Modular Agrosolutions",
        timezone: "America/Bogota",
        language: "es",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        maintenanceMode: false,
        debugMode: false
      },
      security: {
        sessionTimeout: "30",
        passwordExpiration: "90",
        passwordMinLength: "8",
        passwordComplexity: "medium",
        twoFactorAuth: false,
        facialRecognition: true,
        loginAttempts: "5",
        ipRestriction: false
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        maintenanceAlerts: true,
        expirationAlerts: true,
        systemAlerts: true,
        dailyReports: false,
        weeklyReports: true
      },
      backup: {
        autoBackup: true,
        backupFrequency: "daily",
        backupTime: "02:00",
        retentionDays: "30",
        backupLocation: "local",
        includeImages: true,
        compressionLevel: "medium",
        encryptBackups: true
      }
    });
    
    toast({
      title: "Configuración restablecida",
      description: "Se han restaurado los valores predeterminados",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Copia de seguridad iniciada",
      description: "La copia de seguridad se está realizando en segundo plano",
    });
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: "Copia de seguridad completada",
        description: "Los datos han sido respaldados correctamente",
      });
      
      // Update last backup time
      setSystemStats({
        ...systemStats,
        lastBackup: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }, 3000);
  };

  const handleClearCache = () => {
    toast({
      title: "Limpieza de caché iniciada",
      description: "Se está limpiando la caché del sistema",
    });
    
    // Simulate cache clearing
    setTimeout(() => {
      toast({
        title: "Caché limpiada",
        description: "La caché del sistema ha sido limpiada correctamente",
      });
    }, 2000);
  };

  const handleUpdateSetting = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
                <Settings className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                  Configuración del Sistema
                </h1>
                <p className="text-blue-100 text-xs md:text-sm mt-1 leading-tight">
                  Administración de parámetros y ajustes globales
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <Button 
                onClick={handleSaveSettings}
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
                size="sm"
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Guardar Cambios</span>
                <span className="xs:hidden">Guardar</span>
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

        {/* System Status Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Estado del Sistema
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Tiempo activo:</span>
                    <span className="font-medium">{systemStats.uptime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Último respaldo:</span>
                    <span className="font-medium">{systemStats.lastBackup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Tamaño de BD:</span>
                    <span className="font-medium">{systemStats.databaseSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Almacenamiento:</span>
                    <span className="font-medium">{systemStats.storageUsed} / {systemStats.storageTotal}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={handleBackupNow}
                >
                  <Download className="h-4 w-4" />
                  Respaldar Ahora
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={handleClearCache}
                >
                  <RefreshCw className="h-4 w-4" />
                  Limpiar Caché
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Purgar Datos
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará permanentemente los datos históricos más antiguos para liberar espacio. Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          toast({
                            title: "Purga de datos iniciada",
                            description: "Los datos históricos están siendo eliminados",
                          });
                        }}
                      >
                        Confirmar Purga
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="backup">Respaldos</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">Nombre del Sistema</Label>
                    <Input 
                      id="systemName" 
                      value={settings.general.systemName}
                      onChange={(e) => handleUpdateSetting('general', 'systemName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la Empresa</Label>
                    <Input 
                      id="companyName" 
                      value={settings.general.companyName}
                      onChange={(e) => handleUpdateSetting('general', 'companyName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select 
                      value={settings.general.timezone}
                      onValueChange={(value) => handleUpdateSetting('general', 'timezone', value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Seleccionar zona horaria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Bogota">América/Bogotá (UTC-5)</SelectItem>
                        <SelectItem value="America/Mexico_City">América/Ciudad de México (UTC-6)</SelectItem>
                        <SelectItem value="America/Lima">América/Lima (UTC-5)</SelectItem>
                        <SelectItem value="America/Santiago">América/Santiago (UTC-4)</SelectItem>
                        <SelectItem value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select 
                      value={settings.general.language}
                      onValueChange={(value) => handleUpdateSetting('general', 'language', value)}
                    >
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Formato de Fecha</Label>
                    <Select 
                      value={settings.general.dateFormat}
                      onValueChange={(value) => handleUpdateSetting('general', 'dateFormat', value)}
                    >
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
                    <Select 
                      value={settings.general.timeFormat}
                      onValueChange={(value) => handleUpdateSetting('general', 'timeFormat', value)}
                    >
                      <SelectTrigger id="timeFormat">
                        <SelectValue placeholder="Seleccionar formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 horas (14:30)</SelectItem>
                        <SelectItem value="12h">12 horas (2:30 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Opciones Avanzadas</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Modo Mantenimiento</Label>
                      <p className="text-sm text-muted-foreground">
                        Activa el modo de mantenimiento para impedir el acceso a usuarios no administradores
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(value) => handleUpdateSetting('general', 'maintenanceMode', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debugMode">Modo Debug</Label>
                      <p className="text-sm text-muted-foreground">
                        Activa el registro detallado para solución de problemas
                      </p>
                    </div>
                    <Switch
                      id="debugMode"
                      checked={settings.general.debugMode}
                      onCheckedChange={(value) => handleUpdateSetting('general', 'debugMode', value)}
                    />
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number"
                      min="5"
                      max="240"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleUpdateSetting('security', 'sessionTimeout', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiration">Expiración de Contraseña (días)</Label>
                    <Input 
                      id="passwordExpiration" 
                      type="number"
                      min="0"
                      max="365"
                      value={settings.security.passwordExpiration}
                      onChange={(e) => handleUpdateSetting('security', 'passwordExpiration', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">0 = nunca expira</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Longitud Mínima de Contraseña</Label>
                    <Input 
                      id="passwordMinLength" 
                      type="number"
                      min="6"
                      max="16"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleUpdateSetting('security', 'passwordMinLength', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordComplexity">Complejidad de Contraseña</Label>
                    <Select 
                      value={settings.security.passwordComplexity}
                      onValueChange={(value) => handleUpdateSetting('security', 'passwordComplexity', value)}
                    >
                      <SelectTrigger id="passwordComplexity">
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja (solo letras y números)</SelectItem>
                        <SelectItem value="medium">Media (mayúsculas, minúsculas y números)</SelectItem>
                        <SelectItem value="high">Alta (mayúsculas, minúsculas, números y símbolos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Intentos de Inicio de Sesión</Label>
                    <Input 
                      id="loginAttempts" 
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.loginAttempts}
                      onChange={(e) => handleUpdateSetting('security', 'loginAttempts', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Intentos antes de bloqueo</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Autenticación</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Autenticación de Dos Factores</Label>
                      <p className="text-sm text-muted-foreground">
                        Requiere un código de verificación adicional al iniciar sesión
                      </p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(value) => handleUpdateSetting('security', 'twoFactorAuth', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="facialRecognition">Reconocimiento Facial</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite la autenticación mediante reconocimiento facial
                      </p>
                    </div>
                    <Switch
                      id="facialRecognition"
                      checked={settings.security.facialRecognition}
                      onCheckedChange={(value) => handleUpdateSetting('security', 'facialRecognition', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ipRestriction">Restricción por IP</Label>
                      <p className="text-sm text-muted-foreground">
                        Limita el acceso a rangos de IP específicos
                      </p>
                    </div>
                    <Switch
                      id="ipRestriction"
                      checked={settings.security.ipRestriction}
                      onCheckedChange={(value) => handleUpdateSetting('security', 'ipRestriction', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Canales de Notificación</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificaciones por correo electrónico
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'emailNotifications', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Notificaciones Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificaciones push a dispositivos móviles
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'pushNotifications', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">Notificaciones SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificaciones por mensaje de texto
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'smsNotifications', value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Tipos de Alertas</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceAlerts">Alertas de Mantenimiento</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre mantenimientos programados de herramientas
                      </p>
                    </div>
                    <Switch
                      id="maintenanceAlerts"
                      checked={settings.notifications.maintenanceAlerts}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'maintenanceAlerts', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="expirationAlerts">Alertas de Vencimiento</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre insumos próximos a vencer
                      </p>
                    </div>
                    <Switch
                      id="expirationAlerts"
                      checked={settings.notifications.expirationAlerts}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'expirationAlerts', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemAlerts">Alertas del Sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre eventos importantes del sistema
                      </p>
                    </div>
                    <Switch
                      id="systemAlerts"
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'systemAlerts', value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Informes Programados</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dailyReports">Informes Diarios</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar resumen diario de actividades
                      </p>
                    </div>
                    <Switch
                      id="dailyReports"
                      checked={settings.notifications.dailyReports}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'dailyReports', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyReports">Informes Semanales</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar resumen semanal de actividades
                      </p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={settings.notifications.weeklyReports}
                      onCheckedChange={(value) => handleUpdateSetting('notifications', 'weeklyReports', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup Settings */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configuración de Respaldos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Respaldo Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Realizar copias de seguridad automáticas
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.backup.autoBackup}
                    onCheckedChange={(value) => handleUpdateSetting('backup', 'autoBackup', value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
                    <Select 
                      value={settings.backup.backupFrequency}
                      onValueChange={(value) => handleUpdateSetting('backup', 'backupFrequency', value)}
                    >
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
                    <Label htmlFor="backupTime">Hora de Respaldo</Label>
                    <Input 
                      id="backupTime" 
                      type="time"
                      value={settings.backup.backupTime}
                      onChange={(e) => handleUpdateSetting('backup', 'backupTime', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="retentionDays">Días de Retención</Label>
                    <Input 
                      id="retentionDays" 
                      type="number"
                      min="1"
                      max="365"
                      value={settings.backup.retentionDays}
                      onChange={(e) => handleUpdateSetting('backup', 'retentionDays', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Días que se conservarán los respaldos</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupLocation">Ubicación de Respaldo</Label>
                    <Select 
                      value={settings.backup.backupLocation}
                      onValueChange={(value) => handleUpdateSetting('backup', 'backupLocation', value)}
                    >
                      <SelectTrigger id="backupLocation">
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Almacenamiento Local</SelectItem>
                        <SelectItem value="cloud">Nube (S3)</SelectItem>
                        <SelectItem value="both">Local y Nube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Opciones Avanzadas</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeImages">Incluir Imágenes</Label>
                      <p className="text-sm text-muted-foreground">
                        Incluir imágenes y archivos adjuntos en los respaldos
                      </p>
                    </div>
                    <Switch
                      id="includeImages"
                      checked={settings.backup.includeImages}
                      onCheckedChange={(value) => handleUpdateSetting('backup', 'includeImages', value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="compressionLevel">Nivel de Compresión</Label>
                    <Select 
                      value={settings.backup.compressionLevel}
                      onValueChange={(value) => handleUpdateSetting('backup', 'compressionLevel', value)}
                    >
                      <SelectTrigger id="compressionLevel">
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin compresión</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="encryptBackups">Cifrar Respaldos</Label>
                      <p className="text-sm text-muted-foreground">
                        Aplicar cifrado a los archivos de respaldo
                      </p>
                    </div>
                    <Switch
                      id="encryptBackups"
                      checked={settings.backup.encryptBackups}
                      onCheckedChange={(value) => handleUpdateSetting('backup', 'encryptBackups', value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleBackupNow}
                  >
                    <Download className="h-4 w-4" />
                    Respaldar Ahora
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      toast({
                        title: "Restauración iniciada",
                        description: "Seleccione un archivo de respaldo para restaurar",
                      });
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    Restaurar Respaldo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleResetSettings}
          >
            <RefreshCw className="h-4 w-4" />
            Restablecer Valores Predeterminados
          </Button>
          
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleSaveSettings}
          >
            <Settings className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
        
        {/* System Information */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Versión</p>
                <p className="font-medium">{systemStats.version}</p>
              </div>
              <div>
                <p className="text-gray-500">Última Actualización</p>
                <p className="font-medium">{systemStats.lastUpdate}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Usuarios</p>
                <p className="font-medium">{systemStats.totalUsers}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Registros</p>
                <p className="font-medium">{systemStats.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemConfiguration;