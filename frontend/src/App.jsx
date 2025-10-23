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
import StudentSignUp  from './pages/StudentSignUp';
import EmployerSignUp from './pages/EmployerSignUp';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';


// Öğrenci sayfaları
import StudentDashboard from './pages/student/Dashboard';


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
import AdminEvents from './pages/admin/Events';
import AdminCreateEvent from './pages/admin/CreateEvent';
import AdminEditEvent from './pages/admin/EditEvent';
import AdminProjectIdeas from './pages/admin/ProjectIdeas';
import AdminCreateProjectIdea from './pages/admin/CreateProjectIdea';
import AdminEditProjectIdea from './pages/admin/EditProjectIdea';
import AdminDeveloperRequests from './pages/admin/DeveloperRequests';
import AdminDeveloperRequestDetail from './pages/admin/DeveloperRequestDetail';
import AdminEmployerDetail from './pages/admin/EmployerDetail';
import AdminTalentSearch from './pages/admin/AdminTalentSearch';
import AdminTalentDetail from './pages/admin/AdminTalentDetail';

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
        <Route path="/student/signup" element={<StudentSignUp  />} />
        <Route path="/employer/signup" element={<EmployerSignUp  />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />


        {/* Protected student routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
       
        
        
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
        <Route path="/admin/events" element={
          <ProtectedRoute requiredRole="admin">
            <AdminEvents />
          </ProtectedRoute>
        } />
        <Route path="/admin/events/create" element={
          <ProtectedRoute requiredRole="admin">
            <AdminCreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/admin/events/edit/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminEditEvent />
          </ProtectedRoute>
        } />
        <Route path="/admin/project-ideas" element={
          <ProtectedRoute requiredRole="admin">
            <AdminProjectIdeas />
          </ProtectedRoute>
        } />
        <Route path="/admin/project-ideas/create" element={
          <ProtectedRoute requiredRole="admin">
            <AdminCreateProjectIdea />
          </ProtectedRoute>
        } />
        <Route path="/admin/project-ideas/edit/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminEditProjectIdea />
          </ProtectedRoute>
        } />
        <Route path="/admin/developer-requests" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDeveloperRequests />
          </ProtectedRoute>
        } />
        <Route path="/admin/developer-requests/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDeveloperRequestDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/employers/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminEmployerDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/talent-search" element={
          <ProtectedRoute requiredRole="admin">
            <AdminTalentSearch />
          </ProtectedRoute>
        } />
        <Route path="/admin/talent/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminTalentDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;