import { useState } from "react";
import { useUserManagement } from "@/context/UserManagementContext";
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
  Users, 
  User,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Search,
  Filter,
  Key,
  Mail,
  Clock,
  Building,
  Briefcase,
  Phone
} from "lucide-react";
import { UserManagement, USER_ROLES, DEPARTMENTS } from "@/types/userManagement";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface UserManagementListProps {
  onEdit: (user: UserManagement) => void;
}

export function UserManagementList({ onEdit }: UserManagementListProps) {
  const { data, deleteUser, changeUserStatus, resetPassword } = useUserManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleDelete = (user: UserManagement) => {
    if (confirm(`¿Está seguro de que desea eliminar al usuario "${user.name}"?`)) {
      deleteUser(user.id);
    }
  };

  const handleToggleStatus = (user: UserManagement) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    changeUserStatus(user.id, newStatus);
  };

  const handleResetPassword = (user: UserManagement) => {
    if (confirm(`¿Está seguro de que desea restablecer la contraseña de "${user.name}"?`)) {
      resetPassword(user.id);
    }
  };

  // Filtrar usuarios
  const filteredUsers = data.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return "bg-green-100 text-green-800 border-green-200";
      case 'inactive': return "bg-gray-100 text-gray-800 border-gray-200";
      case 'suspended': return "bg-red-100 text-red-800 border-red-200";
      case 'pending': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    const roleConfig = USER_ROLES.find(r => r.id === role);
    return roleConfig?.color || "bg-gray-500";
  };

  const getRoleName = (role: string) => {
    const roleConfig = USER_ROLES.find(r => r.id === role);
    return roleConfig?.name || role;
  };

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "Nunca";
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Usuarios Registrados ({filteredUsers.length})
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {USER_ROLES.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${role.color}`}></div>
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
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
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="suspended">Suspendidos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredUsers.length > 0 ? (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredUsers
                .sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0))
                .map((user) => (
                  <Card key={user.id} className={cn(
                    "border-l-4",
                    user.status === 'active' ? "border-l-green-500" : 
                    user.status === 'inactive' ? "border-l-gray-400" :
                    user.status === 'suspended' ? "border-l-red-500" : "border-l-yellow-500"
                  )}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            
                            <Badge className={cn(
                              "text-white",
                              getRoleColor(user.role)
                            )}>
                              {getRoleName(user.role)}
                            </Badge>
                            
                            <Badge variant="outline" className={getStatusColor(user.status)}>
                              {user.status === 'active' ? "Activo" : 
                               user.status === 'inactive' ? "Inactivo" :
                               user.status === 'suspended' ? "Suspendido" : "Pendiente"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Email:</span>
                              <span className="text-blue-600">{user.email}</span>
                            </div>
                            
                            {user.department && (
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Departamento:</span>
                                <span>{user.department}</span>
                              </div>
                            )}

                            {user.position && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Cargo:</span>
                                <span>{user.position}</span>
                              </div>
                            )}

                            {user.phoneNumber && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Teléfono:</span>
                                <span>{user.phoneNumber}</span>
                              </div>
                            )}

                            {user.employeeId && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">ID Empleado:</span>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {user.employeeId}
                                </code>
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Último acceso:</span>
                              <span className="text-gray-600">{formatTimeAgo(user.lastLogin)}</span>
                            </div>
                          </div>

                          {user.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <span className="font-medium">Notas:</span> {user.notes}
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-500">
                            Creado: {format(new Date(user.createdAt), "dd/MM/yyyy")} | 
                            Última actividad: {formatTimeAgo(user.lastActivity)}
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
                              onClick={() => onEdit(user)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onClick={() => handleResetPassword(user)}
                              className="flex items-center gap-2"
                            >
                              <Key className="h-4 w-4" />
                              Restablecer Contraseña
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user)}
                              className="flex items-center gap-2"
                            >
                              {user.status === 'active' ? (
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
                              onClick={() => handleDelete(user)}
                              className="text-red-600 flex items-center gap-2"
                              disabled={user.email === "admin@ejemplo.com"}
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
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron usuarios</p>
            <p className="text-sm">
              {searchTerm || filterRole !== "all" || filterDepartment !== "all" || filterStatus !== "all"
                ? "Intente ajustar los filtros de búsqueda"
                : "Comience creando un nuevo usuario"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}