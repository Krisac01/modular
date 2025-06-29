import { useState } from "react";
import { useActivity } from "@/context/ActivityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Calendar, 
  User, 
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Activity, ACTIVITY_CATEGORIES } from "@/types/activities";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, isAfter, isBefore, addHours } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ActivityListProps {
  onEdit: (activity: Activity) => void;
  userId?: string;
  showOnlyAssigned?: boolean;
}

export function ActivityList({ onEdit, userId, showOnlyAssigned = false }: ActivityListProps) {
  const { data, deleteActivity, completeActivity, cancelActivity } = useActivity();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [completionNotes, setCompletionNotes] = useState("");
  const [cancellationNotes, setCancellationNotes] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dialogAction, setDialogAction] = useState<"complete" | "cancel" | null>(null);

  const handleDelete = (activity: Activity) => {
    if (confirm(`¿Está seguro de que desea eliminar la actividad "${activity.title}"?`)) {
      deleteActivity(activity.id);
    }
  };

  const handleCompleteActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogAction("complete");
    setCompletionNotes("");
  };

  const handleCancelActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogAction("cancel");
    setCancellationNotes("");
  };

  const confirmCompleteActivity = () => {
    if (selectedActivity) {
      completeActivity(selectedActivity.id, completionNotes);
      setSelectedActivity(null);
      setDialogAction(null);
    }
  };

  const confirmCancelActivity = () => {
    if (selectedActivity) {
      cancelActivity(selectedActivity.id, cancellationNotes);
      setSelectedActivity(null);
      setDialogAction(null);
    }
  };

  // Filtrar actividades
  const filteredActivities = data.activities.filter(activity => {
    // Si estamos mostrando solo las asignadas a un usuario específico
    if (showOnlyAssigned && userId && activity.assignedTo !== userId) {
      return false;
    }

    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || activity.category === filterCategory;
    const matchesPriority = filterPriority === "all" || activity.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-800 border-red-200";
      case 'medium': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low': return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'in_progress': return "bg-blue-100 text-blue-800 border-blue-200";
      case 'completed': return "bg-green-100 text-green-800 border-green-200";
      case 'cancelled': return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId) || ACTIVITY_CATEGORIES[6]; // Default to "other"
  };

  const formatTimeAgo = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es });
  };

  const isOverdue = (dueDate: number) => {
    return isBefore(new Date(dueDate), new Date());
  };

  const isUrgent = (dueDate: number) => {
    return isBefore(new Date(dueDate), addHours(new Date(), 24)) && 
           isAfter(new Date(dueDate), new Date());
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Actividades {showOnlyAssigned ? "Asignadas" : "Registradas"} ({filteredActivities.length})
          </CardTitle>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título, descripción o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {ACTIVITY_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high" className="text-red-600 font-medium">Alta</SelectItem>
                <SelectItem value="medium" className="text-yellow-600 font-medium">Media</SelectItem>
                <SelectItem value="low" className="text-green-600 font-medium">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredActivities.length > 0 ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredActivities
                  .sort((a, b) => {
                    // Primero ordenar por estado (pendientes y en progreso primero)
                    if ((a.status === 'pending' || a.status === 'in_progress') && 
                        (b.status === 'completed' || b.status === 'cancelled')) {
                      return -1;
                    }
                    if ((b.status === 'pending' || b.status === 'in_progress') && 
                        (a.status === 'completed' || a.status === 'cancelled')) {
                      return 1;
                    }
                    
                    // Luego por fecha de vencimiento (más cercanas primero)
                    if (a.status === 'pending' && b.status === 'pending') {
                      return a.dueDate - b.dueDate;
                    }
                    
                    // Finalmente por fecha de actualización (más recientes primero)
                    return b.updatedAt - a.updatedAt;
                  })
                  .map((activity) => {
                    const categoryInfo = getCategoryInfo(activity.category);
                    const isActivityOverdue = isOverdue(activity.dueDate) && activity.status === 'pending';
                    const isActivityUrgent = isUrgent(activity.dueDate) && activity.status === 'pending';
                    
                    return (
                      <Card key={activity.id} className={cn(
                        "border-l-4",
                        activity.status === 'completed' ? "border-l-green-500" : 
                        activity.status === 'cancelled' ? "border-l-red-500" :
                        isActivityOverdue ? "border-l-red-500" :
                        isActivityUrgent ? "border-l-yellow-500" :
                        "border-l-blue-500"
                      )}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-lg">{activity.title}</h3>
                                
                                <Badge className={cn(
                                  "text-white",
                                  categoryInfo.color
                                )}>
                                  {categoryInfo.icon} {categoryInfo.name}
                                </Badge>
                                
                                <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                                  {activity.priority === 'high' ? "Alta" : 
                                   activity.priority === 'medium' ? "Media" : "Baja"}
                                </Badge>
                                
                                <Badge variant="outline" className={getStatusColor(activity.status)}>
                                  {activity.status === 'pending' ? "Pendiente" : 
                                   activity.status === 'in_progress' ? "En Progreso" : 
                                   activity.status === 'completed' ? "Completada" : "Cancelada"}
                                </Badge>
                                
                                {isActivityOverdue && (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Vencida
                                  </Badge>
                                )}
                                
                                {isActivityUrgent && !isActivityOverdue && (
                                  <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Urgente
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Fecha Límite:</span>
                                  <span className={cn(
                                    isActivityOverdue ? "text-red-600 font-medium" : 
                                    isActivityUrgent ? "text-yellow-600 font-medium" : 
                                    "text-gray-600"
                                  )}>
                                    {format(new Date(activity.dueDate), "dd/MM/yyyy", { locale: es })}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Tiempo Estimado:</span>
                                  <span>{activity.estimatedTime}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Asignado a:</span>
                                  <span>{activity.assignedTo}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Asignado por:</span>
                                  <span>{activity.assignedBy}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Ubicación:</span>
                                  <span>{activity.location}</span>
                                </div>
                                
                                {activity.completedAt && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">Completada:</span>
                                    <span>{format(new Date(activity.completedAt), "dd/MM/yyyy", { locale: es })}</span>
                                  </div>
                                )}
                              </div>

                              {activity.notes && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-1 mb-1">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Notas:</span>
                                  </div>
                                  <p className="text-sm text-gray-600 whitespace-pre-line">{activity.notes}</p>
                                </div>
                              )}

                              <div className="mt-2 text-xs text-gray-500">
                                Creada: {formatTimeAgo(activity.createdAt)} | 
                                Actualizada: {formatTimeAgo(activity.updatedAt)}
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
                                  onClick={() => onEdit(activity)}
                                  className="flex items-center gap-2"
                                  disabled={activity.status === 'completed' || activity.status === 'cancelled'}
                                >
                                  <Edit className="h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                
                                {activity.status === 'pending' && (
                                  <DropdownMenuItem
                                    onClick={() => handleCompleteActivity(activity)}
                                    className="flex items-center gap-2 text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Marcar como Completada
                                  </DropdownMenuItem>
                                )}
                                
                                {activity.status === 'pending' && (
                                  <DropdownMenuItem
                                    onClick={() => handleCancelActivity(activity)}
                                    className="flex items-center gap-2 text-yellow-600"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Cancelar Actividad
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem
                                  onClick={() => handleDelete(activity)}
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
                    );
                  })}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron actividades</p>
              <p className="text-sm">
                {searchTerm || filterCategory !== "all" || filterPriority !== "all" || filterStatus !== "all"
                  ? "Intente ajustar los filtros de búsqueda"
                  : "Comience creando una nueva actividad"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para completar actividad */}
      <Dialog open={dialogAction === "complete"} onOpenChange={(open) => !open && setDialogAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completar Actividad</DialogTitle>
            <DialogDescription>
              Añada notas sobre la finalización de esta actividad.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="completionNotes">Notas de Finalización</Label>
              <Textarea
                id="completionNotes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Detalles sobre cómo se completó la actividad, resultados, observaciones..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAction(null)}>Cancelar</Button>
            <Button onClick={confirmCompleteActivity} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Finalización
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para cancelar actividad */}
      <Dialog open={dialogAction === "cancel"} onOpenChange={(open) => !open && setDialogAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Actividad</DialogTitle>
            <DialogDescription>
              Por favor indique el motivo de la cancelación.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancellationNotes">Motivo de Cancelación</Label>
              <Textarea
                id="cancellationNotes"
                value={cancellationNotes}
                onChange={(e) => setCancellationNotes(e.target.value)}
                placeholder="Explique por qué se está cancelando esta actividad..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAction(null)}>Volver</Button>
            <Button onClick={confirmCancelActivity} variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}