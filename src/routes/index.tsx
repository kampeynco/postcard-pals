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
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected routes */}
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

        {/* Catch all route - redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;