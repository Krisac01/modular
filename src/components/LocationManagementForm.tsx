import { useState, useRef } from "react";
import { useLocationManagement } from "@/context/LocationManagementContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { MapPin, Plus, Navigation } from "lucide-react";
import { LocationManagement } from "@/types/locationManagement";

interface LocationManagementFormProps {
  editingLocation?: LocationManagement | null;
  onCancel?: () => void;
  onSave?: () => void;
}

export function LocationManagementForm({ editingLocation, onCancel, onSave }: LocationManagementFormProps) {
  const { data, addLocation, updateLocation } = useLocationManagement();
  
  const [name, setName] = useState(editingLocation?.name || "");
  const [rfidTag, setRfidTag] = useState(editingLocation?.rfidTag || "");
  const [description, setDescription] = useState(editingLocation?.description || "");
  const [categoryId, setCategoryId] = useState(editingLocation?.category.id || "");
  const [isActive, setIsActive] = useState(editingLocation?.isActive ?? true);
  const [maxCapacity, setMaxCapacity] = useState(editingLocation?.maxCapacity?.toString() || "");
  const [currentOccupancy, setCurrentOccupancy] = useState(editingLocation?.currentOccupancy?.toString() || "");
  const [responsiblePerson, setResponsiblePerson] = useState(editingLocation?.responsiblePerson || "");
  const [notes, setNotes] = useState(editingLocation?.notes || "");
  const [coordinates, setCoordinates] = useState({
    latitude: editingLocation?.coordinates?.latitude?.toString() || "",
    longitude: editingLocation?.coordinates?.longitude?.toString() || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("El nombre de la ubicación es obligatorio");
      return;
    }

    if (!rfidTag.trim()) {
      toast.error("El tag RFID es obligatorio");
      return;
    }

    if (!categoryId) {
      toast.error("Por favor seleccione una categoría");
      return;
    }

    const category = data.categories.find(c => c.id === categoryId);
    if (!category) {
      toast.error("Categoría no válida");
      return;
    }

    const locationData = {
      name: name.trim(),
      rfidTag: rfidTag.trim().toUpperCase(),
      description: description.trim(),
      category,
      isActive,
      maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
      currentOccupancy: currentOccupancy ? parseInt(currentOccupancy) : undefined,
      responsiblePerson: responsiblePerson.trim() || undefined,
      notes: notes.trim() || undefined,
      coordinates: coordinates.latitude && coordinates.longitude ? {
        latitude: parseFloat(coordinates.latitude),
        longitude: parseFloat(coordinates.longitude)
      } : undefined,
      createdBy: "admin001" // En una implementación real, esto vendría del usuario actual
    };

    if (editingLocation) {
      updateLocation(editingLocation.id, locationData);
    } else {
      addLocation(locationData);
    }

    // Reset form
    setName("");
    setRfidTag("");
    setDescription("");
    setCategoryId("");
    setIsActive(true);
    setMaxCapacity("");
    setCurrentOccupancy("");
    setResponsiblePerson("");
    setNotes("");
    setCoordinates({ latitude: "", longitude: "" });

    onSave?.();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          toast.success("Coordenadas obtenidas correctamente");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Error al obtener la ubicación GPS");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      toast.error("Geolocalización no disponible en este dispositivo");
    }
  };

  const generateRFIDTag = () => {
    const prefix = "RFID";
    const number = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    setRfidTag(`${prefix}${number}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {editingLocation ? "Editar Ubicación" : "Nueva Ubicación"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Ubicación *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Invernadero Principal - Sección A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfidTag">Tag RFID *</Label>
              <div className="flex gap-2">
                <Input
                  id="rfidTag"
                  value={rfidTag}
                  onChange={(e) => setRfidTag(e.target.value.toUpperCase())}
                  placeholder="Ej: RFID001"
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateRFIDTag}
                  className="flex-shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada de la ubicación..."
              rows={2}
            />
          </div>

          {/* Categoría y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Estado de la Ubicación</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {isActive ? "Activa" : "Inactiva"}
                </Label>
              </div>
            </div>
          </div>

          {/* Capacidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Capacidad Máxima (personas)</Label>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                placeholder="Ej: 20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentOccupancy">Ocupación Actual (personas)</Label>
              <Input
                id="currentOccupancy"
                type="number"
                min="0"
                value={currentOccupancy}
                onChange={(e) => setCurrentOccupancy(e.target.value)}
                placeholder="Ej: 5"
              />
            </div>
          </div>

          {/* Responsable */}
          <div className="space-y-2">
            <Label htmlFor="responsiblePerson">Persona Responsable</Label>
            <Input
              id="responsiblePerson"
              value={responsiblePerson}
              onChange={(e) => setResponsiblePerson(e.target.value)}
              placeholder="Nombre del responsable de la ubicación"
            />
          </div>

          {/* Coordenadas GPS */}
          <div className="space-y-2">
            <Label>Coordenadas GPS (opcional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Latitud"
                value={coordinates.latitude}
                onChange={(e) => setCoordinates(prev => ({ ...prev, latitude: e.target.value }))}
              />
              <Input
                placeholder="Longitud"
                value={coordinates.longitude}
                onChange={(e) => setCoordinates(prev => ({ ...prev, longitude: e.target.value }))}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={getCurrentLocation}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Obtener GPS
              </Button>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cualquier información adicional relevante..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingLocation ? "Actualizar Ubicación" : "Crear Ubicación"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}