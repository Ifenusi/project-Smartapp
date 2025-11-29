export type UserRole = 'student' | 'doctor' | 'admin';

export interface User {
  id: string;
  fullName: string;
  matricNumber?: string; // Student only
  email: string;
  role: UserRole;
  profilePicUrl?: string;
  phoneNumber?: string;
  department?: string;
  faculty?: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  studentMatric: string;
  reason: string;
  date: string;
  time: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  targetId: string; // lecturer_id or vendor_id
  targetName: string;
  type: 'lecturer' | 'vendor';
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}

export interface Lecturer {
  id: string;
  name: string;
  department: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
}

export interface Course {
  id: string;
  code: string;
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export interface CGPARecord {
  id: string;
  studentId: string;
  semester: string; // e.g., "1st Semester 2023/2024"
  courses: Course[];
  gpa: number;
  createdAt: number;
}

export interface SystemLog {
  id: string;
  action: string;
  details: string;
  timestamp: number;
  type: 'info' | 'error' | 'warning' | 'success';
}

export const DOCTOR_CREDENTIALS = {
  email: 'doc@duty',
  password: 'doc@duty'
};

export const ADMIN_CREDENTIALS = {
  email: 'admin@duty',
  password: 'admin@duty'
};

export const REASONS_FOR_VISIT = [
  'General Checkup',
  'Fever / Headache',
  'Stomach Pain',
  'Injury / Wound',
  'Mental Health Support',
  'Follow-up',
  'Other'
];