import { User, Appointment, DOCTOR_CREDENTIALS } from '../types';

const STORAGE_KEY_USERS = 'ssa_users';
const STORAGE_KEY_APPTS = 'ssa_appointments';
const STORAGE_KEY_SESSION = 'ssa_session';

// --- Helper Functions ---
const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEY_APPTS);
  return data ? JSON.parse(data) : [];
};

const saveAppointments = (appts: Appointment[]) => {
  localStorage.setItem(STORAGE_KEY_APPTS, JSON.stringify(appts));
};

// --- Auth Services ---

export const loginStudent = async (matric: string, password: string): Promise<User> => {
  await new Promise(r => setTimeout(r, 600)); // Simulate network delay
  
  const users = getUsers();
  const user = users.find(u => u.matricNumber === matric && u.role === 'student');

  if (!user) {
    throw new Error('Student not found. Please register first.');
  }

  // Password check: Default is surname (lowercase)
  // For this mock, we also check the password stored during registration if available
  // But strictly following prompt: "Password -> Default = Surname (lowercase)"
  // We will assume the registration stores the password and we check against that.
  
  // Extract surname from full name for fallback check if needed
  const surname = user.fullName.split(' ').pop()?.toLowerCase() || '';
  
  // Logic: Check if password matches stored password OR matches surname (if prompt implied dynamic default)
  // The registration page asks for a password, so we should use that.
  // However, the prompt says "Password -> Default = Surname". 
  // We'll support both the registered password AND the surname for ease of use in this demo.
  
  // In a real app, you wouldn't store plain text passwords. This is a mock.
  const storedPassword = (user as any).password; 
  
  if (password !== storedPassword && password.toLowerCase() !== surname) {
    throw new Error('Invalid credentials.');
  }

  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  return user;
};

export const registerStudent = async (data: {
  fullName: string;
  matric: string;
  email: string;
  phone: string;
  password: string;
  profilePic?: string; // Base64 string
}): Promise<User> => {
  await new Promise(r => setTimeout(r, 800));

  const users = getUsers();
  if (users.find(u => u.matricNumber === data.matric)) {
    throw new Error('Matric number already registered.');
  }

  const newUser: User = {
    id: Date.now().toString(),
    fullName: data.fullName,
    matricNumber: data.matric,
    email: data.email,
    phoneNumber: data.phone,
    role: 'student',
    profilePicUrl: data.profilePic || 'https://picsum.photos/200/200',
  };

  // Store password separately/locally for the mock login
  const userWithPass = { ...newUser, password: data.password };
  
  users.push(userWithPass);
  saveUsers(users);
  
  return newUser;
};

export const loginDoctor = async (email: string, password: string): Promise<User> => {
  await new Promise(r => setTimeout(r, 600));

  if (email === DOCTOR_CREDENTIALS.email && password === DOCTOR_CREDENTIALS.password) {
    const doctorUser: User = {
      id: 'doc-001',
      fullName: 'Dr. On Duty',
      email: email,
      role: 'doctor',
      profilePicUrl: 'https://picsum.photos/id/1062/200/200'
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(doctorUser));
    return doctorUser;
  }
  
  throw new Error('Invalid Doctor ID or Password');
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY_SESSION);
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEY_SESSION);
  return data ? JSON.parse(data) : null;
};

// --- Database Services ---

export const bookAppointment = async (student: User, details: {
  reason: string;
  date: string;
  time: string;
  note: string;
}): Promise<Appointment> => {
  await new Promise(r => setTimeout(r, 500));
  
  const appts = getAppointments();
  
  const newAppt: Appointment = {
    id: Date.now().toString(),
    studentId: student.id,
    studentName: student.fullName,
    studentMatric: student.matricNumber || 'N/A',
    status: 'pending',
    createdAt: Date.now(),
    ...details
  };
  
  appts.unshift(newAppt); // Add to top
  saveAppointments(appts);
  return newAppt;
};

export const getStudentAppointments = (studentId: string): Appointment[] => {
  const appts = getAppointments();
  return appts.filter(a => a.studentId === studentId);
};

export const getAllAppointments = (): Appointment[] => {
  return getAppointments();
};

export const updateAppointmentStatus = async (id: string, status: 'accepted' | 'declined'): Promise<void> => {
  await new Promise(r => setTimeout(r, 400));
  const appts = getAppointments();
  const index = appts.findIndex(a => a.id === id);
  if (index !== -1) {
    appts[index].status = status;
    saveAppointments(appts);
  }
};