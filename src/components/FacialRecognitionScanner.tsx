import { useState, useRef, useEffect } from "react";
import { useFacialRecognition } from "@/context/FacialRecognitionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Camera, 
  User, 
  Clock, 
  Shield, 
  Play, 
  Square,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Power,
  Settings
} from "lucide-react";
import { REGISTERED_USERS } from "@/types/facialRecognition";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

export function FacialRecognitionScanner() {
  const { 
    currentSession, 
    isSessionActive, 
    timeRemaining, 
    startFacialRecognition, 
    simulateFacialRecognition, 
    endSession,
    extendSession 
  } = useFacialRecognition();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanAnimation, setScanAnimation] = useState(false);
  const [isSystemEnabled, setIsSystemEnabled] = useState(true);
  const [autoRecognition, setAutoRecognition] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isScanning && isSystemEnabled) {
      setScanAnimation(true);
      const interval = setInterval(() => {
        setScanAnimation(prev => !prev);
      }, 1500);
      
      return () => clearInterval(interval);
    } else {
      setScanAnimation(false);
    }
  }, [isScanning, isSystemEnabled]);

  // Auto-recognition simulation
  useEffect(() => {
    let autoInterval: NodeJS.Timeout;
    
    if (autoRecognition && isScanning && isSystemEnabled && !isSessionActive) {
      autoInterval = setInterval(() => {
        // Simulate random user recognition
        const randomUser = REGISTERED_USERS[Math.floor(Math.random() * REGISTERED_USERS.length)];
        const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%
        
        if (confidence >= confidenceThreshold) {
          simulateFacialRecognition(randomUser.id, confidence);
          setIsScanning(false);
          toast.success(`Reconocimiento automático: ${randomUser.name}`);
        }
      }, 5000); // Try every 5 seconds
    }
    
    return () => {
      if (autoInterval) clearInterval(autoInterval);
    };
  }, [autoRecognition, isScanning, isSystemEnabled, isSessionActive, confidenceThreshold, simulateFacialRecognition]);

  const handleSystemToggle = (enabled: boolean) => {
    setIsSystemEnabled(enabled);
    if (!enabled) {
      setIsScanning(false);
      setAutoRecognition(false);
      stopCamera();
      if (isSessionActive) {
        endSession();
      }
      toast.info(enabled ? "Sistema de reconocimiento facial activado" : "Sistema de reconocimiento facial desactivado");
    } else {
      toast.success("Sistema de reconocimiento facial activado");
    }
  };

  const startCamera = async () => {
    if (!isSystemEnabled) {
      toast.error("El sistema de reconocimiento facial está desactivado");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsScanning(true);
      startFacialRecognition();
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsScanning(true);
      startFacialRecognition();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setAutoRecognition(false);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!timeRemaining) return 0;
    const totalDuration = 10 * 60 * 1000; // 10 minutos en ms
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  return (
    <div className="space-y-6">
      {/* System Control Panel */}
      <Card className={cn(
        "border-2 transition-all duration-300",
        isSystemEnabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className={cn("h-5 w-5", isSystemEnabled ? "text-green-600" : "text-gray-400")} />
            Control del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main System Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                isSystemEnabled ? "bg-green-100" : "bg-gray-100"
              )}>
                <Shield className={cn("h-5 w-5", isSystemEnabled ? "text-green-600" : "text-gray-400")} />
              </div>
              <div>
                <Label htmlFor="system-toggle" className="text-base font-medium">
                  Sistema de Reconocimiento Facial
                </Label>
                <p className="text-sm text-gray-500">
                  {isSystemEnabled ? "Sistema activo y listo para usar" : "Sistema desactivado por seguridad"}
                </p>
              </div>
            </div>
            <Switch
              id="system-toggle"
              checked={isSystemEnabled}
              onCheckedChange={handleSystemToggle}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          {/* Advanced Settings */}
          {isSystemEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <Label htmlFor="auto-recognition" className="text-sm font-medium">
                    Reconocimiento Automático
                  </Label>
                  <p className="text-xs text-gray-500">
                    Detectar usuarios automáticamente
                  </p>
                </div>
                <Switch
                  id="auto-recognition"
                  checked={autoRecognition}
                  onCheckedChange={setAutoRecognition}
                  disabled={!isSystemEnabled || isSessionActive}
                />
              </div>

              <div className="p-3 bg-white rounded-lg border">
                <Label className="text-sm font-medium">
                  Umbral de Confianza: {confidenceThreshold}%
                </Label>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={!isSystemEnabled}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>70%</span>
                  <span>99%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Session Display */}
      {isSessionActive && currentSession && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Sesión Activa</h3>
                  <p className="text-sm text-green-600">{currentSession.userName}</p>
                  <p className="text-xs text-green-500">
                    Reconocido: {new Date(currentSession.recognitionTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-800">
                  {formatTimeRemaining(timeRemaining)}
                </div>
                <Progress 
                  value={getProgressPercentage()} 
                  className="w-24 mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                onClick={extendSession}
                className="bg-green-600 hover:bg-green-700"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Extender 10 min
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={endSession}
              >
                Finalizar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facial Recognition Scanner */}
      <Card className={cn(
        "transition-all duration-300",
        !isSystemEnabled && "opacity-50"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Reconocimiento Facial
            {!isSystemEnabled && (
              <Badge variant="secondary" className="ml-2">
                Desactivado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanner Status */}
          <div className="text-center">
            <div className={cn(
              "mx-auto w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative overflow-hidden",
              isScanning && isSystemEnabled
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 bg-gray-50"
            )}>
              {/* Scanning animation overlay */}
              {isScanning && isSystemEnabled && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-b from-transparent via-blue-200 to-transparent transition-transform duration-1500",
                  scanAnimation ? "translate-y-full" : "-translate-y-full"
                )} />
              )}
              
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                isScanning && isSystemEnabled
                  ? "bg-blue-500" 
                  : "bg-gray-300"
              )}>
                <Camera className={cn(
                  "h-10 w-10 transition-colors duration-300",
                  isScanning && isSystemEnabled ? "text-white" : "text-gray-500"
                )} />
              </div>
            </div>
            
            <div className="mt-4">
              <Badge 
                variant={isScanning && isSystemEnabled ? "default" : "secondary"}
                className={cn(
                  "text-sm px-3 py-1",
                  isScanning && isSystemEnabled && "bg-blue-500"
                )}
              >
                {!isSystemEnabled 
                  ? "Sistema desactivado" 
                  : isScanning 
                    ? autoRecognition 
                      ? "Reconocimiento automático..." 
                      : "Escaneando rostro..."
                    : "Inactivo"
                }
              </Badge>
            </div>
          </div>

          {/* Camera View */}
          {isScanning && isSystemEnabled && (
            <div className="flex justify-center">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-64 h-48 rounded-lg border-2 border-blue-300"
                />
                {/* Face detection overlay */}
                <div className="absolute inset-4 border-2 border-green-400 rounded-lg opacity-70">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isScanning ? (
              <Button 
                onClick={startCamera}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                disabled={!isSystemEnabled || isSessionActive}
              >
                <Play className="h-4 w-4" />
                Iniciar Reconocimiento
              </Button>
            ) : (
              <Button 
                onClick={stopCamera}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!isSystemEnabled}
              >
                <Square className="h-4 w-4" />
                Detener Escaneo
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className={cn(
            "p-4 rounded-lg transition-all duration-300",
            isSystemEnabled ? "bg-blue-50" : "bg-gray-50"
          )}>
            <div className="flex items-start gap-3">
              <Shield className={cn(
                "h-5 w-5 mt-0.5",
                isSystemEnabled ? "text-blue-600" : "text-gray-400"
              )} />
              <div>
                <h4 className={cn(
                  "font-medium mb-2",
                  isSystemEnabled ? "text-blue-800" : "text-gray-600"
                )}>
                  {isSystemEnabled ? "Instrucciones de uso:" : "Sistema desactivado"}
                </h4>
                {isSystemEnabled ? (
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Active el sistema con el switch superior</li>
                    <li>2. Configure el reconocimiento automático si lo desea</li>
                    <li>3. Ajuste el umbral de confianza según sus necesidades</li>
                    <li>4. Presione "Iniciar Reconocimiento" para activar la cámara</li>
                    <li>5. Posiciónese frente a la cámara con buena iluminación</li>
                    <li>6. Su sesión estará activa por 10 minutos automáticamente</li>
                  </ol>
                ) : (
                  <p className="text-sm text-gray-500">
                    Active el sistema de reconocimiento facial para comenzar a usar esta funcionalidad.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Demo/Test Section */}
          {isScanning && isSystemEnabled && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Modo Demostración
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REGISTERED_USERS.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%
                      if (confidence >= confidenceThreshold) {
                        simulateFacialRecognition(user.id, confidence);
                        stopCamera();
                      } else {
                        toast.error(`Confianza insuficiente (${confidence}%) - Umbral: ${confidenceThreshold}%`);
                      }
                    }}
                    className="text-left p-3 h-auto flex flex-col items-start gap-1"
                    disabled={!isSystemEnabled}
                  >
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.role}</span>
                    <span className="text-xs text-gray-400">{user.department}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Presione cualquier usuario para simular su reconocimiento facial
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Duración de Sesión:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Tiempo activo: 10 minutos</li>
                <li>• Extensión disponible: +10 minutos</li>
                <li>• Finalización automática al expirar</li>
                <li>• Finalización manual disponible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Funcionalidades Habilitadas:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Registro de posesión de insumos</li>
                <li>• Registro de posesión de herramientas</li>
                <li>• Trazabilidad de usuario autenticado</li>
                <li>• Geolocalización de actividades</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}