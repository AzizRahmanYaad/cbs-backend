export interface Training {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  instructor: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  capacity: number;
  enrolled: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingParticipant {
  id: number;
  trainingId: number;
  userId: number;
  enrolledAt: string;
  completionStatus: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';
}
