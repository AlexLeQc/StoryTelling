import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProtectedRoute from './utils/ProtectedRoute';
import { isAuthenticated } from './services/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import StoryEditor from './pages/StoryEditor';
import StoryViewer from './pages/StoryViewer';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check if user is authenticated (no need to fetch user data for now)
      setLoading(false);
    };
    initAuth();
  }, []);

  if (loading) {
    return <div className="loading-spinner"></div>;
}

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/story/:shareId" element={<StoryViewer />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/editor" element={<StoryEditor />} />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <StoryEditor />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
