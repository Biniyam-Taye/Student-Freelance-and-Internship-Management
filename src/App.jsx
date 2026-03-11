import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import SuccessStoriesPage from './pages/public/SuccessStoriesPage';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Route guard
import ProtectedRoute from './routes/ProtectedRoute';

// Student pages
import StudentOverview from './pages/student/StudentOverview';
import BrowseOpportunities from './pages/student/BrowseOpportunities';
import StudentApplications from './pages/student/StudentApplications';
import StudentTasks from './pages/student/StudentTasks';
import StudentSkills from './pages/student/StudentSkills';
import StudentMessages from './pages/student/StudentMessages';
import StudentProfile from './pages/student/StudentProfile';

// Recruiter pages
import RecruiterOverview from './pages/recruiter/RecruiterOverview';
import PostOpportunity from './pages/recruiter/PostOpportunity';
import MyPosts from './pages/recruiter/MyPosts';
import RecruiterApplications from './pages/recruiter/RecruiterApplications';
import AssignedTasks from './pages/recruiter/AssignedTasks';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import ManageSupervisors from './pages/recruiter/ManageSupervisors';
import MyTeam from './pages/recruiter/MyTeam';
import MyFreelancers from './pages/recruiter/MyFreelancers';

// Supervisor pages
import SupervisorOverview from './pages/supervisor/SupervisorOverview';
import SupervisorApplications from './pages/supervisor/SupervisorApplications';
import SupervisorTasks from './pages/supervisor/SupervisorTasks';

// Admin pages
import AdminOverview from './pages/admin/AdminOverview';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePosts from './pages/admin/ManagePosts';
import Reports from './pages/admin/Reports';
import SystemAnalytics from './pages/admin/SystemAnalytics';

// Messages shared - recruiters use the same chat UI

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((s) => s.theme);
  const { isAuthenticated, user, token } = useSelector((s) => s.auth);

  // Hydrate auth state on reload
  useEffect(() => {
    if (token && !user) {
      import('./features/auth/authSlice').then(({ fetchProfile }) => {
        dispatch(fetchProfile());
      });
    }
  }, [token, user, dispatch]);

  // Apply dark mode class on mount and theme change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/success-stories" element={<SuccessStoriesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentOverview />} />
        <Route path="browse" element={<BrowseOpportunities />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="tasks" element={<StudentTasks />} />
        <Route path="skills" element={<StudentSkills />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={
        <ProtectedRoute allowedRoles={['recruiter']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<RecruiterOverview />} />
        <Route path="post" element={<PostOpportunity />} />
        <Route path="posts" element={<MyPosts />} />
        <Route path="applications" element={<RecruiterApplications />} />
        <Route path="tasks" element={<AssignedTasks />} />
        <Route path="team" element={<MyTeam />} />
        <Route path="freelancers" element={<MyFreelancers />} />
        <Route path="supervisors" element={<ManageSupervisors />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="profile" element={<CompanyProfile />} />
      </Route>

      {/* Supervisor Routes */}
      <Route path="/supervisor" element={
        <ProtectedRoute allowedRoles={['supervisor']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SupervisorOverview />} />
        <Route path="applications" element={<SupervisorApplications />} />
        <Route path="tasks" element={<SupervisorTasks />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="posts" element={<ManagePosts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="analytics" element={<SystemAnalytics />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={
        isAuthenticated && user
          ? <Navigate to={`/${user.role}`} replace />
          : <Navigate to="/" replace />
      } />
    </Routes>
  );
}

export default App;
