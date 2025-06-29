import { useState, useEffect } from "react";
import { useUserManagement } from "@/context/UserManagementContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { Users, Key, UserPlus } from "lucide-react";
import { UserManagement, DEPARTMENTS, USER_ROLES } from "@/types/userManagement";
import { UserPermissions } from "@/types/user";

interface UserManagementFormProps {
  editingUser?: UserManagement | null;
  onCancel?: () => void;
  onSave?: () => void;
}

export function UserManagementForm({ editingUser, onCancel, onSave }: UserManagementFormProps) {
  const { addUser, updateUser } = useUserManagement();
  
  const [name, setName] = useState(editingUser?.name || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [role, setRole] = useState(editingUser?.role || "user");
  const [department, setDepartment] = useState(editingUser?.department || "");
  const [status, setStatus] = useState(editingUser?.status || "active");
  const [employeeId, setEmployeeId] = useState(editingUser?.employeeId || "");
  const [position, setPosition] = useState(editingUser?.position || "");
  const [phoneNumber, setPhoneNumber] = useState(editingUser?.phoneNumber || "");
  const [address, setAddress] = useState(editingUser?.address || "");
  const [notes, setNotes] = useState(editingUser?.notes || "");
  const [permissions, setPermissions] = useState<UserPermissions>(editingUser?.permissions || {
    canRecordPestIncidence: true,
    canRecordPathogenIncidence: true,
    canUpdateLocation: true,
    canRegisterSupplyPossession: true,
    canRegisterToolPossession: true,
    canUseFacialRecognition: true,
    canViewDashboard: true,
    canExportData: true
  });

  // Actualizar permisos cuando cambia el rol
  useEffect(() => {
    if (role === 'admin') {
      // Permisos de administrador
      setPermissions({
        canRecordPestIncidence: true,
        canRecordPathogenIncidence: true,
        canUpdateLocation: true,
        canRegisterSupplyPossession: true,
        canRegisterToolPossession: true,
        canUseFacialRecognition: true,
        canViewDashboard: true,
        canExportData: true,
        canManageUsers: true,
        canManageLocations: true,
        canManageSupplyDatabase: true,
        canManageToolDatabase: true,
        canAssignActivities: true,
        canViewAllRecords: true,
        canManageSystemSettings: true,
        canAccessAdminPanel: true
      });
    } else {
      // Buscar permisos del rol seleccionado
      const selectedRole = USER_ROLES.find(r => r.id === role);
      if (selectedRole) {
        setPermissions(selectedRole.permissions);
      } else {
        // Permisos de usuario básico
        setPermissions({
          canRecordPestIncidence: true,
          canRecordPathogenIncidence: true,
          canUpdateLocation: true,
          canRegisterSupplyPossession: true,
          canRegisterToolPossession: true,
          canUseFacialRecognition: true,
          canViewDashboard: true,
          canExportData: true
        });
      }
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("El nombre del usuario es obligatorio");
      return;
    }

    if (!email.trim()) {
      toast.error("El email es obligatorio");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("El formato del email no es válido");
      return;
    }

    if (!role) {
      toast.error("Por favor seleccione un rol");
      return;
    }

    const userData: Omit<UserManagement, "id" | "createdAt"> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role as 'admin' | 'user',
      department: department || undefined,
      status: status as UserStatus,
      permissions,
      employeeId: employeeId.trim() || undefined,
      position: position.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      lastLogin: editingUser?.lastLogin,
      lastActivity: Date.now()
    };

    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }

    // Reset form
    setName("");
    setEmail("");
    setRole("user");
    setDepartment("");
    setStatus("active");
    setEmployeeId("");
    setPosition("");
    setPhoneNumber("");
    setAddress("");
    setNotes("");

    onSave?.();
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePermissionChange = (permission: keyof UserPermissions, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: value
    }));
  };

  // Generar contraseña aleatoria para nuevos usuarios
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Copiar al portapapeles
    navigator.clipboard.writeText(password)
      .then(() => {
        toast.success("Contraseña generada y copiada al portapapeles");
      })
      .catch(() => {
        toast.error("No se pudo copiar la contraseña");
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {editingUser ? (
            <>
              <Users className="h-5 w-5" />
              Editar Usuario: {editingUser.name}
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Nuevo Usuario
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre y apellidos"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          {/* Rol y Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el rol" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((roleOption) => (
                    <SelectItem key={roleOption.id} value={roleOption.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${roleOption.color}`}></div>
                        <span>{roleOption.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {USER_ROLES.find(r => r.id === role)?.description || ""}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el departamento" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estado y Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateRandomPassword}
                    className="w-full flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Generar Contraseña
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Se generará una contraseña aleatoria y se copiará al portapapeles
                </p>
              </div>
            )}
          </div>

          {/* Información laboral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">ID de Empleado</Label>
              <Input
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Ej: EMP001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo/Posición</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ej: Técnico Agrícola"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ej: +1234567890"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección completa"
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional relevante..."
              rows={3}
            />
          </div>

          {/* Permisos */}
          <div className="space-y-4">
            <Label>Permisos</Label>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-3">Permisos Básicos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="canUpdateLocation" 
                      checked={permissions.canUpdateLocation}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('canUpdateLocation', checked as boolean)
                      }
                    />
                    <Label htmlFor="canUpdateLocation">Actualizar ubicación</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="canRegisterSupplyPossession" 
                      checked={permissions.canRegisterSupplyPossession}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('canRegisterSupplyPossession', checked as boolean)
                      }
                    />
                    <Label htmlFor="canRegisterSupplyPossession">Registrar posesión de insumos</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="canRegisterToolPossession" 
                      checked={permissions.canRegisterToolPossession}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('canRegisterToolPossession', checked as boolean)
                      }
                    />
                    <Label htmlFor="canRegisterToolPossession">Registrar posesión de herramientas</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="canUseFacialRecognition" 
                      checked={permissions.canUseFacialRecognition}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('canUseFacialRecognition', checked as boolean)
                      }
                    />
                    <Label htmlFor="canUseFacialRecognition">Usar reconocimiento facial</Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="canViewDashboard" 
                      checked={permissions.canViewDashboard}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('canViewDashboard', checked as boolean)
                      }
                    />
                    <Label htmlFor="canViewDashboard">Ver dashboard</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="canExportData" 
                      checked={permissions.canExportData}
                      onCheckedChange={(checked) => 
                        handlePermissionChange('canExportData', checked as boolean)
                      }
                    />
                    <Label htmlFor="canExportData">Exportar datos</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-3">Permisos de Bitácora Electrónica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canRecordPestIncidence" 
                    checked={permissions.canRecordPestIncidence}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canRecordPestIncidence', checked as boolean)
                    }
                  />
                  <Label htmlFor="canRecordPestIncidence">Registrar incidencia de plagas</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canRecordPathogenIncidence" 
                    checked={permissions.canRecordPathogenIncidence}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canRecordPathogenIncidence', checked as boolean)
                    }
                  />
                  <Label htmlFor="canRecordPathogenIncidence">Registrar incidencia de patógenos</Label>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-3">Permisos Administrativos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canManageUsers" 
                    checked={permissions.canManageUsers}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canManageUsers', checked as boolean)
                    }
                  />
                  <Label htmlFor="canManageUsers">Gestionar usuarios</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canManageLocations" 
                    checked={permissions.canManageLocations}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canManageLocations', checked as boolean)
                    }
                  />
                  <Label htmlFor="canManageLocations">Gestionar ubicaciones</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canManageSupplyDatabase" 
                    checked={permissions.canManageSupplyDatabase}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canManageSupplyDatabase', checked as boolean)
                    }
                  />
                  <Label htmlFor="canManageSupplyDatabase">Gestionar base de datos de insumos</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canManageToolDatabase" 
                    checked={permissions.canManageToolDatabase}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canManageToolDatabase', checked as boolean)
                    }
                  />
                  <Label htmlFor="canManageToolDatabase">Gestionar base de datos de herramientas</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canAssignActivities" 
                    checked={permissions.canAssignActivities}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canAssignActivities', checked as boolean)
                    }
                  />
                  <Label htmlFor="canAssignActivities">Asignar actividades</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canViewAllRecords" 
                    checked={permissions.canViewAllRecords}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canViewAllRecords', checked as boolean)
                    }
                  />
                  <Label htmlFor="canViewAllRecords">Ver todos los registros</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canManageSystemSettings" 
                    checked={permissions.canManageSystemSettings}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canManageSystemSettings', checked as boolean)
                    }
                  />
                  <Label htmlFor="canManageSystemSettings">Gestionar configuración del sistema</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="canAccessAdminPanel" 
                    checked={permissions.canAccessAdminPanel}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('canAccessAdminPanel', checked as boolean)
                    }
                  />
                  <Label htmlFor="canAccessAdminPanel">Acceder al panel de administración</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
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