import { useState, useEffect } from "react";
import { useActivity } from "@/context/ActivityContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Calendar, Clock, MapPin, FileText, CalendarIcon } from "lucide-react";
import { Activity, ACTIVITY_CATEGORIES, ActivityCategory } from "@/types/activities";
import { UserDropdown } from "@/components/UserDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ActivityFormProps {
  editingActivity?: Activity | null;
  onCancel?: () => void;
  onSave?: () => void;
  currentUserId?: string;
}

export function ActivityForm({ editingActivity, onCancel, onSave, currentUserId }: ActivityFormProps) {
  const { addActivity, updateActivity } = useActivity();
  
  const [title, setTitle] = useState(editingActivity?.title || "");
  const [description, setDescription] = useState(editingActivity?.description || "");
  const [priority, setPriority] = useState<"high" | "medium" | "low">(editingActivity?.priority || "medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    editingActivity?.dueDate ? new Date(editingActivity.dueDate) : undefined
  );
  const [estimatedHours, setEstimatedHours] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [assignedTo, setAssignedTo] = useState(editingActivity?.assignedTo || "");
  const [location, setLocation] = useState(editingActivity?.location || "");
  const [category, setCategory] = useState<ActivityCategory>(editingActivity?.category || "other");
  const [notes, setNotes] = useState(editingActivity?.notes || "");

  // Parse estimated time on component mount
  useEffect(() => {
    if (editingActivity?.estimatedTime) {
      const timeMatch = editingActivity.estimatedTime.match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
      if (timeMatch) {
        // Format could be "1h 30m", "1h", or "30m"
        const hours = timeMatch[1] || timeMatch[3] || "0";
        const minutes = timeMatch[2] || timeMatch[4] || "0";
        setEstimatedHours(hours);
        setEstimatedMinutes(minutes);
      }
    }
  }, [editingActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("El título de la actividad es obligatorio");
      return;
    }

    if (!dueDate) {
      toast.error("La fecha límite es obligatoria");
      return;
    }

    if (!assignedTo) {
      toast.error("Debe seleccionar un usuario para asignar la actividad");
      return;
    }

    // Format estimated time
    let estimatedTime = "";
    if (estimatedHours && estimatedMinutes) {
      estimatedTime = `${estimatedHours}h ${estimatedMinutes}m`;
    } else if (estimatedHours) {
      estimatedTime = `${estimatedHours}h`;
    } else if (estimatedMinutes) {
      estimatedTime = `${estimatedMinutes}m`;
    } else {
      estimatedTime = "No especificado";
    }

    const activityData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate.getTime(),
      estimatedTime,
      assignedBy: currentUserId || "admin001", // En una implementación real, esto vendría del usuario actual
      assignedTo,
      status: editingActivity?.status || "pending",
      location: location.trim(),
      category,
      notes: notes.trim() || undefined,
      completedAt: editingActivity?.completedAt,
      attachments: editingActivity?.attachments
    };

    if (editingActivity) {
      updateActivity(editingActivity.id, activityData);
    } else {
      addActivity(activityData);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(undefined);
    setEstimatedHours("");
    setEstimatedMinutes("");
    setAssignedTo("");
    setLocation("");
    setCategory("other");
    setNotes("");

    onSave?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {editingActivity ? "Editar Actividad" : "Asignar Nueva Actividad"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Actividad *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Inspección de patógenos en Sección B"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada de la actividad..."
              rows={3}
              required
            />
          </div>

          {/* Prioridad y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad *</Label>
              <Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="text-red-600 font-medium">Alta</SelectItem>
                  <SelectItem value="medium" className="text-yellow-600 font-medium">Media</SelectItem>
                  <SelectItem value="low" className="text-green-600 font-medium">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Fecha Límite *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tiempo Estimado */}
          <div className="space-y-2">
            <Label>Tiempo Estimado</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="Horas"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Minutos"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Asignación */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Asignar a *</Label>
            <UserDropdown
              value={assignedTo}
              onValueChange={setAssignedTo}
              placeholder="Seleccionar usuario"
              showRole={true}
              showDepartment={true}
              showOnlyActive={true}
              required
            />
          </div>

          {/* Ubicación y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Invernadero Principal - Sección A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={category} onValueChange={(value: ActivityCategory) => setCategory(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones especiales, requerimientos, etc..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingActivity ? "Actualizar Actividad" : "Asignar Actividad"}
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