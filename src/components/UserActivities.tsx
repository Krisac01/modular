import { useActivity } from "@/context/ActivityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  MapPin
} from "lucide-react";
import { Activity } from "@/types/activities";
import { format, isAfter, isBefore, addHours } from "date-fns";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UserActivitiesProps {
  userId: string;
}

export function UserActivities({ userId }: UserActivitiesProps) {
  const { getActivitiesByUser, completeActivity, cancelActivity } = useActivity();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [cancellationNotes, setCancellationNotes] = useState("");
  const [dialogAction, setDialogAction] = useState<"complete" | "cancel" | null>(null);

  const userActivities = getActivitiesByUser(userId);
  const pendingActivities = userActivities.filter(a => a.status === 'pending');

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-800 border-red-200";
      case 'medium': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low': return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
            Mis Actividades Pendientes ({pendingActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingActivities.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {pendingActivities
                  .sort((a, b) => a.dueDate - b.dueDate) // Ordenar por fecha de vencimiento
                  .map((activity) => {
                    const isActivityOverdue = isOverdue(activity.dueDate);
                    const isActivityUrgent = isUrgent(activity.dueDate);
                    
                    return (
                      <Card key={activity.id} className={cn(
                        "border-l-4",
                        isActivityOverdue ? "border-l-red-500" :
                        isActivityUrgent ? "border-l-yellow-500" :
                        "border-l-blue-500"
                      )}>
                        <CardContent className="pt-4 pb-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{activity.title}</h3>
                              <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                                {activity.priority === 'high' ? "Alta" : 
                                activity.priority === 'medium' ? "Media" : "Baja"}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            
                            <div className="flex flex-wrap gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                <span className={cn(
                                  isActivityOverdue ? "text-red-600 font-medium" : 
                                  isActivityUrgent ? "text-yellow-600 font-medium" : 
                                  "text-gray-600"
                                )}>
                                  {format(new Date(activity.dueDate), "dd/MM/yyyy", { locale: es })}
                                </span>
                                
                                {isActivityOverdue && (
                                  <Badge variant="destructive" className="ml-1 text-[10px] py-0">Vencida</Badge>
                                )}
                                
                                {isActivityUrgent && !isActivityOverdue && (
                                  <Badge variant="outline" className="ml-1 border-yellow-300 text-yellow-700 bg-yellow-50 text-[10px] py-0">Urgente</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span>{activity.estimatedTime}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span>{activity.location}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleCompleteActivity(activity)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleCancelActivity(activity)}
                                className="flex-1"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Cancelar
                              </Button>
                            </div>
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
              <p>No tienes actividades pendientes</p>
              <p className="text-sm">Todas tus tareas están completadas</p>
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