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
import StudentEvents from './pages/student/Events';
import StudentEventDetail from './pages/student/EventDetail';
import StudentProjectIdeas from './pages/student/ProjectIdeas';
import StudentProjectIdeaDetail from './pages/student/ProjectIdeaDetail';

// İşveren sayfaları
import EmployerDashboard from './pages/employer/Dashboard';
import EmployerProfile from './pages/employer/Profile';
import EmployerJobs from './pages/employer/Jops';
import CreateJob from './pages/employer/CreateJob';
import EmployerJobDetail from './pages/employer/JobDetail';
import EmployerMessages from './pages/employer/Messages';
import DeveloperRequestForm from './pages/employer/DeveloperRequestForm';
import DeveloperRequests from './pages/employer/DeveloperRequests';
import DeveloperRequestDetail from './pages/employer/DeveloperRequestDetail';
import DeveloperRequestEdit from './pages/employer/DeveloperRequestEdit';


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

//test
import Test from './test';


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
        <Route path="/student/events" element={
          <ProtectedRoute requiredRole="student">
            <StudentEvents />
          </ProtectedRoute>
        } />
        <Route path="/student/events/:id" element={
          <ProtectedRoute requiredRole="student">
            <StudentEventDetail />
          </ProtectedRoute>
        } />
        <Route path="/student/settings" element={
          <ProtectedRoute requiredRole="student">
            <StudentSettings />
          </ProtectedRoute>
        } />

        <Route path="/student/project-ideas" element={
          <ProtectedRoute requiredRole="student">
            <StudentProjectIdeas />
          </ProtectedRoute>
        } />
        <Route path="/student/project-ideas/:id" element={
          <ProtectedRoute requiredRole="student">
            <StudentProjectIdeaDetail />
          </ProtectedRoute>
        } />

        <Route path="/employer/dashboard" element={
          <ProtectedRoute requiredRole="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employer/profile" element={
          <ProtectedRoute requiredRole="employer">
            <EmployerProfile />
          </ProtectedRoute>
        } />
        <Route path="/employer/jobs" element={
          <ProtectedRoute requiredRole="employer">
            <EmployerJobs />
          </ProtectedRoute>
        } />
        <Route path="/employer/jobs/create" element={
          <ProtectedRoute requiredRole="employer">
            <CreateJob />
          </ProtectedRoute>
        } />
        <Route path="/employer/jobs/:id" element={
          <ProtectedRoute requiredRole="employer">
            <EmployerJobDetail />
          </ProtectedRoute>
        } />
        <Route path="/employer/messages" element={
          <ProtectedRoute requiredRole="employer">
            <EmployerMessages />
          </ProtectedRoute>
        } />

        <Route path="/employer/developer-request" element={
          <ProtectedRoute requiredRole="employer">
            <DeveloperRequestForm />
          </ProtectedRoute>
        } />
        <Route path="/employer/developer-requests" element={
          <ProtectedRoute requiredRole="employer">
            <DeveloperRequests />
          </ProtectedRoute>
        } />
        <Route path="/employer/developer-requests/:id" element={
          <ProtectedRoute requiredRole="employer">
            <DeveloperRequestDetail />
          </ProtectedRoute>
        } />
        <Route path="/employer/developer-requests/:id/edit" element={
          <ProtectedRoute requiredRole="employer">
            <DeveloperRequestEdit />
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

        <Route path="/test" element={<Test />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;