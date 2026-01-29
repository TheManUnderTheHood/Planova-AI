import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Competitors from './pages/Competitors';
import Strategies from './pages/Strategies';
import IdeaBank from './pages/IdeaBank';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- NEW: Import Toaster for notifications ---
import { Toaster } from 'react-hot-toast';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleStrategyGenerated = (strategy) => {
    navigate(`/calendar/${strategy._id}`);
  };

  // Hide Navbar on landing page
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-[#0B0F1A]">
      {/* --- NEW: Add the Toaster component here --- */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#E5E7EB',
            border: '1px solid rgba(124, 58, 237, 0.2)',
          },
        }}
      />
      {!isLandingPage && <Navbar />}
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard onStrategyGenerated={handleStrategyGenerated} /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/strategies" element={<ProtectedRoute><Strategies /></ProtectedRoute>} />
          <Route path="/calendar/:strategyId" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/competitors" element={<ProtectedRoute><Competitors /></ProtectedRoute>} />
          <Route path="/idea-bank" element={<ProtectedRoute><IdeaBank /></ProtectedRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

function RootApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default RootApp;