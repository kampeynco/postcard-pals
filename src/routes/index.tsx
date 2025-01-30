import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { ProtectedRoute } from "@/components/auth/Auth";
import MainLayout from "@/components/layout/MainLayout";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import CreateActBlueAccount from "@/pages/CreateActBlueAccount";
import PostcardsPage from "@/pages/PostcardsPage";
import MonitoringPage from "@/pages/MonitoringPage";
import PricingPage from "@/pages/PricingPage";
import SignInPage from "@/components/auth/SignInPage";
import SignUpPage from "@/components/auth/SignUpPage";
import EmailConfirmationHandler from "@/components/auth/signin/EmailConfirmationHandler";
import Onboarding from "@/pages/Onboarding";
import Settings from "@/pages/Settings";
import AccountsPage from "@/pages/AccountsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path={ROUTES.PRICING} element={<PricingPage />} />
      <Route path="/auth/callback" element={<EmailConfirmationHandler />} />

      {/* Protected routes wrapped in MainLayout */}
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
        <Route path={ROUTES.SETTINGS.BASE} element={<Settings />} />
        <Route path={ROUTES.ACCOUNTS.BASE} element={<AccountsPage />} />
        <Route path={ROUTES.ACCOUNTS.NEW} element={<CreateActBlueAccount />} />
        <Route path={ROUTES.POSTCARDS} element={<PostcardsPage />} />
        <Route path={ROUTES.MONITORING} element={<MonitoringPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;