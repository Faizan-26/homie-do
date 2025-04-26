import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing-page/landing-page'
import LoginPage from './pages/login/login-page'
import ResetPasswordPage from './pages/reset-password/reset-password-page'
import DashboardPage from './pages/dashboard/dashboard-page'
import PreviewDocument from './pages/dashboard/preview_document'
import Todo from './pages/dashboard/components/Todo';
import { useAuth } from './context/AuthContext'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state if authentication is still being checked
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/preview-document" 
          element={
            <ProtectedRoute>
              <PreviewDocument />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/todos" 
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
