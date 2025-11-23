import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ActivitiesPage from './pages/ActivitiesPage';
import PackagesPage from './pages/PackagesPage';
import ActivityDetail from './pages/ActivityDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageActivities from './pages/admin/ManageActivities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/activities" element={<ManageActivities />} />
      </Routes>
    </Router>
  );
}

export default App;
