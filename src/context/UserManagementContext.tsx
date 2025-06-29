import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserManagement, UserManagementData, generateInitialUsers, UserStatus, USER_ROLES } from "@/types/userManagement";
import { toast } from "@/components/ui/sonner";
import { DEFAULT_USER_PERMISSIONS, DEFAULT_ADMIN_PERMISSIONS } from "@/types/user";

interface UserManagementContextType {
  data: UserManagementData;
  addUser: (user: Omit<UserManagement, "id" | "createdAt">) => void;
  updateUser: (userId: string, updates: Partial<UserManagement>) => void;
  deleteUser: (userId: string) => void;
  changeUserStatus: (userId: string, status: UserStatus) => void;
  resetPassword: (userId: string) => void;
  exportToCSV: () => void;
  getUserById: (userId: string) => UserManagement | undefined;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

const initialData: UserManagementData = {
  users: generateInitialUsers(),
  lastUpdated: Date.now(),
};

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<UserManagementData>(() => {
    const saved = localStorage.getItem("user-management-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("user-management-data", JSON.stringify(data));
  }, [data]);

  const getUserById = (userId: string) => {
    return data.users.find(user => user.id === userId);
  };

  const addUser = (user: Omit<UserManagement, "id" | "createdAt">) => {
    // Verificar que el email no esté duplicado
    const existingUser = data.users.find(u => u.email === user.email);
    if (existingUser) {
      toast.error("Ya existe un usuario con este email");
      return;
    }

    // Asignar permisos según el rol
    let permissions = DEFAULT_USER_PERMISSIONS;
    if (user.role === 'admin') {
      permissions = DEFAULT_ADMIN_PERMISSIONS;
    } else {
      // Buscar permisos específicos para el rol
      const roleConfig = USER_ROLES.find(r => r.id === user.role);
      if (roleConfig) {
        permissions = roleConfig.permissions;
      }
    }

    const newUser: UserManagement = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      permissions
    };

    setData(prevData => ({
      ...prevData,
      users: [...prevData.users, newUser],
      lastUpdated: Date.now(),
    }));

    toast.success("Usuario añadido correctamente");
  };

  const updateUser = (userId: string, updates: Partial<UserManagement>) => {
    // Si se está actualizando el email, verificar que no esté duplicado
    if (updates.email) {
      const existingUser = data.users.find(u => u.email === updates.email && u.id !== userId);
      if (existingUser) {
        toast.error("Ya existe un usuario con este email");
        return;
      }
    }

    // Si se está actualizando el rol, actualizar los permisos
    let updatedPermissions = undefined;
    if (updates.role) {
      if (updates.role === 'admin') {
        updatedPermissions = DEFAULT_ADMIN_PERMISSIONS;
      } else {
        const roleConfig = USER_ROLES.find(r => r.id === updates.role);
        if (roleConfig) {
          updatedPermissions = roleConfig.permissions;
        } else {
          updatedPermissions = DEFAULT_USER_PERMISSIONS;
        }
      }
    }

    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(user =>
        user.id === userId
          ? { 
              ...user, 
              ...updates, 
              permissions: updatedPermissions || user.permissions,
              lastActivity: Date.now() 
            }
          : user
      ),
      lastUpdated: Date.now(),
    }));

    toast.success("Usuario actualizado correctamente");
  };

  const deleteUser = (userId: string) => {
    // Verificar que no sea el usuario administrador principal
    const user = data.users.find(u => u.id === userId);
    if (user?.email === "admin@ejemplo.com") {
      toast.error("No se puede eliminar el usuario administrador principal");
      return;
    }

    setData(prevData => ({
      ...prevData,
      users: prevData.users.filter(user => user.id !== userId),
      lastUpdated: Date.now(),
    }));

    toast.success("Usuario eliminado correctamente");
  };

  const changeUserStatus = (userId: string, status: UserStatus) => {
    // Verificar que no sea el usuario administrador principal
    const user = data.users.find(u => u.id === userId);
    if (user?.email === "admin@ejemplo.com" && status !== 'active') {
      toast.error("No se puede cambiar el estado del usuario administrador principal");
      return;
    }

    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(user =>
        user.id === userId
          ? { ...user, status, lastActivity: Date.now() }
          : user
      ),
      lastUpdated: Date.now(),
    }));

    toast.success(`Estado del usuario cambiado a ${status}`);
  };

  const resetPassword = (userId: string) => {
    // En una implementación real, esto enviaría un correo con un enlace para restablecer la contraseña
    // Aquí solo simulamos el proceso
    
    toast.success("Se ha enviado un enlace de restablecimiento de contraseña al correo del usuario");
    
    // Actualizar la última actividad
    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(user =>
        user.id === userId
          ? { ...user, lastActivity: Date.now() }
          : user
      ),
      lastUpdated: Date.now(),
    }));
  };

  const exportToCSV = () => {
    try {
      let csvContent = "ID,Nombre,Email,Rol,Departamento,Estado,Último Acceso,Fecha Creación,ID Empleado,Posición,Teléfono\n";
      
      data.users.forEach(user => {
        const lastLoginDate = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nunca";
        const createdDate = new Date(user.createdAt).toLocaleDateString();
        
        csvContent += `"${user.id}","${user.name}","${user.email}","${user.role}","${user.department || ''}","${user.status}","${lastLoginDate}","${createdDate}","${user.employeeId || ''}","${user.position || ''}","${user.phoneNumber || ''}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `usuarios-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Datos exportados correctamente");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Error al exportar los datos");
    }
  };

  return (
    <UserManagementContext.Provider
      value={{
        data,
        addUser,
        updateUser,
        deleteUser,
        changeUserStatus,
        resetPassword,
        exportToCSV,
        getUserById
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error("useUserManagement must be used within a UserManagementProvider");
  }
  return context;
}