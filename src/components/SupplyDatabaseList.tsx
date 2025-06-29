import { useState } from "react";
import { useSupplyDatabase } from "@/context/SupplyDatabaseContext";
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
  Package, 
  Beaker,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Search,
  Filter,
  AlertTriangle,
  Shield,
  Droplets
} from "lucide-react";
import { SupplyDatabaseItem } from "@/types/supplyDatabase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SupplyDatabaseListProps {
  onEdit: (supply: SupplyDatabaseItem) => void;
}

export function SupplyDatabaseList({ onEdit }: SupplyDatabaseListProps) {
  const { data, deleteSupply, toggleSupplyStatus } = useSupplyDatabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleDelete = (supply: SupplyDatabaseItem) => {
    if (confirm(`¿Está seguro de que desea eliminar el insumo "${supply.name}"?`)) {
      deleteSupply(supply.id);
    }
  };

  const handleToggleStatus = (supply: SupplyDatabaseItem) => {
    toggleSupplyStatus(supply.id);
  };

  // Filtrar insumos
  const filteredSupplies = data.supplies.filter(supply => {
    const matchesSearch = supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (supply.description && supply.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (supply.activeIngredient && supply.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || supply.category.id === filterCategory;
    const matchesStatus = filterStatus === "all" || supply.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'discontinued': return <Badge className="bg-gray-100 text-gray-800">Descontinuado</Badge>;
      case 'restricted': return <Badge className="bg-red-100 text-red-800">Uso Restringido</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Catálogo de Insumos ({filteredSupplies.length})
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, descripción o ingrediente activo..."
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
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="discontinued">Descontinuados</SelectItem>
              <SelectItem value="restricted">Uso Restringido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredSupplies.length > 0 ? (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredSupplies
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((supply) => (
                  <Card key={supply.id} className={cn(
                    "border-l-4",
                    supply.status === 'active' ? "border-l-green-500" : 
                    supply.status === 'discontinued' ? "border-l-gray-400" :
                    "border-l-red-500"
                  )}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{supply.name}</h3>
                            
                            <Badge className={cn(
                              "text-white",
                              supply.category.color
                            )}>
                              {supply.category.icon} {supply.category.name}
                            </Badge>
                            
                            {getStatusBadge(supply.status)}
                          </div>
                          
                          {supply.description && (
                            <p className="text-sm text-gray-600 mb-3">{supply.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {supply.activeIngredient && (
                              <div className="flex items-center gap-1">
                                <Beaker className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">I.A.:</span> {supply.activeIngredient}
                                {supply.concentration && ` (${supply.concentration})`}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Droplets className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Dosis:</span> {supply.recommendedDose}
                            </div>

                            {supply.manufacturer && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Fabricante:</span> {supply.manufacturer}
                              </div>
                            )}

                            {supply.registrationNumber && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Registro:</span> {supply.registrationNumber}
                              </div>
                            )}
                          </div>

                          {supply.targetPests && supply.targetPests.length > 0 && (
                            <div className="mt-3">
                              <span className="text-sm font-medium">Plagas/Enfermedades objetivo:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {supply.targetPests.map((pest, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {pest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {supply.applicationMethods && supply.applicationMethods.length > 0 && (
                            <div className="mt-3">
                              <span className="text-sm font-medium">Métodos de aplicación:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {supply.applicationMethods.map((method, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                    {method}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {supply.safetyNotes && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                              <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                Notas de Seguridad:
                              </h4>
                              <p className="text-sm text-yellow-700">{supply.safetyNotes}</p>
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-500">
                            Creado: {format(new Date(supply.createdAt), "dd/MM/yyyy", { locale: es })} | 
                            Actualizado: {format(new Date(supply.updatedAt), "dd/MM/yyyy", { locale: es })}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 ml-4">
                          {supply.image && (
                            <img
                              src={supply.image}
                              alt={supply.name}
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
                                onClick={() => onEdit(supply)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(supply)}
                                className="flex items-center gap-2"
                              >
                                {supply.status === 'active' ? (
                                  <>
                                    <PowerOff className="h-4 w-4" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <Power className="h-4 w-4" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem
                                onClick={() => handleDelete(supply)}
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
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron insumos</p>
            <p className="text-sm">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Intente ajustar los filtros de búsqueda"
                : "Comience creando un nuevo insumo"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}