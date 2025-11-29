import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { getCurrentUser } from './services/api';
import { Layout } from './components/Common';

// Auth Pages
import { LandingPage } from './pages/StudentAuth';
import { DoctorLogin } from './pages/DoctorApp';
import { AdminLogin, AdminDashboard } from './pages/AdminApp';

// Student Pages
import { 
  StudentDashboard, BookAppointment, 
  LecturerReview, VendorReview, 
  CGPACalculator, Settings 
} from './pages/StudentApp';
import { AppointmentHistory } from './pages/StudentApp'; // Reusing from previous if available or export it

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
        {/* Public Routes */}
        <Route path="/" element={<LayoutWrapper><LandingPage /></LayoutWrapper>} />
        
        {/* Doctor Routes */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<LayoutWrapper><DoctorDashboard /></LayoutWrapper>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<LayoutWrapper title="Admin Panel"><AdminDashboard /></LayoutWrapper>} />

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