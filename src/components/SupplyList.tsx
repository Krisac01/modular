import { useSupply } from "@/context/SupplyContext";
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
  Target, 
  Beaker,
  AlertTriangle,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function SupplyList() {
  const { data, deleteSupplyRecord } = useSupply();

  const handleDelete = (recordId: string, supplyName: string) => {
    if (confirm(`¿Está seguro de que desea eliminar el registro de "${supplyName}"?`)) {
      deleteSupplyRecord(recordId);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Insecticida": "bg-red-100 text-red-800",
      "Fungicida": "bg-blue-100 text-blue-800",
      "Herbicida": "bg-orange-100 text-orange-800",
      "Fertilizante": "bg-green-100 text-green-800",
      "Bioestimulante": "bg-purple-100 text-purple-800",
      "Adherente": "bg-yellow-100 text-yellow-800",
      "Regulador de crecimiento": "bg-pink-100 text-pink-800",
      "Otro": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    return expDate < today;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Insumos Asignados ({data.records.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.records.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {data.records
                .sort((a, b) => b.assignedDate - a.assignedDate)
                .map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-green-medium">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{record.name}</h3>
                            <Badge className={getCategoryColor(record.category)}>
                              {record.category}
                            </Badge>
                            {isExpired(record.expirationDate) && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Vencido
                              </Badge>
                            )}
                            {isExpiringSoon(record.expirationDate) && !isExpired(record.expirationDate) && (
                              <Badge variant="outline" className="border-orange-500 text-orange-700 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Por vencer
                              </Badge>
                            )}
                          </div>
                          
                          {record.description && (
                            <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {record.activeIngredient && (
                              <div className="flex items-center gap-1">
                                <Beaker className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">I.A.:</span> {record.activeIngredient}
                                {record.concentration && ` (${record.concentration})`}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Dosis:</span> {record.assignedDose}
                            </div>

                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Técnico:</span> {record.assignedBy}
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Asignado:</span> {format(new Date(record.assignedDate), "dd/MM/yyyy", { locale: es })}
                            </div>

                            {record.targetPest && (
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Objetivo:</span> {record.targetPest}
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <span className="font-medium">Aplicación:</span> {record.applicationMethod}
                            </div>
                          </div>

                          {record.instructions && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-800 mb-1">Instrucciones de Uso:</h4>
                              <p className="text-sm text-blue-700">{record.instructions}</p>
                            </div>
                          )}

                          {record.safetyNotes && (
                            <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                              <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                Notas de Seguridad:
                              </h4>
                              <p className="text-sm text-yellow-700">{record.safetyNotes}</p>
                            </div>
                          )}

                          {(record.batchNumber || record.supplier || record.expirationDate) && (
                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                              {record.batchNumber && <div>Lote: {record.batchNumber}</div>}
                              {record.supplier && <div>Proveedor: {record.supplier}</div>}
                              {record.expirationDate && (
                                <div>Vence: {format(new Date(record.expirationDate), "dd/MM/yyyy", { locale: es })}</div>
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
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay insumos asignados aún</p>
            <p className="text-sm">Comience asignando un nuevo insumo</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}