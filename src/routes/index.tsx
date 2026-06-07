import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CreateTest from '../pages/CreateTest';
import Questions from '../pages/Questions';
import PreviewPublish from '../pages/PreviewPublish';
import NotFound from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public / Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tests/create" element={<CreateTest />} />
        <Route path="/tests/:id/questions" element={<Questions />} />
        <Route path="/tests/:id/preview" element={<PreviewPublish />} />
      </Route>

      {/* Index redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 — catch-all for unknown paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

