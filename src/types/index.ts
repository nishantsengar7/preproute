export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'candidate';
  avatarUrl?: string;
  createdAt: string;
}

export interface Option {
  id: string;
  text: string;
}

export type QuestionType = 'single' | 'multiple' | 'boolean' | 'text';

export interface Question {
  id: string;
  testId: string;
  text: string;
  type: QuestionType;
  options: Option[];
  correctOptionIds: string[]; // For single/multiple/boolean
  points: number;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

export type TestStatus = 'draft' | 'published' | 'archived';

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  passingScore: number; // in percentage
  status: TestStatus;
  questionsCount: number;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  subject?: string;
  topic?: string;
  subTopic?: string;
  difficulty?: 'easy' | 'medium' | 'difficult';
  wrongAnswer?: number;
  unattempted?: number;
  correctAnswer?: number;
  totalMarks?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
