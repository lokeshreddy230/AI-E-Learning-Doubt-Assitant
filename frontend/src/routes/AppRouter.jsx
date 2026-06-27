import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import StudentDashboard from '../pages/StudentDashboard';
import AIChatInterface from '../pages/AIChatInterface';
import ChatHistoryPage from '../pages/ChatHistoryPage';
import SavedNotesPage from '../pages/SavedNotesPage';
import LearningAnalyticsPage from '../pages/LearningAnalyticsPage';
import ProfileSettingsPage from '../pages/ProfileSettingsPage';
import AdminDashboard from '../pages/AdminDashboard';
import AdminFeedbackPage from '../pages/AdminFeedbackPage';

const AppRouter = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <ErrorBoundary>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
              </Route>
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />

              {/* Protected Dashboard Routes (Student by default) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/chat" element={<AIChatInterface />} />
                  <Route path="/history" element={<ChatHistoryPage />} />
                  <Route path="/notes" element={<SavedNotesPage />} />
                  <Route path="/analytics" element={<LearningAnalyticsPage />} />
                  <Route path="/settings" element={<ProfileSettingsPage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/feedbacks" element={<AdminFeedbackPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </HashRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default AppRouter;
