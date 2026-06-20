import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateProfilePage from './pages/CreateProfilePage';
import ViewProfilePage from './pages/ViewProfilePage';
import WorkerDiscoveryPage from './pages/WorkerDiscoveryPage';
import CreateJobRequestPage from './pages/CreateJobRequestPage';
import WorkerJobRequestsPage from './pages/WorkerJobRequestsPage';
import ClientJobsPage from './pages/ClientJobsPage';
import LeaveReviewPage from './pages/LeaveReviewPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import WorkerDashboardPage from './pages/WorkerDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="workers" element={<WorkerDiscoveryPage />} />
          <Route path="jobs/create" element={<CreateJobRequestPage />} />
          <Route path="jobs/worker" element={<WorkerJobRequestsPage />} />
          <Route path="jobs/my" element={<ClientJobsPage />} />
          <Route path="reviews/leave" element={<LeaveReviewPage />} />
          <Route path="dashboard/client" element={<ClientDashboardPage />} />
          <Route path="dashboard/worker" element={<WorkerDashboardPage />} />
          <Route path="profile/create" element={<CreateProfilePage />} />
          <Route path="profile/:id" element={<ViewProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
