import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./components/auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import TopNav from "./components/navigation/TopNav";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import ActBlueSettings from "./pages/ActBlueSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <>
                    <TopNav />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/actblue"
              element={
                <ProtectedRoute>
                  <>
                    <TopNav />
                    <ActBlueSettings />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/:tab"
              element={
                <ProtectedRoute>
                  <>
                    <TopNav />
                    <div className="p-8">Settings page placeholder</div>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;