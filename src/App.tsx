import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CreateClientAndOrganization from './pages/onboard/CreateClientAndOrganization';
import SendEmailPage from './pages/auth/forgot-password/SendEmailPage';
import VerifyOTPPage from './pages/auth/forgot-password/VerifyOTPPage';
import ResetPasswordPage from './pages/auth/forgot-password/ResetPasswordPage';
import PolicyPage from './pages/public_pages/Policy';
import TermsPage from './pages/public_pages/Terms';
import DashboardLayout from './pages/layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/home/DashboardHome';
import ProjectList from './pages/dashboard/project/list/ProjectList';
import { Toaster } from 'react-hot-toast';
import WorkItemsList from './pages/dashboard/work_items/WorkItems';
import ProjectWorkItemsList from './pages/dashboard/project/work-items/WorkItemsList';
import ProjectOverview from './pages/dashboard/project/overview/index';
import SettingsPage from './pages/dashboard/settings';

function App() {

  return (
    <Router>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Onboarding Routes */}
        <Route path="/onboard/create-client" element={<CreateClientAndOrganization />} />

        {/* Forgot Password Routes */}
        <Route path="/forgot-password/send-email" element={<SendEmailPage />} />
        <Route path="/forgot-password/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password/reset-password" element={<ResetPasswordPage />} />

        {/* Public Routes */}
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/overview/:projectId" element={<ProjectList />} />
          <Route path="project/:projectId/overview" element={<ProjectOverview />} />
          <Route path="work-items" element={<WorkItemsList />} />
          <Route path="project/:projectId/work-items" element={<ProjectWorkItemsList />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        {/* Default redirect */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App