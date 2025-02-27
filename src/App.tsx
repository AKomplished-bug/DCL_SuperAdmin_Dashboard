import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/ui/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-secondary-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="calls" element={<div className="p-6">Call Queue Page</div>} />
            <Route path="monitoring" element={<div className="p-6">Live Monitoring Page</div>} />
            <Route path="transcripts" element={<div className="p-6">Transcripts Page</div>} />
            <Route path="resources" element={<div className="p-6">Resources Page</div>} />
            <Route path="social" element={<div className="p-6">Social Media Page</div>} />
            <Route path="analytics" element={<div className="p-6">Analytics Page</div>} />
            <Route path="users" element={<div className="p-6">User Management Page</div>} />
            <Route path="settings" element={<div className="p-6">Settings Page</div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;