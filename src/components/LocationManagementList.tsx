import { useState } from "react";
import { useLocationManagement } from "@/context/LocationManagementContext";
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
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  MapPin, 
  Users, 
  Navigation,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Search,
  Filter
} from "lucide-react";
import { LocationManagement } from "@/types/locationManagement";
import { cn } from "@/lib/utils";

interface LocationManagementListProps {
  onEdit: (location: LocationManagement) => void;
}

export function LocationManagementList({ onEdit }: LocationManagementListProps) {
  const { data, deleteLocation, toggleLocationStatus } = useLocationManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleDelete = (location: LocationManagement) => {
    if (confirm(`¿Está seguro de que desea eliminar la ubicación "${location.name}"?`)) {
      deleteLocation(location.id);
    }
  };

  const handleToggleStatus = (location: LocationManagement) => {
    toggleLocationStatus(location.id);
  };

  // Filtrar ubicaciones
  const filteredLocations = data.locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.rfidTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || location.category.id === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && location.isActive) ||
                         (filterStatus === "inactive" && !location.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicaciones Registradas ({filteredLocations.length})
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, tag RFID o descripción..."
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
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredLocations.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredLocations
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((location) => (
                  <Card key={location.id} className={cn(
                    "border-l-4",
                    location.isActive ? "border-l-green-500" : "border-l-gray-400"
                  )}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{location.name}</h3>
                            
                            <Badge className={cn(
                              "text-white",
                              location.category.color
                            )}>
                              {location.category.icon} {location.category.name}
                            </Badge>
                            
                            <Badge variant={location.isActive ? "default" : "secondary"}>
                              {location.isActive ? "Activa" : "Inactiva"}
                            </Badge>
                          </div>
                          
                          {location.description && (
                            <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Tag RFID:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {location.rfidTag}
                              </code>
                            </div>
                            
                            {location.maxCapacity && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Capacidad:</span>
                                <span className={cn(
                                  location.currentOccupancy && location.maxCapacity
                                    ? getOccupancyColor(location.currentOccupancy, location.maxCapacity)
                                    : "text-gray-600"
                                )}>
                                  {location.currentOccupancy || 0}/{location.maxCapacity}
                                </span>
                              </div>
                            )}

                            {location.responsiblePerson && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Responsable:</span>
                                <span>{location.responsiblePerson}</span>
                              </div>
                            )}

                            {location.coordinates && (
                              <div className="flex items-center gap-1">
                                <Navigation className="h-4 w-4 text-gray-500" />
                                <span className="font-mono text-xs">
                                  {formatCoordinates(location.coordinates.latitude, location.coordinates.longitude)}
                                </span>
                              </div>
                            )}
                          </div>

                          {location.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <span className="font-medium">Notas:</span> {location.notes}
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-500">
                            Creado: {new Date(location.createdAt).toLocaleDateString()} | 
                            Actualizado: {new Date(location.updatedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onEdit(location)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(location)}
                              className="flex items-center gap-2"
                            >
                              {location.isActive ? (
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
                            
                            <DropdownMenuItem
                              onClick={() => handleDelete(location)}
                              className="text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron ubicaciones</p>
            <p className="text-sm">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Intente ajustar los filtros de búsqueda"
                : "Comience creando una nueva ubicación"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}