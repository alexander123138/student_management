
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER'
}

export enum SchoolLevel {
  PRIMARY = 'PRIMARY',
  JHS = 'JHS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  regNumber: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dob: string;
  level: SchoolLevel;
  gradeLevel: string; // e.g., "Class 4" or "Basic 7"
  parentName: string;
  parentPhone: string;
  status: 'active' | 'graduated' | 'inactive';
  photo?: string; // Base64 encoded image string
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subject: string;
  term: 1 | 2 | 3;
  score: number;
  maxScore: number;
  grade: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amountDue: number;
  amountPaid: number;
  lastPaymentDate: string;
  status: 'paid' | 'partial' | 'unpaid';
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'Cash' | 'Mobile Money' | 'Bank Transfer';
  description: string;
  receivedBy: string;
}

export interface FeeStructure {
  id: string;
  gradeLevel: string;
  tuition: number;
  canteen: number;
  others: number;
  total: number;
}

export interface TimetableEntry {
  id: string;
  gradeLevel: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  levels: string[]; // e.g., ['Primary', 'JHS']
}

export interface Exam {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'Main Exam' | 'Assessment' | 'Mock';
  status: 'Upcoming' | 'Grading' | 'Completed';
}
