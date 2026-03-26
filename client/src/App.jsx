import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Tasks from './pages/Tasks';
import CareerGuidance from './pages/CareerGuidance';
import LearningResources from './pages/LearningResources';
import MentalHealth from './pages/MentalHealth';
import Mentorship from './pages/Mentorship';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900/30 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-purple-600 rounded-full animate-pulse opacity-20"></div>
        </div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><Layout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="career" element={<CareerGuidance />} />
            <Route path="resources" element={<LearningResources />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="mental-health" element={<MentalHealth />} />
            <Route path="community" element={<Community />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor']}><Layout /></ProtectedRoute>}>
            <Route index element={<MentorDashboard />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
