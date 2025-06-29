import { User, UserPermissions, DEFAULT_USER_PERMISSIONS, DEFAULT_ADMIN_PERMISSIONS } from "./user";

export interface UserManagement extends User {
  status: UserStatus;
  lastActivity?: number;
  notes?: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  employeeId?: string;
  hireDate?: number;
  position?: string;
  supervisor?: string;
  trainingCompleted?: string[];
  certifications?: string[];
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserManagementData {
  users: UserManagement[];
  lastUpdated: number;
}

// Roles predefinidos con permisos específicos
export const USER_ROLES = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    permissions: DEFAULT_ADMIN_PERMISSIONS,
    color: 'bg-red-500'
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Gestión de actividades y visualización de datos',
    permissions: {
      ...DEFAULT_USER_PERMISSIONS,
      canManageActivities: true,
      canViewAllRecords: true,
      canAccessAdminPanel: true
    },
    color: 'bg-orange-500'
  },
  {
    id: 'technician',
    name: 'Técnico',
    description: 'Registro de datos y acceso a herramientas',
    permissions: {
      ...DEFAULT_USER_PERMISSIONS,
      canViewAllRecords: false
    },
    color: 'bg-blue-500'
  },
  {
    id: 'fieldWorker',
    name: 'Trabajador de Campo',
    description: 'Registro básico de datos',
    permissions: {
      ...DEFAULT_USER_PERMISSIONS,
      canExportData: false,
      canViewDashboard: false
    },
    color: 'bg-green-500'
  },
  {
    id: 'guest',
    name: 'Invitado',
    description: 'Acceso limitado de solo lectura',
    permissions: {
      canRecordPestIncidence: false,
      canRecordPathogenIncidence: false,
      canUpdateLocation: false,
      canRegisterSupplyPossession: false,
      canRegisterToolPossession: false,
      canUseFacialRecognition: false,
      canViewDashboard: true,
      canExportData: false
    },
    color: 'bg-gray-500'
  }
];

// Departamentos predefinidos
export const DEPARTMENTS = [
  'Administración',
  'Campo',
  'Invernadero',
  'Control Fitosanitario',
  'Mantenimiento',
  'Producción',
  'Laboratorio',
  'Logística',
  'Calidad',
  'Otro'
];

// Generar usuarios iniciales para demostración
export const generateInitialUsers = (): UserManagement[] => {
  return [
    {
      id: "admin001",
      name: "Administrador Sistema",
      email: "admin@ejemplo.com",
      role: "admin",
      department: "Administración",
      permissions: DEFAULT_ADMIN_PERMISSIONS,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
      lastLogin: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      status: 'active',
      lastActivity: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      employeeId: "EMP001",
      position: "Administrador de Sistema",
      hireDate: Date.now() - 1000 * 60 * 60 * 24 * 365, // 1 year ago
      phoneNumber: "+1234567890",
      trainingCompleted: ["Seguridad Informática", "Administración de Sistemas", "Gestión de Datos"],
      certifications: ["Certificación en Administración de Sistemas Agrícolas"]
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
      status: 'active',
      lastActivity: Date.now() - 1000 * 60 * 10, // 10 minutes ago
      employeeId: "EMP002",
      position: "Técnico de Campo",
      hireDate: Date.now() - 1000 * 60 * 60 * 24 * 180, // 6 months ago
      phoneNumber: "+0987654321"
    },
    {
      id: "user002",
      name: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
      role: "user",
      department: "Invernadero",
      permissions: DEFAULT_USER_PERMISSIONS,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45, // 45 days ago
      lastLogin: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      status: 'active',
      lastActivity: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      employeeId: "EMP003",
      position: "Técnico de Invernadero",
      hireDate: Date.now() - 1000 * 60 * 60 * 24 * 200 // 200 days ago
    },
    {
      id: "user003",
      name: "María González",
      email: "maria.gonzalez@ejemplo.com",
      role: "user",
      department: "Control Fitosanitario",
      permissions: {
        ...DEFAULT_USER_PERMISSIONS,
        canViewAllRecords: true
      },
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60, // 60 days ago
      lastLogin: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
      status: 'active',
      lastActivity: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
      employeeId: "EMP004",
      position: "Especialista en Control de Plagas",
      hireDate: Date.now() - 1000 * 60 * 60 * 24 * 250 // 250 days ago
    },
    {
      id: "user004",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@ejemplo.com",
      role: "user",
      department: "Mantenimiento",
      permissions: DEFAULT_USER_PERMISSIONS,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20, // 20 days ago
      lastLogin: Date.now() - 1000 * 60 * 60 * 48, // 48 hours ago
      status: 'inactive',
      lastActivity: Date.now() - 1000 * 60 * 60 * 48, // 48 hours ago
      employeeId: "EMP005",
      position: "Técnico de Mantenimiento",
      hireDate: Date.now() - 1000 * 60 * 60 * 24 * 150 // 150 days ago
    },
    {
      id: "supervisor001",
      name: "Ana López",
      email: "ana.lopez@ejemplo.com",
      role: "admin", // Rol de supervisor con permisos especiales
      department: "Producción",
      permissions: {
        ...DEFAULT_USER_PERMISSIONS,
        canManageActivities: true,
        canViewAllRecords: true,
        canAccessAdminPanel: true
      },
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90, // 90 days ago
      lastLogin: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
      status: 'active',
      lastActivity: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
      employeeId: "EMP006",
      position: "Supervisora de Producción",
      hireDate: Date.now() - 1000 * 60 * 60 * 24 * 300, // 300 days ago
      phoneNumber: "+1122334455",
      supervisor: "Administrador Sistema"
    }
  ];
};