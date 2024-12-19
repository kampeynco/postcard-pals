import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SignInPage from "@/components/auth/SignInPage";
import SignUpPage from "@/components/auth/SignUpPage";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import PricingPage from "@/pages/PricingPage";
import ActBlueSettings from "@/pages/ActBlueSettings";
import MainLayout from "@/components/layout/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
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
        path="/settings/:tab"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div className="p-8">Settings page placeholder</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;