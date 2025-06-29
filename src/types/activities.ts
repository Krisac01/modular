export interface Activity {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: number;
  estimatedTime: string;
  assignedBy: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  category: ActivityCategory;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  notes?: string;
  attachments?: string[];
}

export type ActivityCategory = 
  | 'inspection'
  | 'maintenance'
  | 'application'
  | 'collection'
  | 'cleaning'
  | 'training'
  | 'other';

export const ACTIVITY_CATEGORIES = [
  { id: 'inspection', name: 'Inspección', color: 'bg-blue-500', icon: '🔍' },
  { id: 'maintenance', name: 'Mantenimiento', color: 'bg-orange-500', icon: '🔧' },
  { id: 'application', name: 'Aplicación', color: 'bg-green-500', icon: '🌱' },
  { id: 'collection', name: 'Recolección', color: 'bg-amber-500', icon: '🧺' },
  { id: 'cleaning', name: 'Limpieza', color: 'bg-cyan-500', icon: '🧹' },
  { id: 'training', name: 'Capacitación', color: 'bg-purple-500', icon: '📚' },
  { id: 'other', name: 'Otro', color: 'bg-gray-500', icon: '📋' }
];

export interface ActivityData {
  activities: Activity[];
  lastUpdated: number;
}