import { useState } from "react";
import { useToolDatabase } from "@/context/ToolDatabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Wrench, 
  Edit,
  Trash2,
  Power,
  PowerOff,
  Search,
  Filter,
  AlertTriangle,
  Shield,
  Settings,
  Calendar
} from "lucide-react";
import { ToolDatabaseItem } from "@/types/toolDatabase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ToolDatabaseListProps {
  onEdit: (tool: ToolDatabaseItem) => void;
}

export function ToolDatabaseList({ onEdit }: ToolDatabaseListProps) {
  const { data, deleteTool, toggleToolStatus } = useToolDatabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleDelete = (tool: ToolDatabaseItem) => {
    if (confirm(`¿Está seguro de que desea eliminar la herramienta "${tool.name}"?`)) {
      deleteTool(tool.id);
    }
  };

  const handleToggleStatus = (tool: ToolDatabaseItem) => {
    toggleToolStatus(tool.id);
  };

  // Filtrar herramientas
  const filteredTools = data.tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (tool.brand && tool.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (tool.model && tool.model.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || tool.category.id === filterCategory;
    const matchesStatus = filterStatus === "all" || tool.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case 'maintenance': return <Badge className="bg-yellow-100 text-yellow-800">En Mantenimiento</Badge>;
      case 'discontinued': return <Badge className="bg-gray-100 text-gray-800">Descontinuada</Badge>;
      case 'damaged': return <Badge className="bg-red-100 text-red-800">Dañada</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Catálogo de Herramientas ({filteredTools.length})
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, descripción, marca o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {data.categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="maintenance">En Mantenimiento</SelectItem>
              <SelectItem value="discontinued">Descontinuadas</SelectItem>
              <SelectItem value="damaged">Dañadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTools.length > 0 ? (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredTools
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((tool) => (
                  <Card key={tool.id} className={cn(
                    "border-l-4",
                    tool.status === 'active' ? "border-l-green-500" : 
                    tool.status === 'maintenance' ? "border-l-yellow-500" :
                    tool.status === 'damaged' ? "border-l-red-500" :
                    "border-l-gray-400"
                  )}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{tool.name}</h3>
                            
                            <Badge className={cn(
                              "text-white",
                              tool.category.color
                            )}>
                              {tool.category.icon} {tool.category.name}
                            </Badge>
                            
                            {getStatusBadge(tool.status)}
                            
                            {isMaintenanceOverdue(tool.nextMaintenanceDate) && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Mantenimiento vencido
                              </Badge>
                            )}
                            
                            {isMaintenanceDue(tool.nextMaintenanceDate) && !isMaintenanceOverdue(tool.nextMaintenanceDate) && (
                              <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Mantenimiento próximo
                              </Badge>
                            )}
                          </div>
                          
                          {tool.description && (
                            <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {(tool.brand || tool.model) && (
                              <div className="flex items-center gap-1">
                                <Settings className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Marca/Modelo:</span> 
                                {tool.brand} {tool.model && `(${tool.model})`}
                              </div>
                            )}
                            
                            {tool.serialNumber && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Serie:</span> {tool.serialNumber}
                              </div>
                            )}

                            {tool.technicalSpecifications && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Especificaciones:</span> {tool.technicalSpecifications}
                              </div>
                            )}

                            {tool.maintenanceFrequency && (
                              <div className="flex items-center gap-1">
                                <Settings className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Frecuencia de mantenimiento:</span> {tool.maintenanceFrequency}
                              </div>
                            )}
                          </div>

                          {tool.recommendedUses && tool.recommendedUses.length > 0 && (
                            <div className="mt-3">
                              <span className="text-sm font-medium">Usos recomendados:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tool.recommendedUses.map((use, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {use}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Fechas importantes */}
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                            {tool.purchaseDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="font-medium">Compra:</span> 
                                {format(new Date(tool.purchaseDate), "dd/MM/yyyy", { locale: es })}
                              </div>
                            )}
                            
                            {tool.lastMaintenanceDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="font-medium">Último mant.:</span> 
                                {format(new Date(tool.lastMaintenanceDate), "dd/MM/yyyy", { locale: es })}
                              </div>
                            )}
                            
                            {tool.nextMaintenanceDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="font-medium">Próximo mant.:</span> 
                                <span className={cn(
                                  isMaintenanceOverdue(tool.nextMaintenanceDate) ? "text-red-600 font-medium" :
                                  isMaintenanceDue(tool.nextMaintenanceDate) ? "text-yellow-600 font-medium" : ""
                                )}>
                                  {format(new Date(tool.nextMaintenanceDate), "dd/MM/yyyy", { locale: es })}
                                </span>
                              </div>
                            )}
                          </div>

                          {tool.safetyInstructions && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                              <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                Instrucciones de Seguridad:
                              </h4>
                              <p className="text-sm text-yellow-700">{tool.safetyInstructions}</p>
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-500">
                            Creado: {format(new Date(tool.createdAt), "dd/MM/yyyy", { locale: es })} | 
                            Actualizado: {format(new Date(tool.updatedAt), "dd/MM/yyyy", { locale: es })}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 ml-4">
                          {tool.image && (
                            <img
                              src={tool.image}
                              alt={tool.name}
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
                                onClick={() => onEdit(tool)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(tool)}
                                className="flex items-center gap-2"
                              >
                                {tool.status === 'active' ? (
                                  <>
                                    <Settings className="h-4 w-4" />
                                    Marcar en Mantenimiento
                                  </>
                                ) : (
                                  <>
                                    <Power className="h-4 w-4" />
                                    Marcar como Activa
                                  </>
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem
                                onClick={() => handleDelete(tool)}
                                className="text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
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
            <p>No se encontraron herramientas</p>
            <p className="text-sm">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Intente ajustar los filtros de búsqueda"
                : "Comience creando una nueva herramienta"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}