export interface DailyReport {
  id: number;
  reportDate: string;
  userId: number;
  summary: string;
  hoursWorked: number;
  tasksCompleted: string;
  challenges: string;
  nextDayPlan: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}
