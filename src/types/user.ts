export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department?: string;
  permissions: UserPermissions;
  createdAt: number;
  lastLogin?: number;
}

export interface UserPermissions {
  // Permisos básicos (ambos roles)
  canRecordPestIncidence: boolean;
  canRecordPathogenIncidence: boolean;
  canUpdateLocation: boolean;
  canRegisterSupplyPossession: boolean;
  canRegisterToolPossession: boolean;
  canUseFacialRecognition: boolean;
  canViewDashboard: boolean;
  canExportData: boolean;

  // Permisos de administrador
  canManageUsers?: boolean;
  canManageLocations?: boolean;
  canManageSupplyDatabase?: boolean;
  canManageToolDatabase?: boolean;
  canAssignActivities?: boolean;
  canViewAllRecords?: boolean;
  canManageSystemSettings?: boolean;
  canAccessAdminPanel?: boolean;
}

export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  canRecordPestIncidence: true,
  canRecordPathogenIncidence: true,
  canUpdateLocation: true,
  canRegisterSupplyPossession: true,
  canRegisterToolPossession: true,
  canUseFacialRecognition: true,
  canViewDashboard: true,
  canExportData: true,
};

export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  ...DEFAULT_USER_PERMISSIONS,
  canManageUsers: true,
  canManageLocations: true,
  canManageSupplyDatabase: true,
  canManageToolDatabase: true,
  canAssignActivities: true,
  canViewAllRecords: true,
  canManageSystemSettings: true,
  canAccessAdminPanel: true,
};

export const DEMO_USERS: User[] = [
  {
    id: "admin001",
    name: "Administrador Sistema",
    email: "admin@ejemplo.com",
    role: "admin",
    department: "Administración",
    permissions: DEFAULT_ADMIN_PERMISSIONS,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
    lastLogin: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: "user001",
    name: "Roberto Sánchez",
    email: "usuario@ejemplo.com",
    role: "user",
    department: "Campo",
    permissions: DEFAULT_USER_PERMISSIONS,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
    lastLogin: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  }
];