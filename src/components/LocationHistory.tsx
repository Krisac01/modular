import { useLocation } from "@/context/LocationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Clock, 
  Smartphone,
  Navigation,
  History
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function LocationHistory() {
  const { data } = useLocation();

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Hace un momento";
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Ubicaciones ({data.records.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.records.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {data.records.map((record, index) => (
                <Card key={record.id} className={cn(
                  "border-l-4",
                  index === 0 ? "border-l-green-500 bg-green-50" : "border-l-blue-500"
                )}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium">{record.locationName}</h3>
                          {index === 0 && (
                            <Badge variant="default" className="bg-green-500">
                              Actual
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(record.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: es })}</span>
                            <Badge variant="outline" className="text-xs">
                              {getTimeAgo(record.timestamp)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {record.rfidTag}
                            </span>
                          </div>

                          {record.coordinates && (
                            <div className="flex items-center gap-2">
                              <Navigation className="h-3 w-3" />
                              <span className="font-mono text-xs">
                                {formatCoordinates(record.coordinates.latitude, record.coordinates.longitude)}
                              </span>
                            </div>
                          )}

                          {record.deviceInfo && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-3 w-3" />
                              <span className="text-xs">
                                {record.deviceInfo.platform}
                              </span>
                            </div>
                          )}
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
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay registros de ubicación aún</p>
            <p className="text-sm">Escanee un tag RFID para comenzar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}