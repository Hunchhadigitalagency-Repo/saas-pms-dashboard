import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './pages/layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/home/DashboardHome';
import ProjectList from './pages/dashboard/project/ProjectList';
import { Toaster } from 'react-hot-toast';
import WorkItemsList from './pages/dashboard/work_items/WorkItems';
import ProjectWorkItemsList from './pages/dashboard/project/work-items/WorkItemsList';

function App() {

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="work-items" element={<WorkItemsList />} />
          <Route path="project/:projectId/work-items" element={<ProjectWorkItemsList />} />
        </Route>
        {/* Default redirect */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App