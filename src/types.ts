export type ViewState = 'start' | 'quiz' | 'result' | 'teacher_login' | 'teacher_dashboard';

export interface StudentInfo {
  name: string;
  className: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface StudentResult {
  id?: string;
  name: string;
  className: string;
  score: number;
  timeTaken: number;
  createdAt: any;
}
