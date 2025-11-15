export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
  assignedTo: number;
  assignedBy: number;
  dueDate: string;
  startDate?: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
