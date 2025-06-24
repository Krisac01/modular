import { useFacialRecognition } from "@/context/FacialRecognitionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Clock, 
  Smartphone,
  Navigation,
  History,
  CheckCircle,
  XCircle,
  Timer
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function FacialRecognitionHistory() {
  const { data } = useFacialRecognition();

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const formatDuration = (startTime: number, endTime: number) => {
    const duration = endTime - startTime;
    const minutes = Math.floor(duration / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getSessionDuration = (session: any) => {
    if (session.isActive) {
      return "En curso";
    }
    return formatDuration(session.recognitionTime, session.expirationTime);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "text-green-600";
    if (confidence >= 85) return "text-blue-600";
    if (confidence >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Reconocimientos ({data.sessions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.sessions.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {data.sessions.map((session, index) => (
                <Card key={session.id} className={cn(
                  "border-l-4",
                  session.isActive 
                    ? "border-l-green-500 bg-green-50" 
                    : "border-l-blue-500"
                )}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium">{session.userName}</h3>
                          <Badge 
                            variant={session.isActive ? "default" : "secondary"}
                            className={session.isActive ? "bg-green-500" : ""}
                          >
                            {session.isActive ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Activa
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Finalizada
                              </div>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>Inicio: {format(new Date(session.recognitionTime), "dd/MM/yyyy HH:mm:ss", { locale: es })}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Timer className="h-3 w-3" />
                            <span>Duración: {getSessionDuration(session)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-medium">Confianza:</span>
                            <span className={cn("font-bold", getConfidenceColor(session.confidence))}>
                              {session.confidence}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              ID: {session.userId}
                            </span>
                          </div>

                          {session.location && (
                            <div className="flex items-center gap-2">
                              <Navigation className="h-3 w-3" />
                              <span className="font-mono text-xs">
                                {formatCoordinates(session.location.latitude!, session.location.longitude!)}
                              </span>
                            </div>
                          )}

                          {session.deviceInfo && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-3 w-3" />
                              <span className="text-xs">
                                {session.deviceInfo.platform}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Session timeline */}
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>
                              Inicio: {format(new Date(session.recognitionTime), "HH:mm:ss")}
                            </span>
                            <span>
                              Expira: {format(new Date(session.expirationTime), "HH:mm:ss")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay registros de reconocimiento aún</p>
            <p className="text-sm">Realice un reconocimiento facial para comenzar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}