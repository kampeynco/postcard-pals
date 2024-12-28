import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SignInPage from "@/components/auth/SignInPage";
import SignUpPage from "@/components/auth/SignUpPage";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import PricingPage from "@/pages/PricingPage";
import ActBlueSettings from "@/pages/ActBlueSettings";
import PostcardsPage from "@/pages/PostcardsPage";
import MonitoringPage from "@/pages/MonitoringPage";
import Onboarding from "@/pages/Onboarding";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider } from "@/components/auth/AuthProvider";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes outside of AuthProvider */}
      <Route index element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes wrapped in AuthProvider */}
      <Route element={
        <AuthProvider>
          <Routes>
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/actblue"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ActBlueSettings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/postcards"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PostcardsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MonitoringPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      } />

      {/* Catch all route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;