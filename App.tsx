import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { getCurrentUser } from './services/api';
import { Layout } from './components/Common';

// Auth Pages
import { UnifiedLogin } from './pages/StudentAuth';
import { AdminDashboard } from './pages/AdminApp';

// Student Pages
import { 
  StudentDashboard, BookAppointment, 
  LecturerReview, VendorReview, 
  CGPACalculator, Settings 
} from './pages/StudentApp';
import { AppointmentHistory } from './pages/StudentApp';

// Doctor Pages
import { DoctorDashboard } from './pages/DoctorApp';

// Wrapper to inject Layout based on route/user
const LayoutWrapper: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const user = getCurrentUser();
  return <Layout user={user} title={title}>{children}</Layout>;
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Unified Login */}
        <Route path="/" element={<LayoutWrapper><UnifiedLogin /></LayoutWrapper>} />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<LayoutWrapper><DoctorDashboard /></LayoutWrapper>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<LayoutWrapper title="Admin Console"><AdminDashboard /></LayoutWrapper>} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <LayoutWrapper title="Dashboard">
            <StudentDashboard />
          </LayoutWrapper>
        } />
        <Route path="/student/book" element={
          <LayoutWrapper title="Book Appointment">
            <BookAppointment />
          </LayoutWrapper>
        } />
        <Route path="/student/history" element={
          <LayoutWrapper title="History">
            <AppointmentHistory />
          </LayoutWrapper>
        } />
        
        {/* Feature Routes */}
        <Route path="/student/lecturers-review" element={
          <LayoutWrapper title="Review Lecturers">
            <LecturerReview />
          </LayoutWrapper>
        } />
        <Route path="/student/food-review" element={
          <LayoutWrapper title="Review Vendors">
            <VendorReview />
          </LayoutWrapper>
        } />
        <Route path="/student/cgpa" element={
          <LayoutWrapper title="CGPA Calculator">
            <CGPACalculator />
          </LayoutWrapper>
        } />
        <Route path="/student/settings" element={
          <LayoutWrapper title="Account Settings">
            <Settings />
          </LayoutWrapper>
        } />

      </Routes>
    </HashRouter>
  );
};

export default App;