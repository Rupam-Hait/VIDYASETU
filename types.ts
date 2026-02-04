
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  class?: string; // For students/teachers
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  type: 'academic' | 'event' | 'transport';
}

export interface StudentStats {
  attendance: number;
  avgGrade: string;
  pendingFees: number;
}

export interface RAGDocument {
  id: string;
  category: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of the correct option
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export interface ClassSession {
  id: string;
  title: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  duration: number; // minutes
  status: 'scheduled' | 'live' | 'ended';
  attendees: number;
}