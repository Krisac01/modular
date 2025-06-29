import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserDropdown } from "@/components/UserDropdown";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { UserCheck } from "lucide-react";

export function UserDropdownDemo() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>("");
  const [selectedResponsibleId, setSelectedResponsibleId] = useState<string>("");

  const handleAssign = () => {
    if (!selectedUserId) {
      toast.error("Por favor seleccione un usuario");
      return;
    }

    toast.success("Usuario asignado correctamente");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Demostración de Selección de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="user-dropdown">Usuario Asignado</Label>
          <UserDropdown
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            placeholder="Seleccionar usuario"
            showRole={true}
            showDepartment={true}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supervisor-dropdown">Supervisor (solo administradores)</Label>
          <UserDropdown
            value={selectedSupervisorId}
            onValueChange={setSelectedSupervisorId}
            placeholder="Seleccionar supervisor"
            showRole={false}
            showDepartment={true}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Este ejemplo muestra usuarios sin indicador de rol</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsible-dropdown">Responsable (solo usuarios activos)</Label>
          <UserDropdown
            value={selectedResponsibleId}
            onValueChange={setSelectedResponsibleId}
            placeholder="Seleccionar responsable"
            showRole={true}
            showDepartment={false}
            showOnlyActive={true}
          />
          <p className="text-xs text-gray-500">Este ejemplo muestra solo usuarios activos sin departamento</p>
        </div>

        <Button onClick={handleAssign} className="w-full">
          Asignar Usuario Seleccionado
        </Button>
      </CardContent>
    </Card>
  );
}