import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import 'aos/dist/aos.css';
import './css/style.css';

import AOS from 'aos';

// Ana sayfalar
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';

// Öğrenci sayfaları
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentPortfolio from './pages/student/Portfolio';
import StudentAddProject from './pages/student/AddProject';
import StudentEditProject from './pages/student/EditProject';
import StudentJobs from './pages/student/Jobs';
import StudentJobDetail from './pages/student/JobDetail';
import StudentSettings from './pages/student/Settings';
import StudentMessage from './pages/student/Messages';

// İşveren sayfaları
import EmployerDashboard from './pages/employer/Dashboard';

// Admin sayfaları
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminStudentDetail from './pages/admin/AdminStudentDetail';
import AdminPendingStudents from './pages/admin/AdminStudents';
import AdminEmployers from './pages/admin/Employers';
import AdminJobs from './pages/admin/Jobs';
import AdminJobAssignment from './pages/admin/JobAssignment';
import AdminMessages from './pages/admin/Messages';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected student routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute requiredRole="student">
            <StudentProfile />
          </ProtectedRoute>
        } />
        <Route path="/student/portfolio" element={
          <ProtectedRoute requiredRole="student">
            <StudentPortfolio />
          </ProtectedRoute>
        } />
        <Route path="/student/portfolio/add" element={
          <ProtectedRoute requiredRole="student">
            <StudentAddProject />
          </ProtectedRoute>
        } />
        <Route path="/student/portfolio/edit/:id" element={
          <ProtectedRoute requiredRole="student">
            <StudentEditProject />
          </ProtectedRoute>
        } />
        <Route path="/student/jobs" element={
          <ProtectedRoute requiredRole="student">
            <StudentJobs />
          </ProtectedRoute>
        } />
        <Route path="/student/jobs/:id" element={
          <ProtectedRoute requiredRole="student">
            <StudentJobDetail />
          </ProtectedRoute>
        } />
         <Route path="/student/messages" element={
          <ProtectedRoute requiredRole="student">
            <StudentMessage />
          </ProtectedRoute>
        } />
        <Route path="/student/settings" element={
          <ProtectedRoute requiredRole="student">
            <StudentSettings />
          </ProtectedRoute>
        } />
        
        {/* Protected employer routes */}
        <Route path="/employer/dashboard" element={
          <ProtectedRoute requiredRole="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute requiredRole="admin">
            <AdminStudents />
          </ProtectedRoute>
        } />
        <Route path="/admin/students/pending" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPendingStudents />
          </ProtectedRoute>
        } />
        <Route path="/admin/students/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminStudentDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/employers" element={
          <ProtectedRoute requiredRole="admin">
            <AdminEmployers />
          </ProtectedRoute>
        } />
        <Route path="/admin/jobs" element={
          <ProtectedRoute requiredRole="admin">
            <AdminJobs />
          </ProtectedRoute>
        } />
        <Route path="/admin/jobs/assign" element={
          <ProtectedRoute requiredRole="admin">
            <AdminJobAssignment />
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute requiredRole="admin">
            <AdminMessages />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;