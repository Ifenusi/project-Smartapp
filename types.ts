export type UserRole = 'student' | 'doctor';

export interface User {
  id: string;
  fullName: string;
  matricNumber?: string; // Student only
  email: string;
  role: UserRole;
  profilePicUrl?: string;
  phoneNumber?: string;
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

export const DOCTOR_CREDENTIALS = {
  email: 'doc@duty',
  password: 'doc@duty'
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