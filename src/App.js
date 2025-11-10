import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import InspectionForm from './components/InspectionForm';
import MobileEstablishmentWrapper from './components/MobileEstablishmentWrapper';
import Reports from './components/Reports';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? children : <Navigate to="/login" replace />;
};

// Inspection Page Wrapper Component
const InspectionPage = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/'); // Navigate back to dashboard
  };

  return (
    <div className="min-h-screen gradient-bg pt-16">
      <div className="container mx-auto px-4 py-8">
        <InspectionForm onClose={handleClose} isModal={false} />
      </div>
    </div>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for existing user session on app load
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    // Listener for cross-tab changes
    const handleStorage = () => {
      const updated = localStorage.getItem('currentUser');
      setCurrentUser(updated ? JSON.parse(updated) : null);
    };
    // Listener for in-app auth changes
    const handleAuthChanged = () => handleStorage();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('authChanged', handleAuthChanged);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('authChanged', handleAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    // Notify others that auth status changed
    window.dispatchEvent(new CustomEvent('authChanged'));
  };

  return (
    <Router>
      <div className="min-h-screen gradient-bg">
        {currentUser && <Navbar currentUser={currentUser} onLogout={handleLogout} />}
        <main className={currentUser ? "md:ml-64 pt-16 px-4 py-8" : ""}>
          <Routes>
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/" replace /> : <Login />} 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute>
                  <InspectionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/establishments" 
              element={
                <ProtectedRoute>
                  <MobileEstablishmentWrapper />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
