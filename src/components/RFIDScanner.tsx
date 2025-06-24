import { useState, useEffect } from "react";
import { useLocation } from "@/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Radio, 
  MapPin, 
  Smartphone, 
  Wifi, 
  Play, 
  Square,
  Zap
} from "lucide-react";
import { PREDEFINED_LOCATIONS } from "@/types/location";
import { cn } from "@/lib/utils";

export function RFIDScanner() {
  const { isScanning, startRFIDScan, stopRFIDScan, simulateRFIDScan, currentLocation } = useLocation();
  const [scanAnimation, setScanAnimation] = useState(false);

  useEffect(() => {
    if (isScanning) {
      setScanAnimation(true);
      const interval = setInterval(() => {
        setScanAnimation(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setScanAnimation(false);
    }
  }, [isScanning]);

  return (
    <div className="space-y-6">
      {/* Current Location Display */}
      {currentLocation && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Ubicación Actual</h3>
                <p className="text-sm text-green-600">{currentLocation.locationName}</p>
                <p className="text-xs text-green-500">
                  Actualizado: {new Date(currentLocation.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFID Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Escáner RFID
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanner Status */}
          <div className="text-center">
            <div className={cn(
              "mx-auto w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500",
              isScanning 
                ? "border-blue-500 bg-blue-50 animate-pulse" 
                : "border-gray-300 bg-gray-50"
            )}>
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                isScanning 
                  ? scanAnimation 
                    ? "bg-blue-500 scale-110" 
                    : "bg-blue-400 scale-100"
                  : "bg-gray-300"
              )}>
                <Wifi className={cn(
                  "h-8 w-8 transition-colors duration-300",
                  isScanning ? "text-white" : "text-gray-500"
                )} />
              </div>
            </div>
            
            <div className="mt-4">
              <Badge 
                variant={isScanning ? "default" : "secondary"}
                className={cn(
                  "text-sm px-3 py-1",
                  isScanning && "bg-blue-500"
                )}
              >
                {isScanning ? "Escaneando..." : "Inactivo"}
              </Badge>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isScanning ? (
              <Button 
                onClick={startRFIDScan}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4" />
                Iniciar Escaneo
              </Button>
            ) : (
              <Button 
                onClick={stopRFIDScan}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Detener Escaneo
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Instrucciones de uso:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Presione "Iniciar Escaneo" para activar el lector RFID</li>
                  <li>2. Acerque el dispositivo al tag RFID (distancia máxima: 5cm)</li>
                  <li>3. Espere la confirmación de lectura exitosa</li>
                  <li>4. Su ubicación se actualizará automáticamente</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Demo/Test Section */}
          {isScanning && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Modo Demostración
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(PREDEFINED_LOCATIONS).slice(0, 6).map(([rfidTag, locationName]) => (
                  <Button
                    key={rfidTag}
                    variant="outline"
                    size="sm"
                    onClick={() => simulateRFIDScan(rfidTag)}
                    className="text-xs p-2 h-auto flex flex-col items-center gap-1"
                  >
                    <span className="font-mono text-xs text-gray-500">{rfidTag}</span>
                    <span className="text-center">{locationName}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Presione cualquier botón para simular la lectura de ese tag RFID
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Compatibilidad RFID/NFC:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Frecuencia: 13.56 MHz (NFC)</li>
                <li>• Protocolo: ISO 14443 Type A/B</li>
                <li>• Distancia de lectura: 0-5 cm</li>
                <li>• Tiempo de respuesta: &lt;100ms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Funcionalidades:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Lectura automática de tags</li>
                <li>• Geolocalización GPS integrada</li>
                <li>• Historial de ubicaciones</li>
                <li>• Exportación de datos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}