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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // or forbidden page
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
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
