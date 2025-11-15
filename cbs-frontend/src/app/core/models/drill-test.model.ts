export interface DrillTest {
  id: number;
  title: string;
  description: string;
  testDate: string;
  duration: number;
  passingScore: number;
  maxAttempts: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface DrillTestAttempt {
  id: number;
  drillTestId: number;
  userId: number;
  attemptNumber: number;
  score: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  answers: any;
}
