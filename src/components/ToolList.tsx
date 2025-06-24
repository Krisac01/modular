import { useTool } from "@/context/ToolContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Calendar, 
  User, 
  MapPin,
  AlertTriangle,
  Wrench,
  Settings,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function ToolList() {
  const { data, deleteToolRecord } = useTool();

  const handleDelete = (recordId: string, toolName: string) => {
    if (confirm(`¿Está seguro de que desea eliminar el registro de "${toolName}"?`)) {
      deleteToolRecord(recordId);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Herramientas de corte": "bg-red-100 text-red-800",
      "Herramientas de excavación": "bg-brown-100 text-brown-800",
      "Herramientas de medición": "bg-blue-100 text-blue-800",
      "Equipos de fumigación": "bg-purple-100 text-purple-800",
      "Herramientas de poda": "bg-green-100 text-green-800",
      "Equipos de riego": "bg-cyan-100 text-cyan-800",
      "Herramientas manuales": "bg-gray-100 text-gray-800",
      "Equipos eléctricos": "bg-yellow-100 text-yellow-800",
      "Maquinaria agrícola": "bg-orange-100 text-orange-800",
      "Equipos de protección": "bg-pink-100 text-pink-800",
      "Otro": "bg-slate-100 text-slate-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      "Excelente": "bg-green-100 text-green-800",
      "Bueno": "bg-blue-100 text-blue-800",
      "Regular": "bg-yellow-100 text-yellow-800",
      "Necesita mantenimiento": "bg-orange-100 text-orange-800",
      "Fuera de servicio": "bg-red-100 text-red-800",
    };
    return colors[condition] || "bg-gray-100 text-gray-800";
  };

  const isMaintenanceDue = (nextMaintenanceDate?: string) => {
    if (!nextMaintenanceDate) return false;
    const maintenanceDate = new Date(nextMaintenanceDate);
    const today = new Date();
    const diffTime = maintenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isMaintenanceOverdue = (nextMaintenanceDate?: string) => {
    if (!nextMaintenanceDate) return false;
    const maintenanceDate = new Date(nextMaintenanceDate);
    const today = new Date();
    return maintenanceDate < today;
  };

  const isWarrantyExpiring = (warrantyExpiration?: string) => {
    if (!warrantyExpiration) return false;
    const expDate = new Date(warrantyExpiration);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Herramientas Asignadas ({data.records.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.records.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {data.records
                .sort((a, b) => b.assignedDate - a.assignedDate)
                .map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{record.name}</h3>
                            <Badge className={getCategoryColor(record.category)}>
                              {record.category}
                            </Badge>
                            <Badge className={getConditionColor(record.condition)}>
                              {record.condition}
                            </Badge>
                            {isMaintenanceOverdue(record.nextMaintenanceDate) && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Mantenimiento vencido
                              </Badge>
                            )}
                            {isMaintenanceDue(record.nextMaintenanceDate) && !isMaintenanceOverdue(record.nextMaintenanceDate) && (
                              <Badge variant="outline" className="border-orange-500 text-orange-700 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Mantenimiento próximo
                              </Badge>
                            )}
                            {isWarrantyExpiring(record.warrantyExpiration) && (
                              <Badge variant="outline" className="border-purple-500 text-purple-700">
                                Garantía por vencer
                              </Badge>
                            )}
                          </div>
                          
                          {record.description && (
                            <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {(record.brand || record.model) && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Marca/Modelo:</span> 
                                {record.brand} {record.model}
                              </div>
                            )}
                            
                            {record.serialNumber && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Serie:</span> {record.serialNumber}
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Asignado a:</span> {record.assignedTo}
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="font-medium">Por:</span> {record.assignedBy}
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Fecha:</span> {format(new Date(record.assignedDate), "dd/MM/yyyy", { locale: es })}
                            </div>

                            {record.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Ubicación:</span> {record.location}
                              </div>
                            )}
                          </div>

                          {record.maintenanceInstructions && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-1">
                                <Settings className="h-4 w-4" />
                                Instrucciones de Mantenimiento:
                              </h4>
                              <p className="text-sm text-blue-700">{record.maintenanceInstructions}</p>
                            </div>
                          )}

                          {record.safetyInstructions && (
                            <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                              <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                Instrucciones de Seguridad:
                              </h4>
                              <p className="text-sm text-yellow-700">{record.safetyInstructions}</p>
                            </div>
                          )}

                          {(record.lastMaintenanceDate || record.nextMaintenanceDate || record.purchaseDate || record.warrantyExpiration) && (
                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                              {record.lastMaintenanceDate && (
                                <div>Último mantenimiento: {format(new Date(record.lastMaintenanceDate), "dd/MM/yyyy", { locale: es })}</div>
                              )}
                              {record.nextMaintenanceDate && (
                                <div>Próximo mantenimiento: {format(new Date(record.nextMaintenanceDate), "dd/MM/yyyy", { locale: es })}</div>
                              )}
                              {record.purchaseDate && (
                                <div>Fecha de compra: {format(new Date(record.purchaseDate), "dd/MM/yyyy", { locale: es })}</div>
                              )}
                              {record.warrantyExpiration && (
                                <div>Garantía hasta: {format(new Date(record.warrantyExpiration), "dd/MM/yyyy", { locale: es })}</div>
                              )}
                            </div>
                          )}

                          {record.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <span className="font-medium">Observaciones:</span> {record.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex items-start gap-2 ml-4">
                          {record.image && (
                            <img
                              src={record.image}
                              alt={record.name}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDelete(record.id, record.name)}
                                className="text-red-600"
                              >
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay herramientas asignadas aún</p>
            <p className="text-sm">Comience asignando una nueva herramienta</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}