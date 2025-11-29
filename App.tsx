import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { getCurrentUser } from './services/api';
import { Layout } from './components/Common';

// Auth Pages
import { StudentLogin, StudentRegister } from './pages/StudentAuth';
import { DoctorLogin } from './pages/DoctorApp';

// Student Pages
import { StudentDashboard, BookAppointment, AppointmentHistory, FutureFeature } from './pages/StudentApp';

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
        <Route path="/" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />

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
        
        {/* Future Features */}
        <Route path="/student/lecturers-review" element={
          <LayoutWrapper title="Reviews">
            <FutureFeature title="Lecturer Reviews" subtitle="Rate and review your learning experience." />
          </LayoutWrapper>
        } />
        <Route path="/student/food-review" element={
          <LayoutWrapper title="Reviews">
            <FutureFeature title="Food Vendor Reviews" subtitle="Find the best food spots on campus." />
          </LayoutWrapper>
        } />
        <Route path="/student/cgpa" element={
          <LayoutWrapper title="CGPA Calculator">
            <FutureFeature title="CGPA Calculator" subtitle="Track your academic performance easily." />
          </LayoutWrapper>
        } />
        <Route path="/student/settings" element={
          <LayoutWrapper title="Settings">
            <FutureFeature title="Settings" subtitle="Manage your profile and preferences." />
          </LayoutWrapper>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <LayoutWrapper>
            <DoctorDashboard />
          </LayoutWrapper>
        } />

      </Routes>
    </HashRouter>
  );
};

export default App;