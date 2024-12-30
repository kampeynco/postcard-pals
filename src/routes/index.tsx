import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { ProtectedRoute } from "@/components/auth/Auth";
import MainLayout from "@/components/layout/MainLayout";
import LandingPage from "@/pages/LandingPage";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import ActBlueSettings from "@/pages/ActBlueSettings";
import PostcardsPage from "@/pages/PostcardsPage";
import MonitoringPage from "@/pages/MonitoringPage";
import PricingPage from "@/pages/PricingPage";
import SignInPage from "@/components/auth/SignInPage";
import SignUpPage from "@/components/auth/SignUpPage";
import EmailConfirmationHandler from "@/components/auth/signin/EmailConfirmationHandler";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path={ROUTES.PRICING} element={<PricingPage />} />
      <Route path="/auth/callback" element={<EmailConfirmationHandler />} />

      {/* Protected routes */}
      <Route 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
        <Route path={ROUTES.SETTINGS.ACTBLUE} element={<ActBlueSettings />} />
        <Route path={ROUTES.POSTCARDS} element={<PostcardsPage />} />
        <Route path={ROUTES.MONITORING} element={<MonitoringPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;