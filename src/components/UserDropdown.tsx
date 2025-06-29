import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { UserManagement } from "@/types/userManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showRole?: boolean;
  showDepartment?: boolean;
  showOnlyActive?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function UserDropdown({
  value,
  onValueChange,
  placeholder = "Seleccionar usuario",
  label,
  showRole = true,
  showDepartment = true,
  showOnlyActive = true,
  className,
  disabled = false,
  required = false,
}: UserDropdownProps) {
  const [users, setUsers] = useState<UserManagement[]>([]);

  useEffect(() => {
    // Cargar usuarios desde localStorage
    const loadUsers = () => {
      try {
        const savedData = localStorage.getItem("user-management-data");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          let filteredUsers = parsedData.users || [];
          
          // Filtrar solo usuarios activos si es necesario
          if (showOnlyActive) {
            filteredUsers = filteredUsers.filter((user: UserManagement) => user.status === 'active');
          }
          
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error loading users:", error);
        setUsers([]);
      }
    };

    loadUsers();
  }, [showOnlyActive]);

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Obtener color de rol
  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {users.length > 0 ? (
          users.map((user) => (
            <SelectItem key={user.id} value={user.id} className="py-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.name}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {showRole && (
                      <Badge variant="outline" className={cn("text-xs py-0 px-1", getRoleColor(user.role))}>
                        {user.role === 'admin' ? 'Admin' : 'Usuario'}
                      </Badge>
                    )}
                    {showDepartment && user.department && (
                      <span>{user.department}</span>
                    )}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="py-2 px-2 text-sm text-gray-500 text-center">
            No hay usuarios disponibles
          </div>
        )}
      </SelectContent>
    </Select>
  );
}