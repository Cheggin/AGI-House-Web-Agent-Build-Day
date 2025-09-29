import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import UploadProfile from './pages/UploadProfile';
import JobsDashboard from './pages/JobsDashboard';
import ApplicationPage from './pages/ApplicationPage';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import DeepResearch from './pages/DeepResearch';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-black">
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadProfile />} />
              <Route path="/jobs" element={<JobsDashboard />} />
              <Route path="/apply/:jobId" element={<ApplicationPage />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/research" element={<DeepResearch />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
