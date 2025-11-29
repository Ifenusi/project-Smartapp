import { User, Appointment, Review, Lecturer, Vendor, CGPARecord, SystemLog, DOCTOR_CREDENTIALS, ADMIN_CREDENTIALS } from '../types';

const STORAGE_KEY_USERS = 'ssa_users';
const STORAGE_KEY_APPTS = 'ssa_appointments';
const STORAGE_KEY_SESSION = 'ssa_session';
const STORAGE_KEY_REVIEWS = 'ssa_reviews';
const STORAGE_KEY_CGPA = 'ssa_cgpa';
const STORAGE_KEY_LECTURERS = 'ssa_lecturers';
const STORAGE_KEY_VENDORS = 'ssa_vendors';
const STORAGE_KEY_LOGS = 'ssa_logs';

// --- Initial Data ---
const INITIAL_LECTURERS: Lecturer[] = [
  { id: 'l1', name: 'Dr. John Smith', department: 'Computer Science' },
  { id: 'l2', name: 'Prof. Sarah Johnson', department: 'Mass Communication' },
  { id: 'l3', name: 'Mr. David Lee', department: 'Business Admin' },
];

const INITIAL_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Mama T Restaurant', location: 'Student Center' },
  { id: 'v2', name: 'Campus Snacks', location: 'Hostel A' },
  { id: 'v3', name: 'Spicy Kitchen', location: 'Main Gate' },
];

// --- Helper Functions ---
const getStorageData = <T>(key: string, defaultData: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultData;
};

const setStorageData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Logging Service ---
export const logActivity = (action: string, details: string, type: SystemLog['type'] = 'info') => {
  const logs = getStorageData<SystemLog[]>(STORAGE_KEY_LOGS, []);
  const newLog: SystemLog = {
    id: Date.now().toString() + Math.random(),
    action,
    details,
    timestamp: Date.now(),
    type
  };
  logs.unshift(newLog);
  // Keep only last 100 logs
  if (logs.length > 100) logs.pop();
  setStorageData(STORAGE_KEY_LOGS, logs);
};

export const getSystemLogs = (): SystemLog[] => {
  return getStorageData<SystemLog[]>(STORAGE_KEY_LOGS, []);
};

// --- Auth Services ---

export const loginStudent = async (matric: string, password: string): Promise<User> => {
  await new Promise(r => setTimeout(r, 600)); 
  
  const users = getStorageData<User[]>(STORAGE_KEY_USERS, []);
  const user = users.find(u => u.matricNumber === matric && u.role === 'student');

  if (!user) {
    throw new Error('Student not found. Please register first.');
  }

  // Check against registered password OR surname (lowercase) as default
  const storedPassword = (user as any).password;
  const surname = user.fullName.split(' ').pop()?.toLowerCase() || '';
  
  if (password !== storedPassword && password.toLowerCase() !== surname) {
    throw new Error('Invalid credentials.');
  }

  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  logActivity('Student Login', `User ${user.fullName} (${user.matricNumber}) logged in`, 'success');
  return user;
};

export const registerStudent = async (data: {
  fullName: string;
  matric: string;
  email: string;
  phone: string;
  password: string;
  profilePic?: string; 
}): Promise<User> => {
  await new Promise(r => setTimeout(r, 800));

  const users = getStorageData<User[]>(STORAGE_KEY_USERS, []);
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
    profilePicUrl: data.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + data.matric,
    department: 'Computer Science', // Default for MVP
    faculty: 'Computing', // Default for MVP
  };

  const userWithPass = { ...newUser, password: data.password };
  
  users.push(userWithPass);
  setStorageData(STORAGE_KEY_USERS, users);
  
  logActivity('New Registration', `Student ${data.fullName} registered`, 'info');
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
      profilePicUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor'
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(doctorUser));
    logActivity('Doctor Login', 'Doctor On Duty logged in', 'success');
    return doctorUser;
  }
  
  logActivity('Failed Doctor Login', `Attempted with email: ${email}`, 'error');
  throw new Error('Invalid Doctor Credentials');
};

export const loginAdmin = async (email: string, password: string): Promise<User> => {
  await new Promise(r => setTimeout(r, 600));

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const adminUser: User = {
      id: 'admin-001',
      fullName: 'System Administrator',
      email: email,
      role: 'admin',
      profilePicUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(adminUser));
    logActivity('Admin Login', 'System Admin logged in', 'success');
    return adminUser;
  }
  
  logActivity('Failed Admin Login', `Attempted with email: ${email}`, 'error');
  throw new Error('Invalid Admin Credentials');
};

export const logout = () => {
  const user = getCurrentUser();
  if (user) {
     logActivity('Logout', `${user.role} ${user.fullName} logged out`, 'info');
  }
  localStorage.removeItem(STORAGE_KEY_SESSION);
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEY_SESSION);
  return data ? JSON.parse(data) : null;
};

export const updateStudentProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  await new Promise(r => setTimeout(r, 500));
  const users = getStorageData<User[]>(STORAGE_KEY_USERS, []);
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) throw new Error("User not found");
  
  // Prevent editing of restricted fields
  const safeUpdates = { ...updates };
  delete safeUpdates.matricNumber;
  delete safeUpdates.department;
  delete safeUpdates.faculty;
  delete safeUpdates.role;
  delete safeUpdates.id;

  const updatedUser = { ...users[index], ...safeUpdates };
  users[index] = updatedUser;
  setStorageData(STORAGE_KEY_USERS, users);
  
  // Update session if it's the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser));
  }

  logActivity('Profile Update', `User ${updatedUser.fullName} updated profile`, 'info');
  return updatedUser;
};

// --- Admin Student Management ---

export const getAllStudents = (): User[] => {
  const users = getStorageData<User[]>(STORAGE_KEY_USERS, []);
  return users.filter(u => u.role === 'student');
};

export const deleteStudent = async (studentId: string): Promise<void> => {
  await new Promise(r => setTimeout(r, 500));
  let users = getStorageData<User[]>(STORAGE_KEY_USERS, []);
  const student = users.find(u => u.id === studentId);
  users = users.filter(u => u.id !== studentId);
  setStorageData(STORAGE_KEY_USERS, users);
  
  if (student) {
    logActivity('Student Deleted', `Admin deleted student: ${student.fullName} (${student.matricNumber})`, 'warning');
  }
};

export const resetStudentPassword = async (studentId: string): Promise<void> => {
  await new Promise(r => setTimeout(r, 500));
  const users = getStorageData<User[]>(STORAGE_KEY_USERS, []);
  const index = users.findIndex(u => u.id === studentId);
  
  if (index !== -1) {
    const student = users[index];
    const surname = student.fullName.split(' ').pop()?.toLowerCase() || 'password';
    // Cast to any to access the password field we store internally
    (users[index] as any).password = surname;
    setStorageData(STORAGE_KEY_USERS, users);
    logActivity('Password Reset', `Admin reset password for: ${student.fullName}`, 'warning');
  }
};

// --- Appointment Services ---

export const bookAppointment = async (student: User, details: {
  reason: string;
  date: string;
  time: string;
  note: string;
}): Promise<Appointment> => {
  await new Promise(r => setTimeout(r, 500));
  
  const appts = getStorageData<Appointment[]>(STORAGE_KEY_APPTS, []);
  
  const newAppt: Appointment = {
    id: Date.now().toString(),
    studentId: student.id,
    studentName: student.fullName,
    studentMatric: student.matricNumber || 'N/A',
    status: 'pending',
    createdAt: Date.now(),
    ...details
  };
  
  appts.unshift(newAppt);
  setStorageData(STORAGE_KEY_APPTS, appts);
  logActivity('Appointment Booked', `Student ${student.matricNumber} booked appointment for ${details.reason}`, 'info');
  return newAppt;
};

export const getStudentAppointments = (studentId: string): Appointment[] => {
  const appts = getStorageData<Appointment[]>(STORAGE_KEY_APPTS, []);
  return appts.filter(a => a.studentId === studentId);
};

export const getAllAppointments = (): Appointment[] => {
  return getStorageData<Appointment[]>(STORAGE_KEY_APPTS, []);
};

export const updateAppointmentStatus = async (id: string, status: 'accepted' | 'declined'): Promise<void> => {
  await new Promise(r => setTimeout(r, 400));
  const appts = getStorageData<Appointment[]>(STORAGE_KEY_APPTS, []);
  const index = appts.findIndex(a => a.id === id);
  if (index !== -1) {
    appts[index].status = status;
    setStorageData(STORAGE_KEY_APPTS, appts);
    logActivity('Appointment Status Update', `Appointment ${id} marked as ${status}`, 'info');
  }
};

// --- Review Services (Lecturers & Food Vendors) ---

export const getLecturers = (): Lecturer[] => {
  return getStorageData<Lecturer[]>(STORAGE_KEY_LECTURERS, INITIAL_LECTURERS);
};

export const getVendors = (): Vendor[] => {
  return getStorageData<Vendor[]>(STORAGE_KEY_VENDORS, INITIAL_VENDORS);
};

export const submitReview = async (review: Omit<Review, 'id' | 'createdAt' | 'studentName'>, studentName: string): Promise<Review> => {
  await new Promise(r => setTimeout(r, 500));
  const reviews = getStorageData<Review[]>(STORAGE_KEY_REVIEWS, []);
  
  const newReview: Review = {
    id: Date.now().toString(),
    studentName,
    createdAt: Date.now(),
    ...review
  };
  
  reviews.unshift(newReview);
  setStorageData(STORAGE_KEY_REVIEWS, reviews);
  logActivity('New Review', `Student reviewed ${review.targetName}`, 'info');
  return newReview;
};

export const getReviews = (type?: 'lecturer' | 'vendor'): Review[] => {
  const reviews = getStorageData<Review[]>(STORAGE_KEY_REVIEWS, []);
  if (type) return reviews.filter(r => r.type === type);
  return reviews;
};

export const deleteReview = async (id: string): Promise<void> => {
  let reviews = getStorageData<Review[]>(STORAGE_KEY_REVIEWS, []);
  reviews = reviews.filter(r => r.id !== id);
  setStorageData(STORAGE_KEY_REVIEWS, reviews);
  logActivity('Review Deleted', `Review ${id} deleted by Admin`, 'warning');
};

// --- CGPA Services ---

export const saveCGPARecord = async (record: Omit<CGPARecord, 'id' | 'createdAt'>): Promise<CGPARecord> => {
  await new Promise(r => setTimeout(r, 500));
  const records = getStorageData<CGPARecord[]>(STORAGE_KEY_CGPA, []);
  
  const newRecord: CGPARecord = {
    id: Date.now().toString(),
    createdAt: Date.now(),
    ...record
  };
  
  records.unshift(newRecord);
  setStorageData(STORAGE_KEY_CGPA, records);
  return newRecord;
};

export const getStudentCGPARecords = (studentId: string): CGPARecord[] => {
  const records = getStorageData<CGPARecord[]>(STORAGE_KEY_CGPA, []);
  return records.filter(r => r.studentId === studentId);
};

// --- Admin Services ---
export const addLecturer = (name: string, dept: string) => {
  const list = getLecturers();
  list.push({ id: Date.now().toString(), name, department: dept });
  setStorageData(STORAGE_KEY_LECTURERS, list);
  logActivity('Lecturer Added', `Added ${name}`, 'info');
};

export const deleteLecturer = (id: string) => {
  const list = getLecturers().filter(l => l.id !== id);
  setStorageData(STORAGE_KEY_LECTURERS, list);
};

export const addVendor = (name: string, loc: string) => {
  const list = getVendors();
  list.push({ id: Date.now().toString(), name, location: loc });
  setStorageData(STORAGE_KEY_VENDORS, list);
  logActivity('Vendor Added', `Added ${name}`, 'info');
};

export const deleteVendor = (id: string) => {
  const list = getVendors().filter(v => v.id !== id);
  setStorageData(STORAGE_KEY_VENDORS, list);
};